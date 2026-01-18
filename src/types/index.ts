// Core data models for the cognitive electronics lab

export interface TestPoint {
  id: string;
  name: string;
  description: string;
  voltage?: number;
  current?: number;
  frequency?: number;
}

export interface Probe {
  id: string;
  name: string;
  type: 'voltage' | 'current' | 'logic' | 'oscilloscope';
  connected: boolean;
  testPointId?: string;
}

export interface Net {
  id: string;
  name: string;
  nodes: string[];
  voltage?: number;
  description: string;
}

export interface Component {
  id: string;
  name: string;
  type: string;
  value?: string;
  pins: string[];
  position: { x: number; y: number };
  connected: boolean;
}

export interface Circuit {
  id: string;
  name: string;
  description: string;
  components: Component[];
  nets: Net[];
  testPoints: TestPoint[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MeasurementStep {
  id: string;
  name: string;
  description: string;
  probe: string;
  testPoint: string;
  expectedValue?: string;
  actualValue?: string;
  status: 'pending' | 'in-progress' | 'complete' | 'failed';
  netId?: string; // Link to specific net
  componentId?: string; // Link to specific component
}

export type MeasurementSource = 'manual' | 'serial' | 'usb' | 'ble';

export interface MeasurementWorkflow {
  id: string;
  name: string;
  circuitId: string;
  steps: MeasurementStep[];
  status: 'not-started' | 'in-progress' | 'complete';
  source?: MeasurementSource; // How measurements are obtained
}

export interface DiagnosticLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  details?: string;
  workflowId?: string;
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  active: boolean;
}

export interface Component3D {
  id: string;
  refDes: string;      // R1, C3, U1...
  type: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  size: { x: number; y: number; z: number }; // bounding box simple
  netIds: string[];    // a qué redes pertenece
}

export interface Board3D {
  id: string;
  name: string;
  width: number;
  height: number;
  thickness: number;
  components: Component3D[];
}

// Cognitive Semantics Layer - Causal Relationships
// "Si este net está bajo, esta sección no puede oscilar"
// "Si este transistor está saturado, el rail cae"

export type ConditionOperator = '>' | '<' | '=' | '>=' | '<=' | '!=' | 'between' | 'absent' | 'present';

export interface Condition {
  id: string;
  type: 'net_voltage' | 'net_current' | 'component_state' | 'measurement' | 'signal_present';
  targetId: string; // netId or componentId
  operator: ConditionOperator;
  value?: number;
  valueRange?: { min: number; max: number };
  description: string;
}

export interface Consequence {
  id: string;
  type: 'functional_failure' | 'oscillation_stop' | 'rail_drop' | 'signal_loss' | 'heating' | 'no_output';
  severity: 'critical' | 'warning' | 'info';
  affectedNetIds: string[];
  affectedComponentIds: string[];
  description: string;
  explanation: string; // Why this happens (the cognitive link)
}

export interface CircuitRule {
  id: string;
  name: string;
  circuitId: string;
  conditions: Condition[]; // If these conditions are met...
  consequence: Consequence; // ...then this happens
  enabled: boolean;
  category: 'power' | 'signal' | 'timing' | 'filtering' | 'amplification' | 'regulation' | 'general';
}

export interface DiagnosticKnowledge {
  circuitId: string;
  rules: CircuitRule[];
  activeSymptoms: string[]; // IDs of currently detected symptoms
  predictedConsequences: Consequence[]; // What the system predicts will fail
}

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

export interface AppState {
  circuits: Circuit[];
  workflows: MeasurementWorkflow[];
  diagnosticLogs: DiagnosticLog[];
  personas: Persona[];
  probes: Probe[];
  activeCircuitId?: string;
  activeWorkflowId?: string;
  board3D?: Board3D;
  selectedComponentId?: string;
  diagnosticKnowledge?: DiagnosticKnowledge[];
  narratives?: TechnicalNarrative[];
}
