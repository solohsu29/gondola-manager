"use client";
import React from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { X, FileText } from "lucide-react";

export interface DocumentsTableRow {
  id: string;
  name: string;
  type: string;
  uploadedAt: string | Date;
  status: string;
  [key: string]: any;
}

interface DocumentsTableProps {
  documents: DocumentsTableRow[];
  onDelete?: (index: number) => void;
  isUploading?: boolean;
  pageSize?: number;
}

export default function DocumentsTable({ documents, onDelete, isUploading = false, pageSize = 5 }: DocumentsTableProps) {
  const columns = React.useMemo<ColumnDef<DocumentsTableRow, any>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: info => (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" />
            <a
              href={`/api/documents/${info.row.original.id}/download`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline"
              download={info.row.original.name}
            >
              {info.getValue<string>()}
            </a>
          </div>
        ),
      },
      {
        header: "Type",
        accessorKey: "type",
      },
      {
        header: "Uploaded",
        accessorKey: "uploadedAt",
        cell: info => {
          const value = info.getValue<string | Date>();
          const date = value instanceof Date ? value : new Date(value);
          return <span>{date.toLocaleDateString()}</span>;
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: info => (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${info.row.original.status === "valid" ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"}`}>
            {info.row.original.status === "valid" ? "Valid" : "Expired"}
          </span>
        ),
      },
      {
        header: "Actions",
        id: "actions",
        cell: info => (
          <Button variant="outline" size="sm" asChild>
          <a href={info.row.original.fileUrl} target="_blank" rel="noreferrer" download={info.row.original.name}>
<FileText className="h-4 w-4 mr-1" />
Download
</a>
        </Button>
        ),
      },
    ],
    [onDelete, isUploading]
  );

  const [pageIndex, setPageIndex] = React.useState(0);
  const table = useReactTable({
    data: documents,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination: { pageIndex, pageSize } },
    onPaginationChange: updater => {
      if (typeof updater === "function") {
        setPageIndex(updater({ pageIndex } as any).pageIndex);
      } else if (typeof updater === "object") {
        setPageIndex(updater.pageIndex);
      }
    },
    pageCount: Math.ceil(documents.length / pageSize),
    manualPagination: false,
  });

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-4 py-2 whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between mt-4">
        <div>
          {(() => {
            const total = documents.length;
            const pageSize = table.getState().pagination.pageSize;
            const pageIndex = table.getState().pagination.pageIndex;
            const start = total === 0 ? 0 : pageIndex * pageSize + 1;
            const end = Math.min((pageIndex + 1) * pageSize, total);
            return (
              <span>
                Showing {start}-{end} of {total} result{total !== 1 ? 's' : ''} (Page {pageIndex + 1} of {Math.max(1, table.getPageCount())})
              </span>
            );
          })()}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
