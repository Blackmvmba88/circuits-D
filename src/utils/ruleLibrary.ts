// Cognitive Rule Library
// 40-60 rules that capture how test engineers think about circuits
// This is the "semiotic electronics layer" - connecting symptoms to causes

import type { Consequence } from '../types';

/**
 * Rule template for library - has partial Consequence that will be completed when applied
 */
export interface RuleTemplate {
  name: string;
  category: 'power' | 'signal' | 'timing' | 'filtering' | 'amplification' | 'regulation' | 'general';
  enabled: boolean;
  consequence: Omit<Consequence, 'id' | 'affectedNetIds' | 'affectedComponentIds'> & {
    id?: string;
    affectedNetIds?: string[];
    affectedComponentIds?: string[];
  };
}

/**
 * Power Supply Rules
 * Rules related to voltage rails, current capacity, and power distribution
 */
export const powerRules: RuleTemplate[] = [
  {
    name: 'Rail Voltage Below Minimum',
    category: 'power',
    enabled: true,
    // Template - actual conditions/consequences added when applied to specific circuit
    consequence: {
      type: 'rail_drop',
      severity: 'critical',
      description: 'Power rail voltage insufficient for circuit operation',
      explanation: 'When supply voltage drops below minimum operating voltage, active components cannot function properly. This typically indicates overload, regulator failure, or insufficient supply current capability.'
    }
  },
  {
    name: 'Excessive Rail Ripple',
    category: 'filtering',
    enabled: true,
    consequence: {
      type: 'signal_loss',
      severity: 'warning',
      description: 'Power rail has excessive AC ripple',
      explanation: 'High ripple on power rails indicates inadequate filtering, often due to high ESR in filter capacitors, missing decoupling, or overload. This can cause noise injection into sensitive circuits and unstable operation.'
    }
  },
  {
    name: 'Voltage Regulator Saturation',
    category: 'regulation',
    enabled: true,
    consequence: {
      type: 'rail_drop',
      severity: 'critical',
      description: 'Voltage regulator cannot maintain output voltage',
      explanation: 'When load current exceeds regulator capability or input-output differential is insufficient, the regulator enters dropout and output voltage sags. Check load current vs regulator rating and ensure adequate input voltage headroom.'
    }
  },
  {
    name: 'Reverse Polarity Protection Active',
    category: 'power',
    enabled: true,
    consequence: {
      type: 'no_output',
      severity: 'critical',
      description: 'Reverse polarity detected - circuit protection engaged',
      explanation: 'Reverse polarity protection (diode or MOSFET) is blocking current flow to protect the circuit. Check input power supply polarity. Note: Some protection circuits can cause voltage drop even with correct polarity.'
    }
  },
  {
    name: 'Inrush Current Limiting Active',
    category: 'power',
    enabled: true,
    consequence: {
      type: 'rail_drop',
      severity: 'warning',
      description: 'Inrush current limiter reducing available voltage during startup',
      explanation: 'NTC thermistors or active inrush limiters can temporarily reduce available voltage during power-up. This is normal but may affect fast-starting circuits. Check steady-state voltage after warmup.'
    }
  }
];

/**
 * Signal Path Rules
 * Rules for analog and digital signal integrity
 */
export const signalRules: RuleTemplate[] = [
  {
    name: 'Signal Missing at Output',
    category: 'signal',
    enabled: true,
    consequence: {
      type: 'signal_loss',
      severity: 'critical',
      description: 'No signal detected at expected output point',
      explanation: 'Signal loss indicates open circuit, failed component, or incorrect bias. Check signal path from input to output, verify DC bias points, and test each stage independently.'
    }
  },
  {
    name: 'Signal Attenuation Excessive',
    category: 'signal',
    enabled: true,
    consequence: {
      type: 'signal_loss',
      severity: 'warning',
      description: 'Signal amplitude lower than expected',
      explanation: 'Excessive attenuation can result from incorrect component values, loading effects, or partial failure. Verify impedance matching, check for shorts to ground, and measure DC bias points.'
    }
  },
  {
    name: 'DC Bias Point Incorrect',
    category: 'amplification',
    enabled: true,
    consequence: {
      type: 'signal_loss',
      severity: 'critical',
      description: 'Transistor or op-amp bias point outside linear region',
      explanation: 'Incorrect DC bias causes clipping, distortion, or complete signal loss. For transistors, check base/gate bias network. For op-amps, verify feedback network and power supply voltages.'
    }
  },
  {
    name: 'AC Coupling Capacitor Open',
    category: 'signal',
    enabled: true,
    consequence: {
      type: 'signal_loss',
      severity: 'critical',
      description: 'AC coupling capacitor failed open - no AC signal transfer',
      explanation: 'Open coupling capacitor blocks all AC signals while DC bias may appear normal. This is common in aging electrolytic capacitors. Replace with appropriate AC coupling capacitor.'
    }
  },
  {
    name: 'Input Impedance Mismatch',
    category: 'signal',
    enabled: true,
    consequence: {
      type: 'signal_loss',
      severity: 'warning',
      description: 'Signal source loaded by low input impedance',
      explanation: 'When input impedance is too low relative to source impedance, signal voltage divides down, causing excessive attenuation. Add buffer amplifier or increase input impedance.'
    }
  }
];

