"use client"

import React, { useState, useEffect, useRef } from "react";
import ReactSelect from "react-select"
import { ProjectDocumentUpload } from "./ProjectDocumentUpload"
import type { Document } from "../data-types";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Plus, Upload, FileCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Project } from "../data-types"
import { useStore } from "@/lib/store/useStore"

export function NewProjectDialog() {
  const [open, setOpen] = useState(false)
  const [projectData, setProjectData] = useState({
  doNumbers: [] as string[],
  clientName: "",
  siteName: "",
  gondolas: "0",
  gondolaIds: [] as string[],
  status: "active" as "active" | "completed" | "cancelled",
  documents: [] as Document[],
})

  const { gondolas, fetchGondolas, projects, fetchProjects, addProject } = useStore()

  // Compute unique DO numbers from all projects
  const doNumbers = Array.from(
    new Set(
      (projects || [])
        .flatMap(p => (p.deliveryOrders ? p.deliveryOrders.map(d => d.number) : []))
        .filter(Boolean)
    )
  ) as string[]

  // Fetch latest data when dialog opens
  useEffect(() => {
    if (open) {
      fetchGondolas()
      fetchProjects()
    }
  }, [open, fetchGondolas, fetchProjects])

  const projectDocUploadRef = useRef<{ uploadAllStagedFiles: (projectId: string) => Promise<void> } | null>(null);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Find the selected gondolas from the real gondolas array
    const selectedGondolas = (gondolas || [])
      .filter((gondola) => projectData.gondolaIds.includes(gondola.id))
      .map((gondola) => ({ id: gondola.id })); // Only send IDs to backend

    let deliveryOrders = projectData.doNumbers
      .filter((doNum) => doNum !== "generate")
      .map((doNumber) => ({
        number: doNumber,
        date: new Date(),
      }));

    const newProjectData = {
      clientName: projectData.clientName,
      siteName: projectData.siteName,
      createdAt: new Date(),
      startDate: new Date(),
      status: projectData.status,
      gondolas: selectedGondolas,
      deliveryOrders: deliveryOrders,
      documents: projectData.documents.filter((doc) => !doc.id || doc.id.startsWith('preview-') || doc.id.length < 24),
    };

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProjectData),
      });
      const data = await res.json();
      if (res.ok) {
        // Success
        // Update staged docs with new projectId
        if (projectDocUploadRef.current) {
          await projectDocUploadRef.current.uploadAllStagedFiles(data.id);
        }
        setOpen(false);
        fetchProjects();
        setProjectData({
          doNumbers: [],
          clientName: "",
          siteName: "",
          gondolas: "0",
          gondolaIds: [],
          status: "active",
          documents: [],
        });
      } else {
        alert("Failed to create project. Please try again.");
      }
    } catch (err) {
      alert("Failed to create project. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[750px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Enter the details for the new project. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col md:flex-row justify-between gap-3 py-4">
            <div className=" space-y-4">
              <div className="flex justify-between flex-col md:flex-row items-center gap-4">
  <Label htmlFor="doNumbers" className="w-[130px]">
    DO Numbers
  </Label>
  <div className="w-full">
    <ReactSelect
      isMulti
      id="doNumbers"
      options={doNumbers.map((num) => ({ value: num, label: num }))}
      value={projectData.doNumbers.map((num) => ({ value: num, label: num }))}
      onChange={(selected) =>
        setProjectData({
          ...projectData,
          doNumbers: selected.map((opt: any) => opt.value),
        })
      }
      placeholder="Select DO Numbers..."
      closeMenuOnSelect={false}
      classNamePrefix="react-select"
    />
  </div>
</div>
              <div className="flex justify-between flex-col md:flex-row items-center gap-4">
  <Label htmlFor="gondolaIds" className="w-[130px]">
    Gondola IDs
  </Label>
  <div className="w-full">
    <ReactSelect
      isMulti
      id="gondolaIds"
      options={(gondolas || []).map((g) => ({ value: g.id, label: g.serialNumber }))}
      value={projectData.gondolaIds.map((id) => {
        const gondola = (gondolas || []).find((g) => g.id === id)
        return { value: id, label: gondola ? gondola.serialNumber : id }
      })}
      onChange={(selected) =>
        setProjectData({
          ...projectData,
          gondolaIds: selected.map((opt: any) => opt.value),
        })
      }
      placeholder="Select Gondolas..."
      closeMenuOnSelect={false}
      classNamePrefix="react-select"
    />
  </div>
</div>
              <div className="flex justify-between flex-col md:flex-row items-center gap-4">
                <Label htmlFor="clientName"  className="w-[130px]">
                  Client
                </Label>
                <Input
                  id="clientName"
                  placeholder="Client name"
                  className="w-full"
                  value={projectData.clientName}
                  onChange={(e) => setProjectData({ ...projectData, clientName: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-between flex-col md:flex-row items-center gap-4">
                <Label htmlFor="siteName"  className="w-[130px]">
                  Site
                </Label>
                <Input
                  id="siteName"
                  placeholder="Site location"
                  className="w-full"
                  value={projectData.siteName}
                  onChange={(e) => setProjectData({ ...projectData, siteName: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-between flex-col md:flex-row items-center gap-4">
                <Label htmlFor="status"  className="w-[130px]">
                  Status
                </Label>
                <Select
                  value={projectData.status}
                  onValueChange={(value: "active" | "completed" | "cancelled") =>
                    setProjectData({ ...projectData, status: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="h-[300px] max-w-[300px] overflow-auto overflow-x-hidden">
              <div className="border rounded-md p-4 bg-gray-50">
                <h3 className="text-sm font-medium mb-2">Preview</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">DO Numbers:</span>{" "}
                    {projectData.doNumbers.length > 0 ? (
                      <div className="mt-1">
                        {projectData.doNumbers.includes("generate") && (
                          <Badge className="mr-1 mb-1">Generate new DO</Badge>
                        )}
                        {projectData.doNumbers
                          .filter((doNum) => doNum !== "generate")
                          .map((doNum) => (
                            <Badge key={doNum} variant="outline" className="mr-1 mb-1">
                              {doNum}
                            </Badge>
                          ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">None selected (will generate new)</span>
                    )}
                  </div>
                 
                  <div>
                    <span className="font-medium">Client:</span>{" "}
                    {projectData.clientName || <span className="text-gray-500">Not specified</span>}
                  </div>
                  <div>
                    <span className="font-medium">Site:</span>{" "}
                    {projectData.siteName || <span className="text-gray-500">Not specified</span>}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> <Badge>{projectData.status}</Badge>
                  </div>
                  <div>
                    <span className="font-medium">Gondolas:</span>{" "}
                    {projectData.gondolaIds.length > 0 ? (
                      <div className="mt-1">
                        {projectData.gondolaIds.map((gondolaId) => {
  // Use any as fallback if Gondola type is not globally available
  const gondola = (gondolas || []).find((g: any) => g.id === gondolaId)
  return (
    <Badge key={gondolaId} variant="outline" className="mr-1 mb-1">
      {gondola ? `${gondola.serialNumber}` : gondolaId}
    </Badge>
  )
})}
                      </div>
                    ) : (
                      <span className="text-gray-500">None selected</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t mt-4 pt-4">
  <h3 className="text-sm font-medium mb-2">Documents</h3>
  <p className="text-sm text-gray-500 mb-3">
    Upload and manage documents for this project:
  </p>
  <div className="flex gap-2">
    {/* Project Document Upload */}
    <ProjectDocumentUpload
  currentDocuments={projectData.documents}
  onDocumentsChange={(docs: Document[]) => setProjectData({ ...projectData, documents: docs })}
  onStagedDocsRef={(ref) => {
    projectDocUploadRef.current = ref;
  }}
/>
  </div>
</div>

          <div className="border-t mt-4 pt-4">
            <h3 className="text-sm font-medium mb-2">Inspections</h3>
            <p className="text-sm text-gray-500 mb-3">Schedule inspections for this project after creation:</p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  // Submit the form to create the project first
                  handleSubmit(e as React.FormEvent)
                  // Then redirect to a new inspection form
                  window.location.href = "/projects?scheduleInspection=true"
                }}
              >
                <FileCheck className="h-4 w-4 mr-2" />
                Schedule Inspection
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )

  
}
