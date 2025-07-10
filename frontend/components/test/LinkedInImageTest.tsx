"use client";
import React from "react";
import ImageWithFallback from "../ui/ImageWithFallback";
import { sanitizeLinkedInUrl, isLinkedInUrl, getImageFallback } from "@/utils/imageUtils";

const LinkedInImageTest: React.FC = () => {
  // Test LinkedIn URLs from your example
  const testLogoUrl = "https://media.licdn.com/dms/image/v2/C560BAQF9UVytKDuFew/company-logo_400_400/company-logo_400_400/0/1630658316355/sadeem_wireless_sensing_systems_logo?e=1743033600&v=beta&t=s-yEjdi-Q2etuhojfdKgnpC_QtpuPvuyRO0BrE9PXkk";
  const testCoverUrl = "https://media.licdn.com/dms/image/v2/C561BAQFkgDJ8y7kJtA/company-background_10000/company-background_10000/0/1594731602850/sadeem_wireless_sensing_systems_cover?e=1734267600&v=beta&t=Mb__tyzO8AanjCR9bom-ZtPFJp0l9zsbLNrqap7-86I";

  console.log('Testing LinkedIn URLs:');
  console.log('Logo URL is LinkedIn:', isLinkedInUrl(testLogoUrl));
  console.log('Cover URL is LinkedIn:', isLinkedInUrl(testCoverUrl));
  console.log('Sanitized logo URL:', sanitizeLinkedInUrl(testLogoUrl));
  console.log('Sanitized cover URL:', sanitizeLinkedInUrl(testCoverUrl));

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">LinkedIn Image Test</h2>
      
      <div className="space-y-2">
        <h3 className="font-semibold">Logo Test:</h3>
        <div className="relative w-32 h-32 border border-gray-300 rounded">
          <ImageWithFallback
            src={testLogoUrl}
            fallbackSrc={getImageFallback('logo')}
            alt="Test LinkedIn Logo"
            objectFit="cover"
            className="rounded"
          />
        </div>
        <p className="text-sm text-gray-600">URL: {testLogoUrl}</p>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Cover Test:</h3>
        <div className="relative w-full h-32 border border-gray-300 rounded">
          <ImageWithFallback
            src={testCoverUrl}
            fallbackSrc={getImageFallback('cover')}
            alt="Test LinkedIn Cover"
            objectFit="cover"
            className="rounded"
          />
        </div>
        <p className="text-sm text-gray-600">URL: {testCoverUrl}</p>
      </div>
    </div>
  );
};

export default LinkedInImageTest; 