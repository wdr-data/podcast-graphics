import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const UploadContext = React.createContext({ open: () => {} });
const UploadProvider = UploadContext.Provider;
export const UploadConsumer = UploadContext.Consumer;

const dropZoneBugWorkaround = reactDropZoneProps => ({
  ...reactDropZoneProps,
  onClick: () => {
    // do nothing, or conditionally call the original onClick if you want
  }
});

interface ImageDropperProps {
  setSource: any;
}

const ImageDropper: React.FC<ImageDropperProps> = ({ setSource, children }) => {
  const onDrop = useCallback((files: any[]) => {
    {
      const reader = new FileReader();
      reader.onload = () => {
        setSource(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  }, [setSource]);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: false,
    noKeyboard: true
  });
  console.log(open);
  return (
    <div {...dropZoneBugWorkaround(getRootProps({}))}>
      <input {...getInputProps()} />
      <UploadProvider value={{ open }}>{children}</UploadProvider>
    </div>
  );
};

export default ImageDropper;
