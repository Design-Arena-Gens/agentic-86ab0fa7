import { useState } from 'react'

interface SidebarProps {
  addNode: (type: string) => void
  selectedNode: any
  updateNodeData: (nodeId: string, data: any) => void
  executeWorkflow: () => void
  saveWorkflow: () => void
  loadWorkflow: () => void
  clearWorkflow: () => void
  isExecuting: boolean
}

export default function Sidebar({
  addNode,
  selectedNode,
  updateNodeData,
  executeWorkflow,
  saveWorkflow,
  loadWorkflow,
  clearWorkflow,
  isExecuting
}: SidebarProps) {
  const [label, setLabel] = useState('')
  const [action, setAction] = useState('')
  const [condition, setCondition] = useState('')
  const [transform, setTransform] = useState('')
  const [config, setConfig] = useState('')

  const handleNodeSelect = () => {
    if (selectedNode) {
      setLabel(selectedNode.data.label || '')
      setAction(selectedNode.data.action || '')
      setCondition(selectedNode.data.condition || '')
      setTransform(selectedNode.data.transform || '')
      setConfig(JSON.stringify(selectedNode.data.config || {}, null, 2))
    }
  }

  const handleUpdate = () => {
    if (selectedNode) {
      const updates: any = { label }
      if (selectedNode.type === 'action') updates.action = action
      if (selectedNode.type === 'condition') updates.condition = condition
      if (selectedNode.type === 'transform') updates.transform = transform
      if (selectedNode.type === 'trigger') {
        try {
          updates.config = JSON.parse(config)
        } catch (e) {
          alert('Invalid JSON config')
          return
        }
      }
      updateNodeData(selectedNode.id, updates)
    }
  }

  return (
    <div style={{
      width: '300px',
      background: '#0f172a',
      borderRight: '1px solid #1e293b',
      padding: '20px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div>
        <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#f1f5f9' }}>
          Flow Automation
        </h2>
        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
          Free workflow builder
        </p>
      </div>

      <div>
        <h3 style={{ fontSize: '14px', marginBottom: '12px', color: '#cbd5e1' }}>
          Add Nodes
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => addNode('trigger')}
            style={{
              padding: '10px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#f1f5f9',
              cursor: 'pointer',
              fontSize: '12px',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#334155'}
            onMouseOut={(e) => e.currentTarget.style.background = '#1e293b'}
          >
            ▶ Trigger
          </button>
          <button
            onClick={() => addNode('action')}
            style={{
              padding: '10px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#f1f5f9',
              cursor: 'pointer',
              fontSize: '12px',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#334155'}
            onMouseOut={(e) => e.currentTarget.style.background = '#1e293b'}
          >
            ⚡ Action
          </button>
          <button
            onClick={() => addNode('condition')}
            style={{
              padding: '10px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#f1f5f9',
              cursor: 'pointer',
              fontSize: '12px',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#334155'}
            onMouseOut={(e) => e.currentTarget.style.background = '#1e293b'}
          >
            ? Condition
          </button>
          <button
            onClick={() => addNode('transform')}
            style={{
              padding: '10px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#f1f5f9',
              cursor: 'pointer',
              fontSize: '12px',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#334155'}
            onMouseOut={(e) => e.currentTarget.style.background = '#1e293b'}
          >
            ⚙ Transform
          </button>
        </div>
      </div>

      {selectedNode && (
        <div>
          <h3 style={{ fontSize: '14px', marginBottom: '12px', color: '#cbd5e1' }}>
            Edit Node
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              placeholder="Label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onFocus={handleNodeSelect}
              style={{
                padding: '8px',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#f1f5f9',
                fontSize: '12px'
              }}
            />

            {selectedNode.type === 'action' && (
              <input
                type="text"
                placeholder="Action (e.g., Send Email)"
                value={action}
                onChange={(e) => setAction(e.target.value)}
                style={{
                  padding: '8px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#f1f5f9',
                  fontSize: '12px'
                }}
              />
            )}

            {selectedNode.type === 'condition' && (
              <input
                type="text"
                placeholder="Condition (e.g., input.value > 10)"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                style={{
                  padding: '8px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#f1f5f9',
                  fontSize: '12px'
                }}
              />
            )}

            {selectedNode.type === 'transform' && (
              <input
                type="text"
                placeholder="Transform (e.g., input.value * 2)"
                value={transform}
                onChange={(e) => setTransform(e.target.value)}
                style={{
                  padding: '8px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#f1f5f9',
                  fontSize: '12px'
                }}
              />
            )}

            {selectedNode.type === 'trigger' && (
              <textarea
                placeholder='Config JSON (e.g., {"url": "/webhook"})'
                value={config}
                onChange={(e) => setConfig(e.target.value)}
                rows={4}
                style={{
                  padding: '8px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#f1f5f9',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  resize: 'vertical'
                }}
              />
            )}

            <button
              onClick={handleUpdate}
              style={{
                padding: '8px',
                background: '#6366f1',
                border: 'none',
                borderRadius: '6px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              Update Node
            </button>
          </div>
        </div>
      )}

      <div style={{ borderTop: '1px solid #1e293b', paddingTop: '20px' }}>
        <h3 style={{ fontSize: '14px', marginBottom: '12px', color: '#cbd5e1' }}>
          Workflow
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={executeWorkflow}
            disabled={isExecuting}
            style={{
              padding: '10px',
              background: isExecuting ? '#334155' : '#10b981',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              cursor: isExecuting ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            {isExecuting ? 'Executing...' : '▶ Execute Workflow'}
          </button>
          <button
            onClick={saveWorkflow}
            style={{
              padding: '8px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#f1f5f9',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            💾 Save
          </button>
          <button
            onClick={loadWorkflow}
            style={{
              padding: '8px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#f1f5f9',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            📂 Load
          </button>
          <button
            onClick={clearWorkflow}
            style={{
              padding: '8px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            🗑 Clear
          </button>
        </div>
      </div>
    </div>
  )
}
