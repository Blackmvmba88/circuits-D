import { useState } from 'react';
import { 
  Brain, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  Info,
  Zap,
  TrendingDown,
  Radio,
  Activity
} from 'lucide-react';
import type { 
  CircuitRule, 
  Circuit,
  MeasurementStep,
  DiagnosticKnowledge
} from '../types';
import { evaluateAllRules, explainRuleTrigger } from '../utils/diagnosticEngine';

interface DiagnosticKnowledgePanelProps {
  circuit: Circuit;
  diagnosticKnowledge?: DiagnosticKnowledge;
  measurements: MeasurementStep[];
  onUpdateKnowledge: (knowledge: DiagnosticKnowledge) => void;
  onAddLog: (message: string, level: 'info' | 'warning' | 'error' | 'success', details?: string) => void;
}

export default function DiagnosticKnowledgePanel({
  circuit,
  diagnosticKnowledge,
  measurements,
  onUpdateKnowledge,
  onAddLog
}: DiagnosticKnowledgePanelProps) {
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);

  const rules = diagnosticKnowledge?.rules || [];

  // Evaluate all rules against current state
  const { triggeredRules, consequences } = evaluateAllRules(rules, {
    nets: circuit.nets,
    components: circuit.components,
    measurements
  });

  const handleAddRule = () => {
    setIsAddingRule(true);
    onAddLog('Opening rule creator', 'info');
  };

  const handleCreateRule = () => {
    // Create a new empty rule
    const newRule: CircuitRule = {
      id: `rule-${Date.now()}`,
      name: 'New Circuit Rule',
      circuitId: circuit.id,
      conditions: [],
      consequence: {
        id: `consequence-${Date.now()}`,
        type: 'functional_failure',
        severity: 'warning',
        affectedNetIds: [],
        affectedComponentIds: [],
        description: 'Describe what fails',
        explanation: 'Explain why this happens'
      },
      enabled: true,
      category: 'general'
    };

    const updatedKnowledge: DiagnosticKnowledge = {
      circuitId: circuit.id,
      rules: [...rules, newRule],
      activeSymptoms: diagnosticKnowledge?.activeSymptoms || [],
      predictedConsequences: diagnosticKnowledge?.predictedConsequences || []
    };

    onUpdateKnowledge(updatedKnowledge);
    setIsAddingRule(false);
    onAddLog(`Created new rule: ${newRule.name}`, 'success');
  };

  const handleDeleteRule = (ruleId: string) => {
    const updatedKnowledge: DiagnosticKnowledge = {
      circuitId: circuit.id,
      rules: rules.filter(r => r.id !== ruleId),
      activeSymptoms: diagnosticKnowledge?.activeSymptoms || [],
      predictedConsequences: diagnosticKnowledge?.predictedConsequences || []
    };

    onUpdateKnowledge(updatedKnowledge);
    onAddLog('Rule deleted', 'info');
  };

  const handleToggleRule = (ruleId: string) => {
    const updatedRules = rules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    );

    const updatedKnowledge: DiagnosticKnowledge = {
      circuitId: circuit.id,
      rules: updatedRules,
      activeSymptoms: diagnosticKnowledge?.activeSymptoms || [],
      predictedConsequences: diagnosticKnowledge?.predictedConsequences || []
    };

    onUpdateKnowledge(updatedKnowledge);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'power':
        return <Zap className="w-4 h-4" />;
      case 'signal':
        return <Radio className="w-4 h-4" />;
      case 'timing':
        return <Activity className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  return (
    <div className="diagnostic-knowledge-panel">
      <div className="panel-header">
        <h3>
          <Brain className="w-5 h-5" />
          Cognitive Diagnostics
        </h3>
        <button onClick={handleAddRule} className="btn-icon" title="Add Rule">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {isAddingRule && (
        <div className="add-rule-prompt">
          <p>Create a new causal rule that describes:</p>
          <ul>
            <li>Conditions: "If this net is low..."</li>
            <li>Consequence: "...then this section cannot oscillate"</li>
          </ul>
          <div className="button-group">
            <button onClick={handleCreateRule} className="btn-primary">
              Create Rule
            </button>
            <button onClick={() => setIsAddingRule(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Active Diagnosis Section */}
      {triggeredRules.length > 0 && (
        <div className="diagnosis-section active-diagnosis">
          <div className="section-header">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h4>Active Diagnoses ({triggeredRules.length})</h4>
          </div>
          
          {triggeredRules.map(rule => (
            <div key={rule.id} className="diagnosis-card triggered">
              <div className="diagnosis-header">
                {getSeverityIcon(rule.consequence.severity)}
                <span className="diagnosis-name">{rule.name}</span>
              </div>
              <div className="diagnosis-body">
                <p className="consequence-description">
                  {rule.consequence.description}
                </p>
                <p className="consequence-explanation">
                  <strong>Why:</strong> {rule.consequence.explanation}
                </p>
                <details>
                  <summary>Show Details</summary>
                  <pre className="explanation-details">
                    {explainRuleTrigger(rule, {
                      nets: circuit.nets,
                      components: circuit.components,
                      measurements
                    })}
                  </pre>
                </details>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rules List */}
      <div className="rules-section">
        <div className="section-header">
          <h4>Circuit Rules ({rules.length})</h4>
          <button 
            onClick={() => setShowEvaluation(!showEvaluation)}
            className="btn-link"
          >
            {showEvaluation ? 'Hide' : 'Show'} Evaluation
          </button>
        </div>

        {rules.length === 0 ? (
          <div className="empty-state">
            <Brain className="w-12 h-12 opacity-50" />
            <p>No cognitive rules defined yet.</p>
            <p className="hint">
              Add rules to capture causal relationships:
              <br />
              "If X condition → then Y consequence"
            </p>
          </div>
        ) : (
          <div className="rules-list">
            {rules.map(rule => {
              const isTriggered = triggeredRules.some(r => r.id === rule.id);
              
              return (
                <div 
                  key={rule.id} 
                  className={`rule-card ${!rule.enabled ? 'disabled' : ''} ${isTriggered ? 'triggered' : ''}`}
                >
                  <div className="rule-header">
                    <div className="rule-title">
                      {getCategoryIcon(rule.category)}
                      <span>{rule.name}</span>
                      {isTriggered && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </div>
                    <div className="rule-actions">
                      <button
                        onClick={() => handleToggleRule(rule.id)}
                        className={`btn-toggle ${rule.enabled ? 'active' : ''}`}
                        title={rule.enabled ? 'Disable rule' : 'Enable rule'}
                      >
                        {rule.enabled ? 'ON' : 'OFF'}
                      </button>
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="btn-icon"
                        title="Delete rule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="rule-body">
                    <div className="rule-conditions">
                      <strong>If:</strong>
                      {rule.conditions.length === 0 ? (
                        <span className="text-muted"> No conditions defined</span>
                      ) : (
                        <ul>
                          {rule.conditions.map(cond => (
                            <li key={cond.id}>{cond.description}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="rule-consequence">
                      <strong>Then:</strong>
                      <p>{rule.consequence.description}</p>
                    </div>

                    {showEvaluation && (
                      <div className="rule-evaluation">
                        <strong>Status:</strong>
                        <span className={isTriggered ? 'text-warning' : 'text-success'}>
                          {isTriggered ? ' ⚠ Triggered' : ' ✓ Not triggered'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Predicted Consequences */}
      {consequences.length > 0 && (
        <div className="consequences-section">
          <div className="section-header">
            <TrendingDown className="w-5 h-5 text-orange-500" />
            <h4>Predicted Consequences</h4>
          </div>
          
          <div className="consequences-list">
            {consequences.map((consequence, idx) => (
              <div key={idx} className="consequence-card">
                {getSeverityIcon(consequence.severity)}
                <div className="consequence-content">
                  <strong>{consequence.description}</strong>
                  <p className="consequence-explanation">{consequence.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .diagnostic-knowledge-panel {
          padding: 1rem;
          background: #1e1e1e;
          border-radius: 8px;
          color: #e0e0e0;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #333;
        }

        .panel-header h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
          font-size: 1.2rem;
        }

        .add-rule-prompt {
          background: #2a2a2a;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          border-left: 3px solid #4CAF50;
        }

        .add-rule-prompt ul {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }

        .button-group {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .diagnosis-section {
          margin-bottom: 1.5rem;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
        }

        .section-header button {
          margin-left: auto;
        }

        .diagnosis-card {
          background: #2a2a2a;
          border-radius: 6px;
          padding: 1rem;
          margin-bottom: 0.75rem;
        }

        .diagnosis-card.triggered {
          border-left: 3px solid #f44336;
          background: #2a1a1a;
        }

        .diagnosis-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .diagnosis-name {
          font-weight: 600;
        }

        .diagnosis-body p {
          margin: 0.5rem 0;
        }

        .consequence-description {
          color: #ff9800;
          font-weight: 500;
        }

        .consequence-explanation {
          font-size: 0.9rem;
          color: #b0b0b0;
        }

        .explanation-details {
          margin-top: 0.5rem;
          padding: 0.75rem;
          background: #1a1a1a;
          border-radius: 4px;
          font-size: 0.85rem;
          white-space: pre-wrap;
          overflow-x: auto;
        }

        .empty-state {
          text-align: center;
          padding: 2rem;
          color: #888;
        }

        .empty-state .hint {
          font-size: 0.9rem;
          margin-top: 0.5rem;
          line-height: 1.6;
        }

        .rules-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .rule-card {
          background: #2a2a2a;
          border-radius: 6px;
          padding: 1rem;
          transition: all 0.2s;
        }

        .rule-card.disabled {
          opacity: 0.5;
        }

        .rule-card.triggered {
          border-left: 3px solid #ff9800;
        }

        .rule-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .rule-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
        }

        .rule-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-toggle {
          padding: 0.25rem 0.75rem;
          border: 1px solid #555;
          border-radius: 4px;
          background: #333;
          color: #888;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s;
        }

        .btn-toggle.active {
          background: #4CAF50;
          border-color: #4CAF50;
          color: white;
        }

        .rule-body {
          font-size: 0.9rem;
        }

        .rule-conditions,
        .rule-consequence,
        .rule-evaluation {
          margin-bottom: 0.5rem;
        }

        .rule-conditions ul {
          margin: 0.25rem 0;
          padding-left: 1.5rem;
        }

        .rule-conditions li {
          color: #b0b0b0;
          margin: 0.25rem 0;
        }

        .text-muted {
          color: #666;
          font-style: italic;
        }

        .text-warning {
          color: #ff9800;
        }

        .text-success {
          color: #4CAF50;
        }

        .consequences-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .consequence-card {
          display: flex;
          gap: 0.5rem;
          background: #2a2a2a;
          padding: 0.75rem;
          border-radius: 6px;
        }

        .consequence-content {
          flex: 1;
        }

        .consequence-content strong {
          display: block;
          margin-bottom: 0.25rem;
        }

        .btn-icon {
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .btn-icon:hover {
          color: #fff;
        }

        .btn-primary,
        .btn-secondary {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #4CAF50;
          color: white;
        }

        .btn-primary:hover {
          background: #45a049;
        }

        .btn-secondary {
          background: #555;
          color: #e0e0e0;
        }

        .btn-secondary:hover {
          background: #666;
        }

        .btn-link {
          background: transparent;
          border: none;
          color: #2196F3;
          cursor: pointer;
          font-size: 0.85rem;
          text-decoration: underline;
        }

        .btn-link:hover {
          color: #42a5f5;
        }
      `}</style>
    </div>
  );
}
