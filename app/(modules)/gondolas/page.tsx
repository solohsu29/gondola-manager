
"use client"
import { useState } from "react";
import {  Download, Filter, Search, Trash } from "lucide-react";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/lib/store/useStore";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar } from "@/components/ui/avatar";
import { EditGondolaDialog } from "@/components/gondolas/EditGondolaDialog";
import { NewGondolaDialog } from "@/components/gondolas/NewGondolaDialog";

type ProjectStatus = 'all' | 'active' | 'completed' | 'cancelled';

import { useEffect } from "react";
import Image from "next/image";

const Gondolas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10); // You can make this user-selectable if desired
  const { gondolas, fetchGondolas } = useStore();

  useEffect(() => {
    fetchGondolas();
  }, [fetchGondolas]);


const formatDate = (date?: Date | string) => {
  if (!date) return "N/A";
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid date";
  return d.toISOString().split("T")[0];
}
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "deployed":
      return "outline"
    case "in use":
      return "secondary"
    case "under inspection":
      return "default"
    case "maintenance":
      return "destructive"
    case "off hired":
      return "outline"
    default:
      return "secondary"
  }
}
  // Filter projects based on search term and status
  const filteredGondolas = gondolas.filter(gondola => {
    const matchesSearch = 
      searchTerm === "" || 
      gondola.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gondola.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gondola.bay.toLowerCase().includes(searchTerm.toLowerCase()) || 
      gondola.block.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === "all" || 
      gondola.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const pageCount = Math.max(1, Math.ceil(filteredGondolas.length / pageSize));
  const paginatedGondolas = filteredGondolas.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  // Reset to page 0 if search/filter changes and current page is out of range
  useEffect(() => {
    if (pageIndex > 0 && pageIndex >= pageCount) {
      setPageIndex(0);
    }
  }, [filteredGondolas.length, pageCount]);

  return (
       
          <div className="max-w-7xl mx-auto">
           
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Filter Gondolas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search gondolas..."
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
              <SelectItem value="deployed">Deployed</SelectItem>
              <SelectItem value="in-use">In Use</SelectItem>
              <SelectItem value="under-inspection">Under Inspection</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="off-hired">Off-Hired</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <NewGondolaDialog />
        </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-0">
                <CardTitle>
                  Gondolas
                  <Badge variant="outline" className="ml-2">
                    {filteredGondolas.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Image</TableHead>
                        <TableHead>Gondola ID </TableHead>
                        <TableHead>Serial Number</TableHead>
                        <TableHead className="text-center">Location</TableHead>
                        <TableHead>Last Inspection</TableHead>
                        <TableHead>Next Inspection</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                       
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGondolas.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                            No matching gondolas found
                          </TableCell>
                        </TableRow>
                      ) : (
                         paginatedGondolas?.map((gondola) => (
                          <TableRow key={gondola.id}>
                            <TableCell className="font-medium">
                            <Avatar className="h-10 w-10 rounded-md">
                    {gondola?.photos?.length > 0 ? (
                      <Image
                        src={gondola?.photos?.[0].url || "/placeholder.svg"}
                        alt={gondola.id}
                        className="object-cover"
                        width={100}
                        height={100}
                      />
                    ) : (
                      <div className="bg-gray-100 h-full w-full flex items-center justify-center text-gray-400">
                        <span className="text-xs">No img</span>
                      </div>
                    )}
                  </Avatar>
                            </TableCell>
                            <TableCell>
  {gondola?.id ? (
    <Link href={`/gondolas/${gondola.id}`} className="text-blue-600 hover:underline">
     

      {gondola?.id?.length > 10 ? gondola?.id?.slice(0, 10) + '...' : gondola?.id}
    </Link>
  ) : '-'}
</TableCell>
<TableCell>{gondola?.serialNumber || '-'}</TableCell>
<TableCell className="text-center">
  {gondola?.block || '-'}, {gondola?.bay || '-'} ,
  {gondola?.floor || '-'}, {gondola?.elevation || '-'}</TableCell>

<TableCell>
  {gondola?.lastInspection ? formatDate(gondola.lastInspection) : '-'}</TableCell>
<TableCell className="text-right">
  {gondola?.nextInspection ? formatDate(gondola.nextInspection) : '-'}</TableCell>
<TableCell className="text-right">
  {gondola?.status ? (
    <Badge variant={getStatusBadgeVariant(gondola.status)}>{gondola.status.replace("-", " ")}</Badge>
  ) : '-'}
</TableCell>
                            <TableCell className="text-right">
                            <div className="flex gap-2">
                    <EditGondolaDialog
                      gondola={gondola}
                      onSave={() => setSearchTerm(searchTerm)} // Trigger re-render
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                         <Trash className="w-4 h-4"/>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the gondola{" "}
                            <strong>{gondola.id}</strong> and remove it from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              useStore.getState().deleteGondola(gondola.id)
                              // Force re-render by updating search term state
                              setSearchTerm(searchTerm)
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
                
                <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between w-full gap-2">
                     <div className="w-full">
                       {(() => {
                         const total = filteredGondolas.length;
                         const start = total === 0 ? 0 : pageIndex * pageSize + 1;
                         const end = Math.min((pageIndex + 1) * pageSize, total);
                         return (
                           <span>
                             Showing {start}-{end} of {total} gondola{total !== 1 ? 's' : ''}
                           </span>
                         );
                       })()}
                     </div>
                     <Pagination className="justify-end">
                       <PaginationContent>
                         <PaginationItem>
                           <PaginationPrevious
                             href="#"
                             onClick={e => { e.preventDefault(); setPageIndex((i: number) => Math.max(0, i - 1)); }}
                             aria-disabled={pageIndex === 0}
                           />
                         </PaginationItem>
                         {Array.from({ length: pageCount }, (_, i) => (
                           <PaginationItem key={i}>
                             <PaginationLink
                               href="#"
                               isActive={i === pageIndex}
                               onClick={e => { e.preventDefault(); setPageIndex((i as number)); }}
                             >
                               {i + 1}
                             </PaginationLink>
                           </PaginationItem>
                         ))}
                         <PaginationItem>
                           <PaginationNext
                             href="#"
                             onClick={e => { e.preventDefault(); setPageIndex((i: number) => Math.min(pageCount - 1, i + 1)); }}
                             aria-disabled={pageIndex === pageCount - 1}
                           />
                         </PaginationItem>
                       </PaginationContent>
                     </Pagination>
                   </div>
              </CardContent>
            </Card>
          </div>
     
     
  );
};

export default Gondolas;