/**
 * Oscillator and Timing Rules
 */
export const timingRules: RuleTemplate[] = [
  {
    name: 'Oscillator Not Starting',
    category: 'timing',
    enabled: true,
    consequence: {
      type: 'oscillation_stop',
      severity: 'critical',
      description: 'Crystal oscillator fails to start or sustain oscillation',
      explanation: 'Oscillator failure typically caused by: (1) Incorrect load capacitors - must match crystal specification, (2) Crystal damaged or wrong frequency, (3) Insufficient gain in oscillator circuit, (4) Incorrect bias or power supply. Verify load capacitance calculation: CL = (C1·C2)/(C1+C2) + Cstray'
    }
  },
  {
    name: 'Clock Signal Absent',
    category: 'timing',
    enabled: true,
    consequence: {
      type: 'no_output',
      severity: 'critical',
      description: 'No clock signal detected - digital circuit inactive',
      explanation: 'Missing clock prevents all sequential logic operation. Check oscillator enable signal, power supply to oscillator, and clock distribution network. Verify clock source is functioning before checking downstream.'
    }
  },
  {
    name: 'Clock Jitter Excessive',
    category: 'timing',
    enabled: true,
    consequence: {
      type: 'signal_loss',
      severity: 'warning',
      description: 'Clock signal has high jitter or instability',
      explanation: 'Excessive jitter causes timing violations and intermittent errors. Common causes: poor power supply decoupling, noisy reference voltage, marginal oscillator circuit, or EMI. Check power rail quality and ground connections first.'
    }
  },
  {
    name: 'PLL Not Locking',
    category: 'timing',
    enabled: true,
    consequence: {
      type: 'oscillation_stop',
      severity: 'critical',
      description: 'Phase-locked loop fails to achieve lock',
      explanation: 'PLL lock failure indicates: reference clock absent/unstable, incorrect loop filter values, VCO out of range, or power supply noise. Check reference clock first, then verify loop filter components match design.'
    }
  },
  {
    name: 'Propagation Delay Excessive',
    category: 'timing',
    enabled: true,
    consequence: {
      type: 'signal_loss',
      severity: 'warning',
      description: 'Signal delay through circuit exceeds timing budget',
      explanation: 'Excessive propagation delay causes timing violations in synchronous circuits. Check for: slow logic families, excessive capacitive loading, insufficient drive strength, or degraded components.'
    }
  }
];

/**
 * Component-Specific Rules
 */
