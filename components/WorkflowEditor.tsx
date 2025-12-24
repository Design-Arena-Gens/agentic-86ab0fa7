'use client'

import { useCallback, useState } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'

import TriggerNode from './nodes/TriggerNode'
import ActionNode from './nodes/ActionNode'
import ConditionNode from './nodes/ConditionNode'
import TransformNode from './nodes/TransformNode'
import Sidebar from './Sidebar'
import ExecutionPanel from './ExecutionPanel'

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  transform: TransformNode,
}

const initialNodes = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 100, y: 100 },
    data: { label: 'Webhook Trigger', config: { url: '/webhook' } },
  },
]

let nodeIdCounter = 2

export default function WorkflowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [executionResults, setExecutionResults] = useState<Record<string, any>>({})
  const [isExecuting, setIsExecuting] = useState(false)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const addNode = useCallback((type: string) => {
    const newNode: any = {
      id: `${nodeIdCounter++}`,
      type,
      position: { x: Math.random() * 400 + 200, y: Math.random() * 400 + 100 },
      data: {
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodeIdCounter - 1}`,
        action: type === 'action' ? 'Send Email' : undefined,
        condition: type === 'condition' ? 'input.value > 0' : undefined,
        transform: type === 'transform' ? 'input.value * 2' : undefined,
        config: type === 'trigger' ? {} : undefined,
      },
    }
    setNodes((nds) => nds.concat(newNode))
  }, [setNodes])

  const onNodeClick = useCallback((_: any, node: any) => {
    setSelectedNode(node)
  }, [])

  const updateNodeData = useCallback((nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      )
    )
    setSelectedNode((prev: any) => prev?.id === nodeId ? { ...prev, data: { ...prev.data, ...data } } : prev)
  }, [setNodes])

  const executeWorkflow = async () => {
    setIsExecuting(true)
    setExecutionResults({})

    const results: Record<string, any> = {}
    const nodeMap = new Map(nodes.map(n => [n.id, n]))
    const visited = new Set<string>()

    const executeNode = async (nodeId: string, inputData: any = null): Promise<any> => {
      if (visited.has(nodeId)) return results[nodeId]
      visited.add(nodeId)

      const node = nodeMap.get(nodeId)
      if (!node) return null

      let output = null
      const nodeData: any = node.data

      switch (node.type) {
        case 'trigger':
          output = {
            triggered: true,
            timestamp: new Date().toISOString(),
            data: nodeData.config || {}
          }
          break

        case 'action':
          await new Promise(resolve => setTimeout(resolve, 500))
          output = {
            action: nodeData.action,
            input: inputData,
            result: `Executed ${nodeData.action}`,
            timestamp: new Date().toISOString()
          }
          break

        case 'condition':
          const condition = nodeData.condition || 'true'
          try {
            const passed = eval(condition.replace(/input/g, JSON.stringify(inputData)))
            output = {
              condition,
              input: inputData,
              passed,
              timestamp: new Date().toISOString()
            }
          } catch (e) {
            output = {
              condition,
              input: inputData,
              passed: false,
              error: 'Invalid condition',
              timestamp: new Date().toISOString()
            }
          }
          break

        case 'transform':
          const transform = nodeData.transform || 'input'
          try {
            output = {
              transform,
              input: inputData,
              output: eval(transform.replace(/input/g, JSON.stringify(inputData))),
              timestamp: new Date().toISOString()
            }
          } catch (e) {
            output = {
              transform,
              input: inputData,
              output: null,
              error: 'Invalid transform',
              timestamp: new Date().toISOString()
            }
          }
          break
      }

      results[nodeId] = output
      setExecutionResults({ ...results })

      const outgoingEdges = edges.filter(e => e.source === nodeId)
      for (const edge of outgoingEdges) {
        await executeNode(edge.target, output)
      }

      return output
    }

    const triggerNodes = nodes.filter(n => n.type === 'trigger')
    for (const trigger of triggerNodes) {
      await executeNode(trigger.id)
    }

    setIsExecuting(false)
  }

  const saveWorkflow = () => {
    const workflow = { nodes, edges }
    localStorage.setItem('workflow', JSON.stringify(workflow))
    alert('Workflow saved!')
  }

  const loadWorkflow = () => {
    const saved = localStorage.getItem('workflow')
    if (saved) {
      const workflow = JSON.parse(saved)
      setNodes(workflow.nodes || [])
      setEdges(workflow.edges || [])
      alert('Workflow loaded!')
    }
  }

  const clearWorkflow = () => {
    if (confirm('Clear all nodes and edges?')) {
      setNodes([])
      setEdges([])
      setExecutionResults({})
    }
  }

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <Sidebar
        addNode={addNode}
        selectedNode={selectedNode}
        updateNodeData={updateNodeData}
        executeWorkflow={executeWorkflow}
        saveWorkflow={saveWorkflow}
        loadWorkflow={loadWorkflow}
        clearWorkflow={clearWorkflow}
        isExecuting={isExecuting}
      />
      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          style={{ background: '#0a0a0a' }}
        >
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              switch (node.type) {
                case 'trigger': return '#3b82f6'
                case 'action': return '#8b5cf6'
                case 'condition': return '#f59e0b'
                case 'transform': return '#10b981'
                default: return '#6366f1'
              }
            }}
          />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
      <ExecutionPanel results={executionResults} nodes={nodes} />
    </div>
  )
}
