// Cognitive Narrative Generator
// Transforms measurements and diagnostic results into technical narratives
// This is the "cognitive loop closure" - Expected vs. Observed → Decision → Documentation

import type {
  Net,
  Component,
  MeasurementStep,
  CircuitRule,
  Consequence,
  Circuit
} from '../types';

export interface TechnicalNarrative {
  id: string;
  timestamp: Date;
  netId?: string;
  componentId?: string;
  expected: string;
  observed: string;
  decision: 'pass' | 'fail' | 'warning' | 'unknown';
  probableCause?: string;
  fullNarrative: string;
  severity: 'critical' | 'warning' | 'info';
  technicalExplanation: string;
  recommendedActions: string[];
}

interface NarrativeContext {
  circuit: Circuit;
  measurement?: MeasurementStep;
  net?: Net;
  component?: Component;
  triggeredRules?: CircuitRule[];
  consequences?: Consequence[];
}

/**
 * Parse tolerance from expected value string
 * Examples: "5V ± 5%", "3.3V ± 0.1V", "1.7V - 2.0V"
 */
function parseExpectedValue(expectedStr: string): {
  nominal: number;
  minTolerance: number;
  maxTolerance: number;
  unit: string;
} | null {
  if (!expectedStr) return null;

  // Remove whitespace for easier parsing
  const cleaned = expectedStr.replace(/\s+/g, '');

  // Match patterns like "5V±5%" or "5V±0.5V"
  const percentMatch = cleaned.match(/(\d+\.?\d*)([A-Za-z]+)?±(\d+\.?\d*)%/);
  if (percentMatch) {
    const nominal = parseFloat(percentMatch[1]);
    const unit = percentMatch[2] || 'V';
    const percentTol = parseFloat(percentMatch[3]);
    const tolerance = (nominal * percentTol) / 100;
    return {
      nominal,
      minTolerance: nominal - tolerance,
      maxTolerance: nominal + tolerance,
      unit
    };
  }

  // Match patterns like "5V±0.1V"
  const absoluteMatch = cleaned.match(/(\d+\.?\d*)([A-Za-z]+)?±(\d+\.?\d*)([A-Za-z]+)?/);
  if (absoluteMatch) {
    const nominal = parseFloat(absoluteMatch[1]);
    const unit = absoluteMatch[2] || absoluteMatch[4] || 'V';
    const tolerance = parseFloat(absoluteMatch[3]);
    return {
      nominal,
      minTolerance: nominal - tolerance,
      maxTolerance: nominal + tolerance,
      unit
    };
  }

  // Match range patterns like "1.7V - 2.0V"
  const rangeMatch = cleaned.match(/(\d+\.?\d*)([A-Za-z]+)?-(\d+\.?\d*)([A-Za-z]+)?/);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[3]);
    const unit = rangeMatch[2] || rangeMatch[4] || 'V';
    return {
      nominal: (min + max) / 2,
      minTolerance: min,
      maxTolerance: max,
      unit
    };
  }

  // Simple value like "5V"
  const simpleMatch = cleaned.match(/(\d+\.?\d*)([A-Za-z]+)?/);
  if (simpleMatch) {
    const value = parseFloat(simpleMatch[1]);
    const unit = simpleMatch[2] || 'V';
    // Default 5% tolerance
    const tolerance = value * 0.05;
    return {
      nominal: value,
      minTolerance: value - tolerance,
      maxTolerance: value + tolerance,
      unit
    };
  }

  return null;
}

/**
 * Parse actual measurement value
 */
function parseActualValue(actualStr: string): { value: number; unit: string } | null {
  if (!actualStr) return null;

  const cleaned = actualStr.replace(/\s+/g, '');
  const match = cleaned.match(/(\d+\.?\d*)([A-Za-z]+)?/);
  
  if (match) {
    return {
      value: parseFloat(match[1]),
      unit: match[2] || 'V'
    };
  }

  return null;
}

/**
 * Generate a technical narrative from a measurement
 */