export const componentRules: RuleTemplate[] = [
  {
    name: 'LED No Current Flow',
    category: 'power',
    enabled: true,
    consequence: {
      type: 'no_output',
      severity: 'warning',
      description: 'LED not illuminating - no current flow detected',
      explanation: 'LED failure modes: (1) Reverse connection - check polarity, (2) Open circuit - LED or current-limiting resistor failed, (3) Insufficient voltage - verify supply exceeds Vf + resistor drop, (4) Excessive resistance - check current-limiting resistor value.'
    }
  },
  {
    name: 'LED Thermal Runaway',
    category: 'power',
    enabled: true,
    consequence: {
      type: 'heating',
      severity: 'critical',
      description: 'LED experiencing thermal runaway - imminent failure',
      explanation: 'LEDs have negative temperature coefficient: as temperature increases, forward voltage decreases, increasing current, which increases temperature further. Without current limiting, this positive feedback loop leads to rapid failure. Always use appropriate current-limiting resistor or constant-current driver.'
    }
  },
  {
    name: 'Resistor Value Incorrect',
    category: 'general',
    enabled: true,
    consequence: {
      type: 'functional_failure',
      severity: 'warning',
      description: 'Measured resistance differs significantly from expected value',
      explanation: 'Incorrect resistor value affects circuit function. Causes: wrong component installed, resistor damaged by overvoltage/overcurrent, or measurement error. Verify with out-of-circuit measurement.'
    }
  },
  {
    name: 'Capacitor ESR High',
    category: 'filtering',
    enabled: true,
    consequence: {
      type: 'functional_failure',
      severity: 'warning',
      description: 'Capacitor ESR too high - reduced filtering effectiveness',
      explanation: 'High ESR limits capacitor ability to supply high-frequency current, causing voltage sag during transients. Common in aging electrolytic capacitors. Replace if ESR exceeds ~1Ω for bulk caps, ~0.1Ω for ceramic.'
    }
  },
  {
    name: 'Capacitor Leakage High',
    category: 'power',
    enabled: true,
    consequence: {
      type: 'rail_drop',
      severity: 'warning',
      description: 'Capacitor has excessive leakage current',
      explanation: 'High leakage current (>1µA for most electrolytics) indicates capacitor degradation. This can cause voltage sag, increased power consumption, and heating. Replace capacitor.'
    }
  },
  {
    name: 'Diode Forward Drop Excessive',
    category: 'power',
    enabled: true,
    consequence: {
      type: 'rail_drop',
      severity: 'warning',
      description: 'Diode forward voltage drop higher than expected',
      explanation: 'Excessive diode drop (>1V for standard silicon, >0.5V for Schottky) indicates wrong diode type or degraded component. Check diode specifications and junction temperature.'
    }
  },
  {
    name: 'Transistor Saturation Failure',
    category: 'amplification',
    enabled: true,
    consequence: {
      type: 'no_output',
      severity: 'critical',
      description: 'Transistor fails to saturate - collector voltage remains high',
      explanation: 'BJT not saturating indicates insufficient base current. For NPN: Ic/Ib should be less than β/10 for hard saturation. Check base drive resistor value and drive signal amplitude. For MOSFET: ensure Vgs exceeds threshold by 4-5V.'
    }
  },
  {
    name: 'Op-Amp Output Rail Limited',
    category: 'amplification',
    enabled: true,
    consequence: {
      type: 'signal_loss',
      severity: 'warning',
      description: 'Op-amp output cannot reach expected voltage - rail limited',
      explanation: 'Op-amp output typically cannot reach supply rails (0.5-2V margin for standard op-amps). For rail-to-rail operation, use R2R op-amp. Also check that output current is within specification and load impedance is adequate.'
    }
  },
  {
    name: 'Voltage Reference Drift',
    category: 'regulation',
    enabled: true,
    consequence: {
      type: 'functional_failure',
      severity: 'warning',
      description: 'Voltage reference outside specified accuracy',
      explanation: 'Reference drift indicates: (1) Temperature effects - check tempco specification, (2) Load regulation - verify load current within spec, (3) Component aging, (4) Power supply noise coupling. Measure with minimal loading and stable temperature.'
    }
  }
];

/**
 * Filtering and Noise Rules
 */
