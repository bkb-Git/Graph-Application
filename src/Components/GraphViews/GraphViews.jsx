import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { WBCountriesByRegion } from "../../WorldBank/worldBankAPIs";
import usePrevious from "../../libs/helpers/usePrevious";
import Slot from "../Slot";

import "./GraphViews.scss";

const GraphViews = () => {
  const [graphList, setGraphList] = useState([{ id: 1 }]);
  const [regionalCountries, setRegionalCountries] = useState([]);
  const [regionCountriesFetched, setRegionCountriesFetched] = useState(false);
  const history = useHistory();
  const { option } = useParams();

  const prevOption = usePrevious(option);

  useEffect(() => {
    setGraphList([{ id: 1 }]);

    if (option !== prevOption) {
      fetch(WBCountriesByRegion(option))
        .then((response) => response.json())
        .then((data) => {
          if (data !== null) {
            setRegionalCountries(data[1]);
            return setRegionCountriesFetched(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [option, history.location, prevOption]);

  const handleAddGraph = () => {
    if (graphList.length < 4) {
      return setGraphList([...graphList, { id: graphList.length + 1 }]);
    }
    return null;
  };

  const renderGraphs = () => {
    return graphList.map((graph) => (
      <Slot
        key={graph.id}
        id={graph.id}
        graphObj={graph}
        emptySlot={{ graphList, handleAddGraph, setGraphList }}
        selectorCard={{ regionCountriesFetched, regionalCountries }}
        graphCard={{ category: option }}
      />
    ));
  };

  return (
    <>
      <div
        className="row bg-transparent gy-4 gx-4"
        style={{ height: "100%", width: "100%" }}
      >
        {renderGraphs()}
      </div>
    </>
  );
};

export default GraphViews;
