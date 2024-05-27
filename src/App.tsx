import React from "react";
import { Route, Routes } from "react-router-dom";
import GrapeJSPage from "./pages/GrapeJSPage.tsx";
import AuthPage from "./pages/AuthPage.tsx";

export default function App(){
  return(
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/editor" element={<GrapeJSPage />} />
    </Routes>
  )
}