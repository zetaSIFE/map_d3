import * as React from "react";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";

import gbmap from "../mapData/gbmap_topo.json";

const featureData = feature(gbmap, gbmap.objects["gbmap"]);
// topojson-client는 topoJSON 파일을 D3에서 사용할 수 있게 바꿔주는 라이브러리라고 하네요??
// 그리고 저는 위에 'korea-topo' 라는 이름으로 접근했는데
// 만드신 topoJSON 파일을 열어서 'objects'라고 검색하셔서 객체로 안에 프로퍼티 이름을 적어주시면 된답니다.

export default function GyengBuk() {
  // svg를 그릴 엘리먼트 설정을 위한 ref
  const chart = useRef(null);

  const printD3 = () => {
    const width = 700; //지도의 넓이
    const height = 700; //지도의 높이
    const initialScale = 5400; //확대시킬 값
    const initialX = -11900; //초기 위치값 X
    const initialY = 4050; //초기 위치값 Y

    const projection = d3
      .geoMercator()
      .scale(initialScale)
      .translate([initialX, initialY]);

    const path = d3.geoPath().projection(projection);

    const svg = d3
      .select(chart.current)
      .append("svg")
      .attr("width", width + "px")
      .attr("height", height + "px");

    const states = svg.append("g").attr("id", "states");

    states
      .append("rect")
      .attr("class", "background")
      .attr("width", width + "px")
      .attr("height", height + "px");

    states
      .selectAll("path") //지역 설정
      .data(featureData.features)
      .enter()
      .append("path")
      .attr("d", path);
  };

  useEffect(() => {
    printD3();
  }, []);

  return <div ref={chart}></div>;
}
