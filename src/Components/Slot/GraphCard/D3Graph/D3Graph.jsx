import { useEffect, useState } from "react";

import { indicators } from "../../../../Constants/indicators";

import usePrevious from "../../../../libs/helpers/usePrevious";
import { sortData } from "./dataManipulation";

import "./D3Graph.scss";
import BarChart from "./BarChart/BarChart";
import Loader from "../../../Loader";
import LineChart from "./LineChart/LineChart";
import { BarChartStr } from "../../../../Constants/keywords";

const D3Graph = (props) => {
  const {
    dataForD3 = [],
    axisLabels,
    inModal,
    id,
    selectorData,
    fetchedObj,
    indicatorInfo,
    orderData,
    dimensions,
  } = props;

  const { fetched, setFetched } = fetchedObj;

  const data = dataForD3.sort((a, b) => a.date - b.date);

  const [graphData, setGraphData] = useState(null);
  const [graphDimensions, setGraphDimensions] = useState({});

  const prevOrderData = usePrevious(orderData);

  // sortData func. args (data,setGraphData,orderData,inModal,indicatorInfo)

  useEffect(() => {
    if (!inModal) {
      if (orderData.page !== prevOrderData?.page) {
        return sortData(data, setGraphData, orderData, inModal, indicatorInfo);
      } else if (orderData.page === 0) {
        return sortData(data, setGraphData, orderData, inModal, indicatorInfo);
      }
    }
    return sortData(data, setGraphData, orderData, inModal, indicatorInfo);
  }, [data, orderData, prevOrderData, indicatorInfo, inModal]);

  useEffect(() => {
    const cardHeader = document.getElementById(`cardHeader-${id}`);

    if (!fetched.cardHeaderDimensionsFetched) {
      setTimeout(() => {
        const height = cardHeader.getBoundingClientRect().height;

        setGraphDimensions({
          width: dimensions.width,
          height: dimensions.height - height,
        });

        return setFetched({ ...fetched, cardHeaderDimensionsFetched: true });
      }, 200);
    }
  }, [id, dimensions, fetched, setFetched]);

  const barGraph = () => {
    return (
      <BarChart
        axisLabels={axisLabels}
        indicators={indicators}
        dimensions={graphDimensions}
        id={id}
        indicatorInfo={indicatorInfo}
        orderData={orderData}
        graphData={graphData}
      />
    );
  };

  const lineGraph = () => {
    return (
      <LineChart
        axisLabels={axisLabels}
        indicators={indicators}
        indicatorInfo={indicatorInfo}
        graphData={graphData}
        dimensions={graphDimensions}
        orderData={orderData}
      />
    );
  };

  const renderGraph = () => {
    if (selectorData.chart === BarChartStr) {
      return barGraph();
    }
    return lineGraph();
  };

  return graphData && fetched.cardHeaderDimensionsFetched ? (
    renderGraph()
  ) : (
    <Loader />
  );
};

export default D3Graph;
