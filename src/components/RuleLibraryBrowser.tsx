import { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  CheckCircle
} from 'lucide-react';
import { getAllRuleTemplates, getRulesByCategory, getRuleCount, type RuleTemplate } from '../utils/ruleLibrary';

interface RuleLibraryBrowserProps {
  onApplyRule: (ruleTemplate: RuleTemplate) => void;
  onClose?: () => void;
}

export default function RuleLibraryBrowser({
  onApplyRule,
  onClose
}: RuleLibraryBrowserProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedRules, setExpandedRules] = useState<Set<number>>(new Set());

  const allRules = getAllRuleTemplates();
  const totalRules = getRuleCount();

  const categories = [
    { id: 'all', name: 'All Rules', count: totalRules },
    { id: 'power', name: 'Power', count: getRulesByCategory('power').length },
    { id: 'signal', name: 'Signal', count: getRulesByCategory('signal').length },
    { id: 'timing', name: 'Timing', count: getRulesByCategory('timing').length },
    { id: 'filtering', name: 'Filtering', count: getRulesByCategory('filtering').length },
    { id: 'amplification', name: 'Amplification', count: getRulesByCategory('amplification').length },
    { id: 'regulation', name: 'Regulation', count: getRulesByCategory('regulation').length },
    { id: 'general', name: 'General', count: getRulesByCategory('general').length }
  ];

  // Filter rules based on search and category
  const filteredRules = allRules.filter(rule => {
    const matchesSearch = !searchTerm || 
      rule.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.consequence?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.consequence?.explanation?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || rule.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedRules);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRules(newExpanded);
  };

  const handleApplyRule = (ruleTemplate: RuleTemplate) => {
    onApplyRule(ruleTemplate);
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return '#f44336';
      case 'warning': return '#ff9800';
      case 'info': return '#2196F3';
      default: return '#999';
    }
  };

  return (
    <div className="rule-library-browser">
      <div className="browser-header">
        <div className="header-title">
          <BookOpen size={24} />
          <div>
            <h2>Cognitive Rule Library</h2>
            <p className="subtitle">{totalRules} expert diagnostic rules</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="close-button">✕</button>
        )}
      </div>

      <div className="browser-info">
        <p>
          This library contains expert knowledge from test engineers, capturing how professionals
          diagnose circuit failures. Apply rules to your circuit to enable automated causal reasoning.
        </p>
      </div>

      <div className="browser-controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search rules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filter">
          <Filter size={18} />
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rules-list">
        {filteredRules.length === 0 ? (
          <div className="empty-state">
            <p>No rules match your search</p>
          </div>
        ) : (
          filteredRules.map((rule, index) => {
            const isExpanded = expandedRules.has(index);
            
            return (
              <div key={index} className="rule-card">
                <div 
                  className="rule-header"
                  onClick={() => toggleExpanded(index)}
                >
                  <div className="rule-info">
                    <div className="rule-name">{rule.name}</div>
                    <div className="rule-meta">
                      <span className="category-badge">{rule.category}</span>
                      <span 
                        className="severity-badge"
                        style={{ 
                          color: getSeverityColor(rule.consequence?.severity),
                          borderColor: getSeverityColor(rule.consequence?.severity)
                        }}
                      >
                        {rule.consequence?.severity}
                      </span>
                    </div>
                  </div>
                  <div className="rule-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyRule(rule);
                      }}
                      className="apply-button"
                      title="Apply this rule to circuit"
                    >
                      <Plus size={18} />
                      Apply
                    </button>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {isExpanded && rule.consequence && (
                  <div className="rule-details">
                    <div className="detail-section">
                      <h4>What Fails</h4>
                      <p className="consequence-description">
                        {rule.consequence.description}
                      </p>
                    </div>

                    <div className="detail-section">
                      <h4>Why This Happens</h4>
                      <p className="consequence-explanation">
                        {rule.consequence.explanation}
                      </p>
                    </div>

                    <div className="detail-section">
                      <h4>Consequence Type</h4>
                      <span className="type-badge">{rule.consequence.type}</span>
                    </div>

                    <div className="apply-hint">
                      <CheckCircle size={16} />
                      Click "Apply" to add this rule to your circuit's diagnostic knowledge base.
                      You'll need to configure specific conditions (nets, voltages, etc.) after applying.
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <style>{`
        .rule-library-browser {
          padding: 20px;
          max-height: 80vh;
          overflow-y: auto;
          background: #1a1a1a;
          border-radius: 8px;
          color: #e0e0e0;
        }

        .browser-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .header-title {
          display: flex;
          align-items: flex-start;
          gap: 15px;
        }

        .header-title h2 {
          margin: 0;
          font-size: 1.4rem;
          color: #ffffff;
        }

        .subtitle {
          margin: 4px 0 0 0;
          font-size: 0.85rem;
          color: #888;
        }

        .close-button {
          background: #333;
          border: 1px solid #555;
          border-radius: 4px;
          color: #e0e0e0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.2rem;
        }

        .close-button:hover {
          background: #444;
        }

        .browser-info {
          background: #2a2a2a;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 15px;
          font-size: 0.9rem;
          color: #b0b0b0;
          border-left: 3px solid #2196F3;
        }

        .browser-info p {
          margin: 0;
          line-height: 1.5;
        }

        .browser-controls {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #2a2a2a;
          border: 1px solid #444;
          border-radius: 4px;
          padding: 8px 12px;
        }

        .search-box input {
          flex: 1;
          background: transparent;
          border: none;
          color: #e0e0e0;
          font-size: 0.9rem;
          outline: none;
        }

        .category-filter {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #2a2a2a;
          border: 1px solid #444;
          border-radius: 4px;
          padding: 8px 12px;
        }

        .category-filter select {
          background: transparent;
          border: none;
          color: #e0e0e0;
          font-size: 0.9rem;
          cursor: pointer;
          outline: none;
        }

        .rules-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .rule-card {
          background: #2a2a2a;
          border-radius: 6px;
          border: 1px solid #333;
          overflow: hidden;
        }

        .rule-card:hover {
          border-color: #444;
        }

        .rule-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          cursor: pointer;
        }

        .rule-header:hover {
          background: #333;
        }

        .rule-info {
          flex: 1;
        }

        .rule-name {
          font-size: 1rem;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .rule-meta {
          display: flex;
          gap: 8px;
        }

        .category-badge,
        .severity-badge,
        .type-badge {
          padding: 3px 10px;
          border-radius: 3px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .category-badge {
          background: #333;
          color: #2196F3;
        }

        .severity-badge {
          background: transparent;
          border: 1px solid;
        }

        .type-badge {
          background: #444;
          color: #aaa;
        }

        .rule-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .apply-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: #2196F3;
          border: none;
          border-radius: 4px;
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }

        .apply-button:hover {
          background: #1976D2;
        }

        .rule-details {
          padding: 0 15px 15px 15px;
          border-top: 1px solid #333;
        }

        .detail-section {
          margin-top: 15px;
        }

        .detail-section h4 {
          margin: 0 0 8px 0;
          font-size: 0.85rem;
          color: #2196F3;
          text-transform: uppercase;
        }

        .consequence-description,
        .consequence-explanation {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.6;
          color: #b0b0b0;
        }

        .apply-hint {
          margin-top: 15px;
          padding: 12px;
          background: #1a3a1a;
          border: 1px solid #2d5016;
          border-radius: 4px;
          font-size: 0.85rem;
          color: #90c090;
          display: flex;
          gap: 8px;
          align-items: flex-start;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #666;
        }

        @media (max-width: 768px) {
          .browser-controls {
            flex-direction: column;
          }

          .rule-actions {
            flex-direction: column;
            align-items: flex-end;
          }
        }
      `}</style>
    </div>
  );
}
