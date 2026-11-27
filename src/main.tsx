import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setupNativeBackButton } from "@/lib/native-back-button";

setupNativeBackButton();

createRoot(document.getElementById("root")!).render(<App />);
