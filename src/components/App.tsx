import React, { useState, useRef, useCallback } from "react";
import Select from "@material-ui/core/es/Select";
import MenuItem from "@material-ui/core/es/MenuItem";

import ImageCropper from "./ImageCropper";
import ImageRenderer from "./ImageRenderer";
import { useFormField } from "../hooks/form";

import config from "../config.json";

import styles from "./App.module.scss";

export type Mode = "square" | "wide";

const App: React.FC = () => {
  const [aspectRatio, aspectRatioChanged] = useFormField("square");
  const [podcast, podcastChanged] = useFormField("thadeusz");
  const [background, setBackground] = useState<string | undefined>();

  const cropResultChanged = useCallback(newCrop => {
    setBackground(newCrop);
  }, []);

  return (
    <>
      <Select value={podcast} onChange={podcastChanged}>
        {config.podcasts.map(pod => (
          <MenuItem value={pod.id}>{pod.name}</MenuItem>
        ))}
      </Select>
      <Select
        value={aspectRatio}
        onChange={ev => {
          setBackground(undefined);
          return aspectRatioChanged(ev);
        }}
      >
        <MenuItem value="square">Quadratisch</MenuItem>
        <MenuItem value="wide">16 : 9</MenuItem>
      </Select>
      <ImageCropper aspectRatio={aspectRatio === "square" ? 1 : 16 / 9} resultChanged={cropResultChanged} />
      <ImageRenderer
        mode={aspectRatio as Mode}
        aspectRatio={aspectRatio === "square" ? 1 : 16 / 9}
        background={background}
        podcast={podcast}
      />
    </>
  );
};

export default App;
