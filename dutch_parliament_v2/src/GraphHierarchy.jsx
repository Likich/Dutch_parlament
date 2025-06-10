import React, { useEffect, useState, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 300;
const nodeHeight = 60;

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';

    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
  });

  return { nodes, edges };
};

const GraphHierarchy = () => {
  const [rawData, setRawData] = useState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetch('/merged_df.json')
      .then((res) => res.json())
      .then((data) => {
        setRawData(data);
        const { nodes, edges } = createGraph(data, {});
        const layouted = getLayoutedElements(nodes, edges);
        setNodes(layouted.nodes);
        setEdges(layouted.edges);
      });
  }, []);

  const createGraph = (data, expandState) => {
    const nodes = [];
    const edges = [];

    const metaSeen = new Set();
    const clusterSeen = new Set();
    const codeSeen = new Set();

    data.forEach((row, i) => {
      const metaId = `meta-${row.MetaCluster}`;
      const clusterId = `cluster-${row.HDBSCAN_Cluster}`;
      const codeId = `code-${row.Final_Code}-${clusterId}`;
      const utteranceId = `utt-${i}`;

      if (!metaSeen.has(metaId)) {
        nodes.push({
          id: metaId,
          data: { label: row.MetaCluster_Label },
          style: { background: '#BFDBFE', border: '1px solid #1D4ED8' },
          position: { x: 0, y: 0 },
        });
        metaSeen.add(metaId);
      }

      if (expandState[metaId]) {
        if (!clusterSeen.has(clusterId)) {
          nodes.push({
            id: clusterId,
            data: { label: row.Label },
            style: { background: '#FDE68A', border: '1px solid #CA8A04' },
            position: { x: 0, y: 0 },
          });
          edges.push({ id: `${metaId}-${clusterId}`, source: metaId, target: clusterId, type: 'smoothstep' });
          clusterSeen.add(clusterId);
        }

        if (expandState[clusterId]) {
          if (!codeSeen.has(codeId)) {
            nodes.push({
              id: codeId,
              data: { label: row.Final_Code },
              style: { background: '#BBF7D0', border: '1px solid #15803D', cursor: 'pointer' },
              position: { x: 0, y: 0 },
            });
            edges.push({ id: `${clusterId}-${codeId}`, source: clusterId, target: codeId, type: 'smoothstep' });
            codeSeen.add(codeId);
          }

          if (expandState[codeId]) {
            nodes.push({
              id: utteranceId,
              data: { label: row.utterance },
              style: {
                background: '#F3F4F6',
                border: '1px solid #9CA3AF',
                fontSize: 10,
              },
              position: { x: 0, y: 0 },
            });
            edges.push({ id: `${codeId}-${utteranceId}`, source: codeId, target: utteranceId, type: 'smoothstep' });
          }
        }
      }
    });

    return { nodes, edges };
  };

  const onNodeClick = useCallback(
    (_, node) => {
      const newExpanded = { ...expanded };
      newExpanded[node.id] = !newExpanded[node.id];
      setExpanded(newExpanded);
      const { nodes, edges } = createGraph(rawData, newExpanded);
      const layouted = getLayoutedElements(nodes, edges);
      setNodes(layouted.nodes);
      setEdges(layouted.edges);
    },
    [expanded, rawData]
  );

  return (
    <div style={{ height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default GraphHierarchy;
