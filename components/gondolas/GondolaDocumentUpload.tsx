"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText } from "lucide-react";
import type { Document } from "../data-types/index";

interface GondolaDocumentUploadProps {
  gondolaId: string;
  currentDocuments?: Document[];
  onDocumentsChange?: (docs: Document[]) => void;
  onStagedDocsRef?: (ref: { uploadAllStagedFiles: () => Promise<void> }) => void;
}

export function GondolaDocumentUpload({ gondolaId, currentDocuments, onDocumentsChange, onStagedDocsRef }: GondolaDocumentUploadProps) {
  const [documents, setDocuments] = useState<Document[]>(currentDocuments || []);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Expose uploadAllStagedFiles to parent
  React.useEffect(() => {
    if (onStagedDocsRef) {
      onStagedDocsRef({ uploadAllStagedFiles });
    }
    // eslint-disable-next-line
  }, [stagedFiles, documents]);

  // Batch upload all staged files
  async function uploadAllStagedFiles() {
    if (!gondolaId || stagedFiles.length === 0) return;
    setIsUploading(true);
    setUploadError("");
    const uploadedDocs: Document[] = [];
    for (const file of stagedFiles) {
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
    const newDocs = [...documents, ...uploadedDocs];
    setDocuments(newDocs);
    if (onDocumentsChange) onDocumentsChange(newDocs);
    setIsUploading(false);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setStagedFiles(prev => [...prev, ...Array.from(files)]);
    e.target.value = '';
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

console.log('document',documents)
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
          Select Documents
        </Button>
        <Button
          type="button"
          variant="default"
          size="sm"
          className="ml-2"
          onClick={uploadAllStagedFiles}
          disabled={isUploading || stagedFiles.length === 0 || !gondolaId}
        >
          {isUploading ? "Uploading..." : `Upload All (${stagedFiles.length})`}
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
      {/* Staged files preview */}
      {stagedFiles.length > 0 && (
        <div className="space-y-2 mt-2">
          {stagedFiles.map((file, idx) => (
            <div key={file.name + idx} className="flex items-center gap-2 border rounded-md px-2 py-1 bg-blue-50">
              <FileText className="h-4 w-4 text-blue-400" />
              <span className="text-blue-900">{file.name}</span>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="ml-auto"
                onClick={() => setStagedFiles(stagedFiles.filter((_, i) => i !== idx))}
                disabled={isUploading}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      {/* Uploaded documents list */}
      {documents.length > 0 ? (
        <DocumentsTable documents={documents} onDelete={handleRemoveDocument} isUploading={isUploading} />
      ) : (
        <div className="text-gray-500 text-sm mt-4">No documents uploaded</div>
      )}
    </div>
  );
}

import DocumentsTable from "@/components/common/DocumentsTable";
