

"use client"
import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Edit, Image, MapPin, Settings, Upload } from "lucide-react"
import { useStore } from "@/lib/store/useStore"
import { GondolaStatus } from "../data-types"
import { GondolaImageUpload, GondolaPhoto } from "./GondolaImageUpload"
import { GondolaDocumentUpload } from "./GondolaDocumentUpload"
import type { Document } from "../data-types/index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"



export function EditGondolaDialog({
  gondola,
  onSave,
}: {
  gondola: any
  onSave: () => void
}) {
  const [open, setOpen] = useState(false)
  // Ref for staged doc upload
  const stagedDocsRef = useRef<{ uploadAllStagedFiles: () => Promise<void> } | null>(null);
  // Ref for staged image upload
  const stagedImagesRef = useRef<{ uploadAllStagedImages: () => Promise<void> } | null>(null);

  const [gondolaData, setGondolaData] = useState<{
    id:string;
    serialNumber: string;
    status: GondolaStatus;
    bay: string;
    floor: string;
    block: string;
    elevation: string;
    lastInspection: string;
    nextInspection: string;
    photos: GondolaPhoto[];
    documents: Document[];
  }>({
    id:gondola?.id,
    serialNumber: gondola?.serialNumber,
    status: gondola?.status,
    bay: gondola?.bay || "",
    floor: gondola?.floor || "",
    block: gondola?.block || "",
    elevation: gondola?.elevation || "",
    lastInspection: gondola?.lastInspection ? new Date(gondola.lastInspection).toISOString().split("T")[0] : "",
    nextInspection: gondola?.nextInspection ? new Date(gondola.nextInspection).toISOString().split("T")[0] : "",
    photos: gondola?.photos || [],
    documents: gondola?.documents || [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const updatedGondola = {
      serialNumber: gondolaData.serialNumber,
      status: gondolaData.status as GondolaStatus,
      bay: gondolaData.bay,
      floor: gondolaData.floor,
      block: gondolaData.block,
      elevation: gondolaData.elevation,
      lastInspection: gondolaData.lastInspection ? new Date(gondolaData.lastInspection) : undefined,
      nextInspection: gondolaData.nextInspection ? new Date(gondolaData.nextInspection) : undefined,
      photos: gondolaData.photos || [],
    }
    useStore.getState().updateGondola(gondola.id, updatedGondola)
    // Upload staged documents after saving gondola
    if (stagedDocsRef.current) {
      await stagedDocsRef.current.uploadAllStagedFiles();
    }
    // Upload staged images after saving gondola and documents
    if (stagedImagesRef.current) {
      await stagedImagesRef.current.uploadAllStagedImages();
    }
    setOpen(false)
    onSave()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "deployed": return "bg-green-100 text-green-800 border-green-200"
      case "in-use": return "bg-blue-100 text-blue-800 border-blue-200"
      case "under-inspection": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "maintenance": return "bg-orange-100 text-orange-800 border-orange-200"
      case "off-hired": return "bg-gray-100 text-gray-800 border-gray-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600 transition-colors">
          <Edit className="h-4 w-4 mr-1" />
        
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-white cursor-pointer">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader className="space-y-3 pb-4 cursor-pointer">
            <div className="flex items-center justify-between mt-3">
              <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                
                Edit Gondola {gondola.serialNumber}
              </DialogTitle>
              <Badge className={`${getStatusColor(gondolaData.status)} font-medium`}>
                {gondolaData.status?.replace('-', ' ').toUpperCase()}
              </Badge>
            </div>
            <DialogDescription className="text-gray-600 text-base">
              Update gondola details and manage associated documents. All changes will be saved immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information Card */}
            <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="serialNumber" className="text-sm font-medium text-gray-700">
                    Serial Number
                  </Label>
                  <Input
                    id="serialNumber"
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                    value={gondolaData.serialNumber}
                    onChange={(e) => setGondolaData({ ...gondolaData, serialNumber: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                    Status
                  </Label>
                  <Select
                     value={gondolaData.status}
                     onValueChange={(value: GondolaStatus) => setGondolaData({ ...gondolaData, status: value })}
                  >
                    <SelectTrigger id="status" className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deployed">Deployed</SelectItem>
                      <SelectItem value="in-use">In Use</SelectItem>
                      <SelectItem value="under-inspection">Under Inspection</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="off-hired">Off-Hired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Location Information Card */}
            <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="bay" className="text-sm font-medium text-gray-700">Bay</Label>
                    <Input
                      id="bay"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                      value={gondolaData.bay}
                      onChange={(e) => setGondolaData({ ...gondolaData, bay: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="floor" className="text-sm font-medium text-gray-700">Floor</Label>
                    <Input
                      id="floor"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                      value={gondolaData.floor}
                      onChange={(e) => setGondolaData({ ...gondolaData, floor: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="block" className="text-sm font-medium text-gray-700">Block</Label>
                    <Input
                      id="block"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                      value={gondolaData.block}
                      onChange={(e) => setGondolaData({ ...gondolaData, block: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="elevation" className="text-sm font-medium text-gray-700">Elevation</Label>
                    <Input
                      id="elevation"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                      onChange={(e) => setGondolaData({ ...gondolaData, elevation: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inspection Dates Card */}
            <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Inspection Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="lastInspection" className="text-sm font-medium text-gray-700">
                    Last Inspection
                  </Label>
                  <Input
                    id="lastInspection"
                    type="date"
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                    value={gondolaData.lastInspection}
                    onChange={(e) => setGondolaData({ ...gondolaData, lastInspection: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextInspection" className="text-sm font-medium text-gray-700">
                    Next Inspection
                  </Label>
                  <Input
                    id="nextInspection"
                    type="date"
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                    value={gondolaData.nextInspection}
                    onChange={(e) => setGondolaData({ ...gondolaData, nextInspection: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Image Upload Card */}
            <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Image className="w-5 h-5 text-indigo-600" />
                  Gondola Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <GondolaImageUpload
                  gondolaId={gondolaData.id}
                  currentImages={gondolaData.photos}
                  onImagesChange={(images: GondolaPhoto[]) => setGondolaData((prev) => ({ ...prev, photos: images }))}
                  onStagedImagesRef={ref => { stagedImagesRef.current = ref; }}
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Image upload component will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-6" />

          {/* Documents Section */}
          <Card className="shadow-sm border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                Document Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Manage certificates, inspection reports, and other important documents for this gondola.
              </p>
              <GondolaDocumentUpload
                gondolaId={gondolaData.id}
                currentDocuments={gondolaData.documents}
                onDocumentsChange={(docs: Document[]) => setGondolaData((prev) => ({ ...prev, documents: docs }))}
                onStagedDocsRef={ref => { stagedDocsRef.current = ref; }}
              />
            </CardContent>
          </Card>

          <DialogFooter className="pt-6">
            <div className="flex gap-3 w-full sm:w-auto">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="flex-1 sm:flex-none text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
