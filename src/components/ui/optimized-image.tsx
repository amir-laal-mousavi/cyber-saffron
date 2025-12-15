import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
}

export function OptimizedImage({ className, containerClassName, alt, ...props }: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      <img
        className={cn(
          "transition-all duration-700 ease-in-out",
          isLoading ? "opacity-0 blur-lg scale-105" : "opacity-100 blur-0 scale-100",
          className
        )}
        onLoad={() => setIsLoading(false)}
        alt={alt || "Image"}
        loading="lazy"
        {...props}
      />
    </div>
  );
}
