import { useTheme } from "@/context/ThemeContext";
import { Excalidraw, WelcomeScreen } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { useEffect, useState } from "react";

export default function DrawExcalidraw() {
  document.title = "9ralibre | Paint"
  const [elements, setElements] = useState(() => {
    const savedDrawing = localStorage.getItem("drawing");
    return savedDrawing ? JSON.parse(savedDrawing) : [];
  });
  const {theme} = useTheme();
  useEffect(() => {
    localStorage.setItem("drawing", JSON.stringify(elements));
  }, [elements]);

  if (!elements) {
    return null;
  }

  return (
    <div className="size-full" style={{ height: "100vh" }}>
      <Excalidraw
        theme={theme === "dark" ? "dark" : "light"}
        langCode="fr-FR"
        initialData={{ elements }}
        onChange={(updatedElements) => setElements(updatedElements)}
      >
        <WelcomeScreen />
      </Excalidraw>
    </div>
  );
}
