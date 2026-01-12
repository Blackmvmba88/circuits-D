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
}

export interface MeasurementWorkflow {
  id: string;
  name: string;
  circuitId: string;
  steps: MeasurementStep[];
  status: 'not-started' | 'in-progress' | 'complete';
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

export interface AppState {
  circuits: Circuit[];
  workflows: MeasurementWorkflow[];
  diagnosticLogs: DiagnosticLog[];
  personas: Persona[];
  probes: Probe[];
  activeCircuitId?: string;
  activeWorkflowId?: string;
}
