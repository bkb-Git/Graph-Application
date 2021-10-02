import { useEffect, useState } from "react";

import { indicators } from "../../../../Constants/indicators";

import usePrevious from "../../../../libs/helpers/usePrevious";
import { sortData } from "./dataManipulation";

import "./D3Graph.scss";
import BarChart from "./BarChart/BarChart";

const D3Graph = (props) => {
  const {
    dataForD3 = [],
    axisLabels,
    inModal,
    indicatorInfo,
    orderData,
    dimensions,
  } = props;

  const data = dataForD3.sort((a, b) => a.date - b.date);

  const [graphData, setGraphData] = useState(null);

  const prevOrderData = usePrevious(orderData);

  // sortData func. args (data,setGraphData,orderData,prevOrderData)

  useEffect(() => {
    if (!inModal) {
      if (orderData.page !== prevOrderData?.page) {
        return sortData(
          data,
          setGraphData,
          orderData,
          prevOrderData,
          indicatorInfo
        );
      } else if (orderData.page === 0) {
        return sortData(
          data,
          setGraphData,
          orderData,
          prevOrderData,
          indicatorInfo
        );
      }
    }
    return sortData(data, setGraphData, orderData, inModal);
  }, [data, orderData, prevOrderData, indicatorInfo, inModal]);

  const renderLoading = () => {
    return (
      <div
        class="d-flex text-primary justify-content-center align-items-center"
        style={{ height: "100%" }}
      >
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  };

  const renderGraph = () => {
    return (
      <BarChart
        axisLabels={axisLabels}
        indicators={indicators}
        dimensions={dimensions}
        indicatorInfo={indicatorInfo}
        orderData={orderData}
        prevOrderData={prevOrderData}
        graphData={graphData}
      />
    );
  };

  return graphData ? renderGraph() : renderLoading();
};

export default D3Graph;