export function generateMeasurementNarrative(
  context: NarrativeContext
): TechnicalNarrative | null {
  const { measurement, net, component, triggeredRules } = context;

  if (!measurement || !measurement.actualValue) {
    return null;
  }

  const expected = parseExpectedValue(measurement.expectedValue || '');
  const actual = parseActualValue(measurement.actualValue);

  if (!expected || !actual) {
    return null;
  }

  // Determine if measurement passes, fails, or warns
  let decision: 'pass' | 'fail' | 'warning' | 'unknown' = 'unknown';
  let severity: 'critical' | 'warning' | 'info' = 'info';

  if (actual.value >= expected.minTolerance && actual.value <= expected.maxTolerance) {
    decision = 'pass';
    severity = 'info';
  } else if (actual.value < expected.minTolerance * 0.5 || actual.value > expected.maxTolerance * 1.5) {
    decision = 'fail';
    severity = 'critical';
  } else {
    decision = 'warning';
    severity = 'warning';
  }

  // Generate probable cause from triggered rules
  let probableCause = 'Unknown cause';
  let technicalExplanation = '';
  const recommendedActions: string[] = [];

  if (triggeredRules && triggeredRules.length > 0) {
    // Find most relevant rule
    const relevantRule = triggeredRules.find(rule => 
      rule.consequence.affectedNetIds.includes(net?.id || '') ||
      rule.consequence.affectedComponentIds.includes(component?.id || '')
    ) || triggeredRules[0];

    probableCause = relevantRule.consequence.description;
    technicalExplanation = relevantRule.consequence.explanation;

    // Generate recommended actions based on consequence type
    switch (relevantRule.consequence.type) {
      case 'rail_drop':
        recommendedActions.push('Check for component saturation or excessive load');
        recommendedActions.push('Verify power supply current capability');
        recommendedActions.push('Inspect voltage regulator if present');
        break;
      case 'no_output':
        recommendedActions.push('Verify component connections');
        recommendedActions.push('Check for reverse polarity');
        recommendedActions.push('Measure intermediate nodes to isolate fault');
        break;
      case 'heating':
        recommendedActions.push('Reduce supply voltage or current');
        recommendedActions.push('Check component power ratings');
        recommendedActions.push('Improve thermal management');
        break;
      case 'signal_loss':
        recommendedActions.push('Check signal path for opens or shorts');
        recommendedActions.push('Verify AC coupling capacitors');
        recommendedActions.push('Inspect bias network');
        break;
      case 'oscillation_stop':
        recommendedActions.push('Verify oscillator components (crystal, caps)');
        recommendedActions.push('Check load capacitance matches crystal spec');
        recommendedActions.push('Ensure adequate power supply decoupling');
        break;
      default:
        recommendedActions.push('Perform systematic troubleshooting');
        recommendedActions.push('Check component values and connections');
        recommendedActions.push('Consult circuit documentation');
    }
  } else if (decision === 'fail' || decision === 'warning') {
    // Generate generic cause based on measurement deviation
    const deviation = ((actual.value - expected.nominal) / expected.nominal * 100).toFixed(1);
    
    if (actual.value < expected.minTolerance) {
      probableCause = `Voltage is ${Math.abs(parseFloat(deviation))}% below expected`;
      technicalExplanation = `The measured voltage is significantly lower than specified. This could indicate excessive load, component failure, or power supply issues.`;
      recommendedActions.push('Check for shorts or excessive current draw');
      recommendedActions.push('Verify power supply output');
      recommendedActions.push('Inspect all components in power path');
    } else {
      probableCause = `Voltage is ${Math.abs(parseFloat(deviation))}% above expected`;
      technicalExplanation = `The measured voltage is significantly higher than specified. This could indicate open circuits, missing loads, or incorrect component values.`;
      recommendedActions.push('Check for open connections');
      recommendedActions.push('Verify load components are present and connected');
      recommendedActions.push('Inspect voltage divider or regulator circuit');
    }
  } else {
    probableCause = 'Measurement within acceptable range';
    technicalExplanation = 'The measured value matches the expected specification within tolerance.';
    recommendedActions.push('Continue with next measurement step');
  }

  // Build the full narrative
  const netName = net ? net.name : 'Unknown Net';
  const componentName = component ? component.name : '';
  const location = componentName ? `at ${componentName} (${netName})` : `at ${netName}`;

  const fullNarrative = 
    `${measurement.name}: Expected ${expected.nominal}${expected.unit} ± ${((expected.maxTolerance - expected.nominal) / expected.nominal * 100).toFixed(1)}% ${location}. ` +
    `Observed: ${actual.value}${actual.unit}. ` +
    `Result: ${decision.toUpperCase()}. ` +
    (decision !== 'pass' ? `Probable cause: ${probableCause}.` : 'Nominal operation.');

  return {
    id: `narrative-${measurement.id}-${Date.now()}`,
    timestamp: new Date(),
    netId: net?.id,
    componentId: component?.id,
    expected: `${expected.nominal}${expected.unit} ± ${((expected.maxTolerance - expected.nominal) / expected.nominal * 100).toFixed(1)}%`,
    observed: `${actual.value}${actual.unit}`,
    decision,
    probableCause: decision !== 'pass' ? probableCause : undefined,
    fullNarrative,
    severity,
    technicalExplanation,
    recommendedActions
  };
}

