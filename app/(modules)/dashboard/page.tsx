import CertificateExpiryWidget from '@/components/dashboard/CertificateExpiryWidge'
import RecentProjects from '@/components/dashboard/RecentProjects'

import StatCard from '@/components/dashboard/StatCard'
import { dashboardStats, mockCertificateExpiries, mockProjects } from '@/components/data/mockData'
import { Button } from '@/components/ui/button'
import { Calendar, FileCheck, FileText, Truck } from 'lucide-react'
import React from 'react'

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <div className="mt-3 md:mt-0 space-x-3">
                <Button variant="outline">Generate Report</Button>
                <Button>Upload DO</Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <StatCard
                title="Active Gondolas" 
                value={dashboardStats.activeGondolas}
                icon={<Truck className="h-6 w-6 text-gondola-600" />}
                description="Currently deployed equipment" 
              />
              <StatCard 
                title="Expiring Certificates" 
                value={dashboardStats.expiringCertificates}
                icon={<FileText className="h-6 w-6 text-status-warning" />}
                description="Requiring attention within 30 days" 
                className="border-l-4 border-status-warning"
              />
              <StatCard 
                title="Pending Inspections" 
                value={dashboardStats.pendingInspections}
                icon={<FileCheck className="h-6 w-6 text-status-pending" />}
                description="Due within the next 7 days" 
              />
              <StatCard 
                title="Total Projects" 
                value={dashboardStats.totalProjects}
                icon={<Calendar className="h-6 w-6 text-gondola-500" />}
                description="Active and completed deployments" 
              />
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-6">
              <div className="md:col-span-2">
                <RecentProjects projects={mockProjects} />
              </div>
              <div className="md:col-span-1">
                <CertificateExpiryWidget certificates={mockCertificateExpiries} />
              </div>
            </div>
          </div>
  )
}

export default Dashboard
