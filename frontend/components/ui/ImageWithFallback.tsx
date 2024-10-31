"use client";
import React, { useState } from "react";
import Image from "next/image";

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
  // const { src, fallbackSrc } = props;
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      objectFit={objectFit}
      className={className}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
};

export default ImageWithFallback;
