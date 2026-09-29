import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext";
import { AmbientBackground } from "./components/AmbientBackground";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AmbientBackground />
    <div className="relative z-10 flex min-h-screen flex-1 flex-col">
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </div>
  </StrictMode>
);
