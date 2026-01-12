import jsPDF from 'jspdf';
import type { Circuit, AppState } from '../types';

export function exportToPDF(state: AppState) {
  const doc = new jsPDF();
  const circuit = state.circuits.find(c => c.id === state.activeCircuitId);
  
  if (!circuit) {
    throw new Error('No active circuit found');
  }

  // Title
  doc.setFontSize(20);
  doc.text('Circuit Documentation', 20, 20);
  
  // Circuit Info
  doc.setFontSize(16);
  doc.text(circuit.name, 20, 35);
  doc.setFontSize(12);
  doc.text(circuit.description, 20, 45);
  
  // Components
  doc.setFontSize(14);
  doc.text('Components:', 20, 60);
  doc.setFontSize(10);
  let y = 70;
  circuit.components.forEach((comp, idx) => {
    doc.text(`${idx + 1}. ${comp.name} (${comp.type}) - ${comp.value || 'N/A'}`, 25, y);
    y += 7;
  });
  
  // Test Points
  y += 10;
  doc.setFontSize(14);
  doc.text('Test Points:', 20, y);
  doc.setFontSize(10);
  y += 10;
  circuit.testPoints.forEach((tp, idx) => {
    doc.text(`${idx + 1}. ${tp.name}: ${tp.description}`, 25, y);
    if (tp.voltage !== undefined) {
      doc.text(`   Voltage: ${tp.voltage}V`, 25, y + 5);
      y += 5;
    }
    y += 7;
  });
  
  // Nets
  y += 10;
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(14);
  doc.text('Nets:', 20, y);
  doc.setFontSize(10);
  y += 10;
  circuit.nets.forEach((net, idx) => {
    doc.text(`${idx + 1}. ${net.name}: ${net.description}`, 25, y);
    doc.text(`   Nodes: ${net.nodes.join(', ')}`, 25, y + 5);
    y += 12;
  });
  
  doc.save(`${circuit.name.replace(/\s+/g, '_')}_documentation.pdf`);
}

export function exportToBOM(circuit: Circuit): string {
  let bom = `# Bill of Materials - ${circuit.name}\n\n`;
  bom += `| Ref | Component | Type | Value | Qty |\n`;
  bom += `|-----|-----------|------|-------|-----|\n`;
  
  circuit.components.forEach((comp) => {
    bom += `| ${comp.name} | ${comp.type} | ${comp.type} | ${comp.value || '-'} | 1 |\n`;
  });
  
  bom += `\n## Notes\n${circuit.description}\n`;
  bom += `\nCreated: ${circuit.createdAt.toLocaleDateString()}\n`;
  bom += `Updated: ${circuit.updatedAt.toLocaleDateString()}\n`;
  
  return bom;
}

export function exportToMarkdown(state: AppState): string {
  const circuit = state.circuits.find(c => c.id === state.activeCircuitId);
  const workflow = state.workflows.find(w => w.id === state.activeWorkflowId);
  
  if (!circuit) {
    throw new Error('No active circuit found');
  }

  let md = `# ${circuit.name}\n\n`;
  md += `${circuit.description}\n\n`;
  
  md += `## Components\n\n`;
  circuit.components.forEach(comp => {
    md += `- **${comp.name}** (${comp.type}): ${comp.value || 'N/A'}\n`;
    md += `  - Pins: ${comp.pins.join(', ')}\n`;
    md += `  - Status: ${comp.connected ? '✓ Connected' : '✗ Not connected'}\n`;
  });
  
  md += `\n## Nets\n\n`;
  circuit.nets.forEach(net => {
    md += `### ${net.name}\n`;
    md += `${net.description}\n`;
    md += `- Nodes: ${net.nodes.join(', ')}\n`;
    if (net.voltage !== undefined) {
      md += `- Voltage: ${net.voltage}V\n`;
    }
    md += `\n`;
  });
  
  md += `## Test Points\n\n`;
  circuit.testPoints.forEach(tp => {
    md += `### ${tp.name}\n`;
    md += `${tp.description}\n`;
    if (tp.voltage !== undefined) md += `- Voltage: ${tp.voltage}V\n`;
    if (tp.current !== undefined) md += `- Current: ${tp.current}A\n`;
    if (tp.frequency !== undefined) md += `- Frequency: ${tp.frequency}Hz\n`;
    md += `\n`;
  });
  
  if (workflow) {
    md += `## Measurement Workflow: ${workflow.name}\n\n`;
    md += `Status: ${workflow.status}\n\n`;
    workflow.steps.forEach((step, idx) => {
      const statusIcon = step.status === 'complete' ? '✓' : 
                        step.status === 'failed' ? '✗' : 
                        step.status === 'in-progress' ? '⟳' : '○';
      md += `${idx + 1}. ${statusIcon} **${step.name}**\n`;
      md += `   - ${step.description}\n`;
      md += `   - Probe: ${step.probe}, Test Point: ${step.testPoint}\n`;
      if (step.expectedValue) md += `   - Expected: ${step.expectedValue}\n`;
      if (step.actualValue) md += `   - Actual: ${step.actualValue}\n`;
      md += `\n`;
    });
  }
  
  md += `\n---\n`;
  md += `*Generated: ${new Date().toLocaleString()}*\n`;
  
  return md;
}

export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
