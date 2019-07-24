import React, { useState, useCallback, useRef } from "react";
import Select from "@material-ui/core/es/Select";
import MenuItem from "@material-ui/core/es/MenuItem";
import Button from "@material-ui/core/es/Button";
import TextField from "@material-ui/core/es/TextField";
import _ from "lodash-es";

import ImageDropper, { UploadConsumer } from "./ImageDropper";
import ImageCropper from "./ImageCropper";
import ImageRenderer from "./ImageRenderer";
import { useFormField } from "../hooks/form";

import config from "../config.json";

import styles from "./App.module.scss";

export type Mode = "square" | "wide";

const App: React.FC = () => {
  const [aspectRatio, aspectRatioChanged] = useFormField("square");
  const [podcast, podcastChanged] = useFormField("thadeusz");
  const [podcastText, setPodcastText] = useState<string | undefined>("zu Gast (Vorname Nachname)");
  const podcastTextField = useRef<HTMLInputElement>(null);

  const [source, setSource] = useState<string | undefined>();
  const [background, setBackground] = useState<string | undefined>();

  const cropResultChanged = useCallback(newCrop => {
    setBackground(newCrop);
  }, []);
  const applyPodcastText = useCallback(() => {
    console.log("vor");
    podcastTextField.current && console.log(podcastTextField.current.value);
    setPodcastText(podcastTextField.current!.value);
  }, []);

  return (
    <ImageDropper setSource={setSource}>
      <Select value={podcast} onChange={podcastChanged}>
        {_.toPairs(config.podcasts).map(([id, pod]) => (
          <MenuItem value={id} key={id}>
            {pod.name}
          </MenuItem>
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
      {config.podcasts[podcast].hasTitle && (
        <>
          <TextField
            inputRef={podcastTextField}
            label="Name der Folge"
            defaultValue={podcastText}
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={applyPodcastText}>
            Anwenden
          </Button>
        </>
      )}
      <UploadConsumer>
        {props => (
          <Button variant="contained" color="primary" onClick={props.open}>
            Upload
          </Button>
        )}
      </UploadConsumer>
      <ImageCropper
        source={source}
        aspectRatio={aspectRatio === "square" ? 1 : 16 / 9}
        resultChanged={cropResultChanged}
      />
      <ImageRenderer
        mode={aspectRatio as Mode}
        aspectRatio={aspectRatio === "square" ? 1 : 16 / 9}
        background={background}
        podcast={podcast}
        text={config.podcasts[podcast].hasTitle && podcastText}
      />
    </ImageDropper>
  );
};

export default App;
