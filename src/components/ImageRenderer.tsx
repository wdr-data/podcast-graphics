import React, { useRef, useState, useLayoutEffect } from "react";
import Button from "@material-ui/core/es/Button";
import moment from "moment-timezone";

import config from "../config.json";

import styles from "./ImageRenderer.module.scss";
import { Mode } from "./App.jsx";

const TARGET_HEIGHT = {
  square: 1400,
  wide: 1080
};

const TILT_IMAGES = Object.keys(config.podcasts).reduce((acc, id) => {
  const square = new Image();
  square.src = require(`../img/tilt/square/${id}.png`);
  const wide = new Image();
  wide.src = require(`../img/tilt/wide/${id}.png`);
  return { [id]: { square, wide }, ...acc };
}, {});

const TITLE_IMAGES = Object.keys(config.podcasts).reduce((acc, id) => {
  const square = new Image();
  square.src = require(`../img/title/square/${id}.png`);
  const wide = new Image();
  wide.src = require(`../img/title/wide/${id}.png`);
  return { [id]: { square, wide }, ...acc };
}, {});

const LOGO_IMAGES = ["guten_morgen"].reduce((acc, cur) => {
  const square = new Image();
  square.src = require(`../img/banner/square/${cur}.png`);
  const wide = new Image();
  wide.src = require(`../img/banner/wide/${cur}.png`);
  return { [cur]: { square, wide }, ...acc };
}, {});



const DEFAULT_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

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
      return resolve(obj);
    }
    obj.onload = () => resolve(obj);
  });
}

interface ImageFilter {
  name: "brightness" | "contrast" | "saturate";
  value: number;
}

interface ImageRendererProps {
  mode: Mode;
  aspectRatio: number;
  background: string | undefined; // dataurl
  podcast: string;
  filters?: ImageFilter[];
}

const ImageRenderer: React.FC<ImageRendererProps> = ({ aspectRatio, mode, background, podcast, filters }) => {
  const canvas = useRef<HTMLCanvasElement>(null);

  const [renderedDataUrl, setRenderedDataUrl] = useState<string>();

  // Draw canvas
  useLayoutEffect(() => {
    const draw = async () => {
      if (!canvas.current) {
        return;
      }

      const img = new Image();
      img.src = background || DEFAULT_PIXEL;

      const ctx = canvas.current.getContext("2d", { alpha: false });
      if (!ctx) {
        return;
      }

      ctx.save();

      ctx.filter = (filters || []).map(filter => `${filter.name}(${filter.value})`).join(" ");

      await waitForLoad(img);
      drawImage(ctx, img);

      ctx.restore();

      ctx.globalAlpha = 0.3;
      await waitForLoad(TILT_IMAGES["guten_morgen"][mode]);
      drawImage(ctx, TILT_IMAGES["guten_morgen"][mode]);

      ctx.globalAlpha = 0.7;
      await waitForLoad(LOGO_IMAGES["guten_morgen"][mode]);
      drawImage(ctx, LOGO_IMAGES["guten_morgen"][mode]);

      ctx.globalAlpha = 1;
      await waitForLoad(TITLE_IMAGES[podcast][mode]);
      drawImage(ctx, TITLE_IMAGES[podcast][mode]);

      setRenderedDataUrl(canvas.current.toDataURL("image/jpeg"));
    };

    draw();
  }, [background, podcast, mode, filters]);

  return (
    <>
      <canvas
        className={styles.canvas}
        ref={canvas}
        height={TARGET_HEIGHT[mode]}
        width={TARGET_HEIGHT[mode] * aspectRatio}
      />
      <a
        className={styles.download}
        download={`${podcast}_${moment()
          .tz("Europe/Berlin")
          .format("YYYY-MM-DD")}_${mode}.jpeg`}
        href={renderedDataUrl}
      >
        <Button variant="contained" color="primary">
          Download
        </Button>
      </a>
    </>
  );
};

export default ImageRenderer;
