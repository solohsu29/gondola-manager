
"use client"
import { useState } from "react";

import { ChevronDown, FileText, Filter, Plus, Search } from "lucide-react";


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
import { mockProjects } from "@/components/data/mockData";
import Link from "next/link";

type TransactionStatus = 'all' | 'active' | 'completed' | 'cancelled';

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus>("all");


  // Filter projects based on search term and status
  const filteredProjects = mockProjects.filter(transaction => {
    const matchesSearch = 
      searchTerm === "" || 
      transaction.doNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.siteName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === "all" || 
      transaction.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
       
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <FileText className="h-6 w-6 text-gondola-600 mr-2" />
                <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
              </div>
              <div className="space-x-3">
                <Button variant="outline" asChild>
                  <Link href="/documents">View All Documents</Link>
                </Button>
                <Button>
                  <Plus className="mr-1 h-4 w-4" />
                  Upload DO
                </Button>
              </div>
            </div>
            
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Filter Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search by DO number, client, site..."
                      className="pl-8 pr-4"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-1">
                          <Filter className="h-4 w-4" />
                          Status
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[180px]">
                        {(['all', 'active', 'completed', 'cancelled'] as const).map((status) => (
                          <DropdownMenuCheckboxItem
                            key={status}
                            checked={statusFilter === status}
                            onCheckedChange={() => setStatusFilter(status)}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Status</TableHead>
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
                        filteredProjects.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">
                              <Link href={`/projects/${transaction.id}`} className="text-gondola-600 hover:text-gondola-800 underline">
                                {transaction.doNumber}
                              </Link>
                            </TableCell>
                            <TableCell>{transaction.clientName}</TableCell>
                            <TableCell>{transaction.siteName}</TableCell>
                            <TableCell className="text-center">{transaction.gondolas.length}</TableCell>
                            <TableCell>
                              {transaction.startDate.toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {formatDistanceToNow(transaction.createdAt, { addSuffix: true })}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge variant={
                                transaction.status === 'active' ? 'outline' :
                                transaction.status === 'completed' ? 'default' : 'destructive'
                              }>
                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                              </Badge>
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
