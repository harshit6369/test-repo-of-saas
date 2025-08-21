export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay';
  name: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

export interface WorkflowConnection {
  from: string;
  to: string;
}

export interface Workflow {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'draft';
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  createdAt: string;
  lastModified: string;
}
