import * as React from "react"
import { useRouter } from 'next/navigation'
import { FormData } from '@/app/ssiForm/page'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface OngoingSSITableProps {
  data: FormData[]
}

export default function OngoingSSITable({ data }: OngoingSSITableProps) {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize] = React.useState(10)
  const router = useRouter()

  const columns: { Header: string; accessor: keyof FormData }[] = [
    { Header: 'Patient Name', accessor: 'patientName' },
    { Header: 'Patient ID', accessor: 'patientId' },
    { Header: 'Status', accessor: 'status' },
  ]

  const handleRowClick = (id: string) => {
    router.push(`/ssiForm?formId=${id}`)
  }

  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const totalPages = Math.ceil(data.length / pageSize)

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessor}>{column.Header}</TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.patientId} className="cursor-pointer hover:bg-muted/50">
                {columns.map((column) => (
                  <TableCell key={column.accessor} onClick={() => handleRowClick(row.patientId)}>
                    {column.accessor === 'status' ? (
                      <Badge variant="secondary">{row[column.accessor]}</Badge>
                    ) : (
                      row[column.accessor].toString()
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => handleRowClick(row.patientId)}>
                    Continue
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              // disabled={currentPage === 1}
              className={currentPage === 1 ? 'disabled' : ''}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink 
                onClick={() => setCurrentPage(i + 1)}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              // disabled={currentPage === totalPages}
              className={currentPage === totalPages ? 'disabled' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}