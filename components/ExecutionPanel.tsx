interface ExecutionPanelProps {
  results: Record<string, any>
  nodes: any[]
}

export default function ExecutionPanel({ results, nodes }: ExecutionPanelProps) {
  const hasResults = Object.keys(results).length > 0

  return (
    <div style={{
      width: '320px',
      background: '#0f172a',
      borderLeft: '1px solid #1e293b',
      padding: '20px',
      overflowY: 'auto'
    }}>
      <h3 style={{ fontSize: '14px', marginBottom: '16px', color: '#cbd5e1' }}>
        Execution Results
      </h3>

      {!hasResults && (
        <p style={{ fontSize: '12px', color: '#64748b' }}>
          Run workflow to see results
        </p>
      )}

      {hasResults && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {nodes.map(node => {
            const result = results[node.id]
            if (!result) return null

            return (
              <div
                key={node.id}
                style={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '12px'
                }}
              >
                <div style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#f1f5f9',
                  marginBottom: '8px'
                }}>
                  {node.data.label}
                </div>
                <div style={{
                  fontSize: '10px',
                  color: '#94a3b8',
                  marginBottom: '6px'
                }}>
                  Type: {node.type}
                </div>
                <div style={{
                  fontSize: '10px',
                  color: '#64748b',
                  background: '#0f172a',
                  padding: '8px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  maxHeight: '150px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all'
                }}>
                  {JSON.stringify(result, null, 2)}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
