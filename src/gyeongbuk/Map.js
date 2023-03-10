import { Map as OlMap } from "ol";
import Stamen from "ol/source/Stamen.js";
import View from "ol/View.js";
import { Layer, Tile as TileLayer } from "ol/layer.js";
import { fromLonLat, toLonLat, get as getProjection } from "ol/proj.js";
import { getCenter, getWidth } from "ol/extent.js";
import { feature } from "topojson-client";
import gbmap from "../mapData/gbmap_topo.json";
import * as d3 from "d3";
import { useEffect, useState } from "react";
import MapContext from "./MapContext";
import { OSM } from "ol/source";
import { defaults as defaultControls } from "ol/control";

const featureData = feature(gbmap, gbmap.objects.gbmap);

class CanvasLayer extends Layer {
  constructor(options) {
    super(options);

    this.features = options.features;

    this.svg = d3
      .select(document.createElement("div"))
      .append("svg")
      .style("position", "absolute");

    this.svg.append("g").attr("id", "states");

    this.svg
      .select("g")
      .selectAll("path")
      .data(featureData.features)
      .enter()
      .append("path");
  }

  getSourceState() {
    return "ready";
  }

  render(frameState) {
    const width = frameState.size[0];
    const height = frameState.size[1];
    const projection = frameState.viewState.projection;
    const d3Projection = d3.geoMercator().scale(1).translate([0, 0]);
    let d3Path = d3.geoPath().projection(d3Projection);

    const pixelBounds = d3Path.bounds(this.features);
    const pixelBoundsWidth = pixelBounds[1][0] - pixelBounds[0][0];
    const pixelBoundsHeight = pixelBounds[1][1] - pixelBounds[0][1];

    const geoBounds = d3.geoBounds(this.features);
    const geoBoundsLeftBottom = fromLonLat(geoBounds[0], projection);
    const geoBoundsRightTop = fromLonLat(geoBounds[1], projection);
    let geoBoundsWidth = geoBoundsRightTop[0] - geoBoundsLeftBottom[0];
    if (geoBoundsWidth < 0) {
      geoBoundsWidth += getWidth(projection.getExtent());
    }
    const geoBoundsHeight = geoBoundsRightTop[1] - geoBoundsLeftBottom[1];

    const widthResolution = geoBoundsWidth / pixelBoundsWidth;
    const heightResolution = geoBoundsHeight / pixelBoundsHeight;
    const r = Math.max(widthResolution, heightResolution);
    const scale = r / frameState.viewState.resolution;

    const center = toLonLat(getCenter(frameState.extent), projection);
    const angle = (-frameState.viewState.rotation * 180) / Math.PI;

    d3Projection
      .scale(scale)
      .center(center)
      .translate([width / 2, height / 2])
      .angle(angle);

    d3Path = d3Path.projection(d3Projection);
    d3Path(this.features);

    this.svg.attr("width", width);
    this.svg.attr("height", height);

    this.svg.selectAll("path").attr("d", d3Path);

    return this.svg.node();
  }
}

const Map = ({ children }) => {
  const [mapObj, setMapObj] = useState({});

  useEffect(() => {
    const map = new OlMap({
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

    const layer = new CanvasLayer({
      features: featureData,
    });
    map.addLayer(layer);
    setMapObj({ map });
    return () => map.setTarget(undefined);
  }, []);

  // MapContext.Provider 에 객체 저장
  return <MapContext.Provider value={mapObj}>{children}</MapContext.Provider>;
};

export default Map;
