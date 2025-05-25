"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText } from "lucide-react";
import type { Document } from "../data-types/index";

interface GondolaDocumentUploadProps {
  gondolaId: string;
  currentDocuments?: Document[];
  onDocumentsChange?: (docs: Document[]) => void;
}

export function GondolaDocumentUpload({ gondolaId, currentDocuments, onDocumentsChange }: GondolaDocumentUploadProps) {
  const [documents, setDocuments] = useState<Document[]>(currentDocuments || []);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<Document | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('gondolaId', gondolaId);
    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        return {
          id: data.id,
          type: data.type || 'ADHOC',
          name: data.name,
          uploadedAt: new Date(data.uploadedAt),
          expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
          fileUrl: data.url,
          status: data.status || 'valid',
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
    let newDocs = [...documents];
    for (const file of Array.from(files)) {
      // Show filename immediately
      const tempId = `preview-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const previewDoc: Document = {
        id: tempId,
        type: 'ADHOC',
        name: file.name,
        uploadedAt: new Date(),
        fileUrl: '',
        status: 'valid',
      };
      newDocs = [...newDocs, previewDoc];
      setDocuments([...newDocs]);
      if (onDocumentsChange) onDocumentsChange([...newDocs]);
      // Upload in background
      try {
        const uploaded = await uploadFile(file);
        if (uploaded) {
          newDocs = newDocs.map((doc) => doc.id === tempId ? uploaded : doc);
          setDocuments([...newDocs]);
          if (onDocumentsChange) onDocumentsChange([...newDocs]);
        } else {
          newDocs = newDocs.filter((doc) => doc.id !== tempId);
          setDocuments([...newDocs]);
          setUploadError("Upload failed: Invalid gondola or server error.");
          if (onDocumentsChange) onDocumentsChange([...newDocs]);
        }
      } catch (err) {
        newDocs = newDocs.filter((doc) => doc.id !== tempId);
        setDocuments([...newDocs]);
        setUploadError("Upload failed: " + (err instanceof Error ? err.message : "Unknown error"));
        if (onDocumentsChange) onDocumentsChange([...newDocs]);
      }
    }
    setIsUploading(false);
  };

  const handleRemoveDocument = async (index: number) => {
    const doc = documents[index];
    if (doc.id && !doc.id.startsWith('preview-')) {
      // Only delete from backend if it's a real document, not a temp preview
      try {
        await fetch(`/api/documents/delete`, {
          body:JSON.stringify({documentId:doc?.id}),
          method: 'DELETE',
        });
      } catch (err) {
        setUploadError('Failed to delete document from server.');
        return;
      }
    }
    const newDocs = [...documents];
    newDocs.splice(index, 1);
    setDocuments(newDocs);
    if (onDocumentsChange) onDocumentsChange(newDocs);
  };


  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => { if (gondolaId) fileInputRef.current?.click(); }}
          disabled={isUploading || !gondolaId}
          title={!gondolaId ? "Save gondola first" : undefined}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? "Uploading..." : "Upload Documents"}
        </Button>
      </div>
      {uploadError && (
        <div className="text-red-600 text-sm mt-2">{uploadError}</div>
      )}
      {!gondolaId && (
        <div className="text-yellow-600 text-sm mt-2">
          Save the gondola before uploading documents.
        </div>
      )}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple disabled={!gondolaId} />
      {documents.length > 0 ? (
        <div className="space-y-2">
          {documents.map((doc, idx) => (
            <div key={doc.id} className="flex items-center gap-2 border rounded-md px-2 py-1 bg-white">
              <FileText className="h-4 w-4 text-blue-500" />
              <a
                href={doc.fileUrl || undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={doc.fileUrl ? "text-blue-700 underline" : "text-gray-500"}
                download={doc.name}
              >
                {doc.name}
              </a>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="ml-auto"
                onClick={() => handleRemoveDocument(idx)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-sm">No documents uploaded</div>
      )}
    </div>
  );
}
