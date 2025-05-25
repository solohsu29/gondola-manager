"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText } from "lucide-react";
import type { Document } from "../data-types";

interface ProjectDocumentUploadProps {
  projectId?: string; // optional for new project
  currentDocuments?: Document[];
  onDocumentsChange?: (docs: Document[]) => void;
  onStagedDocsRef?: (ref: { uploadAllStagedFiles: (projectId: string) => Promise<void> }) => void;
}

export function ProjectDocumentUpload({ projectId, currentDocuments, onDocumentsChange, onStagedDocsRef }: ProjectDocumentUploadProps) {
  const [documents, setDocuments] = useState<Document[]>(currentDocuments || []);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Expose function to parent
  React.useEffect(() => {
    if (onStagedDocsRef) {
      onStagedDocsRef({ uploadAllStagedFiles });
    }
    // eslint-disable-next-line
  }, [stagedFiles, documents]);

  // Batch upload all staged files with a given projectId
  async function uploadAllStagedFiles(newProjectId: string) {
    setIsUploading(true);
    setUploadError("");
    const uploadedDocs: Document[] = [];
    for (const file of stagedFiles) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', newProjectId);
      try {
        const res = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (res.ok && data.url) {
          uploadedDocs.push({
            id: data.id,
            type: data.type || 'ADHOC',
            name: data.name,
            uploadedAt: new Date(data.uploadedAt),
            expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
            fileUrl: data.url,
            status: data.status || 'valid',
          } as Document);
        }
      } catch (err) {
        setUploadError('One or more files failed to upload.');
      }
    }
    setStagedFiles([]);
    setDocuments([...documents, ...uploadedDocs]);
    setIsUploading(false);
    if (onDocumentsChange) onDocumentsChange([...documents, ...uploadedDocs]);
  }




  // Only stage files for preview, do not upload yet
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadError("");
    setStagedFiles((prev) => [...prev, ...Array.from(files)]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }


  const handleRemoveStagedFile = (index: number) => {
    const newFiles = [...stagedFiles];
    newFiles.splice(index, 1);
    setStagedFiles(newFiles);
  };

  const handleRemoveDocument = async (index: number) => {
    const doc = documents[index];
    if (doc.id) {
      // Only delete from backend if it's a real document
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
      {/* Preview staged files before upload */}
      {stagedFiles.length > 0 && (
        <div className="space-y-2">
          {stagedFiles.map((file, idx) => (
            <div key={file.name + idx} className="flex items-center gap-2 border rounded-md px-2 py-1 bg-gray-50">
              <FileText className="h-4 w-4 text-gray-500" />
              <span>{file.name}</span>
              <span className="text-xs text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="ml-auto"
                onClick={() => handleRemoveStagedFile(idx)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? "Uploading..." : "Upload Documents"}
        </Button>
      </div>
      {uploadError && (
        <div className="text-red-600 text-sm mt-2">{uploadError}</div>
      )}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
      {/* Show uploaded documents only after upload */}
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
      ) : null}
    </div>
  );
}

