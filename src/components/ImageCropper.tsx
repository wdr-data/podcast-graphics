import React, { useCallback, useRef, useEffect } from "react";
import ReactCropper from "react-cropper";

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
    if (typeof cropper.current.getCroppedCanvas() === "undefined" || cropper.current.getCroppedCanvas() === null) {
      return;
    }
    resultChanged(cropper.current.getCroppedCanvas().toDataURL());
  }, [cropper, resultChanged]);

  useEffect(crop, [aspectRatio, crop]);

  return (
    <div className={styles.wrapper}>
      <ReactCropper
        className={styles.cropper}
        aspectRatio={aspectRatio}
        viewMode={2}
        guides={true}
        cropend={crop}
        ready={crop}
        src={source}
        ref={crp => (cropper.current = crp)}
      />
    </div>
  );
};

export default ImageCropper;
