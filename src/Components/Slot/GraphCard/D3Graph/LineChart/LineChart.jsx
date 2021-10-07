import { useCallback, useEffect, useRef } from "react";
import * as d3 from "d3";

import {
  BillionStr,
  MillionStr,
  TrillionStr,
} from "../../../../../Constants/keywords";

const LineChart = (props) => {
  const {
    axisLabels,
    graphData,
    dimensions,
    orderData,
    indicatorInfo,
    indicators,
  } = props;

  const { height, width } = dimensions;
  const { xAxisLabel, yValue } = axisLabels;
  const { gdpTotalinUSD, totalPopulation } = indicators;

  const color = "#5902ab";

  const svgRef = useRef(null);

  const renderGraph = useCallback(
    (svgEl) => {
      const svg = d3
        .select(svgEl)
        .attr("fill", "none")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round");

      //   const margin = { top: 25, right: 10, bottom: 25, left: 43 };
      const margin = { top: 20, right: 30, bottom: 30, left: 40 };

      const xAxisLabelFormat = (i) => {
        const tickLabel = graphData[i][xAxisLabel];
        const parsedInt = parseInt(graphData[i][xAxisLabel]);

        if (i === 0) {
          return tickLabel;
        } else if (parsedInt < 2000) {
          const tickStr = tickLabel.split("");
          tickStr.splice(0, 2, " '' ");

          return tickStr.join("");
        } else if (parsedInt === 2000) {
          return tickLabel;
        }

        const tickStr = tickLabel.split("");
        tickStr.splice(0, 2, ' "" ');

        return tickStr.join("");
      };

      const graphDataValues = graphData.filter(
        (data) => typeof data.value === "number"
      );

      const x = d3
        .scaleUtc()
        .domain(
          d3.extent(graphData, (d) => new Date(d[xAxisLabel]).getUTCFullYear())
        )
        .range([margin.left, width - margin.right]);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(graphDataValues, (d) => d[yValue])])
        .nice()
        .range([height - margin.bottom, margin.top]);

      const line = d3
        .line()
        .defined((d) => !isNaN(d.value))
        .x((d) => x(new Date(d[xAxisLabel]).getUTCFullYear()))
        .y((d) => y(d[yValue]));

      const xAxis = (g) => {
        return g
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .call(
            d3
              .axisBottom(x)
              .ticks(graphData.length - 1)
              .tickFormat((d, i) => xAxisLabelFormat(i))
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

        const renderTickText = (label) => {
          if (indicatorInfo === gdpTotalinUSD) {
            const largestFigure = graphData[0].maxValue;

            const prefix = () => {
              switch (largestFigure) {
                case TrillionStr:
                  return "T";
                case BillionStr:
                  return "B";

                case MillionStr:
                  return "M";

                default:
                  break;
              }
            };

            const formatSpecifier = () => {
              const has3digits = graphData.find((record) => record.value >= 95);
              if (has3digits) {
                return "($.0f";
              }
              return "($.1f";
            };

            return d3
              .formatLocale({ currency: ["$", prefix()] })
              .format([formatSpecifier()]);
          }

          if (indicatorInfo === totalPopulation) {
            const unit = graphData[0].maxValue;

            const specifier = () => {
              if (graphData[0].hasMillionFigure) {
                return "($.1f";
              }
              return "($.0f";
            };

            if (unit) {
              return d3
                .formatLocale({ currency: ["", "B"] })
                .format([specifier()]);
            }
            return d3.format(["(.1s"]);
          }
        };

        return g
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y).ticks().tickFormat(renderTickText()))
          .call((g) => g.select(".domain").remove())
          .call((g) =>
            g
              .select(".tick:last-of-type text")
              .clone()
              .attr("x", 3)
              .attr("y", -10)
              .attr("text-anchor", "start")
              .attr("font-weight", "bold")
              .text(renderText())
          );
      };

      svg.selectAll("g").transition().duration(50).style("opacity", 0).remove();
      svg
        .selectAll("path")
        .transition()
        .duration(50)
        .style("opacity", 0)
        .remove();

      svg.append("g").call(xAxis);

      svg.append("g").call(yAxis);

      svg
        .append("path")
        .datum(graphData.filter(line.defined()))
        .attr("stroke", "#ccc")
        .attr("stroke-width", 1.5)
        .attr("d", line);

      return svg
        .append("path")
        .datum(graphData)
        .attr("stroke", color)
        .attr("stroke-width", 1.5)
        .attr("d", line);
    },
    [
      yValue,
      graphData,
      height,
      width,
      xAxisLabel,
      gdpTotalinUSD,
      indicatorInfo,
      totalPopulation,
    ]
  );

  useEffect(() => {
    const svgNode = svgRef.current;
    return renderGraph(svgNode);
  }, [orderData, renderGraph]);

  return (
    <svg ref={svgRef} x="0" y="0" style={{ width: "100%", height: "100%" }} />
  );
};

export default LineChart;
