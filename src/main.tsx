import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster, } from 'sonner';
import App from "./App.tsx";
import "./index.css";


const AppWrapper = () => (
  <BrowserRouter>
    <Toaster />
    <App />
  </BrowserRouter>
);

//@ts-ignore
ReactDOM.createRoot(document.getElementById("root")!).render(<AppWrapper />);