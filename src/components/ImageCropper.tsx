import React, { useCallback, useState, useRef } from "react";
import ReactCropper from "react-cropper";

import "cropperjs/dist/cropper.css";

interface ImageCropperProps {
  aspectRatio: number;
  resultChanged: any;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ aspectRatio, resultChanged }) => {
  const cropper = useRef<ReactCropper | null>(null);
  const [source, setSource] = useState<string | undefined>();

  const fileUploaded = useCallback((e: any) => {
    {
      e.preventDefault();
      let files;
      if (e.dataTransfer) {
        files = e.dataTransfer.files;
      } else if (e.target) {
        files = e.target.files;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setSource(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  }, []);

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
        <input type="file" onChange={fileUploaded} />
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
