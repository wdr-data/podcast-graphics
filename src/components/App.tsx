import React, { useState, useCallback, useRef } from "react";
import AppBar from "@material-ui/core/es/AppBar";
import Toolbar from "@material-ui/core/es/Toolbar";
import FormControl from "@material-ui/core/es/FormControl";
import InputLabel from "@material-ui/core/es/InputLabel";
import Select from "@material-ui/core/es/Select";
import MenuItem from "@material-ui/core/es/MenuItem";
import Button from "@material-ui/core/es/Button";
import TextField from "@material-ui/core/es/TextField";
import Container from "@material-ui/core/es/Container";
import Paper from "@material-ui/core/es/Paper";
import Typography from "@material-ui/core/es/Typography";
import Grid from "@material-ui/core/es/Grid";
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
      <AppBar position="static" className={styles.appbar}>
        <Toolbar className={styles.toolbar}>
          <Typography variant="h5" component="h1">
            WDR Podracer
          </Typography>

          <UploadConsumer>
            {props => (
              <Button variant="contained" color="secondary" onClick={props.open}>
                Bild auswählen
              </Button>
            )}
          </UploadConsumer>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={7}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Paper className={styles.paper}>
                  <Typography variant="h5">Allgemeine Einstellungen</Typography>
                  <br />
                  <FormControl fullWidth>
                    <InputLabel>Podcast</InputLabel>
                    <Select value={podcast} onChange={podcastChanged}>
                      {_.toPairs(config.podcasts).map(([id, pod]) => (
                        <MenuItem value={id} key={id}>
                          {pod.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <br />
                  <br />
                  <FormControl fullWidth>
                    <InputLabel>Bildformat</InputLabel>
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
                  </FormControl>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper className={styles.paper}>
                  <Typography variant="h5">Podcast-Einstellungen</Typography>
                  {config.podcasts[podcast].hasTitle && (
                    <>
                      <TextField
                        fullWidth
                        inputRef={podcastTextField}
                        label="Name der Folge"
                        defaultValue={podcastText}
                        margin="normal"
                      />
                      <Button variant="contained" color="primary" onClick={applyPodcastText}>
                        Anwenden
                      </Button>
                      <br />
                    </>
                  )}
                </Paper>
              </Grid>
            </Grid>

            <Paper className={styles.paper}>
              <Typography variant="h5">Bild zuschneiden</Typography>
              {source ? (
                <>
                  <br />
                  <ImageCropper
                    source={source}
                    aspectRatio={aspectRatio === "square" ? 1 : 16 / 9}
                    resultChanged={cropResultChanged}
                  />
                </>
              ) : (
                <div className={styles.dragndropcalltoaction}>
                  <p>Bild hier hin ziehen um zu beginnen</p>
                </div>
              )}
            </Paper>
          </Grid>
          <Grid item xs={5}>
            <Paper className={styles.paper}>
              <ImageRenderer
                mode={aspectRatio as Mode}
                aspectRatio={aspectRatio === "square" ? 1 : 16 / 9}
                background={background}
                podcast={podcast}
                text={config.podcasts[podcast].hasTitle && podcastText}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ImageDropper>
  );
};

export default App;
