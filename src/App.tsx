import { useState } from 'react';
import './App.css';
import { useAppState } from './hooks/useAppState';
import ComponentVisualization from './components/ComponentVisualization';
import MeasurementWorkflows from './components/MeasurementWorkflows';
import DiagnosticLogging from './components/DiagnosticLogging';
import PersonasSidebar from './components/PersonasSidebar';
import ExportPanel from './components/ExportPanel';
import Board3DViewer from './components/Board3DViewer';
import ComponentPropertiesPanel from './components/ComponentPropertiesPanel';
import CircuitBuilder from './components/CircuitBuilder';
import PhotoCapture from './components/PhotoCapture';
import DiagnosticKnowledgePanel from './components/DiagnosticKnowledgePanel';
import type { MeasurementStep, DiagnosticLog, Component3D, Circuit, DiagnosticKnowledge } from './types';
import { Activity, FileText, ClipboardList, Download, Box, Edit3, Wrench, Camera, Brain } from 'lucide-react';

type View = 'visualization' | 'workflows' | 'logs' | 'export' | '3d' | 'builder' | 'capture' | 'diagnostics';

function App() {
  const [state, setState] = useAppState();
  const [activeView, setActiveView] = useState<View>('visualization');
  const [editMode, setEditMode] = useState(false);

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

  const handleSelectComponent = (componentId: string) => {
    setState(prevState => ({
      ...prevState,
      selectedComponentId: componentId,
    }));
    
    // Add log entry
    const component = state.board3D?.components.find(c => c.id === componentId);
    if (component) {
      addLog({
        level: 'info',
        message: `3D Component selected: ${component.refDes}`,
        details: `Type: ${component.type}`,
      });
    }
  };

  const handleComponentUpdate = (componentId: string, updates: Partial<Component3D>) => {
    setState(prevState => ({
      ...prevState,
      board3D: prevState.board3D
        ? {
            ...prevState.board3D,
            components: prevState.board3D.components.map(c =>
              c.id === componentId ? { ...c, ...updates } : c
            ),
          }
        : undefined,
    }));

    // Add log entry
    const component = state.board3D?.components.find(c => c.id === componentId);
    if (component) {
      addLog({
        level: 'info',
        message: `Component updated: ${component.refDes}`,
        details: JSON.stringify(updates, null, 2),
      });
    }
  };

  const handleComponent2DClick = (componentId: string) => {
    // Find corresponding 3D component by refDes
    const component2D = activeCircuit?.components.find(c => c.id === componentId);
    if (component2D && state.board3D) {
      const component3D = state.board3D.components.find(c => c.refDes === component2D.name);
      if (component3D) {
        handleSelectComponent(component3D.id);
        setActiveView('3d'); // Switch to 3D view
      }
    }
  };

  const handleCircuitCreate = (circuit: Circuit) => {
    setState(prevState => ({
      ...prevState,
      circuits: [...prevState.circuits, circuit],
      activeCircuitId: circuit.id,
    }));

    addLog({
      level: 'success',
      message: `New circuit created: ${circuit.name}`,
      details: `Components: ${circuit.components.length}, Nets: ${circuit.nets.length}`,
    });

    setActiveView('visualization');
  };

  const handlePhotoCapture = (photoData: { url: string; name: string; timestamp: Date }) => {
    addLog({
      level: 'info',
      message: `Photo captured: ${photoData.name}`,
      details: 'Photo capture is a stub implementation. Future versions will support component extraction and board analysis.',
    });
  };

  const handleUpdateDiagnosticKnowledge = (knowledge: DiagnosticKnowledge) => {
    setState(prevState => {
      const existingKnowledgeIndex = prevState.diagnosticKnowledge?.findIndex(
        k => k.circuitId === knowledge.circuitId
      );

      const updatedKnowledge = 
        existingKnowledgeIndex !== undefined && existingKnowledgeIndex >= 0
          ? prevState.diagnosticKnowledge!.map((k, i) => 
              i === existingKnowledgeIndex ? knowledge : k
            )
          : [...(prevState.diagnosticKnowledge || []), knowledge];

      return {
        ...prevState,
        diagnosticKnowledge: updatedKnowledge,
      };
    });

    addLog({
      level: 'success',
      message: 'Diagnostic knowledge updated',
      details: `Rules: ${knowledge.rules.length}`,
    });
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
              2D Schematic
            </button>
            <button
              className={`tab ${activeView === '3d' ? 'active' : ''}`}
              onClick={() => setActiveView('3d')}
            >
              <Box size={18} />
              3D View
            </button>
            <button
              className={`tab ${activeView === 'builder' ? 'active' : ''}`}
              onClick={() => setActiveView('builder')}
            >
              <Wrench size={18} />
              Circuit Builder
            </button>
            <button
              className={`tab ${activeView === 'capture' ? 'active' : ''}`}
              onClick={() => setActiveView('capture')}
            >
              <Camera size={18} />
              Photo Capture
            </button>
            <button
              className={`tab ${activeView === 'workflows' ? 'active' : ''}`}
              onClick={() => setActiveView('workflows')}
            >
              <ClipboardList size={18} />
              Workflows
            </button>
            <button
              className={`tab ${activeView === 'diagnostics' ? 'active' : ''}`}
              onClick={() => setActiveView('diagnostics')}
            >
              <Brain size={18} />
              Cognitive Diagnostics
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
                onComponentClick={handleComponent2DClick}
              />
            )}
            {activeView === '3d' && state.board3D && (
              <div className="view-3d-container">
                <div className="view-3d-toolbar">
                  <button
                    className={`btn-edit-mode ${editMode ? 'active' : ''}`}
                    onClick={() => setEditMode(!editMode)}
                    title={editMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
                  >
                    <Edit3 size={18} />
                    {editMode ? 'View Mode' : 'Edit Mode'}
                  </button>
                </div>
                <div className="view-3d-main">
                  <Board3DViewer
                    board={state.board3D}
                    selectedComponentId={state.selectedComponentId}
                    onSelectComponent={handleSelectComponent}
                    onComponentUpdate={handleComponentUpdate}
                    editMode={editMode}
                  />
                  {editMode && (
                    <ComponentPropertiesPanel
                      component={state.board3D.components.find(c => c.id === state.selectedComponentId)}
                      onUpdate={handleComponentUpdate}
                    />
                  )}
                </div>
              </div>
            )}
            {activeView === 'workflows' && (
              <MeasurementWorkflows
                workflows={state.workflows}
                activeWorkflowId={state.activeWorkflowId}
                onWorkflowSelect={handleWorkflowSelect}
                onStepUpdate={handleStepUpdate}
              />
            )}
            {activeView === 'diagnostics' && activeCircuit && (
              <DiagnosticKnowledgePanel
                circuit={activeCircuit}
                diagnosticKnowledge={state.diagnosticKnowledge?.find(k => k.circuitId === activeCircuit.id)}
                measurements={state.workflows
                  .filter(w => w.circuitId === activeCircuit.id)
                  .flatMap(w => w.steps)}
                onUpdateKnowledge={handleUpdateDiagnosticKnowledge}
                onAddLog={(message, level, details) => addLog({ level, message, details })}
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
            {activeView === 'builder' && (
              <CircuitBuilder onCircuitCreate={handleCircuitCreate} />
            )}
            {activeView === 'capture' && (
              <PhotoCapture onPhotoCapture={handlePhotoCapture} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
