"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { FormData, SSIEvalCheckListItem } from "@/app/ssiForm/page"

interface SSIEvalProps {
  formData: FormData
  handleYesNoChange: (index: number, value: boolean) => void
  handleRemarkChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void
  isEditing?: boolean
}

export default function SSIEval({
  formData,
  handleYesNoChange,
  handleRemarkChange,
  isEditing,
}: SSIEvalProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">SSI Evaluation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Patient Name</Label>
              <div className="p-2 bg-muted rounded">{formData.patientName}</div>
            </div>
            <div className="space-y-2">
              <Label>Patient ID</Label>
              <div className="p-2 bg-muted rounded">{formData.patientId}</div>
            </div>
            <div className="space-y-2">
              <Label>Age</Label>
              <div className="p-2 bg-muted rounded">{formData.age}</div>
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <div className="p-2 bg-muted rounded">{formData.gender === 'M' ? 'Male' : 'Female'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Procedure Name</Label>
              <div className="p-2 bg-muted rounded">{formData.procedureName}</div>
            </div>
            <div className="space-y-2">
              <Label>Date of Procedure</Label>
              <div className="p-2 bg-muted rounded">{formData.dateOfProcedure}</div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">S.No</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="w-[100px]">Yes/No</TableHead>
                <TableHead className="w-[200px]">Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.SSIEvalCheckList.map((item: SSIEvalCheckListItem, index: number) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.item}</TableCell>
                  <TableCell>
                    <Switch
                      checked={item.yesNo || false}
                      onCheckedChange={(checked) => handleYesNoChange(index, checked)}
                      disabled={isEditing}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.remark}
                      onChange={(e) => handleRemarkChange(index, e)}
                      placeholder="Enter remarks"
                      disabled={isEditing}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}