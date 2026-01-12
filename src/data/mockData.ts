import type { Circuit, Probe, Persona, MeasurementWorkflow, DiagnosticLog, AppState } from '../types';

export const mockComponents = [
  {
    id: 'C1',
    name: 'R1',
    type: 'Resistor',
    value: '10kΩ',
    pins: ['1', '2'],
    position: { x: 100, y: 100 },
    connected: true,
  },
  {
    id: 'C2',
    name: 'C1',
    type: 'Capacitor',
    value: '100μF',
    pins: ['1', '2'],
    position: { x: 200, y: 100 },
    connected: true,
  },
  {
    id: 'C3',
    name: 'U1',
    type: 'IC',
    value: 'LM358',
    pins: ['1', '2', '3', '4', '5', '6', '7', '8'],
    position: { x: 300, y: 150 },
    connected: true,
  },
  {
    id: 'C4',
    name: 'Q1',
    type: 'Transistor',
    value: '2N2222',
    pins: ['B', 'C', 'E'],
    position: { x: 400, y: 100 },
    connected: false,
  },
];

export const mockNets = [
  {
    id: 'N1',
    name: 'VCC',
    nodes: ['U1.8', 'R1.1', 'C1.1'],
    voltage: 5.0,
    description: 'Power supply rail',
  },
  {
    id: 'N2',
    name: 'GND',
    nodes: ['U1.4', 'C1.2', 'Q1.E'],
    voltage: 0.0,
    description: 'Ground reference',
  },
  {
    id: 'N3',
    name: 'OUT',
    nodes: ['U1.1', 'R1.2'],
    description: 'Amplifier output',
  },
];

export const mockTestPoints = [
  {
    id: 'TP1',
    name: 'TP1',
    description: 'Power supply voltage',
    voltage: 5.02,
  },
  {
    id: 'TP2',
    name: 'TP2',
    description: 'Signal input',
    voltage: 2.5,
    frequency: 1000,
  },
  {
    id: 'TP3',
    name: 'TP3',
    description: 'Amplifier output',
    voltage: 4.8,
  },
];

export const mockCircuits: Circuit[] = [
  {
    id: 'circuit-1',
    name: 'Audio Amplifier Stage',
    description: 'Single-stage op-amp audio amplifier with gain control',
    components: mockComponents,
    nets: mockNets,
    testPoints: mockTestPoints,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
];

export const mockProbes: Probe[] = [
  {
    id: 'probe-1',
    name: 'DMM-1',
    type: 'voltage',
    connected: true,
    testPointId: 'TP1',
  },
  {
    id: 'probe-2',
    name: 'Scope-CH1',
    type: 'oscilloscope',
    connected: false,
  },
  {
    id: 'probe-3',
    name: 'Current-Probe',
    type: 'current',
    connected: false,
  },
];

export const mockPersonas: Persona[] = [
  {
    id: 'persona-1',
    name: 'Alice Chen',
    role: 'Circuit Designer',
    avatar: '👩‍🔬',
    description: 'Focuses on circuit topology and component selection',
    active: true,
  },
  {
    id: 'persona-2',
    name: 'Bob Martinez',
    role: 'Test Engineer',
    avatar: '👨‍🔧',
    description: 'Specializes in measurement procedures and validation',
    active: false,
  },
  {
    id: 'persona-3',
    name: 'Charlie Kim',
    role: 'Debug Specialist',
    avatar: '🔍',
    description: 'Expert in troubleshooting and diagnostics',
    active: false,
  },
];

export const mockWorkflows: MeasurementWorkflow[] = [
  {
    id: 'workflow-1',
    name: 'Power Supply Verification',
    circuitId: 'circuit-1',
    status: 'in-progress',
    steps: [
      {
        id: 'step-1',
        name: 'Measure VCC',
        description: 'Verify power supply voltage is within spec',
        probe: 'DMM-1',
        testPoint: 'TP1',
        expectedValue: '5.0V ± 0.25V',
        actualValue: '5.02V',
        status: 'complete',
      },
      {
        id: 'step-2',
        name: 'Check Ground',
        description: 'Verify ground reference integrity',
        probe: 'DMM-1',
        testPoint: 'TP2',
        expectedValue: '0V',
        status: 'in-progress',
      },
      {
        id: 'step-3',
        name: 'Output Signal',
        description: 'Measure output signal amplitude',
        probe: 'Scope-CH1',
        testPoint: 'TP3',
        expectedValue: '4.5V - 5.0V',
        status: 'pending',
      },
    ],
  },
];

export const mockDiagnosticLogs: DiagnosticLog[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 300000),
    level: 'info',
    message: 'Workflow started: Power Supply Verification',
    workflowId: 'workflow-1',
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 240000),
    level: 'success',
    message: 'Step 1 complete: VCC measurement within tolerance',
    details: 'Measured: 5.02V, Expected: 5.0V ± 0.25V',
    workflowId: 'workflow-1',
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 180000),
    level: 'warning',
    message: 'Probe connection unstable',
    details: 'DMM-1 may need recalibration',
  },
  {
    id: 'log-4',
    timestamp: new Date(Date.now() - 120000),
    level: 'info',
    message: 'Starting step 2: Ground check',
    workflowId: 'workflow-1',
  },
];

export const initialAppState: AppState = {
  circuits: mockCircuits,
  workflows: mockWorkflows,
  diagnosticLogs: mockDiagnosticLogs,
  personas: mockPersonas,
  probes: mockProbes,
  activeCircuitId: 'circuit-1',
  activeWorkflowId: 'workflow-1',
};
