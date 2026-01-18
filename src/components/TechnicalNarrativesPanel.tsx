import { useState } from 'react';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Lightbulb
} from 'lucide-react';
import type { TechnicalNarrative } from '../types';

interface TechnicalNarrativesPanelProps {
  narratives: TechnicalNarrative[];
  onClear?: () => void;
}

export default function TechnicalNarrativesPanel({
  narratives,
  onClear
}: TechnicalNarrativesPanelProps) {
  const [expandedNarratives, setExpandedNarratives] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedNarratives);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNarratives(newExpanded);
  };

  const getDecisionIcon = (decision: TechnicalNarrative['decision']) => {
    switch (decision) {
      case 'pass':
        return <CheckCircle size={20} color="#4CAF50" />;
      case 'fail':
        return <XCircle size={20} color="#f44336" />;
      case 'warning':
        return <AlertTriangle size={20} color="#ff9800" />;
      default:
        return <HelpCircle size={20} color="#999" />;
    }
  };

  const getDecisionClass = (decision: TechnicalNarrative['decision']) => {
    switch (decision) {
      case 'pass':
        return 'decision-pass';
      case 'fail':
        return 'decision-fail';
      case 'warning':
        return 'decision-warning';
      default:
        return 'decision-unknown';
    }
  };

  const getSeverityClass = (severity: TechnicalNarrative['severity']) => {
    return `severity-${severity}`;
  };

  // Sort narratives by timestamp (newest first)
  const sortedNarratives = [...narratives].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Statistics
  const stats = {
    total: narratives.length,
    pass: narratives.filter(n => n.decision === 'pass').length,
    fail: narratives.filter(n => n.decision === 'fail').length,
    warning: narratives.filter(n => n.decision === 'warning').length
  };

  return (
    <div className="technical-narratives-panel">
      <div className="panel-header">
        <div className="header-title">
          <FileText size={20} />
          <h2>Technical Narratives</h2>
        </div>
        <div className="header-stats">
          <span className="stat pass">{stats.pass} Pass</span>
          <span className="stat warning">{stats.warning} Warning</span>
          <span className="stat fail">{stats.fail} Fail</span>
          <span className="stat total">Total: {stats.total}</span>
        </div>
        {onClear && narratives.length > 0 && (
          <button onClick={onClear} className="clear-button">
            Clear All
          </button>
        )}
      </div>

      <div className="narratives-info">
        <p>
          Technical narratives transform measurements into engineering conclusions.
          Each narrative compares expected vs. observed values, identifies probable causes,
          and provides actionable recommendations.
        </p>
      </div>

      {sortedNarratives.length === 0 ? (
        <div className="empty-state">
          <FileText size={48} color="#ccc" />
          <p>No technical narratives yet</p>
          <p className="hint">
            Complete measurement steps to generate technical narratives
          </p>
        </div>
      ) : (
        <div className="narratives-list">
          {sortedNarratives.map((narrative) => {
            const isExpanded = expandedNarratives.has(narrative.id);
            
            return (
              <div
                key={narrative.id}
                className={`narrative-card ${getDecisionClass(narrative.decision)} ${getSeverityClass(narrative.severity)}`}
              >
                <div 
                  className="narrative-header"
                  onClick={() => toggleExpanded(narrative.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="header-left">
                    {getDecisionIcon(narrative.decision)}
                    <div className="narrative-summary">
                      <div className="narrative-title">
                        <span className="decision-badge">{narrative.decision.toUpperCase()}</span>
                        <span className="severity-badge">{narrative.severity}</span>
                      </div>
                      <div className="narrative-text">{narrative.fullNarrative}</div>
                      <div className="narrative-meta">
                        {new Date(narrative.timestamp).toLocaleString()}
                        {narrative.netId && <span className="meta-item">Net: {narrative.netId}</span>}
                        {narrative.componentId && <span className="meta-item">Component: {narrative.componentId}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="header-right">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="narrative-details">
                    <div className="detail-section">
                      <h4>Comparison</h4>
                      <div className="comparison-grid">
                        <div className="comparison-item">
                          <span className="label">Expected:</span>
                          <span className="value expected">{narrative.expected}</span>
                        </div>
                        <div className="comparison-item">
                          <span className="label">Observed:</span>
                          <span className="value observed">{narrative.observed}</span>
                        </div>
                      </div>
                    </div>

                    {narrative.probableCause && (
                      <div className="detail-section">
                        <h4>Probable Cause</h4>
                        <p className="probable-cause">{narrative.probableCause}</p>
                      </div>
                    )}

                    <div className="detail-section">
                      <h4>Technical Explanation</h4>
                      <p className="explanation">{narrative.technicalExplanation}</p>
                    </div>

                    {narrative.recommendedActions.length > 0 && (
                      <div className="detail-section">
                        <h4>
                          <Lightbulb size={16} />
                          Recommended Actions
                        </h4>
                        <ul className="action-list">
                          {narrative.recommendedActions.map((action, idx) => (
                            <li key={idx}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .technical-narratives-panel {
          padding: 20px;
          background: #1a1a1a;
          border-radius: 8px;
          color: #e0e0e0;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .header-title h2 {
          margin: 0;
          font-size: 1.3rem;
          color: #ffffff;
        }

        .header-stats {
          display: flex;
          gap: 15px;
          font-size: 0.9rem;
        }

        .stat {
          padding: 4px 12px;
          border-radius: 4px;
          background: #2a2a2a;
        }

        .stat.pass { color: #4CAF50; }
        .stat.warning { color: #ff9800; }
        .stat.fail { color: #f44336; }
        .stat.total { color: #2196F3; }

        .clear-button {
          padding: 6px 14px;
          background: #333;
          border: 1px solid #555;
          border-radius: 4px;
          color: #e0e0e0;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .clear-button:hover {
          background: #444;
        }

        .narratives-info {
          background: #2a2a2a;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 15px;
          font-size: 0.9rem;
          color: #b0b0b0;
          border-left: 3px solid #2196F3;
        }

        .narratives-info p {
          margin: 0;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .empty-state p {
          margin: 10px 0;
        }

        .empty-state .hint {
          font-size: 0.9rem;
          color: #888;
        }

        .narratives-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .narrative-card {
          background: #2a2a2a;
          border-radius: 6px;
          border-left: 4px solid #555;
          overflow: hidden;
        }

        .narrative-card.decision-pass {
          border-left-color: #4CAF50;
        }

        .narrative-card.decision-fail {
          border-left-color: #f44336;
        }

        .narrative-card.decision-warning {
          border-left-color: #ff9800;
        }

        .narrative-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 15px;
          gap: 15px;
        }

        .narrative-header:hover {
          background: #333;
        }

        .header-left {
          display: flex;
          gap: 12px;
          flex: 1;
        }

        .narrative-summary {
          flex: 1;
        }

        .narrative-title {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }

        .decision-badge,
        .severity-badge {
          padding: 2px 8px;
          border-radius: 3px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .decision-badge {
          background: #333;
          color: #fff;
        }

        .severity-badge {
          background: #444;
          color: #aaa;
        }

        .narrative-card.decision-pass .decision-badge { background: #2d5016; color: #4CAF50; }
        .narrative-card.decision-fail .decision-badge { background: #5c1919; color: #f44336; }
        .narrative-card.decision-warning .decision-badge { background: #5c3a19; color: #ff9800; }

        .narrative-card.severity-critical .severity-badge { background: #5c1919; color: #f44336; }
        .narrative-card.severity-warning .severity-badge { background: #5c3a19; color: #ff9800; }
        .narrative-card.severity-info .severity-badge { background: #19335c; color: #2196F3; }

        .narrative-text {
          font-size: 0.95rem;
          line-height: 1.5;
          color: #e0e0e0;
          margin-bottom: 8px;
        }

        .narrative-meta {
          font-size: 0.8rem;
          color: #888;
          display: flex;
          gap: 15px;
        }

        .meta-item {
          display: inline-block;
        }

        .header-right {
          color: #888;
        }

        .narrative-details {
          padding: 0 15px 15px 15px;
          border-top: 1px solid #333;
        }

        .detail-section {
          margin-top: 15px;
        }

        .detail-section h4 {
          margin: 0 0 8px 0;
          font-size: 0.9rem;
          color: #2196F3;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .comparison-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 10px;
          background: #222;
          border-radius: 4px;
        }

        .comparison-item .label {
          font-size: 0.75rem;
          color: #888;
          text-transform: uppercase;
        }

        .comparison-item .value {
          font-size: 1rem;
          font-weight: 600;
        }

        .comparison-item .value.expected {
          color: #2196F3;
        }

        .comparison-item .value.observed {
          color: #ff9800;
        }

        .probable-cause {
          margin: 0;
          padding: 10px;
          background: #222;
          border-radius: 4px;
          font-size: 0.9rem;
          color: #e0e0e0;
          border-left: 2px solid #ff9800;
        }

        .explanation {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.6;
          color: #b0b0b0;
        }

        .action-list {
          margin: 0;
          padding-left: 20px;
          font-size: 0.9rem;
          line-height: 1.8;
          color: #b0b0b0;
        }

        .action-list li {
          margin-bottom: 4px;
        }

        @media (max-width: 768px) {
          .comparison-grid {
            grid-template-columns: 1fr;
          }

          .header-stats {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}
