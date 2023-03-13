import { Map as OlMap, MapEvent } from "ol";
import View from "ol/View.js";
import { Layer, Tile as TileLayer, Vector } from "ol/layer.js";
import { fromLonLat, toLonLat, get as getProjection } from "ol/proj.js";
import { useEffect, useRef, useState } from "react";
import MapContext from "./MapContext";
import { OSM } from "ol/source";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import TopoJSON from 'ol/format/TopoJSON';
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Select from "ol/interaction/Select";
import {pointerMove} from "ol/events/condition";

const style = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.6)',
  }),
  stroke: new Stroke({
    color: 'black',
    width: 1,
  }),
});

const vectorLayer = new VectorLayer({
  source: new VectorSource({
      format: new TopoJSON(),
      url: 'data/gbmap_topo.json',
    }),
    style: style
});

const Map = ({ children, setCity, setMouseHover, mousePosition }) => {
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
        zoom: 7,
      }),
    });

    const test = new Select({
      condition: pointerMove,
      style: new Style({
        stroke: new Stroke({
            color: 'white',
            width: 2
        }),
        fill: new Fill({
            color: 'rgba(0,0,255,0.6)'
        }),
      })
    })

    const mousemove = (event) => {
      console.log("pageX: ",event.pageX, 
      "pageY: ", event.pageY, 
      "clientX: ", event.clientX, 
      "clientY:", event.clientY)

      mousePosition.current[0] = event.clientX;
      mousePosition.current[1] = event.clientY;
    }

    test.getFeatures().on("add", function(e){
      setCity(e.element.values_.SIG_KOR_NM);    
      setMouseHover(true);
      window.addEventListener('mousemove', mousemove);
    })

    test.getFeatures().on("remove", function(e){
      setMouseHover(false);
      window.removeEventListener('mousemove', mousemove);
    })

    map.addInteraction(test)
    map.addLayer(vectorLayer);
    setMapObj({ map });

    return () => map.setTarget(undefined);
  }, []);

  // MapContext.Provider 에 객체 저장
  return <MapContext.Provider value={mapObj}>{children}</MapContext.Provider>;
};

export default Map;
