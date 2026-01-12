import { useState } from 'react';
import type { AppState } from '../types';
import { Download, FileText, FileSpreadsheet, File } from 'lucide-react';
import { exportToPDF, exportToBOM, exportToMarkdown, downloadFile } from '../utils/export';

interface ExportPanelProps {
  state: AppState;
}

export default function ExportPanel({ state }: ExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');

  const handleExport = async (format: 'pdf' | 'bom' | 'markdown') => {
    setIsExporting(true);
    setExportMessage('');

    try {
      const circuit = state.circuits.find(c => c.id === state.activeCircuitId);
      if (!circuit) {
        throw new Error('No active circuit selected');
      }

      switch (format) {
        case 'pdf': {
          exportToPDF(state);
          setExportMessage('PDF exported successfully!');
          break;
        }
        case 'bom': {
          const bom = exportToBOM(circuit);
          downloadFile(
            bom,
            `${circuit.name.replace(/\s+/g, '_')}_BOM.md`,
            'text/markdown'
          );
          setExportMessage('BOM exported successfully!');
          break;
        }
        case 'markdown': {
          const md = exportToMarkdown(state);
          downloadFile(
            md,
            `${circuit.name.replace(/\s+/g, '_')}_documentation.md`,
            'text/markdown'
          );
          setExportMessage('Markdown documentation exported successfully!');
          break;
        }
      }

      setTimeout(() => setExportMessage(''), 3000);
    } catch (error) {
      setExportMessage(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => setExportMessage(''), 5000);
    } finally {
      setIsExporting(false);
    }
  };

  const activeCircuit = state.circuits.find(c => c.id === state.activeCircuitId);

  return (
    <div className="export-panel">
      <div className="panel-header">
        <Download size={20} />
        <h2>Export</h2>
      </div>

      {!activeCircuit ? (
        <div className="no-circuit-message">
          <p>No circuit selected. Please select a circuit to export.</p>
        </div>
      ) : (
        <>
          <div className="export-info">
            <h3>Export Options</h3>
            <p className="circuit-name">Circuit: {activeCircuit.name}</p>
          </div>

          <div className="export-options">
            <button
              className="export-button pdf"
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
            >
              <FileText size={24} />
              <div className="button-content">
                <span className="button-title">Export to PDF</span>
                <span className="button-description">
                  Complete circuit documentation with components, nets, and test points
                </span>
              </div>
            </button>

            <button
              className="export-button bom"
              onClick={() => handleExport('bom')}
              disabled={isExporting}
            >
              <FileSpreadsheet size={24} />
              <div className="button-content">
                <span className="button-title">Export BOM</span>
                <span className="button-description">
                  Bill of Materials with component list and quantities
                </span>
              </div>
            </button>

            <button
              className="export-button markdown"
              onClick={() => handleExport('markdown')}
              disabled={isExporting}
            >
              <File size={24} />
              <div className="button-content">
                <span className="button-title">Export to Markdown</span>
                <span className="button-description">
                  Detailed documentation including workflows and measurements
                </span>
              </div>
            </button>
          </div>

          {exportMessage && (
            <div className={`export-message ${exportMessage.includes('failed') ? 'error' : 'success'}`}>
              {exportMessage}
            </div>
          )}

          <div className="export-preview">
            <h4>Export Preview</h4>
            <div className="preview-stats">
              <div className="stat">
                <span className="stat-label">Components:</span>
                <span className="stat-value">{activeCircuit.components.length}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Nets:</span>
                <span className="stat-value">{activeCircuit.nets.length}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Test Points:</span>
                <span className="stat-value">{activeCircuit.testPoints.length}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Workflows:</span>
                <span className="stat-value">
                  {state.workflows.filter(w => w.circuitId === activeCircuit.id).length}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
