import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Node {
  id: string;
  name: string;
  group: 'campaign' | 'ip' | 'domain' | 'target';
  val: number;
  x?: number;
  y?: number;
}

interface Edge {
  source: string;
  target: string;
  value: number;
}

interface CampaignGraphProps {
  nodes?: Node[];
  links?: Edge[];
  className?: string;
}

export const CampaignGraph: React.FC<CampaignGraphProps> = ({
  className = ''
}) => {
  // Pre-seeded interactive graph nodes demonstrating campaign link relationships
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const graphNodes: Node[] = [
    { id: 'c1', name: 'Operation PhantomMFA', group: 'campaign', val: 24, x: 250, y: 150 },
    { id: 'ip1', name: '185.220.101.5 (RU)', group: 'ip', val: 18, x: 120, y: 100 },
    { id: 'ip2', name: '91.240.118.82 (NL)', group: 'ip', val: 14, x: 130, y: 220 },
    { id: 'd1', name: 'bank-corp-security.top', group: 'domain', val: 16, x: 380, y: 80 },
    { id: 'd2', name: 'attacker-c2.net', group: 'domain', val: 15, x: 390, y: 210 },
    { id: 't1', name: 'corporate-bank.com', group: 'target', val: 20, x: 490, y: 150 },
    { id: 'ip3', name: '194.26.29.112 (UA)', group: 'ip', val: 12, x: 230, y: 260 }
  ];

  const graphEdges: { from: Node; to: Node }[] = [
    { from: graphNodes[0], to: graphNodes[1] },
    { from: graphNodes[0], to: graphNodes[2] },
    { from: graphNodes[0], to: graphNodes[3] },
    { from: graphNodes[0], to: graphNodes[4] },
    { from: graphNodes[3], to: graphNodes[5] },
    { from: graphNodes[4], to: graphNodes[5] },
    { from: graphNodes[0], to: graphNodes[6] }
  ];

  const colorMap = {
    campaign: '#EF4444', // red
    ip: '#F59E0B',       // amber
    domain: '#3B82F6',   // blue
    target: '#10B981'    // green
  };

  return (
    <div className={`relative w-full rounded-2xl bg-surface/80 border border-border/80 p-4 overflow-hidden ${className}`}>
      {/* Legend & Details */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/60 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-danger" />
            <span className="text-text-muted">Campaign Hub</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-warning" />
            <span className="text-text-muted">Relay IP</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-text-muted">Spoofed Domain</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span className="text-text-muted">Target Entity</span>
          </div>
        </div>

        {selectedNode && (
          <span className="text-xs font-mono text-primary font-bold">
            Selected: {selectedNode.name} ({selectedNode.group.toUpperCase()})
          </span>
        )}
      </div>

      {/* SVG Interactive Canvas */}
      <div className="w-full h-80 flex items-center justify-center">
        <svg viewBox="0 0 600 300" className="w-full h-full select-none">
          {/* Edges */}
          {graphEdges.map((edge, idx) => (
            <line
              key={idx}
              x1={edge.from.x}
              y1={edge.from.y}
              x2={edge.to.x}
              y2={edge.to.y}
              stroke="rgba(59, 130, 246, 0.3)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          ))}

          {/* Nodes */}
          {graphNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <g
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer group"
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.val}
                  fill={colorMap[node.group]}
                  opacity={isSelected ? 0.95 : 0.75}
                  stroke={isSelected ? '#ffffff' : 'rgba(255,255,255,0.2)'}
                  strokeWidth={isSelected ? 3 : 1.5}
                  className="transition-all duration-200 hover:opacity-100"
                  style={{
                    filter: `drop-shadow(0 0 8px ${colorMap[node.group]}90)`
                  }}
                />
                <text
                  x={node.x}
                  y={(node.y || 0) + node.val + 14}
                  textAnchor="middle"
                  fill="#9CA3AF"
                  fontSize="10"
                  fontFamily="Inter, sans-serif"
                  fontWeight="500"
                  className="pointer-events-none group-hover:fill-white"
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
