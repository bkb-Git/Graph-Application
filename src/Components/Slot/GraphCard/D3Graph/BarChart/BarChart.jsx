import { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Tooltip } from "bootstrap";
import { noData } from "../../../../../Constants/keywords";
import {
  gdpTotalinUSD,
  totalPopulation,
} from "../../../../../Constants/indicators";
import {
  handleTooltipTitle,
  xAxisLabelFormat,
  yAxisTickFormat,
} from "../../../../../libs/helpers/graphFormatting";

const BarChart = (props) => {
  const {
    axisLabels,
    graphData,
    id,
    dimensions,
    indicatorInfo,
    orderData,
    indicatorUnit,
  } = props;

  const { height, width } = dimensions;
  const { xAxisLabel, yValue } = axisLabels;

  const [graphRendered, setGraphRendered] = useState(false);

  const color = "#5902ab";

  const svgRef = useRef(null);

  const graphDataValues = graphData.filter(
    (data) => typeof data.value === "number"
  );
  const meanValue = d3.mean(graphDataValues, (d) => {
    const value = d[yValue];
    let finalValue;

    value < 0 ? (finalValue = value * -1) : (finalValue = value);
    return finalValue;
  });

  const renderGraph = useCallback(
    (svgEl) => {
      const svg = d3.select(svgEl);

      const margin = { top: 25, right: 10, bottom: 25, left: 43 };

      // const minValue = d3.min(graphDataValues, (d) => d[yValue]);

      const domainMaxValue = (d) => {
        if (d[yValue] < 0) {
          return d[yValue] * -1;
        }
        return d[yValue];
      };

      const barHeight = (d) => {
        const value = d[yValue];

        if (value === noData) {
          return y(0) - y(meanValue);
        } else if (value < 0) {
          return y(0) - y(value * -1);
        }
        return y(0) - y(value);
      };

      const handleBarY = (d) => {
        const value = d[yValue];

        if (value === noData) {
          return y(meanValue);
        } else if (value < 0) {
          return y(value * -1);
        }
        return y(value);
      };

      const handleBarColor = (d) => {
        if (d[yValue] !== noData && d[yValue] > 0) {
          return color;
        } else if (d[yValue] < 0) {
          return "#821E1A";
        }
        return "#828282";
      };

      const x = d3
        .scaleBand()
        .domain(d3.range(graphData.length))
        .range([margin.left, width - margin.right])
        .padding(0.1);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(graphDataValues, (d) => domainMaxValue(d))])
        .nice()
        .range([height - margin.bottom, margin.top]);

      const xAxis = (g) => {
        return g
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .call(
            d3
              .axisBottom(x)
              .tickFormat((i) => xAxisLabelFormat(graphData, i, xAxisLabel))
              .tickSizeOuter(0)
          );
      };

      const yAxis = (g) => {
        const renderText = () => {
          if (indicatorInfo === gdpTotalinUSD) {
            const unit = graphData[0].maxValue;
            if (unit) {
              return `${unit}`;
            }
            return `No Data`;
          } else if (indicatorInfo === totalPopulation) {
            const unit = graphData[0].maxValue
              ? graphData[0].maxValue
              : "Million";
            return `${unit}`;
          }
        };

        return g
          .attr("transform", `translate(${margin.left},0)`)
          .call(
            d3
              .axisLeft(y)
              .ticks()
              .tickFormat(
                yAxisTickFormat(indicatorInfo, indicatorUnit, graphData)
              )
          )
          .call((g) => g.select(".domain").remove())
          .call((g) =>
            g
              .append("text")
              .attr("x", -35)
              .attr("y", 10)
              .attr("fill", "currentColor")
              .attr("text-anchor", "start")
              .text(renderText())
          );
      };

      svg.selectAll("g").transition().duration(50).style("opacity", 0).remove();

      svg
        .append("g")
        .attr("class", `main-graph main-graph-${id}`)
        .selectAll("rect")
        .data(graphData)
        .join((enter) => enter.append("rect"))
        .attr("fill", (d) => handleBarColor(d))
        .attr("title", (d) =>
          handleTooltipTitle(d, indicatorInfo, yValue, xAxisLabel)
        )
        .attr("id", (d) => `graph-bar`)
        .attr("x", (d, i) => x(i))
        .attr("y", y(0))
        .transition()
        .duration(80)
        .ease(d3.easeLinear)
        .delay((d, i) => i * 70)
        .attr("y", (d) => handleBarY(d))
        .attr("height", (d) => barHeight(d))
        .attr("width", x.bandwidth());

      svg.append("g").call(xAxis);

      svg.append("g").call(yAxis);

      return setGraphRendered(true);
    },
    [
      yValue,
      xAxisLabel,
      indicatorInfo,
      graphData,
      height,
      width,
      graphDataValues,
      meanValue,
      id,
      indicatorUnit,
    ]
  );

  // Render Graph
  useEffect(() => {
    const svgNode = svgRef.current;
    setGraphRendered(false);
    return renderGraph(svgNode);
  }, [orderData, renderGraph]);

  // Bar Tooltips
  useEffect(() => {
    if (graphRendered) {
      const bars = Array.from(document.querySelectorAll(`[id="graph-bar"]`));
      console.log(bars);
      bars.map((tooltip) => {
        return new Tooltip(tooltip, {
          trigger: "hover",
          animation: true,
          placement: "top",
          html: true,
          title: tooltip.getAttribute("title"),
        });
      });
    }
  }, [graphRendered, id, graphData]);

  return (
    <svg ref={svgRef} x="0" y="0" style={{ width: "100%", height: "100%" }} />
  );
};

export default BarChart;