/**
 * Generate a narrative from a diagnostic consequence
 */
export function generateConsequenceNarrative(
  consequence: Consequence,
  circuit: Circuit,
  rule?: CircuitRule
): TechnicalNarrative {
  const affectedNets = consequence.affectedNetIds
    .map(id => circuit.nets.find(n => n.id === id))
    .filter(n => n !== undefined)
    .map(n => n!.name);

  const affectedComponents = consequence.affectedComponentIds
    .map(id => circuit.components.find(c => c.id === id))
    .filter(c => c !== undefined)
    .map(c => c!.name);

  const affectedItems = [...affectedNets, ...affectedComponents].join(', ');
  const ruleName = rule?.name || 'Diagnostic Rule';

  const fullNarrative = 
    `${ruleName}: ${consequence.description}. ` +
    (affectedItems ? `Affects: ${affectedItems}. ` : '') +
    `Explanation: ${consequence.explanation}`;

  // Generate recommended actions based on consequence type
  const recommendedActions: string[] = [];
  switch (consequence.type) {
    case 'rail_drop':
      recommendedActions.push('Measure current consumption to identify saturated component');
      recommendedActions.push('Check voltage regulator output capability');
      recommendedActions.push('Verify power supply specifications');
      break;
    case 'oscillation_stop':
      recommendedActions.push('Verify crystal load capacitors are present and correct value');
      recommendedActions.push('Check oscillator enable signals');
      recommendedActions.push('Measure DC bias at oscillator pins');
      break;
    case 'no_output':
      recommendedActions.push('Verify input signals are present');
      recommendedActions.push('Check power supply voltages');
      recommendedActions.push('Measure intermediate signals to isolate failure point');
      break;
    case 'heating':
      recommendedActions.push('Measure component temperature');
      recommendedActions.push('Check component power dissipation vs rating');
      recommendedActions.push('Improve cooling or reduce power');
      break;
    case 'signal_loss':
      recommendedActions.push('Check signal path for opens');
      recommendedActions.push('Verify coupling capacitors');
      recommendedActions.push('Measure DC bias points');
      break;
    default:
      recommendedActions.push('Perform systematic troubleshooting');
      recommendedActions.push('Measure all relevant test points');
      recommendedActions.push('Consult circuit schematic and documentation');
  }

  return {
    id: `narrative-${consequence.id}-${Date.now()}`,
    timestamp: new Date(),
    netId: consequence.affectedNetIds[0],
    componentId: consequence.affectedComponentIds[0],
    expected: 'Normal operation',
    observed: consequence.description,
    decision: 'fail',
    probableCause: consequence.description,
    fullNarrative,
    severity: consequence.severity,
    technicalExplanation: consequence.explanation,
    recommendedActions
  };
}

/**
 * Generate narratives for all measurements in a workflow
 */
export function generateWorkflowNarratives(
  context: NarrativeContext,
  measurements: MeasurementStep[]
): TechnicalNarrative[] {
  const narratives: TechnicalNarrative[] = [];

  for (const measurement of measurements) {
    if (measurement.status === 'complete' && measurement.actualValue) {
      const net = measurement.netId 
        ? context.circuit.nets.find(n => n.id === measurement.netId)
        : undefined;
      
      const component = measurement.componentId
        ? context.circuit.components.find(c => c.id === measurement.componentId)
        : undefined;

      const narrative = generateMeasurementNarrative({
        ...context,
        measurement,
        net,
        component
      });

      if (narrative) {
        narratives.push(narrative);
      }
    }
  }

  return narratives;
}
