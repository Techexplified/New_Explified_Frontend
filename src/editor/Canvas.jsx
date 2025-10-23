import { Excalidraw, MainMenu, WelcomeScreen, exportToSvg } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { useRef } from "react";
 
export default function Canvas() {
  const excalidrawRef = useRef(null);


  const handleExport = () => {
    const api = excalidrawRef.current;
    if (api) {
      const svg = exportToSvg({ elements: api.getSceneElements(), appState: api.getAppState() });
   
    }
  };
 
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
 <Excalidraw
  ref={excalidrawRef}
  theme="light"
  UIOptions={{
    canvasActions: {
      export: {
        saveFileToDisk: true,   // controls export button inside UI
        exportBackground: true,
        exportWithDarkMode: false,
      },
      // other canvas actions ...
      saveToActiveFile: true,
      loadScene: true,
      changeViewBackgroundColor: true,
    },
  }}
/>
    </div>
  );
}
