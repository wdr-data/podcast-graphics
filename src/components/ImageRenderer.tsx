import React, { useRef, useEffect, useState } from "react";
import Button from "@material-ui/core/es/Button";

import styles from "./ImageRenderer.module.scss";

const TARGET_HEIGHT = 2160;

interface ImageRendererProps {
  aspectRatio: number;
  background: string | undefined; // dataurl
}

const ImageRenderer: React.FC<ImageRendererProps> = ({ aspectRatio, background }) => {
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
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height, // source rectangle
        0,
        0,
        canvas.current.width,
        canvas.current.height // destination rectangle
      );
      setRenderedDataUrl(canvas.current.toDataURL("image/jpeg"));
    };

    return () => {};
  }, [background]);

  return (
    <>
      <canvas className={styles.canvas} ref={canvas} height={TARGET_HEIGHT} width={TARGET_HEIGHT * aspectRatio} />
      <a download="som.jpg" href={renderedDataUrl}>
        <Button>Download</Button>
      </a>
    </>
  );
};

export default ImageRenderer;
