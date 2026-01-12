import { useState } from 'react';
import { Plus, Trash2, Save, Grid3x3 } from 'lucide-react';
import type { Circuit, Component, Net } from '../types';

interface CircuitBuilderProps {
  onCircuitCreate?: (circuit: Circuit) => void;
}

export function CircuitBuilder({ onCircuitCreate }: CircuitBuilderProps) {
  const [circuitName, setCircuitName] = useState('');
  const [circuitDescription, setCircuitDescription] = useState('');
  const [circuitType, setCircuitType] = useState('amplifier');
  const [components, setComponents] = useState<Component[]>([]);
  const [nets, setNets] = useState<Net[]>([]);
  const [showComponentForm, setShowComponentForm] = useState(false);
  const [showNetForm, setShowNetForm] = useState(false);

  // Component form state
  const [newComponent, setNewComponent] = useState({
    name: '',
    type: 'Resistor',
    value: '',
    pins: '',
  });

  // Net form state
  const [newNet, setNewNet] = useState({
    name: '',
    nodes: '',
    voltage: '',
    description: '',
  });

  const handleAddComponent = () => {
    if (!newComponent.name) return;

    const component: Component = {
      id: `comp-${Date.now()}`,
      name: newComponent.name,
      type: newComponent.type,
      value: newComponent.value || undefined,
      pins: newComponent.pins.split(',').map(p => p.trim()).filter(Boolean),
      position: { x: 100 + components.length * 100, y: 100 },
      connected: false,
    };

    setComponents([...components, component]);
    setNewComponent({ name: '', type: 'Resistor', value: '', pins: '' });
    setShowComponentForm(false);
  };

  const handleRemoveComponent = (id: string) => {
    setComponents(components.filter(c => c.id !== id));
  };

  const handleAddNet = () => {
    if (!newNet.name) return;

    const net: Net = {
      id: `net-${Date.now()}`,
      name: newNet.name,
      nodes: newNet.nodes.split(',').map(n => n.trim()).filter(Boolean),
      voltage: newNet.voltage ? parseFloat(newNet.voltage) : undefined,
      description: newNet.description,
    };

    setNets([...nets, net]);
    setNewNet({ name: '', nodes: '', voltage: '', description: '' });
    setShowNetForm(false);
  };

  const handleRemoveNet = (id: string) => {
    setNets(nets.filter(n => n.id !== id));
  };

  const handleSaveCircuit = () => {
    if (!circuitName || components.length === 0) {
      alert('Please provide a circuit name and add at least one component');
      return;
    }

    const circuit: Circuit = {
      id: `circuit-${Date.now()}`,
      name: circuitName,
      description: circuitDescription,
      components,
      nets,
      testPoints: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onCircuitCreate?.(circuit);
    
    // Reset form
    setCircuitName('');
    setCircuitDescription('');
    setComponents([]);
    setNets([]);
  };

  return (
    <div className="circuit-builder">
      <div className="builder-header">
        <h2>Circuit Builder</h2>
        <p className="subtitle">Design your circuit from scratch</p>
      </div>

      <div className="builder-content">
        <section className="builder-section">
          <h3>Circuit Information</h3>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="circuit-name">Circuit Name *</label>
              <input
                id="circuit-name"
                type="text"
                value={circuitName}
                onChange={(e) => setCircuitName(e.target.value)}
                placeholder="e.g., Audio Amplifier"
              />
            </div>
            <div className="form-field">
              <label htmlFor="circuit-type">Circuit Type</label>
              <select
                id="circuit-type"
                value={circuitType}
                onChange={(e) => setCircuitType(e.target.value)}
              >
                <option value="power-supply">Power Supply</option>
                <option value="amplifier">Amplifier</option>
                <option value="filter">Filter</option>
                <option value="oscillator">Oscillator</option>
                <option value="digital">Digital Logic</option>
                <option value="sensor">Sensor Interface</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-field full-width">
              <label htmlFor="circuit-description">Description</label>
              <textarea
                id="circuit-description"
                value={circuitDescription}
                onChange={(e) => setCircuitDescription(e.target.value)}
                placeholder="Describe the circuit's purpose and functionality"
                rows={3}
              />
            </div>
          </div>
        </section>

        <section className="builder-section">
          <div className="section-header">
            <h3>Components ({components.length})</h3>
            <button
              className="btn-add"
              onClick={() => setShowComponentForm(!showComponentForm)}
            >
              <Plus size={16} />
              Add Component
            </button>
          </div>

          {showComponentForm && (
            <div className="form-panel">
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="comp-name">Component Name *</label>
                  <input
                    id="comp-name"
                    type="text"
                    value={newComponent.name}
                    onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })}
                    placeholder="e.g., R1, C1, U1"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="comp-type">Type</label>
                  <select
                    id="comp-type"
                    value={newComponent.type}
                    onChange={(e) => setNewComponent({ ...newComponent, type: e.target.value })}
                  >
                    <option value="Resistor">Resistor</option>
                    <option value="Capacitor">Capacitor</option>
                    <option value="IC">IC</option>
                    <option value="Transistor">Transistor</option>
                    <option value="Diode">Diode</option>
                    <option value="LED">LED</option>
                    <option value="Inductor">Inductor</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="comp-value">Value</label>
                  <input
                    id="comp-value"
                    type="text"
                    value={newComponent.value}
                    onChange={(e) => setNewComponent({ ...newComponent, value: e.target.value })}
                    placeholder="e.g., 10kΩ, 100μF"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="comp-pins">Pins (comma-separated)</label>
                  <input
                    id="comp-pins"
                    type="text"
                    value={newComponent.pins}
                    onChange={(e) => setNewComponent({ ...newComponent, pins: e.target.value })}
                    placeholder="e.g., 1, 2 or VCC, GND, OUT"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button className="btn-secondary" onClick={() => setShowComponentForm(false)}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleAddComponent}>
                  Add Component
                </button>
              </div>
            </div>
          )}

          <div className="items-list">
            {components.length === 0 ? (
              <div className="empty-state">
                <Grid3x3 size={32} />
                <p>No components yet. Click "Add Component" to get started.</p>
              </div>
            ) : (
              components.map((comp) => (
                <div key={comp.id} className="list-item">
                  <div className="item-info">
                    <span className="item-name">{comp.name}</span>
                    <span className="item-type">{comp.type}</span>
                    {comp.value && <span className="item-value">{comp.value}</span>}
                  </div>
                  <button
                    className="btn-icon-danger"
                    onClick={() => handleRemoveComponent(comp.id)}
                    title="Remove component"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="builder-section">
          <div className="section-header">
            <h3>Nets ({nets.length})</h3>
            <button
              className="btn-add"
              onClick={() => setShowNetForm(!showNetForm)}
            >
              <Plus size={16} />
              Add Net
            </button>
          </div>

          {showNetForm && (
            <div className="form-panel">
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="net-name">Net Name *</label>
                  <input
                    id="net-name"
                    type="text"
                    value={newNet.name}
                    onChange={(e) => setNewNet({ ...newNet, name: e.target.value })}
                    placeholder="e.g., VCC, GND, OUT"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="net-voltage">Voltage (V)</label>
                  <input
                    id="net-voltage"
                    type="number"
                    step="0.1"
                    value={newNet.voltage}
                    onChange={(e) => setNewNet({ ...newNet, voltage: e.target.value })}
                    placeholder="e.g., 5.0"
                  />
                </div>
                <div className="form-field full-width">
                  <label htmlFor="net-nodes">Connected Nodes (comma-separated)</label>
                  <input
                    id="net-nodes"
                    type="text"
                    value={newNet.nodes}
                    onChange={(e) => setNewNet({ ...newNet, nodes: e.target.value })}
                    placeholder="e.g., R1.1, C1.1, U1.8"
                  />
                </div>
                <div className="form-field full-width">
                  <label htmlFor="net-description">Description</label>
                  <input
                    id="net-description"
                    type="text"
                    value={newNet.description}
                    onChange={(e) => setNewNet({ ...newNet, description: e.target.value })}
                    placeholder="e.g., Power supply rail"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button className="btn-secondary" onClick={() => setShowNetForm(false)}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleAddNet}>
                  Add Net
                </button>
              </div>
            </div>
          )}

          <div className="items-list">
            {nets.length === 0 ? (
              <div className="empty-state">
                <p>No nets defined. Add nets to specify connections.</p>
              </div>
            ) : (
              nets.map((net) => (
                <div key={net.id} className="list-item">
                  <div className="item-info">
                    <span className="item-name">{net.name}</span>
                    {net.voltage !== undefined && (
                      <span className="item-voltage">{net.voltage}V</span>
                    )}
                    <span className="item-nodes">{net.nodes.length} nodes</span>
                  </div>
                  <button
                    className="btn-icon-danger"
                    onClick={() => handleRemoveNet(net.id)}
                    title="Remove net"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <div className="builder-actions">
          <button
            className="btn-save"
            onClick={handleSaveCircuit}
            disabled={!circuitName || components.length === 0}
          >
            <Save size={18} />
            Save Circuit
          </button>
        </div>
      </div>
    </div>
  );
}

export default CircuitBuilder;