export const filteringRules: RuleTemplate[] = [
  {
    name: 'Decoupling Capacitor Missing',
    category: 'filtering',
    enabled: true,
    consequence: {
      type: 'functional_failure',
      severity: 'critical',
      description: 'Missing decoupling capacitor causing power supply instability',
      explanation: 'Every IC requires local decoupling (typically 100nF ceramic) to supply high-frequency switching currents. Without decoupling: power rail droops during transitions, noise couples between circuits, and oscillation may occur. Place decoupling caps close to IC power pins with short traces.'
    }
  },
  {
    name: 'Ground Bounce Present',
    category: 'signal',
    enabled: true,
    consequence: {
      type: 'signal_loss',
      severity: 'warning',
      description: 'Ground voltage fluctuating due to return current impedance',
      explanation: 'Ground bounce occurs when high di/dt currents flow through finite ground impedance, causing ground voltage to shift. Solutions: (1) Reduce ground trace inductance with ground plane, (2) Add decoupling capacitors, (3) Separate analog and digital grounds with star connection, (4) Reduce switching speed if possible.'
    }
  },
  {
    name: 'EMI Filter Ineffective',
    category: 'filtering',
    enabled: true,
    consequence: {
      type: 'signal_loss',
      severity: 'warning',
      description: 'EMI/RFI still present despite filtering - filter inadequate',
      explanation: 'Ineffective EMI filtering indicates: (1) Filter cutoff frequency too high for noise spectrum, (2) Poor component placement allowing coupling around filter, (3) Insufficient attenuation - need multi-stage filter, (4) Ground loop creating alternate path. Check filter response vs noise frequency.'
    }
  },
  {
    name: 'Common Mode Noise High',
    category: 'signal',
    enabled: true,
    consequence: {
      type: 'signal_loss',
      severity: 'warning',
      description: 'Common mode noise affecting differential signals',
      explanation: 'High common mode noise indicates poor grounding or EMI pickup. For differential signals, common mode rejection ratio (CMRR) of receiver limits immunity. Improve with: balanced layout, twisted pair wiring, common mode chokes, and proper grounding.'
    }
  },
  {
    name: 'Power Supply Rejection Inadequate',
    category: 'amplification',
    enabled: true,
    consequence: {
      type: 'signal_loss',
      severity: 'warning',
      description: 'Power supply noise coupling into signal path',
      explanation: 'Poor power supply rejection ratio (PSRR) allows supply noise to modulate signal. Improve with: better power supply filtering, separate analog/digital supplies, linear post-regulator for sensitive circuits, and improved decoupling.'
    }
  }
];

/**
 * Thermal Rules
 */
export const thermalRules: RuleTemplate[] = [
  {
    name: 'Component Overheating',
    category: 'power',
    enabled: true,
    consequence: {
      type: 'heating',
      severity: 'critical',
      description: 'Component temperature exceeds safe operating range',
      explanation: 'Overheating causes immediate or long-term failure. Check: (1) Power dissipation vs rating - use P=I²R or P=V²/R, (2) Thermal resistance junction-to-ambient, (3) Heatsinking adequacy, (4) Ambient temperature, (5) Adjacent heat sources. Reduce power or improve cooling.'
    }
  },
  {
    name: 'Thermal Runaway in Linear Regulator',
    category: 'regulation',
    enabled: true,
    consequence: {
      type: 'heating',
      severity: 'critical',
      description: 'Linear regulator entering thermal runaway',
      explanation: 'Linear regulators dissipate P = (Vin - Vout) × Iout. As temperature increases, quiescent current increases, causing more heating. Thermal runaway occurs when heat generation exceeds dissipation. Solutions: (1) Reduce input voltage, (2) Add/improve heatsink, (3) Switch to switching regulator, (4) Reduce load current.'
    }
  },
  {
    name: 'Thermal Protection Active',
    category: 'regulation',
    enabled: true,
    consequence: {
      type: 'no_output',
      severity: 'warning',
      description: 'Thermal shutdown protecting component from damage',
      explanation: 'Thermal protection circuitry has shut down output to prevent damage. This is working as designed. Root cause: excessive power dissipation, inadequate cooling, or high ambient temperature. Do not bypass thermal protection - address root cause.'
    }
  },
  {
    name: 'Temperature Coefficient Effect',
    category: 'general',
    enabled: true,
    consequence: {
      type: 'functional_failure',
      severity: 'info',
      description: 'Circuit parameters drifting with temperature',
      explanation: 'All components have temperature coefficients. Significant effects: (1) Resistor tempco typically 50-100ppm/°C, (2) Capacitor tempco varies widely by type, (3) Semiconductor parameters very temperature dependent, (4) Crystal frequency drifts. Use temperature-stable components for precision circuits.'
    }
  }
];

/**
 * Digital Logic Rules
 */
