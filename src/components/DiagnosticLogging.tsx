import { useRef, useEffect } from 'react';
import type { DiagnosticLog } from '../types';
import { Info, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';

interface DiagnosticLoggingProps {
  logs: DiagnosticLog[];
  onClearLogs?: () => void;
}

export default function DiagnosticLogging({ logs, onClearLogs }: DiagnosticLoggingProps) {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogIcon = (level: DiagnosticLog['level']) => {
    switch (level) {
      case 'info':
        return <Info size={16} color="#2196F3" />;
      case 'warning':
        return <AlertTriangle size={16} color="#FF9800" />;
      case 'error':
        return <XCircle size={16} color="#f44336" />;
      case 'success':
        return <CheckCircle size={16} color="#4CAF50" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="diagnostic-logging">
      <div className="logging-header">
        <h2>Diagnostic Logs</h2>
        <div className="header-actions">
          <span className="log-count">{logs.length} entries</span>
          {onClearLogs && (
            <button className="btn-clear-logs" onClick={onClearLogs}>
              Clear Logs
            </button>
          )}
        </div>
      </div>

      <div className="logs-container">
        {logs.length === 0 ? (
          <div className="no-logs">
            <p>No diagnostic logs yet</p>
            <span className="hint">Logs will appear here as you work with the circuit</span>
          </div>
        ) : (
          <div className="logs-list">
            {logs.map((log) => (
              <div key={log.id} className={`log-entry log-${log.level}`}>
                <div className="log-header">
                  <div className="log-icon">{getLogIcon(log.level)}</div>
                  <span className="log-timestamp">{formatTime(log.timestamp)}</span>
                  <span className={`log-level ${log.level}`}>{log.level.toUpperCase()}</span>
                </div>
                <div className="log-message">{log.message}</div>
                {log.details && (
                  <div className="log-details">
                    <details>
                      <summary>Details</summary>
                      <pre>{log.details}</pre>
                    </details>
                  </div>
                )}
                {log.workflowId && (
                  <div className="log-metadata">
                    <span className="metadata-label">Workflow:</span>
                    <span className="metadata-value">{log.workflowId}</span>
                  </div>
                )}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>

      <div className="logging-footer">
        <div className="level-legend">
          <span className="legend-item">
            <Info size={14} color="#2196F3" /> Info
          </span>
          <span className="legend-item">
            <CheckCircle size={14} color="#4CAF50" /> Success
          </span>
          <span className="legend-item">
            <AlertTriangle size={14} color="#FF9800" /> Warning
          </span>
          <span className="legend-item">
            <XCircle size={14} color="#f44336" /> Error
          </span>
        </div>
      </div>
    </div>
  );
}
