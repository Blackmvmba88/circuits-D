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

// Tolerance for numeric comparisons (adjustable based on measurement precision)
const COMPARISON_TOLERANCE = 0.01;

// Maximum safe numeric value to prevent overflow
const MAX_SAFE_VALUE = 1e6;

interface EvaluationContext {
  nets: Net[];
  components: Component[];
  measurements: MeasurementStep[];
}

/**
 * Validates that a numeric value is safe and within reasonable bounds
 */
function isValidNumericValue(value: number): boolean {
  return !isNaN(value) && isFinite(value) && Math.abs(value) < MAX_SAFE_VALUE;
}

/**
 * Validates a condition object has required fields
 */
function isValidCondition(condition: Condition): boolean {
  if (!condition || !condition.id || !condition.type || !condition.targetId || !condition.operator) {
    return false;
  }
  
  // Validate operator is appropriate for condition type
  const numericOperators: ConditionOperator[] = ['>', '<', '=', '>=', '<=', '!=', 'between'];
  const booleanOperators: ConditionOperator[] = ['present', 'absent'];
  
  if (condition.type === 'net_voltage' || condition.type === 'measurement') {
    return numericOperators.includes(condition.operator);
  }
  
  if (condition.type === 'component_state' || condition.type === 'signal_present') {
    return booleanOperators.includes(condition.operator);
  }
  
  return false;
}

/**
 * Validates a rule object has required fields and valid structure
 */
