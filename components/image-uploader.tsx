"use client";

import type React from "react";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload, Camera, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isLoading: boolean;
  hideCamera?: boolean;
}

export default function ImageUploader({
  onImageUpload,
  isLoading,
}: ImageUploaderProps) {
  const { t, direction } = useLanguage();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match("image.*")) {
      alert("Please upload an image file");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Pass file to parent component
    onImageUpload(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {!previewUrl ? (
        <div
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg ${
            dragActive ? "border-green-500 bg-green-50" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center py-5">
            <Upload className="w-12 h-12 mb-4 text-gray-400" />
            <p className="mb-2 text-sm font-medium text-gray-700">
              {t("uploader.dragDrop")}{" "}
              <span
                className="text-green-600 cursor-pointer hover:text-green-700"
                onClick={triggerFileInput}
              >
                {t("uploader.browse")}
              </span>
            </p>
            <p className="text-xs text-gray-500">{t("uploader.formats")}</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg">
          <div className="relative aspect-video">
            <Image
              src={previewUrl || "/placeholder.svg"}
              alt="Plant preview"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 rtl:space-x-reverse">
        {!previewUrl ? (
          <>
            <Button
              type="button"
              onClick={triggerFileInput}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Upload className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {t("uploader.upload")}
            </Button>
          </>
        ) : (
          <>
            {isLoading ? (
              <Button disabled className="flex-1">
                <Loader2 className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 animate-spin" />
                {t("uploader.analyzing")}
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setPreviewUrl(null)}
              >
                {t("uploader.different")}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
