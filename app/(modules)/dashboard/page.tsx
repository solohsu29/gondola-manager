'use client'
import CertificateExpiryWidget from '@/components/dashboard/CertificateExpiryWidge'
import RecentProjects from '@/components/dashboard/RecentProjects'
import StatCard from '@/components/dashboard/StatCard'

import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store/useStore'
import { Calendar, FileCheck, FileText, Truck } from 'lucide-react'
import React from 'react'


const Dashboard = () => {
  const {
    activeGondolas,
    expiringCertificates,
    pendingInspections,
    totalProjects,
    recentProjects,
    certificateExpiries,
    fetchProjects,
    fetchCertificateExpiries,
    fetchGondolas,
  } = useStore()

  React.useEffect(() => {
    fetchProjects();
    fetchCertificateExpiries();
    fetchGondolas();
  }, []);

  return (
  
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="mt-3 md:mt-0 space-x-3">
            <Button variant="outline"  onClick={() => {
              // In a real app, you would generate a proper report with actual data
              const reportData = {
                date: new Date().toLocaleDateString(),
                activeGondolas: activeGondolas.length,
                expiringCertificates: expiringCertificates.length,
                pendingInspections: pendingInspections.length,
                totalProjects: totalProjects,
                projects: recentProjects.map((p) => ({
                  doNumber: p.deliveryOrders && p.deliveryOrders.length > 0 ? p.deliveryOrders.map((doObj) => doObj.number).join(', ') : 'No DO',
                  client: p.clientName,
                  site: p.siteName,
                  status: p.status,
                })),
              }

              // Convert to JSON string with formatting
              const jsonString = JSON.stringify(reportData, null, 2)

              // Create a blob and download link
              const blob = new Blob([jsonString], { type: "application/json" })
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = `gondola-report-${new Date().toISOString().split("T")[0]}.json`
              document.body.appendChild(a)
              a.click()

              // Clean up
              setTimeout(() => {
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
              }, 0)
            }}>Generate Report</Button>
            <Button  onClick={() => {
              const input = document.createElement("input")
              input.type = "file"
              input.accept = ".pdf,.doc,.docx,.xls,.xlsx"
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0]
                if (file) {
                  // In a real app, you would upload the file to your server
                  alert(
                    `File "${file.name}" selected. In a production app, this would upload the Delivery Order to the server.`,
                  )
                  // You could call a function from your store here
                  // Example: useStore.getState().uploadDeliveryOrder(file);
                }
              }
              input.click()
            }}>Upload DO</Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Active Gondolas" 
            value={activeGondolas.length}
            icon={<Truck className="h-6 w-6 text-gondola-600" />}
            description="Currently deployed equipment" 
          />
          <StatCard 
            title="Expiring Certificates" 
            value={expiringCertificates.length}
            icon={<FileText className="h-6 w-6 text-status-warning" />}
            description="Requiring attention within 30 days" 
            className="border-l-4 border-status-warning"
          />
          <StatCard 
            title="Pending Inspections" 
            value={pendingInspections.length}
            icon={<FileCheck className="h-6 w-6 text-status-pending" />}
            description="Due within the next 7 days" 
          />
          <StatCard 
            title="Total Projects" 
            value={totalProjects}
            icon={<Calendar className="h-6 w-6 text-gondola-500" />}
            description="Active and completed deployments" 
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <div className="md:col-span-2">
            <RecentProjects projects={recentProjects} />
          </div>
          <div className="md:col-span-1">
            <CertificateExpiryWidget certificates={certificateExpiries} />
          </div>
        </div>
      </div>
   
  )
}

export default Dashboard
