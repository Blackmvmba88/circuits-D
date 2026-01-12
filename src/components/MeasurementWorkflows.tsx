import type { MeasurementWorkflow, MeasurementStep } from '../types';
import { CheckCircle, Circle, XCircle, PlayCircle } from 'lucide-react';

interface MeasurementWorkflowsProps {
  workflows: MeasurementWorkflow[];
  activeWorkflowId?: string;
  onWorkflowSelect: (id: string) => void;
  onStepUpdate: (workflowId: string, stepId: string, updates: Partial<MeasurementStep>) => void;
}

export default function MeasurementWorkflows({
  workflows,
  activeWorkflowId,
  onWorkflowSelect,
  onStepUpdate,
}: MeasurementWorkflowsProps) {
  const activeWorkflow = workflows.find(w => w.id === activeWorkflowId);

  const getStatusIcon = (status: MeasurementStep['status']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle size={20} color="#4CAF50" />;
      case 'failed':
        return <XCircle size={20} color="#f44336" />;
      case 'in-progress':
        return <PlayCircle size={20} color="#2196F3" />;
      default:
        return <Circle size={20} color="#999" />;
    }
  };

  const getStatusClass = (status: MeasurementStep['status']) => {
    switch (status) {
      case 'complete':
        return 'status-complete';
      case 'failed':
        return 'status-failed';
      case 'in-progress':
        return 'status-in-progress';
      default:
        return 'status-pending';
    }
  };

  return (
    <div className="measurement-workflows">
      <div className="workflow-header">
        <h2>Measurement Workflows</h2>
        <select
          value={activeWorkflowId || ''}
          onChange={(e) => onWorkflowSelect(e.target.value)}
          className="workflow-selector"
        >
          <option value="">Select workflow...</option>
          {workflows.map(w => (
            <option key={w.id} value={w.id}>
              {w.name} ({w.status})
            </option>
          ))}
        </select>
      </div>

      {activeWorkflow && (
        <div className="workflow-content">
          <div className="workflow-info">
            <h3>{activeWorkflow.name}</h3>
            <span className={`workflow-status ${activeWorkflow.status}`}>
              {activeWorkflow.status.toUpperCase()}
            </span>
          </div>

          <div className="workflow-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${(activeWorkflow.steps.filter(s => s.status === 'complete').length / activeWorkflow.steps.length) * 100}%`,
                }}
              />
            </div>
            <span className="progress-text">
              {activeWorkflow.steps.filter(s => s.status === 'complete').length} / {activeWorkflow.steps.length} steps complete
            </span>
          </div>

          <div className="workflow-steps">
            {activeWorkflow.steps.map((step, idx) => (
              <div key={step.id} className={`workflow-step ${getStatusClass(step.status)}`}>
                <div className="step-header">
                  <div className="step-number-icon">
                    <span className="step-number">{idx + 1}</span>
                    {getStatusIcon(step.status)}
                  </div>
                  <div className="step-title">
                    <h4>{step.name}</h4>
                    <p className="step-description">{step.description}</p>
                  </div>
                </div>

                <div className="step-details">
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="label">Probe:</span>
                      <span className="value">{step.probe}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Test Point:</span>
                      <span className="value">{step.testPoint}</span>
                    </div>
                    {step.expectedValue && (
                      <div className="detail-item">
                        <span className="label">Expected:</span>
                        <span className="value expected">{step.expectedValue}</span>
                      </div>
                    )}
                    {step.actualValue && (
                      <div className="detail-item">
                        <span className="label">Actual:</span>
                        <span className="value actual">{step.actualValue}</span>
                      </div>
                    )}
                  </div>

                  {step.status === 'pending' && (
                    <button
                      className="btn-start-step"
                      onClick={() => onStepUpdate(activeWorkflow.id, step.id, { status: 'in-progress' })}
                    >
                      Start Measurement
                    </button>
                  )}

                  {step.status === 'in-progress' && (
                    <div className="step-actions">
                      <button
                        className="btn-complete"
                        onClick={() => onStepUpdate(activeWorkflow.id, step.id, { 
                          status: 'complete',
                          actualValue: '5.02V' // Placeholder
                        })}
                      >
                        Complete
                      </button>
                      <button
                        className="btn-fail"
                        onClick={() => onStepUpdate(activeWorkflow.id, step.id, { status: 'failed' })}
                      >
                        Mark Failed
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!activeWorkflow && workflows.length > 0 && (
        <div className="no-workflow-selected">
          <p>Select a workflow to view measurement steps</p>
        </div>
      )}

      {workflows.length === 0 && (
        <div className="no-workflows">
          <p>No measurement workflows available</p>
        </div>
      )}
    </div>
  );
}
