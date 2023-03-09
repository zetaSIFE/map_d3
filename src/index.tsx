import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Map from "./gyeongbuk/Map";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Map>
    <App />
  </Map>
);