export function validateRule(rule: CircuitRule): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!rule) {
    return { valid: false, errors: ['Rule is null or undefined'] };
  }
  
  if (!rule.id || typeof rule.id !== 'string') {
    errors.push('Rule must have a valid id');
  }
  
  if (!rule.name || typeof rule.name !== 'string') {
    errors.push('Rule must have a valid name');
  }
  
  if (!rule.circuitId || typeof rule.circuitId !== 'string') {
    errors.push('Rule must have a valid circuitId');
  }
  
  if (!Array.isArray(rule.conditions)) {
    errors.push('Rule must have a conditions array');
  } else if (rule.conditions.length === 0) {
    errors.push('Rule must have at least one condition');
  } else {
    rule.conditions.forEach((condition, index) => {
      if (!isValidCondition(condition)) {
        errors.push(`Condition ${index} is invalid or has incompatible operator`);
      }
    });
  }
  
  if (!rule.consequence) {
    errors.push('Rule must have a consequence');
  } else {
    if (!rule.consequence.id || !rule.consequence.type || !rule.consequence.severity) {
      errors.push('Consequence must have id, type, and severity');
    }
    if (!rule.consequence.description || !rule.consequence.explanation) {
      errors.push('Consequence must have description and explanation');
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Evaluates a single condition against the current circuit state
 * Returns false for any invalid or unsafe conditions
 */
export function evaluateCondition(
  condition: Condition, 
  context: EvaluationContext
): boolean {
  // Validate condition structure
  if (!isValidCondition(condition)) {
    console.warn('Invalid condition structure:', condition);
    return false;
  }
  
  // Validate context
  if (!context || !context.nets || !context.components || !context.measurements) {
    console.warn('Invalid evaluation context');
    return false;
  }
  
  try {
    switch (condition.type) {
      case 'net_voltage': {
        const net = context.nets.find(n => n.id === condition.targetId);
        if (!net || net.voltage === undefined || net.voltage === null) {
          return false;
        }
        if (!isValidNumericValue(net.voltage)) {
          console.warn('Invalid voltage value:', net.voltage);
          return false;
        }
        return evaluateNumericCondition(net.voltage, condition.operator, condition.value, condition.valueRange);
      }
      
      case 'measurement': {
        const measurement = context.measurements.find(m => 
          m.id === condition.targetId || m.netId === condition.targetId
        );
        if (!measurement || !measurement.actualValue) {
          return false;
        }
        const numValue = parseFloat(measurement.actualValue);
        if (!isValidNumericValue(numValue)) {
          console.warn('Invalid measurement value:', measurement.actualValue);
          return false;
        }
        return evaluateNumericCondition(numValue, condition.operator, condition.value, condition.valueRange);
      }
      
      case 'component_state': {
        const component = context.components.find(c => c.id === condition.targetId);
        if (!component) {
          return false;
        }
        
        if (condition.operator === 'present') {
          return component.connected === true;
        } else if (condition.operator === 'absent') {
          return component.connected === false;
        }
        return false;
      }
      
      case 'signal_present': {
        const measurement = context.measurements.find(m => 
          m.id === condition.targetId || m.netId === condition.targetId
        );
        if (!measurement) {
          return false;
        }
        
        if (condition.operator === 'present') {
          return measurement.status === 'complete' && !!measurement.actualValue;
        } else if (condition.operator === 'absent') {
          return measurement.status === 'failed' || !measurement.actualValue;
        }
        return false;
      }
      
      default:
        console.warn('Unknown condition type:', (condition as Condition).type);
        return false;
    }
  } catch (error) {
    console.error('Error evaluating condition:', error, condition);
    return false;
  }
}

/**
 * Evaluates numeric conditions with various operators
 * Includes validation for safe numeric operations
 */
function evaluateNumericCondition(
  value: number,
  operator: ConditionOperator,
  target?: number,
  range?: { min: number; max: number }
): boolean {
  // Validate inputs
  if (!isValidNumericValue(value)) {
    return false;
  }
  
  if (target !== undefined && !isValidNumericValue(target)) {
    console.warn('Invalid target value:', target);
    return false;
  }
  
  if (range) {
    if (!isValidNumericValue(range.min) || !isValidNumericValue(range.max)) {
      console.warn('Invalid range values:', range);
      return false;
    }
    if (range.min > range.max) {
      console.warn('Invalid range: min > max', range);
      return false;
    }
  }
  
  if (target === undefined && !range) {
    return false;
  }
  
  try {
    switch (operator) {
      case '>':
        return target !== undefined && value > target;
      case '<':
        return target !== undefined && value < target;
      case '=':
        return target !== undefined && Math.abs(value - target) < COMPARISON_TOLERANCE;
      case '>=':
        return target !== undefined && value >= target;
      case '<=':
        return target !== undefined && value <= target;
      case '!=':
        return target !== undefined && Math.abs(value - target) >= COMPARISON_TOLERANCE;
      case 'between':
        return range !== undefined && value >= range.min && value <= range.max;
      default:
        return false;
    }
  } catch (error) {
    console.error('Error in numeric comparison:', error);
    return false;
  }
}

/**
 * Evaluates a complete rule - all conditions must be true for the rule to fire
 * Includes validation and error handling
 */
export function evaluateRule(rule: CircuitRule, context: EvaluationContext): boolean {
  // Basic validation
  if (!rule || !context) {
    return false;
  }
  
  if (!rule.enabled) {
    return false;
  }
  
  if (!Array.isArray(rule.conditions) || rule.conditions.length === 0) {
    return false;
  }
  
  try {
    // All conditions must be true (AND logic)
    return rule.conditions.every(condition => {
      try {
        return evaluateCondition(condition, context);
      } catch (error) {
        console.error('Error evaluating condition in rule:', rule.id, error);
        return false;
      }
    });
  } catch (error) {
    console.error('Error evaluating rule:', rule.id, error);
    return false;
  }
}

/**
 * Evaluates all rules and returns the predicted consequences
 * Includes validation and filtering of invalid rules
 */
export function evaluateAllRules(
  rules: CircuitRule[],
  context: EvaluationContext
): { triggeredRules: CircuitRule[]; consequences: Consequence[] } {
  // Validate inputs
  if (!Array.isArray(rules)) {
    console.warn('Rules is not an array');
    return { triggeredRules: [], consequences: [] };
  }
  
  if (!context || !context.nets || !context.components || !context.measurements) {
    console.warn('Invalid evaluation context');
    return { triggeredRules: [], consequences: [] };
  }
  
  try {
    // Filter and evaluate valid rules only
    const validRules = rules.filter(rule => {
      const validation = validateRule(rule);
      if (!validation.valid) {
        console.warn('Skipping invalid rule:', rule.id, validation.errors);
        return false;
      }
      return true;
    });
    
    const triggeredRules = validRules.filter(rule => {
      try {
        return evaluateRule(rule, context);
      } catch (error) {
        console.error('Error evaluating rule:', rule.id, error);
        return false;
      }
    });
    
    const consequences = triggeredRules
      .map(rule => rule.consequence)
      .filter(consequence => consequence !== null && consequence !== undefined);
    
    return { triggeredRules, consequences };
  } catch (error) {
    console.error('Error in evaluateAllRules:', error);
    return { triggeredRules: [], consequences: [] };
  }
}

/**
 * Generates a human-readable explanation of why a rule triggered
 * Includes safe handling of missing data
 */
export function explainRuleTrigger(
  rule: CircuitRule, 
  context: EvaluationContext
): string {
  if (!rule || !context) {
    return 'Invalid rule or context';
  }
  
  try {
    const conditionExplanations = rule.conditions.map(condition => {
      let explanation = condition.description || 'No description';
      
      try {
        switch (condition.type) {
          case 'net_voltage': {
            const net = context.nets.find(n => n.id === condition.targetId);
            if (net && net.voltage !== undefined && net.voltage !== null) {
              explanation += ` (measured: ${net.voltage.toFixed(2)}V)`;
            } else {
              explanation += ' (no measurement)';
            }
            break;
          }
          case 'measurement': {
            const measurement = context.measurements.find(m => 
              m.id === condition.targetId || m.netId === condition.targetId
            );
            if (measurement && measurement.actualValue) {
              explanation += ` (measured: ${measurement.actualValue})`;
            } else {
              explanation += ' (no measurement)';
            }
            break;
          }
          case 'component_state': {
            const component = context.components.find(c => c.id === condition.targetId);
            if (component) {
              explanation += ` (${component.connected ? 'connected' : 'disconnected'})`;
            }
            break;
          }
          case 'signal_present': {
            const measurement = context.measurements.find(m => 
              m.id === condition.targetId || m.netId === condition.targetId
            );
            if (measurement) {
              explanation += ` (status: ${measurement.status})`;
            }
            break;
          }
        }
      } catch (error) {
        console.error('Error explaining condition:', error);
        explanation += ' (error reading value)';
      }
      
      return explanation;
    });
    
    const ruleName = rule.name || 'Unnamed Rule';
    const consequenceDesc = rule.consequence?.description || 'No consequence description';
    const consequenceExpl = rule.consequence?.explanation || 'No explanation';
    
    return `${ruleName}:\n` +
      `Conditions:\n${conditionExplanations.map(e => `  • ${e}`).join('\n')}\n` +
      `Consequence: ${consequenceDesc}\n` +
      `Explanation: ${consequenceExpl}`;
  } catch (error) {
    console.error('Error generating rule explanation:', error);
    return `Error explaining rule: ${rule.id}`;
  }
}
