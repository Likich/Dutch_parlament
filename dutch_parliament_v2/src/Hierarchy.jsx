import React, { useEffect, useState } from "react";
import Papa from "papaparse";

const Box = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded p-3 m-2 bg-white shadow">
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer font-semibold text-blue-800"
      >
        {open ? "▼" : "▶"} {title}
      </div>
      {open && <div className="ml-4 mt-2">{children}</div>}
    </div>
  );
};

const Hierarchy = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/merged_df.csv")
      .then((res) => res.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const cleaned = result.data.map((row) => ({
              MetaCluster: row.MetaCluster?.trim(),
              MetaCluster_Label: row.MetaCluster_Label?.trim(),
              HDBSCAN_Cluster: row.HDBSCAN_Cluster?.trim(),
              Label: row.Label?.trim(),
              Final_Code: row.Final_Code?.trim(),
              utterance: row.utterance?.trim(),
            }));
            setData(cleaned);
          },
        });
      });
  }, []);

  const hierarchy = {};

  data.forEach((row) => {
    const metaId = row.MetaCluster || "undefined";
    const metaLabel = row.MetaCluster_Label || "Meta undefined";
    const clusterId = row.HDBSCAN_Cluster || "undefined";
    const clusterLabel = row.Label || "Cluster undefined";
    const code = row.Final_Code || "Uncoded";

    if (!hierarchy[metaId]) {
      hierarchy[metaId] = {
        label: metaLabel,
        clusters: {},
      };
    }
    if (!hierarchy[metaId].clusters[clusterId]) {
      hierarchy[metaId].clusters[clusterId] = {
        label: clusterLabel,
        codes: {},
      };
    }
    if (!hierarchy[metaId].clusters[clusterId].codes[code]) {
      hierarchy[metaId].clusters[clusterId].codes[code] = [];
    }
    hierarchy[metaId].clusters[clusterId].codes[code].push(row.utterance);
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">
        📦 Hierarchical Code Explorer
      </h1>
      {Object.entries(hierarchy).map(([metaId, meta]) => (
        <Box key={metaId} title={`◆ ${meta.label}`}>
          {Object.entries(meta.clusters).map(([clusterId, cluster]) => (
            <Box key={clusterId} title={`▶ ${cluster.label}`}>
              {Object.entries(cluster.codes).map(([code, utterances]) => (
                <Box key={code} title={`💬 ${code}`}>
                  <ul className="list-disc list-inside ml-4">
                    {utterances.map((utt, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        🗣 {utt}
                      </li>
                    ))}
                  </ul>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      ))}
    </div>
  );
};

export default Hierarchy;
