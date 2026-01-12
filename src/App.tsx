import { useState } from 'react';
import './App.css';
import { useAppState } from './hooks/useAppState';
import ComponentVisualization from './components/ComponentVisualization';
import MeasurementWorkflows from './components/MeasurementWorkflows';
import DiagnosticLogging from './components/DiagnosticLogging';
import PersonasSidebar from './components/PersonasSidebar';
import ExportPanel from './components/ExportPanel';
import type { MeasurementStep, DiagnosticLog } from './types';
import { Activity, FileText, ClipboardList, Download } from 'lucide-react';

type View = 'visualization' | 'workflows' | 'logs' | 'export';

function App() {
  const [state, setState] = useAppState();
  const [activeView, setActiveView] = useState<View>('visualization');

  const activeCircuit = state.circuits.find(c => c.id === state.activeCircuitId);

  const handlePersonaToggle = (personaId: string) => {
    setState(prevState => ({
      ...prevState,
      personas: prevState.personas.map(p =>
        p.id === personaId ? { ...p, active: !p.active } : p
      ),
    }));
    
    // Add log entry
    const persona = state.personas.find(p => p.id === personaId);
    if (persona) {
      addLog({
        level: 'info',
        message: `Persona ${persona.active ? 'deactivated' : 'activated'}: ${persona.name}`,
      });
    }
  };

  const handleWorkflowSelect = (workflowId: string) => {
    setState(prevState => ({
      ...prevState,
      activeWorkflowId: workflowId,
    }));
    
    const workflow = state.workflows.find(w => w.id === workflowId);
    if (workflow) {
      addLog({
        level: 'info',
        message: `Workflow selected: ${workflow.name}`,
        workflowId,
      });
    }
  };

  const handleStepUpdate = (workflowId: string, stepId: string, updates: Partial<MeasurementStep>) => {
    setState(prevState => ({
      ...prevState,
      workflows: prevState.workflows.map(w =>
        w.id === workflowId
          ? {
              ...w,
              steps: w.steps.map(s =>
                s.id === stepId ? { ...s, ...updates } : s
              ),
            }
          : w
      ),
    }));

    // Add log entry
    const workflow = state.workflows.find(w => w.id === workflowId);
    const step = workflow?.steps.find(s => s.id === stepId);
    if (step) {
      const level = updates.status === 'complete' ? 'success' : 
                   updates.status === 'failed' ? 'error' : 'info';
      addLog({
        level,
        message: `Step ${updates.status}: ${step.name}`,
        details: updates.actualValue ? `Measured value: ${updates.actualValue}` : undefined,
        workflowId,
      });
    }
  };

  const addLog = (logData: Omit<DiagnosticLog, 'id' | 'timestamp'>) => {
    const newLog: DiagnosticLog = {
      ...logData,
      id: `log-${Date.now()}`,
      timestamp: new Date(),
    };
    
    setState(prevState => ({
      ...prevState,
      diagnosticLogs: [...prevState.diagnosticLogs, newLog],
    }));
  };

  const handleClearLogs = () => {
    setState(prevState => ({
      ...prevState,
      diagnosticLogs: [],
    }));
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Activity size={32} />
            <div className="logo-text">
              <h1>Circuits Lab</h1>
              <p className="tagline">Interactive Cognitive Electronics Workbench</p>
            </div>
          </div>
          {activeCircuit && (
            <div className="active-circuit-info">
              <span className="label">Active Circuit:</span>
              <span className="circuit-name">{activeCircuit.name}</span>
            </div>
          )}
        </div>
      </header>

      <div className="app-layout">
        <PersonasSidebar
          personas={state.personas}
          onPersonaToggle={handlePersonaToggle}
        />

        <main className="main-content">
          <nav className="view-tabs">
            <button
              className={`tab ${activeView === 'visualization' ? 'active' : ''}`}
              onClick={() => setActiveView('visualization')}
            >
              <Activity size={18} />
              Circuit View
            </button>
            <button
              className={`tab ${activeView === 'workflows' ? 'active' : ''}`}
              onClick={() => setActiveView('workflows')}
            >
              <ClipboardList size={18} />
              Workflows
            </button>
            <button
              className={`tab ${activeView === 'logs' ? 'active' : ''}`}
              onClick={() => setActiveView('logs')}
            >
              <FileText size={18} />
              Diagnostic Logs
            </button>
            <button
              className={`tab ${activeView === 'export' ? 'active' : ''}`}
              onClick={() => setActiveView('export')}
            >
              <Download size={18} />
              Export
            </button>
          </nav>

          <div className="view-content">
            {activeView === 'visualization' && activeCircuit && (
              <ComponentVisualization
                components={activeCircuit.components}
                nets={activeCircuit.nets}
              />
            )}
            {activeView === 'workflows' && (
              <MeasurementWorkflows
                workflows={state.workflows}
                activeWorkflowId={state.activeWorkflowId}
                onWorkflowSelect={handleWorkflowSelect}
                onStepUpdate={handleStepUpdate}
              />
            )}
            {activeView === 'logs' && (
              <DiagnosticLogging
                logs={state.diagnosticLogs}
                onClearLogs={handleClearLogs}
              />
            )}
            {activeView === 'export' && (
              <ExportPanel state={state} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
