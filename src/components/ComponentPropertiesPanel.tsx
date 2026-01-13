import { useState, useEffect } from 'react';
import type { Component3D } from '../types';
import { Edit3, RotateCw, Move } from 'lucide-react';

interface ComponentPropertiesPanelProps {
  component: Component3D | undefined;
  onUpdate?: (id: string, updates: Partial<Component3D>) => void;
}

export function ComponentPropertiesPanel({
  component,
  onUpdate,
}: ComponentPropertiesPanelProps) {
  const [editedComponent, setEditedComponent] = useState<Component3D | undefined>(component);

  useEffect(() => {
    setEditedComponent(component);
  }, [component]);

  if (!component || !editedComponent) {
    return (
      <div className="component-properties-panel empty">
        <div className="panel-header">
          <Edit3 size={20} />
          <h3>Component Properties</h3>
        </div>
        <div className="panel-content">
          <p className="empty-message">Select a component to view and edit its properties</p>
        </div>
      </div>
    );
  }

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    const updatedComponent = {
      ...editedComponent,
      position: { ...editedComponent.position, [axis]: numValue },
    };
    setEditedComponent(updatedComponent);
    onUpdate?.(component.id, { position: updatedComponent.position });
  };

  const handleRotate90 = () => {
    const currentY = editedComponent.rotation.y;
    const newY = (currentY + Math.PI / 2) % (Math.PI * 2);
    const updatedComponent = {
      ...editedComponent,
      rotation: { ...editedComponent.rotation, y: newY },
    };
    setEditedComponent(updatedComponent);
    onUpdate?.(component.id, { rotation: updatedComponent.rotation });
  };

  const handleRefDesChange = (value: string) => {
    const updatedComponent = {
      ...editedComponent,
      refDes: value,
    };
    setEditedComponent(updatedComponent);
    onUpdate?.(component.id, { refDes: value });
  };

  const handleTypeChange = (value: string) => {
    const updatedComponent = {
      ...editedComponent,
      type: value,
    };
    setEditedComponent(updatedComponent);
    onUpdate?.(component.id, { type: value });
  };

  return (
    <div className="component-properties-panel">
      <div className="panel-header">
        <Edit3 size={20} />
        <h3>Component Properties</h3>
      </div>
      
      <div className="panel-content">
        <div className="property-section">
          <h4>Identity</h4>
          <div className="property-field">
            <label htmlFor="refDes">Reference Designator</label>
            <input
              id="refDes"
              type="text"
              value={editedComponent.refDes}
              onChange={(e) => handleRefDesChange(e.target.value)}
            />
          </div>
          <div className="property-field">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              value={editedComponent.type}
              onChange={(e) => handleTypeChange(e.target.value)}
            >
              <option value="Resistor">Resistor</option>
              <option value="Capacitor">Capacitor</option>
              <option value="IC">IC</option>
              <option value="Transistor">Transistor</option>
              <option value="Diode">Diode</option>
              <option value="LED">LED</option>
              <option value="Inductor">Inductor</option>
              <option value="Header">Header</option>
              <option value="Connector">Connector</option>
            </select>
          </div>
        </div>

        <div className="property-section">
          <h4>
            <Move size={16} /> Position
          </h4>
          <div className="property-grid">
            <div className="property-field">
              <label htmlFor="pos-x">X</label>
              <input
                id="pos-x"
                type="number"
                step="1"
                value={editedComponent.position.x.toFixed(1)}
                onChange={(e) => handlePositionChange('x', e.target.value)}
              />
            </div>
            <div className="property-field">
              <label htmlFor="pos-y">Y</label>
              <input
                id="pos-y"
                type="number"
                step="0.1"
                value={editedComponent.position.y.toFixed(1)}
                onChange={(e) => handlePositionChange('y', e.target.value)}
              />
            </div>
            <div className="property-field">
              <label htmlFor="pos-z">Z</label>
              <input
                id="pos-z"
                type="number"
                step="1"
                value={editedComponent.position.z.toFixed(1)}
                onChange={(e) => handlePositionChange('z', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="property-section">
          <h4>
            <RotateCw size={16} /> Rotation
          </h4>
          <div className="rotation-controls">
            <button
              className="btn-rotate"
              onClick={handleRotate90}
              title="Rotate 90° clockwise"
            >
              <RotateCw size={18} />
              Rotate 90°
            </button>
            <div className="rotation-display">
              Current: {Math.round((editedComponent.rotation.y * 180) / Math.PI)}°
            </div>
          </div>
        </div>

        <div className="property-section">
          <h4>Nets</h4>
          <div className="nets-list">
            {editedComponent.netIds.length > 0 ? (
              editedComponent.netIds.map((netId) => (
                <span key={netId} className="net-badge">
                  {netId}
                </span>
              ))
            ) : (
              <span className="empty-message">No nets connected</span>
            )}
          </div>
        </div>

        <div className="property-section">
          <h4>Dimensions</h4>
          <div className="dimensions-display">
            <span>{editedComponent.size.x.toFixed(1)} × {editedComponent.size.y.toFixed(1)} × {editedComponent.size.z.toFixed(1)} mm</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComponentPropertiesPanel;
