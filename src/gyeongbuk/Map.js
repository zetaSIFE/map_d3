import React, { useState, useEffect } from "react";
import MapContext from "./MapContext";
import "ol/ol.css";
import { Map as OlMap, View } from "ol";
import { defaults as defaultControls } from "ol/control";
import { fromLonLat, get as getProjection } from "ol/proj";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import * as d3 from "d3";
import { feature } from "topojson-client";
import TopoJSON from "ol/format/TopoJSON.js";

import gbmap from "../assets/gbmap_topo.json";
const featureData = feature(gbmap, gbmap.objects["gbmap"]);

function GyengBuk() {
  // svg를 그릴 엘리먼트 설정을 위한 ref

  // 지도 svg의 너비와 높이
  const width = 500;
  const height = 500;

  // 메르카토르 투영법 설정
  // 우리가 가장 많이 쓰는 도법으로 구형인 지구를 평면으로 표현하는 하나의 방법이라고 하네요??
  const projection = d3.geoMercator().scale(1).translate([0, 0]);
  const path = d3.geoPath().projection(projection);
  const bounds = path.bounds(featureData);

  // svg의 크기에 따른 지도의 크기와 위치값을 설정합니다.
  const dx = bounds[1][0] - bounds[0][0];
  const dy = bounds[1][1] - bounds[0][1];
  const x = (bounds[0][0] + bounds[1][0]) / 2;
  const y = (bounds[0][1] + bounds[1][1]) / 2;
  const scale = 0.9 / Math.max(dx / width, dy / height);
  const translate = [width / 2 - scale * x, height / 2 - scale * y];

  projection.scale(scale).translate(translate);

  // svg를 만들고
  const svg = d3
    .select(document.createElement("div"))
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const mapLayer = svg.append("g");

  // topoJSON의 데이터를 그려줍니다.
  mapLayer
    .selectAll("path")
    .data(featureData.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill", "#666");

  return svg.node();
}

const Map = ({ children }) => {
  const [mapObj, setMapObj] = useState({});

  useEffect(() => {
    // Map 객체 생성 및 OSM 배경지도 추가
    const map = new OlMap({
      controls: defaultControls({ zoom: false, rotate: false }).extend([]),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: "map", // 하위 요소 중 id 가 map 인 element가 있어야함.
      view: new View({
        projection: getProjection("EPSG:3857"),
        center: fromLonLat(
          [127.9745613, 37.3236563],
          getProjection("EPSG:3857")
        ),
        zoom: 5,
      }),
    });

    d3.json("../assets/gbmap_topo.json", function (us) {
      const layer = new GyengBuk({
        features: TopoJSON.feature(us, us.objects.counties),
      });

      map.addLayer(layer);
    });
    setMapObj({ map });
    return () => map.setTarget(undefined);
  }, []);

  // MapContext.Provider 에 객체 저장
  return <MapContext.Provider value={mapObj}>{children}</MapContext.Provider>;
};

export default Map;
