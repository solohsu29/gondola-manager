"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ArrowLeft, Calendar, FileCheck, FileText, ImageIcon } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { useStore } from "@/lib/store/useStore"
import { Gondola } from "@/components/data-types"
import { GondolaImageUpload } from "@/components/gondolas/GondolaImageUpload"


export default function GondolaDetailPage() {
  const params = useParams()
  const gondolaId = params.id as string
  const { gondolas, updateGondola, addGondolaPhoto } = useStore()

  const [gondola, setGondola] = useState<Gondola | null>(null)
  const [loading, setLoading] = useState(true)
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)

  useEffect(() => {
    const foundGondola = gondolas.find((g) => g.id === gondolaId)
    setGondola(foundGondola || null)
    setLoading(false)
  }, [gondolaId, gondolas])

  const formatDate = (date?: Date) => {
    if (!date) return "N/A"
    return date.toISOString().split("T")[0]
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "deployed":
        return "outline"
      case "in-use":
        return "secondary"
      case "under-inspection":
        return "default"
      case "maintenance":
        return "destructive"
      case "off-hired":
        return "outline"
      default:
        return "secondary"
    }
  }

  if (loading) {
    return (
     
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Link href="/gondolas">
              <Button variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Gondolas
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Loading...</h1>
          </div>
        </div>
   
    )
  }

  if (!gondola) {
    return (
    
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Link href="/gondolas">
              <Button variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Gondolas
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Gondola Not Found</h1>
          </div>
          <p>The gondola with ID {gondolaId} could not be found.</p>
        </div>
     
    )
  }

  return (
   
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/gondolas">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gondolas
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Gondola Details: {gondola.id}</h1>
          <Badge className="ml-4" variant={getStatusBadgeVariant(gondola.status)}>
            {gondola.status.replace("-", " ")}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Gondola Images</CardTitle>
              </CardHeader>
              <CardContent>
                {gondola.photos.length > 0 ? (
                  <div className="space-y-4">
                    <div className="relative border rounded-md overflow-hidden w-full h-48">
                      <img
                        src={gondola.photos[activePhotoIndex].url || "/placeholder.svg"}
                        alt={gondola.photos[activePhotoIndex].description}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-500">{gondola.photos[activePhotoIndex].description}</p>

                    {gondola.photos.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto py-2">
                        {gondola.photos.map((photo, index) => (
                          <div
                            key={photo.id}
                            className={`w-16 h-16 border-2 rounded cursor-pointer ${
                              index === activePhotoIndex ? "border-blue-500" : "border-gray-200"
                            }`}
                            onClick={() => setActivePhotoIndex(index)}
                          >
                            <img
                              src={photo.url || "/placeholder.svg"}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">No images available</p>
                  </div>
                )}

                <div className="mt-4">
                  <GondolaImageUpload
                    gondolaId={gondola.id}
                    onImagesChange={(images) => {
                      const firstImage = images[0] || { url: '', description: '' };
                      const newPhoto = {
                        id: `photo-${Date.now()}`,
                        url: firstImage.url,
                        uploadedAt: new Date(),
                        description: firstImage.description || `Photo of gondola ${gondola.id}`,
                      };
                      addGondolaPhoto(gondola.id, newPhoto);
                    }}

                  
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Gondola Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">ID</h3>
                    <p>{gondola.id}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Serial Number</h3>
                    <p>{gondola.serialNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p>
                      {gondola?.block}, {gondola?.bay}
                    </p>
                    <p className="text-sm text-gray-500">
                      {gondola?.floor}, {gondola?.elevation}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Deployed At</h3>
                    <p>{gondola.deployedAt ? formatDate(gondola.deployedAt) : "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Last Inspection</h3>
                    <p>{formatDate(gondola.lastInspection)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Next Inspection</h3>
                    <p>{formatDate(gondola.nextInspection)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <Badge variant={getStatusBadgeVariant(gondola.status)}>{gondola.status.replace("-", " ")}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="documents">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="documents">
                  <FileText className="h-4 w-4 mr-2" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="inspections">
                  <FileCheck className="h-4 w-4 mr-2" />
                  Inspections
                </TabsTrigger>
                <TabsTrigger value="history">
                  <Calendar className="h-4 w-4 mr-2" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="documents" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Documents</CardTitle>
                      <Button size="sm">Add Document</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {gondola.documents.length > 0 ? (
                      <div className="space-y-4">
                        {gondola.documents.map((doc) => (
                          <div key={doc.id} className="border-b pb-4 last:border-0">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-medium">{doc.name}</h3>
                              <Badge variant={doc.status === "expired" ? "destructive" : "outline"}>{doc.status}</Badge>
                            </div>
                            <p className="text-sm text-gray-500">Type: {doc.type.replace("_", " ")}</p>
                            <p className="text-sm text-gray-500">
                              Uploaded: {formatDistanceToNow(doc.uploadedAt, { addSuffix: true })}
                            </p>
                            {doc.expiryDate && (
                              <p className="text-sm font-medium">Expires: {formatDate(doc.expiryDate)}</p>
                            )}
                            <div className="mt-2">
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-2" />
                                View Document
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No documents found for this gondola.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inspections" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Inspections</CardTitle>
                      <Button size="sm">Schedule Inspection</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {gondola.lastInspection ? (
                      <div className="space-y-4">
                        <div className="border-b pb-4 last:border-0">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-medium">Last Inspection</h3>
                            <Badge variant="default">Completed</Badge>
                          </div>
                          <p className="text-sm text-gray-500">Date: {formatDate(gondola.lastInspection)}</p>
                        </div>
                        {gondola.nextInspection && (
                          <div className="border-b pb-4 last:border-0">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-medium">Next Scheduled Inspection</h3>
                              <Badge variant="outline">Pending</Badge>
                            </div>
                            <p className="text-sm text-gray-500">Date: {formatDate(gondola.nextInspection)}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500">No inspection records found for this gondola.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">No history records available yet.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
   
  )
}
