import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { GitHubDark, Google } from "developer-icons";
import { useEffect, useState } from "react";

export default function DrawExcalidraw() {
  document.title = "9ralibre | Paint"
  const [elements, setElements] = useState(() => {
    const savedDrawing = localStorage.getItem("drawing");
    return savedDrawing ? JSON.parse(savedDrawing) : [];
  });
  useEffect(() => {
    localStorage.setItem("drawing", JSON.stringify(elements));
  }, [elements]);

  if (!elements) {
    return null;
  }

  return (
    <div className="size-full" style={{ height: "590px" }}>
      <Excalidraw
        langCode="fr-FR"
        initialData={{ elements }}
        onChange={(updatedElements) => setElements(updatedElements)}
      >
        <WelcomeScreen />
        <MainMenu>
          <MainMenu.Group title="Excalidraw items">
            <MainMenu.DefaultItems.Socials />
            <MainMenu.DefaultItems.Export />
          </MainMenu.Group>
          <MainMenu.Group title="9ralibre items">
          <MainMenu.ItemLink href="https://google.com">
            <Google size={12}/> Google
          </MainMenu.ItemLink>
          <MainMenu.ItemLink href="https://github.com/Mounir-abaddah">
            <GitHubDark size={12}/> Github
          </MainMenu.ItemLink>
          </MainMenu.Group>
        </MainMenu>
      </Excalidraw>
    </div>
  );
}
