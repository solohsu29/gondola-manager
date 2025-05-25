"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, ImageIcon } from "lucide-react"

export interface GondolaPhoto {
  id: string;
  url: string;
  uploadedAt: Date;
  description: string;
}

interface GondolaImageUploadProps {
  gondolaId: string;
  currentImages?: GondolaPhoto[];
  onImagesChange?: (images: GondolaPhoto[]) => void;
}

export function GondolaImageUpload({ gondolaId, currentImages, onImagesChange }: GondolaImageUploadProps) {
  const [images, setImages] = useState<GondolaPhoto[]>(
    currentImages?.map((img) => ({ ...img })) || [],
  )
  const [description, setDescription] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Upload a file to /api/photos/upload and return the photo info
  const uploadFile = async (file: File): Promise<GondolaPhoto | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('gondolaId', gondolaId);
    if (description) formData.append('description', description);
    try {
      const res = await fetch('/api/photos/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        return {
          id: data.id,
          url: data.url,
          uploadedAt: new Date(data.uploadedAt),
          description: data.description || '',
        };
      }
      return null;
    } catch (err) {
      console.error('Upload failed:', err);
      return null;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError("");
    let newImages: GondolaPhoto[] = [...images];

    for (const file of Array.from(files)) {
      // 1. Create a preview blob URL
      const previewUrl = URL.createObjectURL(file);
      const tempId = `preview-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const previewPhoto: GondolaPhoto = {
        id: tempId,
        url: previewUrl,
        uploadedAt: new Date(),
        description: description || `Photo of gondola ${gondolaId}`,
      };
      newImages = [...newImages, previewPhoto];
      setImages([...newImages]);
      if (onImagesChange) onImagesChange([...newImages]);

      // 2. Upload in background
      try {
        const uploaded = await uploadFile(file);
        if (uploaded) {
          // Replace preview with uploaded
          newImages = newImages.map((img) =>
            img.id === tempId ? uploaded : img
          );
          // Revoke the preview blob URL
          URL.revokeObjectURL(previewUrl);
          setImages([...newImages]);
          if (onImagesChange) onImagesChange([...newImages]);
        } else {
          // Remove preview on failure
          newImages = newImages.filter((img) => img.id !== tempId);
          URL.revokeObjectURL(previewUrl);
          setImages([...newImages]);
          setUploadError("Upload failed: Invalid gondola or server error.");
          if (onImagesChange) onImagesChange([...newImages]);
        }
      } catch (err) {
        // Remove preview on error
        newImages = newImages.filter((img) => img.id !== tempId);
        URL.revokeObjectURL(previewUrl);
        setImages([...newImages]);
        setUploadError("Upload failed: " + (err instanceof Error ? err.message : "Unknown error"));
        if (onImagesChange) onImagesChange([...newImages]);
      }
    }
    setIsUploading(false);
    setDescription("");
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];

    // Revoke the object URL to prevent memory leaks
    if (newImages[index].url) {
      URL.revokeObjectURL(newImages[index].url);
    }

    newImages.splice(index, 1);
    setImages(newImages);

    if (onImagesChange) {
      onImagesChange(newImages);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            if (gondolaId) fileInputRef.current?.click();
          }}
          disabled={isUploading || !gondolaId}
          title={!gondolaId ? "Save gondola first" : undefined}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? "Uploading..." : "Upload Images"}
        </Button>
      </div>
      {uploadError && (
        <div className="text-red-600 text-sm mt-2">{uploadError}</div>
      )}
      {!gondolaId && (
        <div className="text-yellow-600 text-sm mt-2">
          Save the gondola before uploading images.
        </div>
      )}

      <input
        type="text"
        placeholder="Image description (optional)"
        className="w-full p-2 border rounded-md"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" disabled={!gondolaId} />

      {images.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative border rounded-md overflow-hidden w-full h-32">
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={`Gondola preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                  {image.description || `Image ${index + 1}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="border rounded-md flex items-center justify-center w-full h-48 bg-gray-50">
          <div className="text-center text-gray-500">
            <ImageIcon className="h-10 w-10 mx-auto mb-2" />
            <p>No images uploaded</p>
          </div>
        </div>
      )}
    </div>
  )
}
