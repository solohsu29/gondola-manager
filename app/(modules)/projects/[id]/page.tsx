
"use client"
import { useEffect, useMemo } from "react";
import { useStore } from "@/lib/store/useStore";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import DeliveryOrdersTab from "@/components/projects/DeliveryOrdersTab";
import DetailHeader from "@/components/projects/DetailHeader";
import DocumentsTab from "@/components/projects/DocumentsTab";
import GondolasTab from "@/components/projects/GondolasTab";
import InfoCards from "@/components/projects/InfoCards";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs } from "@radix-ui/react-tabs";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();

  
  const { projects, fetchProjects } = useStore();

  useEffect(() => {
    if (!projects || projects.length === 0) {
      fetchProjects();
    }
  }, [projects, fetchProjects]);

  const project = useMemo(() => projects.find((t) => t.id === id), [projects, id]);
  

  
  // State for upload modal
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadingGondolaId, setUploadingGondolaId] = useState<string | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const uploadDocument = (gondolaId?: string) => {
    setUploadingGondolaId(gondolaId);
    setUploadModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !project) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('projectId', project.id);
      if (uploadingGondolaId) {
        formData.append('gondolaId', uploadingGondolaId);
      }
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      // Refresh project data so the new document appears
      await fetchProjects();
      setUploading(false);
      setUploadModalOpen(false);
      setSelectedFile(null);
      toast.success(`Document uploaded for ${uploadingGondolaId ? `gondola ${uploadingGondolaId}` : 'project'}`);
    } catch (error) {
      setUploading(false);
      toast.error('Failed to upload document');
    }
  };
  
  if (!project) {
    return (
      <div className="max-w-7xl mx-auto p-10 text-center text-gray-500">
        Project not found or loading...
      </div>
    );
  }

  // Upload Document Modal
  // You can move this to a separate component if needed
  const uploadModal = (
  <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Upload Document</DialogTitle>
      </DialogHeader>
      <div className="py-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Attach to</label>
          <Select
            value={uploadingGondolaId || 'project'}
            onValueChange={(value) => setUploadingGondolaId(value === 'project' ? undefined : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Project (default)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="project">Project (default)</SelectItem>
              {project.gondolas?.map(gondola => (
                <SelectItem key={gondola.id} value={gondola.id}>
                  Gondola {gondola.serialNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input
          type="file"
          onChange={handleFileChange}
          accept="application/pdf,image/*"
          className="mb-4"
        />
        {selectedFile && <div className="text-sm text-gray-700 mb-2">Selected: {selectedFile.name}</div>}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => setUploadModalOpen(false)} disabled={uploading}>
          Cancel
        </Button>
        <Button onClick={handleUpload} disabled={!selectedFile || uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

  // Debug: See what the project object contains
  console.log('Project detail object:', project);
  
  // Organize documents by gondola
  const allDocuments = [
    ...(
      Array.isArray(project.gondolas)
        ? project.gondolas.map(gondola => ({
            gondolaId: gondola.id,
            serialNumber: gondola.serialNumber,
            documents: gondola.documents || []
          }))
        : []
    ),
    {
      gondolaId: null,
      serialNumber: null,
      documents: project.documents || []
    }
  ];

  // const projectDOs = Array.isArray(project.deliveryOrders) 
  //   ? project.deliveryOrders 
  //   : [{ id: 'default-do', number: project.doNumber, date: project.createdAt }];
console.log('projects',projects)
  return (
    <>
      {uploadModal}
      <div className="max-w-7xl mx-auto">
      <DetailHeader
        ddNumber={project.deliveryOrders && project.deliveryOrders.length > 0 ? project.deliveryOrders[0].number : 'N/A'}
        onUploadDocument={() => uploadDocument()}
      />
      <InfoCards project={project} />
      <Tabs defaultValue="delivery-orders" className="mb-6">
        <TabsList className="mb-2">
          <TabsTrigger value="delivery-orders">Delivery Orders</TabsTrigger>
          <TabsTrigger value="gondolas">Gondolas</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="delivery-orders">
          <DeliveryOrdersTab
            deliveryOrders={Array.isArray(project.deliveryOrders) ? project.deliveryOrders : []}
            project={project}
          />
        </TabsContent>
        <TabsContent value="gondolas">
          <GondolasTab 
            gondolas={Array.isArray(project.gondolas) ? project.gondolas.filter(Boolean) : []}
            onUploadDocument={uploadDocument}
          />
        </TabsContent>
        <TabsContent value="documents">
  <DocumentsTab allDocuments={[
    ...(project.gondolas || []).map(gondola => ({
      gondolaId: gondola.id,
      serialNumber: gondola.serialNumber,
      documents: (gondola.documents || []).map(doc => ({
        ...doc,
        fileUrl: doc.fileUrl && doc.fileUrl.trim() !== "" ? doc.fileUrl : `/api/documents/${doc.id}/download`
      }))
    })),
    {
      gondolaId: null,
      serialNumber: null,
      documents: (project.documents || []).map(doc => ({
        ...doc,
        fileUrl: doc.fileUrl && doc.fileUrl.trim() !== "" ? doc.fileUrl : `/api/documents/${doc.id}/download`
      }))
    }
  ]} />
</TabsContent>
      </Tabs>
    </div>
    </>
  );
};

export default ProjectDetail;
