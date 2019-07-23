import React, { useState, useRef, useCallback } from "react";

import ImageCropper from "./ImageCropper";

import styles from "./App.module.scss";
import ImageRenderer from "./ImageRenderer";

const App: React.FC = () => {
  const [aspectRatio, setAspectRatio] = useState(16 / 9);

  const [background, setBackground] = useState<string | undefined>();

  const cropResultChanged = useCallback(newCrop => {
    setBackground(newCrop);
  }, []);

  return (
    <>
      <ImageCropper aspectRatio={aspectRatio} resultChanged={cropResultChanged} />
      <ImageRenderer aspectRatio={aspectRatio} background={background} />
    </>
  );
};

export default App;
