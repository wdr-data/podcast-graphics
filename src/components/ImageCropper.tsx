import React, { useCallback, useRef } from "react";
import ReactCropper from "react-cropper";

import "cropperjs/dist/cropper.css";

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
    <div>
      <div style={{ width: "100%" }}>
        <ReactCropper
          style={{ height: 400, width: "100%" }}
          aspectRatio={aspectRatio}
          preview=".img-preview"
          guides={false}
          src={source}
          ref={crp => (cropper.current = crp)}
        />
        <button onClick={crop} style={{ float: "right" }}>
          Crop Image
        </button>
      </div>
    </div>
  );
};

export default ImageCropper;
