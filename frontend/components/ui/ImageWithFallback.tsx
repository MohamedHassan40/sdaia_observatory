"use client";
import React, { useState } from "react";
import Image from "next/image";
import { isLinkedInUrl, logImageError } from "@/utils/imageUtils";

interface ImageWithFallBackProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  width?: number;
  height?: number;
  className: string;
  objectFit: string;
}

const ImageWithFallback: React.FC<ImageWithFallBackProps> = ({
  src,
  fallbackSrc,
  alt,
  width,
  height,
  className,
  objectFit,
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Handle LinkedIn URLs - they might need special handling
  const isLinkedIn = isLinkedInUrl(src);
  
  const handleImageError = (error: any) => {
    if (!hasError) {
      setHasError(true);
      logImageError(src, alt, error);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      objectFit={objectFit}
      className={className}
      onError={handleImageError}
      unoptimized={isLinkedIn} // Skip optimization for LinkedIn URLs to avoid issues
    />
  );
};

export default ImageWithFallback;
