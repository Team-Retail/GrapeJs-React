import React from "react";
import { Route, Routes } from "react-router-dom";
import GrapeJSPage from "./pages/GrapeJSPage.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import Select from "./components/Select.tsx";
import CompanyDetails from "./pages/CompanyDetails.tsx";
import EmailVerification from "./pages/EmailVerification.tsx";
import EditDetails from "./pages/EditDetails.tsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/editor" element={<GrapeJSPage />} />
      <Route path="/company" element={<CompanyDetails />} />
      <Route path="/editDetails" element={<EditDetails />} />
      <Route path="/verify/:token" element={<EmailVerification />} />
    </Routes>
  );
}
