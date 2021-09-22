import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GraphCard from "../GraphCard";

import "./GraphView.scss";

const GraphView = () => {
  const [graphList, setGraphList] = useState([{ id: 1 }]);
  const { option } = useParams();

  useEffect(() => {
    setGraphList([{ id: 1 }]);
  }, [option]);

  const handleAddGraph = () => {
    if (graphList.length < 4) {
      return setGraphList([...graphList, { id: graphList.length + 1 }]);
    }
    return null;
  };

  const renderGraphs = () => {
    return graphList.map((graph) => (
      <GraphCard
        key={`${graph.id}`}
        data={graph}
        graphList={graphList}
        addGraph={handleAddGraph}
        setGraphList={setGraphList}
        category={option}
      />
    ));
  };

  return (
    <>
      <div
        className="row  bg-transparent gy-4 gx-4"
        style={{ height: "100%", width: "100%" }}
      >
        {renderGraphs()}
      </div>
    </>
  );
};

export default GraphView;
