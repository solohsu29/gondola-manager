"use client"

import { useState } from "react"
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
import { FileText, Download, Calendar, Building, MapPin } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { DeliveryOrder, Project } from "../data-types"


interface DeliveryOrderViewerProps {
  deliveryOrder: DeliveryOrder
  project: Project
  onClose?: () => void
}

export function DeliveryOrderViewer({ deliveryOrder, project, onClose }: DeliveryOrderViewerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => {
    setIsOpen(false)
    if (onClose) onClose()
  }

  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          View DO
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Delivery Order: {deliveryOrder.number}
          </DialogTitle>
          <DialogDescription>Delivery order details and preview</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">DO ID</h3>
              <p className="font-mono text-sm">{deliveryOrder.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">DO Number</h3>
              <p className="font-medium">{deliveryOrder.number}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date Issued</h3>
              <div className="flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                <span>{formatDate(deliveryOrder.date)}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(deliveryOrder.date, { addSuffix: true })}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Client</h3>
              <div className="flex items-center mt-1">
                <Building className="h-4 w-4 mr-1 text-gray-400" />
                <span>{project.clientName}</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Site</h3>
              <div className="flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                <span>{project.siteName}</span>
              </div>
            </div>
          </div>

          <div className="border rounded-md p-4 bg-gray-50 flex flex-col items-center justify-center">
            {deliveryOrder.fileUrl ? (
              <>
                <div className="text-center mb-4">
                  <FileText className="h-16 w-16 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">Delivery Order Document</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {deliveryOrder.fileUrl.split(".").pop()?.toUpperCase()} Document
                  </p>
                </div>
                <Button asChild>
                  <Link href={deliveryOrder.fileUrl} download target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" />
                    Download Document
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <div className="text-center mb-4">
                  <FileText className="h-16 w-16 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No Document Available</p>
                  <p className="text-xs text-gray-400 mt-1">The delivery order document has not been uploaded yet.</p>
                </div>
                <Button
                  onClick={() => {
                    // In a real app, this would open a file upload dialog
                    alert("This would open a file upload dialog in a real application.")
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-2">Gondolas in Delivery Order</h3>
          {project.gondolas.length > 0 ? (
            <div className="max-h-[200px] overflow-y-auto border rounded">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">Gondola ID</th>
                    <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">Serial Number</th>
                    <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {project.gondolas.map((gondola) => (
                    <tr key={gondola.id} className="border-t">
                      <td className="py-1 px-2 text-xs">
                        <Link href={`/gondolas/${gondola.id}`} className="text-blue-600 hover:underline">
                          {gondola.id}
                        </Link>
                      </td>
                      <td className="py-1 px-2 text-xs">{gondola.serialNumber}</td>
                      <td className="py-1 px-2 text-xs">{gondola.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No gondolas associated with this delivery order.</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          <Button asChild>
            <Link href={`/delivery-orders/${deliveryOrder.id}`}>View Full Details</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
