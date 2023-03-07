import { useContext } from "react";
import "./App.css";
import GyengBuk from "./gyeongbuk/GyengBuk";
import MapContext from "./gyeongbuk/MapContext"

function App() {

   // 컨텍스트에 저장되어있는 객체를 가져옴
   const { map } = useContext(MapContext);
 
   const handleZoomInClick = () => {
       map.getView().setZoom(map.getView().getZoom() + 1);
   };

   const handleZoomOutClick = () => {
       map.getView().setZoom(map.getView().getZoom() - 1);
   };

  return (
    <>
      {/* <div>Hello</div> */}
      <GyengBuk />
      <button onClick={handleZoomInClick}>zoomIn</button>
      <button onClick={handleZoomOutClick}>zoomOut</button>
      <div id="map" style={{ width: '100%', height: 400 }}></div>
    </>
  );
}

export default App;