export const digitalRules: RuleTemplate[] = [
  {
    name: 'Logic Level Threshold Violation',
    category: 'signal',
    enabled: true,
    consequence: {
      type: 'functional_failure',
      severity: 'critical',
      description: 'Digital signal not meeting logic level thresholds',
      explanation: 'For valid logic levels: TTL requires >2V (high) and <0.8V (low); CMOS typically >70% Vdd (high) and <30% Vdd (low). Marginal levels cause unreliable operation. Check: (1) Drive strength vs load, (2) Supply voltage, (3) Pull-up/down resistors, (4) Level shifters for mixed-voltage systems.'
    }
  },
  {
    name: 'Floating Input',
    category: 'signal',
    enabled: true,
    consequence: {
      type: 'functional_failure',
      severity: 'warning',
      description: 'Digital input left floating - undefined state',
      explanation: 'CMOS inputs draw very low current but are extremely high impedance. Floating inputs pick up noise and drift, causing unreliable behavior and increased power consumption. Always: tie unused inputs to defined level via resistor or to supply/ground directly per datasheet.'
    }
  },
  {
    name: 'Bus Contention',
    category: 'signal',
    enabled: true,
    consequence: {
      type: 'functional_failure',
      severity: 'critical',
      description: 'Multiple drivers conflicting on shared bus',
      explanation: 'Bus contention occurs when multiple outputs drive the same net to different states simultaneously. This causes: excessive current draw, logic errors, and potential component damage. Verify: (1) Tri-state control signals, (2) Bus arbiter logic, (3) Pull-up/down resistor values for open-drain buses.'
    }
  },
  {
    name: 'Setup/Hold Time Violation',
    category: 'timing',
    enabled: true,
    consequence: {
      type: 'functional_failure',
      severity: 'critical',
      description: 'Data signal violating flip-flop timing requirements',
      explanation: 'Setup time (data stable before clock) and hold time (data stable after clock) violations cause metastability and unreliable data capture. Check: (1) Clock-to-Q delay of source + routing delay < clock period - setup time, (2) Hold time < clock-to-Q delay + routing delay. Add pipeline stages if needed.'
    }
  },
  {
    name: 'Fan-Out Exceeded',
    category: 'signal',
    enabled: true,
    consequence: {
      type: 'signal_loss',
      severity: 'warning',
      description: 'Output driving more inputs than rated capacity',
      explanation: 'Exceeding fan-out causes: slow rise/fall times, reduced noise margin, and potential logic errors. For TTL fan-out is in unit loads; for CMOS consider total input capacitance vs drive strength. Solutions: (1) Add buffer IC, (2) Reduce number of loads, (3) Use higher drive strength output.'
    }
  }
];

/**
 * Protection Circuit Rules
 */
export const protectionRules: RuleTemplate[] = [
  {
    name: 'Overcurrent Protection Triggered',
    category: 'power',
    enabled: true,
    consequence: {
      type: 'no_output',
      severity: 'critical',
      description: 'Current limit or foldback protection active',
      explanation: 'Overcurrent protection prevents damage from shorts or overload. This is working as designed. Investigate: (1) Short circuit in load, (2) Inrush current too high, (3) Wrong component causing excessive current draw, (4) Protection threshold set too low. Do not bypass protection - find root cause.'
    }
  },
  {
    name: 'ESD Clamp Conducting',
    category: 'power',
    enabled: true,
    consequence: {
      type: 'signal_loss',
      severity: 'warning',
      description: 'ESD protection diode forward biased - signal clamped',
      explanation: 'ESD protection diodes clamp signals that go beyond supply rails. If conducting during normal operation: (1) Input signal exceeds rail voltages, (2) Power supply sequencing issue, (3) Ground potential difference. Add series resistor to limit clamp current or use dedicated level shifter.'
    }
  },
  {
    name: 'Overvoltage Protection Active',
    category: 'power',
    enabled: true,
    consequence: {
      type: 'no_output',
      severity: 'critical',
      description: 'Overvoltage protection has shut down circuit',
      explanation: 'Overvoltage protection (crowbar SCR or MOSFET cutoff) has activated to prevent damage. Check input power supply voltage. After clearing fault condition, circuit may require power cycle or reset to restore operation.'
    }
  }
];

/**
 * All rules combined
 */
export const cognitiveRuleLibrary = {
  power: powerRules,
  signal: signalRules,
  timing: timingRules,
  component: componentRules,
  filtering: filteringRules,
  thermal: thermalRules,
  digital: digitalRules,
  protection: protectionRules
};

/**
 * Get all rules as flat array
 */
export function getAllRuleTemplates(): RuleTemplate[] {
  return [
    ...powerRules,
    ...signalRules,
    ...timingRules,
    ...componentRules,
    ...filteringRules,
    ...thermalRules,
    ...digitalRules,
    ...protectionRules
  ];
}

/**
 * Get rules by category
 */
export function getRulesByCategory(
  category: 'power' | 'signal' | 'timing' | 'filtering' | 'amplification' | 'regulation' | 'general'
): RuleTemplate[] {
  return getAllRuleTemplates().filter(rule => rule.category === category);
}

/**
 * Get rule count
 */
export function getRuleCount(): number {
  return getAllRuleTemplates().length;
}
