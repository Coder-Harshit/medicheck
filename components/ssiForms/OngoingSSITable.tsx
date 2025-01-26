import * as React from "react"
import { useRouter } from 'next/navigation'
import { SSIFormData as FormData } from '@/app/interfaces'
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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { supabase } from "@/utils/supabase/client"
import { Trash2 } from "lucide-react"

interface OngoingSSITableProps {
  data: FormData[]
}

export default function OngoingSSITable({ data }: OngoingSSITableProps) {
  const [dataValue, setData] = React.useState(data)
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

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('SSI_Form')
        .delete()
        .eq('patientId', id)

      if (error) throw error
    } catch (error) {
      console.error('Error:', error)
    }
    setData((prevData) => {
      const filteredData = prevData.filter((item) => item.patientId !== id);
      if (filteredData.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1); // Decrement page if last page is now empty
      }
      return filteredData;
    });
    // console.log(`Delete button clicked for ID: ${id}`)
  }

  const paginatedData = dataValue.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const totalPages = Math.ceil(dataValue.length / pageSize)

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
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 hover:text-white text-white"  // Optional: Change the button color to indicate danger/deletion
                    onClick={() => handleDelete(row.patientId)}
                  >
                    <Trash2 className="h-4 w-4" />
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
              className={currentPage === totalPages ? 'disabled' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
