import { useState } from "react";

const TreeNode = ({ label, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="ml-4">
      <div
        className="cursor-pointer text-blue-600 hover:underline"
        onClick={() => setOpen(!open)}
      >
        {label}
      </div>
      {open && <div className="ml-4 mt-1">{children}</div>}
    </div>
  );
};

const TreeView = ({ data }) => {
  const metaClusters = {};

  data.forEach((item) => {
    const meta = item.MetaCluster_Label || "Unlabeled";
    const cluster = item.Label || "Unlabeled";
    const final = item.Final_Code || "";

    if (!metaClusters[meta]) metaClusters[meta] = {};
    if (!metaClusters[meta][cluster]) metaClusters[meta][cluster] = [];
    metaClusters[meta][cluster].push(final);
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dutch Parliament Debate Taxonomy</h1>
      {Object.entries(metaClusters).map(([meta, clusters]) => (
        <TreeNode key={meta} label={`🧭 ${meta}`}>
          {Object.entries(clusters).map(([cluster, finals]) => (
            <TreeNode key={cluster} label={`📦 ${cluster}`}>
              {finals.map((f, idx) => (
                <div key={idx} className="ml-4 text-sm text-gray-800">🗣 {f}</div>
              ))}
            </TreeNode>
          ))}
        </TreeNode>
      ))}
    </div>
  );
};

export default TreeView;
