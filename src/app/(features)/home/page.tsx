"use client";
import React, { useCallback, useState } from "react";
import DragAndDropArea from "./components/drag-and-drop-area";
import Image from "next/image";

const HomePage = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = useCallback((file: Blob) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl lg:max-w-6xl">
        <div className="space-y-8 lg:space-y-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Upload Images
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Drag and drop your image here or click to select a file.
            </p>
          </div>
          <DragAndDropArea onImageUpload={handleImageUpload} />
          <div className="mt-8">
            <h2 className="text-xl font-medium mb-3">Uploaded Image</h2>
            {uploadedImage ? (
              <Image
                src={uploadedImage}
                width={600}
                height={600}
                alt="Uploaded Image"
                className="w-full h-auto rounded-lg object-cover shadow-md"
              />
            ) : (
              <div className="w-full h-[300px] bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                No image uploaded
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
