"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import DragAndDropArea from "./components/drag-and-drop-area";

const HomePage = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = useCallback((file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
      setUploadedImage(file);
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDownload = async () => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadedImage);

      const response = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to optimize image");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "optimized-image.webp";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error optimizing image:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl lg:max-w-6xl">
        <div className="space-y-8 lg:space-y-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Upload and Preview Images
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Drag and drop your image here or click to select a file. Click the
              download button to optimize and save the image.
            </p>
          </div>
          <DragAndDropArea onImageUpload={handleImageUpload} />
          <div className="mt-8">
            <h2 className="text-xl font-medium mb-3">Uploaded Image</h2>
            {isProcessing ? (
              <div className="w-full h-[300px] bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                Processing image...
              </div>
            ) : previewUrl ? (
              <>
                <Image
                  src={previewUrl}
                  width={600}
                  height={600}
                  alt="Uploaded Image"
                  className="w-full h-auto rounded-lg object-cover shadow-md"
                />
                <button
                  onClick={handleDownload}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Download Optimized Image"}
                </button>
              </>
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
