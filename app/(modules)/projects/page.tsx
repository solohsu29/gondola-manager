
"use client"
import { useState } from "react";

import { ChevronDown, Download, FileCheck, FileText, Filter, Plus, Search, Trash } from "lucide-react";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect } from "react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { DeliveryOrderViewer } from "@/components/projects/DeliveryOrderViewer";
import { useStore } from "@/lib/store/useStore";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { NewProjectDialog } from "@/components/projects/NewProjectDialog";
import { EditProjectDialog } from "@/components/projects/EditProjectDialog";

type ProjectStatus = 'all' | 'active' | 'completed' | 'cancelled';

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");


  const { projects, fetchProjects } = useStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Filter projects based on search term and status
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchTerm === "" ||
      (project.deliveryOrders && project.deliveryOrders.some((doItem) => doItem.number.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.siteName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
console.log('projects',filteredProjects)
  return (
       
          <div className="max-w-7xl mx-auto">
           
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Filter Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search projects..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <NewProjectDialog />
        </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-0">
                <CardTitle>
                  Projects
                  <Badge variant="outline" className="ml-2">
                    {filteredProjects.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">DO Number</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Site</TableHead>
                        <TableHead className="text-center">Gondolas</TableHead>
                        <TableHead>Start Date</TableHead>
                        {/* <TableHead>Created</TableHead> */}
                        <TableHead className="text-right">Status</TableHead>
                        <TableHead className="text-right">Inspections</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProjects.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                            No matching projects found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProjects.map((project) => (
                          <TableRow key={project.id}>
                            <TableCell className="font-medium">
                              <Link href={`/projects/${project.id}`} className="text-gondola-600 hover:text-gondola-800 underline">
                                {project.deliveryOrders && project.deliveryOrders.length > 0
  ? project.deliveryOrders.map((doObj) => doObj.number).join(', ')
  : 'No DO' }
                              </Link>
                            </TableCell>
                            <TableCell>{project.clientName.length > 20 ? project.clientName.slice(0, 20) + '...' : project.clientName}</TableCell>
                            <TableCell>{project.siteName.length > 20 ? project.siteName.slice(0, 20) + '...' : project.siteName}</TableCell>
                            <TableCell className="text-center">{project.gondolas.length}</TableCell>
                            <TableCell>
                              {(() => {
                                const date = typeof project.startDate === 'string' ? new Date(project.startDate) : project.startDate;
                                return date && typeof date.toLocaleDateString === 'function' ? date.toLocaleDateString() : '';
                              })()}
                            </TableCell>
                            {/* <TableCell>
                              {formatDistanceToNow(project.createdAt, { addSuffix: true })}
                            </TableCell> */}
                            <TableCell className="text-right">
                              <Badge variant={
                                project.status === 'active' ? 'outline' :
                                project.status === 'completed' ? 'default' : 'destructive'
                              }>
                                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                            <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      window.location.href = `/projects?projectId=${project.id}&scheduleInspection=true`
                    }}
                  >
                    <FileCheck className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                            </TableCell>
                            <TableCell className="text-right">
                            <div className="flex gap-2">
                    {project.deliveryOrders && project.deliveryOrders[0] && (
                      <DeliveryOrderViewer deliveryOrder={project.deliveryOrders[0]} project={project} />
                    )}
                    <EditProjectDialog
                      project={project}
                      onSave={() => setSearchTerm(searchTerm)} // Trigger re-render
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash className="h-4 w-4"/>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the project{" "}
                            <strong>{project.deliveryOrders && project.deliveryOrders[0] ? project.deliveryOrders[0].number : 'No DO'}</strong> and remove it from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              try {
                                await useStore.getState().deleteProject(project.id);
                                await fetchProjects();
                                setSearchTerm(searchTerm); // Force re-render if needed
                              } catch (err) {
                                alert('Failed to delete project.');
                              }
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </CardContent>
            </Card>
          </div>
     
     
  );
};

export default Projects;
