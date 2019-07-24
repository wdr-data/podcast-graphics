import React, { useCallback, useRef } from "react";
import ReactCropper from "react-cropper";
import Button from "@material-ui/core/es/Button";

import "cropperjs/dist/cropper.css";
import styles from "./ImageCropper.module.scss";

interface ImageCropperProps {
  source: string | undefined;
  aspectRatio: number;
  resultChanged: any;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ source, aspectRatio, resultChanged }) => {
  const cropper = useRef<ReactCropper | null>(null);

  const crop = useCallback(() => {
    if (!cropper.current) {
      return;
    }
    if (typeof cropper.current.getCroppedCanvas() === "undefined") {
      return;
    }
    resultChanged(cropper.current.getCroppedCanvas().toDataURL());
  }, [cropper, resultChanged]);

  return (
    <div className={styles.wrapper}>
      <ReactCropper
        className={styles.cropper}
        aspectRatio={aspectRatio}
        viewMode={2}
        guides={true}
        src={source}
        ref={crp => (cropper.current = crp)}
      />
      <Button variant="contained" color="primary" onClick={crop}>
        Crop Image
      </Button>
    </div>
  );
};

export default ImageCropper;
