"use client";

import { memo, useMemo } from "react";
import { Background, Handle, MarkerType, Position, ReactFlow, type Edge, type Node, type NodeProps } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { GRAPH_EDGES, GRAPH_NODES, type NodeId } from "@/lib/agent/spec";

export type NodeStatus = "idle" | "active" | "done";

type GNode = Node<{ label: string; sub: string; color: string; emoji: string; status: NodeStatus; visits: number; terminal: boolean }>;

const GraphNode = memo(function GraphNode({ data }: NodeProps<GNode>) {
  const { status, color } = data;
  return (
    <div
      className={`relative rounded-2xl border-2 bg-white px-3 py-2 text-center shadow-md transition-all duration-300 ${status === "active" ? "pulse-ring scale-110" : ""}`}
      style={{
        borderColor: status === "idle" ? "#e2e8f0" : color,
        background: status === "done" ? `${color}14` : status === "active" ? "#fff" : "#fff",
        width: data.terminal ? 96 : 150,
        opacity: status === "idle" ? 0.75 : 1,
        ["--ring-color" as string]: `${color}88`,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <Handle type="target" id="top" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" id="bottom" position={Position.Bottom} style={{ opacity: 0 }} />
      <div className="text-xl leading-none">{data.emoji}</div>
      <div className="mt-1 text-[13px] font-extrabold" style={{ color: status === "idle" ? "#475569" : color }}>{data.label}</div>
      {!data.terminal && <div className="text-[10px] leading-tight text-slate-500">{data.sub}</div>}
      {status === "done" && (
        <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold text-white shadow" style={{ background: color }}>✓</span>
      )}
      {data.visits > 1 && (
        <span className="absolute -left-2 -top-2 rounded-full bg-slate-900 px-1.5 text-[10px] font-bold text-white">×{data.visits}</span>
      )}
    </div>
  );
});

const nodeTypes = { g: GraphNode };

export function AgentGraph({ status, visits, traversed }: { status: Record<string, NodeStatus>; visits: Record<string, number>; traversed: Set<string> }) {
  const nodes: GNode[] = useMemo(
    () =>
      GRAPH_NODES.map((n) => ({
        id: n.id,
        type: "g",
        position: { x: n.x, y: n.y },
        draggable: false,
        data: { ...n, status: status[n.id] ?? "idle", visits: visits[n.id] ?? 0, terminal: n.id.startsWith("__") },
      })),
    [status, visits],
  );

  const edges: Edge[] = useMemo(
    () =>
      GRAPH_EDGES.map((e) => {
        const on = traversed.has(`${e.source}->${e.target}`);
        const color = on ? GRAPH_NODES.find((n) => n.id === e.target)!.color : "#cbd5e1";
        const loop = e.source === "reviewer" && e.target === "specialist";
        return {
          id: e.id,
          source: e.source,
          target: e.target,
          sourceHandle: loop ? "bottom" : undefined,
          type: loop ? "smoothstep" : "default",
          label: e.label,
          animated: on,
          labelStyle: { fontSize: 10, fontWeight: 700, fill: on ? color : "#94a3b8" },
          labelBgStyle: { fill: "#fff" },
          style: { stroke: color, strokeWidth: on ? 3 : 1.5, strokeDasharray: e.conditional && !on ? "5 4" : undefined },
          markerEnd: { type: MarkerType.ArrowClosed, color, width: 16, height: 16 },
        } satisfies Edge;
      }),
    [traversed],
  );

  return (
    <div className="h-[240px] w-full sm:h-[260px] overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-br from-white to-violet-50/60">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        forceColorMode="light"
        style={{ background: "transparent" }}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnScroll={false}
        zoomOnScroll={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={18} color="#e9e3ff" />
      </ReactFlow>
    </div>
  );
}

export type { NodeId };
