"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import DragAndDropArea from "./components/drag-and-drop-area";
import { useImageOptimization } from "./hooks/optimize-image";
import ImagePreviewCard from "./components/image-preview-card";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<ImageInfo | null>(null);
  const [optimizedImage, setOptimizedImage] = useState<ImageInfo | null>(null);

  const optimizeImage = useImageOptimization();

  const handleImageUpload = useCallback(
    async (file: File) => {
      setUploadedImage(file);

      // Set original image info
      const originalUrl = URL.createObjectURL(file);
      setOriginalImage({ url: originalUrl, size: file.size });

      // Optimize image
      try {
        const result = await optimizeImage.mutateAsync({ file });

        // Set optimized image info
        const optimizedUrl = URL.createObjectURL(result);
        setOptimizedImage({ url: optimizedUrl, size: result.size });
      } catch (error) {
        console.error("Error optimizing image:", error);
        // Handle error (e.g., show error message to user)
      }
    },
    [optimizeImage]
  );

  const handleDownload = useCallback(() => {
    if (!optimizedImage) return;

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = optimizedImage.url;
    a.download = "optimized-image.webp";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(optimizedImage.url);
  }, [optimizedImage]);

  const calculateSizeReduction = () => {
    if (!originalImage || !optimizedImage) return null;
    const reduction =
      ((originalImage.size - optimizedImage.size) / originalImage.size) * 100;
    return reduction.toFixed(2);
  };

  return (
    <div className="flex flex-col items-center justify-start  p-4 sm:p-6 lg:p-8 mt-[3.5rem]">
      <div className="w-full max-w-6xl">
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
            <h2 className="text-xl font-medium mb-3 text-center py-2">
              Image Preview
            </h2>
            <div className=" overflow-y-auto">
              {optimizeImage.isPending ? (
                <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                  Processing image...
                </div>
              ) : originalImage && optimizedImage ? (
                <div className="flex flex-col sm:flex-row gap-4 h-full">
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-lg font-medium mb-2">Original</h3>
                    <ImagePreviewCard
                      info={originalImage}
                      alt="Original Image"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-lg font-medium mb-2">Optimized</h3>
                    <ImagePreviewCard
                      info={optimizedImage}
                      alt="Optimized Image"
                    />
                    {calculateSizeReduction() && (
                      <div className="mt-2 text-sm text-green-600 font-medium">
                        {calculateSizeReduction()}% size reduction
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full min-h-[200px] h-full bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                  No image uploaded
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-center">
              {optimizedImage && (
                <Button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  disabled={optimizeImage.isPending}
                >
                  {optimizeImage.isPending
                    ? "Processing..."
                    : "Download Optimized Image"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
