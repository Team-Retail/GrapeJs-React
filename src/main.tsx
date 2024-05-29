import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

//@ts-ignore
ReactDOM.createRoot(document.getElementById("root")!).render(<AppWrapper />);