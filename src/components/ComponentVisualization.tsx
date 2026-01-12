import type { Component, Net } from '../types';
import { Circle } from 'lucide-react';

interface ComponentVisualizationProps {
  components: Component[];
  nets: Net[];
  onComponentClick?: (componentId: string) => void;
}

export default function ComponentVisualization({ components, nets, onComponentClick }: ComponentVisualizationProps) {
  return (
    <div className="component-visualization">
      <div className="visualization-header">
        <h2>Circuit Schematic</h2>
        <div className="legend">
          <span className="legend-item">
            <Circle size={12} fill="green" /> Connected
          </span>
          <span className="legend-item">
            <Circle size={12} fill="gray" /> Disconnected
          </span>
        </div>
      </div>
      
      <div className="schematic-canvas">
        <svg width="100%" height="400" viewBox="0 0 600 400">
          {/* Grid pattern */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e0e0e0" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Render nets as lines */}
          {nets.map((net, idx) => (
            <g key={net.id}>
              <line
                x1={100 + idx * 150}
                y1={200}
                x2={200 + idx * 150}
                y2={200}
                stroke="#4CAF50"
                strokeWidth="2"
                strokeDasharray={net.voltage !== undefined ? '0' : '5,5'}
              />
              <text
                x={100 + idx * 150}
                y={190}
                fontSize="10"
                fill="#666"
              >
                {net.name} {net.voltage !== undefined ? `(${net.voltage}V)` : ''}
              </text>
            </g>
          ))}
          
          {/* Render components */}
          {components.map((comp) => (
            <g
              key={comp.id}
              onClick={() => onComponentClick?.(comp.id)}
              style={{ cursor: onComponentClick ? 'pointer' : 'default' }}
            >
              {comp.type === 'Resistor' && (
                <>
                  <rect
                    x={comp.position.x}
                    y={comp.position.y}
                    width="60"
                    height="30"
                    fill="none"
                    stroke={comp.connected ? '#4CAF50' : '#999'}
                    strokeWidth="2"
                    rx="3"
                  />
                  <line
                    x1={comp.position.x + 10}
                    y1={comp.position.y + 8}
                    x2={comp.position.x + 50}
                    y2={comp.position.y + 22}
                    stroke={comp.connected ? '#4CAF50' : '#999'}
                    strokeWidth="2"
                  />
                </>
              )}
              
              {comp.type === 'Capacitor' && (
                <>
                  <line
                    x1={comp.position.x + 25}
                    y1={comp.position.y}
                    x2={comp.position.x + 25}
                    y2={comp.position.y + 30}
                    stroke={comp.connected ? '#2196F3' : '#999'}
                    strokeWidth="2"
                  />
                  <line
                    x1={comp.position.x + 35}
                    y1={comp.position.y}
                    x2={comp.position.x + 35}
                    y2={comp.position.y + 30}
                    stroke={comp.connected ? '#2196F3' : '#999'}
                    strokeWidth="2"
                  />
                </>
              )}
              
              {comp.type === 'IC' && (
                <rect
                  x={comp.position.x}
                  y={comp.position.y}
                  width="80"
                  height="60"
                  fill={comp.connected ? '#FFF3E0' : '#f5f5f5'}
                  stroke={comp.connected ? '#FF9800' : '#999'}
                  strokeWidth="2"
                  rx="5"
                />
              )}
              
              {comp.type === 'Transistor' && (
                <circle
                  cx={comp.position.x + 20}
                  cy={comp.position.y + 20}
                  r="20"
                  fill="none"
                  stroke={comp.connected ? '#9C27B0' : '#999'}
                  strokeWidth="2"
                />
              )}
              
              {/* Component label */}
              <text
                x={comp.position.x}
                y={comp.position.y - 5}
                fontSize="12"
                fontWeight="bold"
                fill={comp.connected ? '#333' : '#999'}
              >
                {comp.name}
              </text>
              <text
                x={comp.position.x}
                y={comp.position.y + (comp.type === 'IC' ? 75 : 45)}
                fontSize="10"
                fill="#666"
              >
                {comp.value}
              </text>
            </g>
          ))}
        </svg>
      </div>
      
      <div className="component-list">
        <h3>Component Details</h3>
        <div className="component-cards">
          {components.map((comp) => (
            <div
              key={comp.id}
              className={`component-card ${comp.connected ? 'connected' : 'disconnected'}`}
              onClick={() => onComponentClick?.(comp.id)}
              style={{ cursor: onComponentClick ? 'pointer' : 'default' }}
            >
              <div className="card-header">
                <span className="component-name">{comp.name}</span>
                <span className={`status-badge ${comp.connected ? 'connected' : 'disconnected'}`}>
                  {comp.connected ? '✓' : '✗'}
                </span>
              </div>
              <div className="card-body">
                <div className="detail-row">
                  <span className="label">Type:</span>
                  <span className="value">{comp.type}</span>
                </div>
                {comp.value && (
                  <div className="detail-row">
                    <span className="label">Value:</span>
                    <span className="value">{comp.value}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="label">Pins:</span>
                  <span className="value">{comp.pins.join(', ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
