import React, { useState } from "react";
import { Handle, Position } from "reactflow";

const CollapsibleNode = ({ data }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="rounded border bg-white p-2 shadow-md w-64">
      <div
        className="cursor-pointer font-semibold text-sm"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? "▶" : "▼"} {data.label}
      </div>

      {!collapsed && data.children && (
        <ul className="mt-2 text-xs list-disc list-inside">
          {data.children.map((child, idx) => (
            <li key={idx}>{child}</li>
          ))}
        </ul>
      )}

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CollapsibleNode;
