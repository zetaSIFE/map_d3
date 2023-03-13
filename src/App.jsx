import { useContext, useRef, useState } from "react";
import "./App.css";
import MapContext from "./gyeongbuk/MapContext";
import Map from "./gyeongbuk/Vector";

function App() {
  // 컨텍스트에 저장되어있는 객체를 가져옴
  const { map } = useContext(MapContext);
  const [city, setCity] = useState('');
  const mousePosition = useRef([0 ,0])
  const [mouseHover, setMouseHover] = useState(false);

  const handleZoomInClick = () => {
    map.getView().setZoom(map.getView().getZoom() + 1);
  };

  const handleZoomOutClick = () => {
    map.getView().setZoom(map.getView().getZoom() - 1);
  };

  return (
    <>
    <Map style={{ position: "relative" }} setCity={setCity} mousePosition={mousePosition} setMouseHover={setMouseHover} >
      {mouseHover ? <table id="tooltip" style={{ width: "200px", height: "70px", backgroundColor: "#eee", position: "absolute", zIndex: 100, top: mousePosition.current[1] + "px", left: mousePosition.current[0] + "px", borderRadius: "10%" }}>
          <tr>
            <th>시군구명</th>
            <th>{city}</th>
          </tr>
          <tr>
            <td>지연증가율</td>
            <td>0</td>
          </tr>
      </table> : <div></div>}
      
      <button onClick={handleZoomInClick}>zoomIn</button>
      <button onClick={handleZoomOutClick}>zoomOut</button>
      <div id="map" style={{ width: "100%", height: 1000 }}></div>
    </Map>
    </>
  );
}

export default App;
