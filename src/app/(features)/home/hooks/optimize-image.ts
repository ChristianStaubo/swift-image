import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type OptimizedImageResponse = Blob;

interface OptimizeImageRequest {
  file: File;
}

export const useImageOptimization = () => {
  const mutation = useMutation<OptimizedImageResponse, Error, OptimizeImageRequest>({
    mutationFn: async ({ file }) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to optimize image");
      }

      return response.blob();
    },
    onSuccess: () => {
      toast.success("Image optimized successfully");
      // You can add additional logic here, such as updating the UI or invalidating queries
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};