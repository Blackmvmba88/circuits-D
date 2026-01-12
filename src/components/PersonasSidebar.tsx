import type { Persona } from '../types';
import { User } from 'lucide-react';

interface PersonasSidebarProps {
  personas: Persona[];
  onPersonaToggle: (id: string) => void;
}

export default function PersonasSidebar({ personas, onPersonaToggle }: PersonasSidebarProps) {
  const activePersonas = personas.filter(p => p.active);
  const inactivePersonas = personas.filter(p => !p.active);

  return (
    <div className="personas-sidebar">
      <div className="sidebar-header">
        <User size={20} />
        <h2>Personas</h2>
      </div>

      <div className="personas-content">
        {activePersonas.length > 0 && (
          <div className="persona-section">
            <h3 className="section-title">Active</h3>
            <div className="persona-list">
              {activePersonas.map(persona => (
                <div key={persona.id} className="persona-card active">
                  <div className="persona-avatar">{persona.avatar}</div>
                  <div className="persona-info">
                    <div className="persona-name">{persona.name}</div>
                    <div className="persona-role">{persona.role}</div>
                    <div className="persona-description">{persona.description}</div>
                  </div>
                  <button
                    className="persona-toggle active"
                    onClick={() => onPersonaToggle(persona.id)}
                    title="Deactivate persona"
                  >
                    ✓
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {inactivePersonas.length > 0 && (
          <div className="persona-section">
            <h3 className="section-title">Available</h3>
            <div className="persona-list">
              {inactivePersonas.map(persona => (
                <div key={persona.id} className="persona-card inactive">
                  <div className="persona-avatar inactive">{persona.avatar}</div>
                  <div className="persona-info">
                    <div className="persona-name">{persona.name}</div>
                    <div className="persona-role">{persona.role}</div>
                    <div className="persona-description">{persona.description}</div>
                  </div>
                  <button
                    className="persona-toggle inactive"
                    onClick={() => onPersonaToggle(persona.id)}
                    title="Activate persona"
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        <div className="active-count">
          {activePersonas.length} active persona{activePersonas.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
