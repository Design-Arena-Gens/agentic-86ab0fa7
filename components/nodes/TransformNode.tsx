import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'

const TransformNode = ({ data, selected }: NodeProps) => {
  return (
    <div style={{
      padding: '12px 16px',
      background: selected ? '#1e293b' : '#0f172a',
      border: `2px solid ${selected ? '#6366f1' : '#334155'}`,
      borderRadius: '8px',
      minWidth: '180px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '8px'
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          background: '#10b981',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px'
        }}>
          ⚙
        </div>
        <strong style={{ fontSize: '13px' }}>Transform</strong>
      </div>
      <div style={{
        fontSize: '11px',
        color: '#94a3b8',
        marginBottom: '4px'
      }}>
        {data.label || 'Transform Data'}
      </div>
      {data.transform && (
        <div style={{
          fontSize: '10px',
          color: '#64748b',
          marginTop: '4px',
          padding: '4px 6px',
          background: '#1e293b',
          borderRadius: '4px'
        }}>
          {data.transform}
        </div>
      )}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#10b981', width: '10px', height: '10px' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#10b981', width: '10px', height: '10px' }}
      />
    </div>
  )
}

export default memo(TransformNode)
