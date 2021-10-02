import { useCallback, useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  BillionStr,
  MillionStr,
  TrillionStr,
} from "../../../../../Constants/keywords";

const BarChart = (props) => {
  const {
    axisLabels,
    indicators,
    graphData,
    dimensions,
    indicatorInfo,
    orderData,
    prevOrderData,
  } = props;

  const { height, width } = dimensions;
  const { xAxisLabel, yValue } = axisLabels;
  const { gdpTotalinUSD, totalPopulation } = indicators;

  const color = "#5902ab";

  const svgRef = useRef(null);

  const renderGraph = useCallback(
    (svgEl) => {
      const svg = d3.select(svgEl);

      const margin = { top: 25, right: 10, bottom: 25, left: 40 };

      const x = d3
        .scaleBand()
        .domain(d3.range(graphData.length))
        .range([margin.left, width - margin.right])
        .padding(0.1);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(graphData, (d) => d[yValue])])
        .nice()
        .range([height - margin.bottom, margin.top]);

      const xAxis = (g) => {
        g.attr("transform", `translate(0,${height - margin.bottom})`).call(
          d3
            .axisBottom(x)
            .tickFormat((d) => graphData[d][xAxisLabel])
            .tickSizeOuter(0)
        );
      };

      const yAxis = (g) => {
        const renderText = () => {
          if (indicatorInfo === gdpTotalinUSD) {
            const unit = graphData[0].maxValue;
            return `unit (${unit})`;
          } else if (indicatorInfo === totalPopulation) {
            const unit = graphData[0].maxValue
              ? graphData[0].maxValue
              : "Million";
            return `unit (${unit})`;
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
              if (
                graphData[0].hasBillionFigure ||
                graphData[0].hasMillionFigure ||
                graphData[0].hasFigureLessThanMillion
              ) {
                return "($.1f";
              }
              return "($.0f";
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
              .append("text")
              .attr("x", -margin.left)
              .attr("y", 10)
              .attr("fill", "currentColor")
              .attr("text-anchor", "start")
              .text(renderText())
          );
      };

      svg.selectAll("g").transition().duration(50).style("opacity", 0).remove();

      svg
        .append("g")
        .attr("fill", color)
        .selectAll("rect")
        .data(graphData)
        .join((enter) => enter.append("rect"))
        .attr("x", (d, i) => x(i))
        .attr("y", y(0))
        .transition()
        .duration(150)
        .ease(d3.easeLinear)
        .delay((d, i) => i * 100)
        .attr("y", (d) => y(d[yValue]))
        .attr("height", (d) => y(0) - y(d[yValue]))
        .attr("width", x.bandwidth());

      svg.append("g").call(xAxis);

      svg.append("g").call(yAxis);
    },
    [
      yValue,
      xAxisLabel,
      gdpTotalinUSD,
      indicatorInfo,
      totalPopulation,
      graphData,
      height,
      width,
    ]
  );

  useEffect(() => {
    const svgNode = svgRef.current;
    return renderGraph(svgNode);
  }, [graphData, orderData, prevOrderData, renderGraph]);

  return (
    <svg ref={svgRef} x="0" y="0" style={{ width: "100%", height: "100%" }} />
  );
};

export default BarChart;
