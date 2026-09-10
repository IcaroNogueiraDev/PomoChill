import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { TimerUi } from "./pages/timer";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TimerUi />
  </StrictMode>,
);
