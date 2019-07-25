import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import Button from "@material-ui/core/es/Button";

import config from "../config.json";

import styles from "./ImageRenderer.module.scss";
import { Mode } from "./App.jsx";

const TARGET_HEIGHT = {
  square: 1400,
  wide: 2160
};

const TITLE_IMAGES = Object.keys(config.podcasts).reduce((acc, id) => {
  const square = new Image();
  square.src = require(`../img/title/square/${id}.png`);
  const wide = new Image();
  wide.src = require(`../img/title/wide/${id}.png`);
  return { [id]: { square, wide }, ...acc };
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

interface OnLoadAble {
  onload: any;
  complete: boolean;
}
function waitForLoad<T extends OnLoadAble>(obj: T): Promise<T> {
  return new Promise(resolve => {
    if (obj.complete) {
      return resolve(obj)
    }
    obj.onload = () => resolve(obj);
  });
}

interface ImageRendererProps {
  mode: Mode;
  aspectRatio: number;
  background: string | undefined; // dataurl
  podcast: string;
  text: string | undefined;
}

const ImageRenderer: React.FC<ImageRendererProps> = ({ aspectRatio, mode, background, podcast, text }) => {
  const canvas = useRef<HTMLCanvasElement>(null);

  const [renderedDataUrl, setRenderedDataUrl] = useState<string>();

  // Draw canvas
  useLayoutEffect(() => {
    const draw = async () => {
      if (!canvas.current) {
        return;
      }

      const img = new Image();
      img.src =
        background ||
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";


      const ctx = canvas.current.getContext("2d", { alpha: false });
      if (!ctx) {
        return;
      }

      await waitForLoad(img);
      console.log("loaded img");

      drawImage(ctx, img);

      await waitForLoad(TITLE_IMAGES[podcast][mode]);
      console.log("loaded title");
      drawImage(ctx, TITLE_IMAGES[podcast][mode]);

      await waitForLoad(LOGO_IMAGES["wdr2_podcast"][mode]);
      console.log("loaded logo");
      drawImage(ctx, LOGO_IMAGES["wdr2_podcast"][mode]);

      if (text) {
        text = text.toUpperCase();
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = "#fff";

        let size;
        switch (mode) {
          case "square":
            size = 75;
            break;
          case "wide":
            size = 100;
        }
        ctx.font = `bold ${size}px sans-serif`;
        let textSize = ctx.measureText(text);
        while (textSize.width > 0.85 * ctx.canvas.height) {
          size -= 5;
          ctx.font = `bold ${size}px sans-serif`;
          textSize = ctx.measureText(text);
        }
        ctx.fillText(
          text,
          ctx.canvas.width / 2,
          ctx.canvas.height * config.podcasts[podcast].offsetTitle,
          ctx.canvas.width
        );

        setRenderedDataUrl(canvas.current.toDataURL("image/jpeg"));
      }

    };

    draw();
  }, [background, podcast, mode, text]);

  return (
    <>
      <canvas
        className={styles.canvas}
        ref={canvas}
        height={TARGET_HEIGHT[mode]}
        width={TARGET_HEIGHT[mode] * aspectRatio}
      />
      <a download="som.jpg" href={renderedDataUrl}>
        <Button variant="contained" color="primary">
          Download
        </Button>
      </a>
    </>
  );
};

export default ImageRenderer;
