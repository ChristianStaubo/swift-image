import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { formatFileSize } from "../utils/utils";
import Image from "next/image";
const ImagePreviewCard = ({ info, alt }: { info: ImageInfo; alt: string }) => (
  <Dialog>
    <DialogTrigger asChild>
      <div className="cursor-pointer">
        <Image
          src={info.url}
          width={400}
          height={300}
          alt={alt}
          className="w-full h-[300px] rounded-lg object-cover shadow-md"
        />
        <div className="mt-2 text-sm text-muted-foreground">
          Size: {formatFileSize(info.size)}
        </div>
      </div>
    </DialogTrigger>
    <DialogContent className="max-w-[90vw] max-h-[90vh]">
      <Image
        src={info.url}
        width={1200}
        height={900}
        alt={alt}
        className="w-full h-auto max-h-[85vh] object-contain"
      />
    </DialogContent>
  </Dialog>
);

export default ImagePreviewCard;
