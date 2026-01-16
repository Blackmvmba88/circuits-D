// Cognitive Diagnostic Engine
// Evaluates circuit rules and predicts consequences based on measurements

import type { 
  CircuitRule, 
  Condition, 
  Consequence, 
  Net, 
  Component, 
  MeasurementStep,
  ConditionOperator 
} from '../types';

interface EvaluationContext {
  nets: Net[];
  components: Component[];
  measurements: MeasurementStep[];
}

/**
 * Evaluates a single condition against the current circuit state
 */
export function evaluateCondition(
  condition: Condition, 
  context: EvaluationContext
): boolean {
  switch (condition.type) {
    case 'net_voltage': {
      const net = context.nets.find(n => n.id === condition.targetId);
      if (!net || net.voltage === undefined) return false;
      return evaluateNumericCondition(net.voltage, condition.operator, condition.value, condition.valueRange);
    }
    
    case 'measurement': {
      const measurement = context.measurements.find(m => 
        m.id === condition.targetId || m.netId === condition.targetId
      );
      if (!measurement || !measurement.actualValue) return false;
      const numValue = parseFloat(measurement.actualValue);
      if (isNaN(numValue)) return false;
      return evaluateNumericCondition(numValue, condition.operator, condition.value, condition.valueRange);
    }
    
    case 'component_state': {
      const component = context.components.find(c => c.id === condition.targetId);
      if (!component) return false;
      
      if (condition.operator === 'present') {
        return component.connected;
      } else if (condition.operator === 'absent') {
        return !component.connected;
      }
      return false;
    }
    
    case 'signal_present': {
      const measurement = context.measurements.find(m => 
        m.id === condition.targetId || m.netId === condition.targetId
      );
      if (!measurement) return false;
      
      if (condition.operator === 'present') {
        return measurement.status === 'complete' && !!measurement.actualValue;
      } else if (condition.operator === 'absent') {
        return measurement.status === 'failed' || !measurement.actualValue;
      }
      return false;
    }
    
    default:
      return false;
  }
}

/**
 * Evaluates numeric conditions with various operators
 */
function evaluateNumericCondition(
  value: number,
  operator: ConditionOperator,
  target?: number,
  range?: { min: number; max: number }
): boolean {
  if (target === undefined && !range) return false;
  
  switch (operator) {
    case '>':
      return target !== undefined && value > target;
    case '<':
      return target !== undefined && value < target;
    case '=':
      return target !== undefined && Math.abs(value - target) < 0.01;
    case '>=':
      return target !== undefined && value >= target;
    case '<=':
      return target !== undefined && value <= target;
    case '!=':
      return target !== undefined && Math.abs(value - target) >= 0.01;
    case 'between':
      return range !== undefined && value >= range.min && value <= range.max;
    default:
      return false;
  }
}

/**
 * Evaluates a complete rule - all conditions must be true for the rule to fire
 */
export function evaluateRule(rule: CircuitRule, context: EvaluationContext): boolean {
  if (!rule.enabled) return false;
  if (rule.conditions.length === 0) return false;
  
  // All conditions must be true (AND logic)
  return rule.conditions.every(condition => evaluateCondition(condition, context));
}

/**
 * Evaluates all rules and returns the predicted consequences
 */
export function evaluateAllRules(
  rules: CircuitRule[],
  context: EvaluationContext
): { triggeredRules: CircuitRule[]; consequences: Consequence[] } {
  const triggeredRules = rules.filter(rule => evaluateRule(rule, context));
  const consequences = triggeredRules.map(rule => rule.consequence);
  
  return { triggeredRules, consequences };
}

/**
 * Generates a human-readable explanation of why a rule triggered
 */
export function explainRuleTrigger(
  rule: CircuitRule, 
  context: EvaluationContext
): string {
  const conditionExplanations = rule.conditions.map(condition => {
    let explanation = condition.description;
    
    switch (condition.type) {
      case 'net_voltage': {
        const net = context.nets.find(n => n.id === condition.targetId);
        if (net && net.voltage !== undefined) {
          explanation += ` (measured: ${net.voltage}V)`;
        }
        break;
      }
      case 'measurement': {
        const measurement = context.measurements.find(m => 
          m.id === condition.targetId || m.netId === condition.targetId
        );
        if (measurement && measurement.actualValue) {
          explanation += ` (measured: ${measurement.actualValue})`;
        }
        break;
      }
    }
    
    return explanation;
  });
  
  return `${rule.name}:\n` +
    `Conditions:\n${conditionExplanations.map(e => `  • ${e}`).join('\n')}\n` +
    `Consequence: ${rule.consequence.description}\n` +
    `Explanation: ${rule.consequence.explanation}`;
}
