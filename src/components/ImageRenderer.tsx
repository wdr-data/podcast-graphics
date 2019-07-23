import React, { useRef, useEffect, useState } from "react";
import Button from "@material-ui/core/es/Button";

import config from "../config.json";

import styles from "./ImageRenderer.module.scss";
import { Mode } from "./App.jsx";

const TARGET_HEIGHT = 2160;

const TITLE_IMAGES = config.podcasts.reduce((acc, cur) => {
  const square = new Image();
  square.src = require(`../img/title/square/${cur.id}.png`);
  const wide = new Image();
  wide.src = require(`../img/title/wide/${cur.id}.png`);
  return { [cur.id]: { square, wide }, ...acc };
}, {});

const LOGO_IMAGES = ["wdr2_podcast"].reduce((acc, cur) => {
  const square = new Image();
  square.src = require(`../img/logo/square/${cur}.png`);
  const wide = new Image();
  wide.src = require(`../img/logo/wide/${cur}.png`);
  return { [cur]: { square, wide }, ...acc };
}, {});

const drawImage = (ctx: CanvasRenderingContext2D, img: CanvasImageSource) => {
  ctx.drawImage(
    img,
    0,
    0,
    img.width as number,
    img.height as number, // source rectangle
    0,
    0,
    ctx.canvas.width,
    ctx.canvas.height // destination rectangle
  );
};

interface ImageRendererProps {
  mode: Mode;
  aspectRatio: number;
  background: string | undefined; // dataurl
  podcast: string;
}

const ImageRenderer: React.FC<ImageRendererProps> = ({ aspectRatio, mode, background, podcast }) => {
  const canvas = useRef<HTMLCanvasElement>(null);

  const [renderedDataUrl, setRenderedDataUrl] = useState<string>();

  // Draw canvas
  useEffect(() => {
    console.log(`Drawing canvas`);

    if (!canvas.current || !background) {
      return;
    }

    const img = new Image();
    img.src = background;

    img.onload = () => {
      if (!canvas.current || !background) {
        return;
      }

      const ctx = canvas.current.getContext("2d");
      if (!ctx) {
        return;
      }

      drawImage(ctx, img);
      drawImage(ctx, TITLE_IMAGES[podcast][mode]);
      drawImage(ctx, LOGO_IMAGES["wdr2_podcast"][mode]);

      setRenderedDataUrl(canvas.current.toDataURL("image/jpeg"));
    };

    return () => {};
  }, [background, podcast, mode]);

  return (
    <>
      {background && (
        <>
          <canvas className={styles.canvas} ref={canvas} height={TARGET_HEIGHT} width={TARGET_HEIGHT * aspectRatio} />
          <a download="som.jpg" href={renderedDataUrl}>
            <Button variant="contained" color="primary">
              Download
            </Button>
          </a>
        </>
      )}
    </>
  );
};

export default ImageRenderer;
