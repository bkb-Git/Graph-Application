import { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Tooltip } from "bootstrap";
import {
  BillionStr,
  Indicator,
  MillionStr,
  TrillionStr,
} from "../../../../../Constants/keywords";

const BarChart = (props) => {
  const {
    axisLabels,
    indicators,
    graphData,
    id,
    dimensions,
    indicatorInfo,
    orderData,
  } = props;

  const { height, width } = dimensions;
  const { xAxisLabel, yValue } = axisLabels;
  const { gdpTotalinUSD, totalPopulation } = indicators;

  const [graphRendered, setGraphRendered] = useState(false);

  const color = "#5902ab";

  const svgRef = useRef(null);

  const renderGraph = useCallback(
    (svgEl) => {
      const svg = d3.select(svgEl);

      const margin = { top: 25, right: 10, bottom: 25, left: 43 };
      const meanValue = d3.mean(graphData, (d) => d.value);

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

      const barHeight = (d) => {
        if (d[yValue] === 0) {
          return y(0) - y(meanValue);
        }
        return y(0) - y(d[yValue]);
      };

      const handleBarY = (d) => {
        if (d[yValue] === 0) {
          return y(meanValue);
        }
        return y(d[yValue]);
      };

      const handleBarColor = (d) => {
        if (d[yValue] > 0) {
          return color;
        }
        return "#4F4F4F";
      };

      const handleTitle = (d) => {
        const suffix = () => {
          if (indicatorInfo === gdpTotalinUSD) {
            switch (d.maxValue) {
              case TrillionStr:
                return TrillionStr;
              case BillionStr:
                return BillionStr;
              case MillionStr:
                return MillionStr;
              default:
                return null;
            }
          } else if (indicatorInfo === totalPopulation) {
            switch (d.maxValue) {
              case BillionStr:
                return BillionStr;
              case MillionStr:
                return MillionStr;
              default:
                return null;
            }
          }
          return null;
        };
        const renderValue = () => {
          if (indicatorInfo === gdpTotalinUSD) {
            if (d[yValue] === 0) {
              return "No Data";
            }
            return `$${d3.format([".1f"])(d[yValue])} ${suffix()}`;
          } else if (indicatorInfo === totalPopulation) {
            if (d[yValue] === 0) {
              return "No Data";
            }
            return ` ${d3.format([".1s"])(d[yValue])}`;
          }
        };
        return `<h5>Year: ${d[xAxisLabel]}</h5>
                <p>Value: ${renderValue()}</p>`;
      };

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
        return g
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .call(
            d3
              .axisBottom(x)
              .tickFormat((i) => xAxisLabelFormat(i))
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
        .attr("title", (d) => handleTitle(d))
        .attr("id", (d) => "graph-bar")
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
      gdpTotalinUSD,
      indicatorInfo,
      totalPopulation,
      graphData,
      height,
      width,
      id,
    ]
  );

  useEffect(() => {
    const svgNode = svgRef.current;
    return renderGraph(svgNode);
  }, [orderData, renderGraph]);

  useEffect(() => {
    if (graphRendered) {
      const bars = Array.from(document.querySelectorAll('[id="graph-bar"]'));

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
