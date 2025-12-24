import { create } from 'zustand'
import { Node, Edge, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges } from 'reactflow'

export interface WorkflowState {
  nodes: Node[]
  edges: Edge[]
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  addNode: (node: Node) => void
  executeWorkflow: () => Promise<void>
  isExecuting: boolean
  executionResults: Record<string, any>
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  isExecuting: false,
  executionResults: {},

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    })
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    })
  },

  addNode: (node) => {
    set({ nodes: [...get().nodes, node] })
  },

  executeWorkflow: async () => {
    const { nodes, edges } = get()
    set({ isExecuting: true, executionResults: {} })

    const results: Record<string, any> = {}
    const nodeMap = new Map(nodes.map(n => [n.id, n]))
    const visited = new Set<string>()

    const executeNode = async (nodeId: string, inputData: any = null): Promise<any> => {
      if (visited.has(nodeId)) return results[nodeId]
      visited.add(nodeId)

      const node = nodeMap.get(nodeId)
      if (!node) return null

      let output = null

      switch (node.type) {
        case 'trigger':
          output = {
            triggered: true,
            timestamp: new Date().toISOString(),
            data: node.data.config || {}
          }
          break

        case 'action':
          await new Promise(resolve => setTimeout(resolve, 500))
          output = {
            action: node.data.action,
            input: inputData,
            result: `Executed ${node.data.action}`,
            timestamp: new Date().toISOString()
          }
          break

        case 'condition':
          const condition = node.data.condition || 'true'
          const passed = eval(condition.replace(/input/g, JSON.stringify(inputData)))
          output = {
            condition,
            input: inputData,
            passed,
            timestamp: new Date().toISOString()
          }
          break

        case 'transform':
          const transform = node.data.transform || 'input'
          output = {
            transform,
            input: inputData,
            output: eval(transform.replace(/input/g, JSON.stringify(inputData))),
            timestamp: new Date().toISOString()
          }
          break
      }

      results[nodeId] = output

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

    set({ isExecuting: false, executionResults: results })
  }
}))
