import { UploadIcon } from "lucide-react";
import { useCallback } from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
interface DragAndDropAreaProps {
  onImageUpload: (file: File) => void;
}

const DragAndDropArea: React.FC<DragAndDropAreaProps> = ({ onImageUpload }) => {
  const onDrop = useCallback(
    (
      acceptedFiles: File[],
      fileRejections: FileRejection[],
      event: DropEvent
    ) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onImageUpload(acceptedFiles[0]);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "image/gif": [],
      "image/svg+xml": [],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex items-center justify-center w-full lg:w-[80%] mx-auto h-48 sm:h-56 lg:h-64 p-6 border-2 border-dashed rounded-lg border-primary bg-muted transition-colors ${
        isDragActive ? "bg-primary/10" : "hover:bg-muted/80"
      } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer`}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <UploadIcon className="w-12 h-12 mx-auto text-primary" />
        <p className="mt-4 text-sm sm:text-base lg:text-lg text-muted-foreground">
          {isDragActive
            ? "Drop the image here"
            : "Drag and drop your image here"}
        </p>
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
          or click to select a file
        </p>
      </div>
    </div>
  );
};

export default DragAndDropArea;
