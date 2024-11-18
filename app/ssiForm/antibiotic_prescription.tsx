"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from 'lucide-react'
import { FormData } from "@/app/ssiForm/page"

interface AntibioticPrescriptionProps {
  formData: FormData
  handleAntibioticChange: (prescriptions: AntibioticPrescription[]) => void
  isEditing?: boolean
}

interface AntibioticPrescription {
  id: string
  name: string
  stage: 'prior' | 'pre_peri' | 'after'
  dose: number
  route: string
  duration: string
}

const routes = ["Oral", "Intravenous", "Intramuscular", "Topical"]

export default function AntibioticPrescription({
  formData,
  handleAntibioticChange,
  isEditing,
}: AntibioticPrescriptionProps) {
  const [prescriptions, setPrescriptions] = React.useState<AntibioticPrescription[]>(
    formData.antibioticPrescriptions || []
  )

  const addPrescription = () => {
    const newPrescription: AntibioticPrescription = {
      id: Date.now().toString(),
      name: "",
      stage: "prior",
      dose: 0,
      route: "",
      duration: "",
    }
    setPrescriptions([...prescriptions, newPrescription])
    handleAntibioticChange([...prescriptions, newPrescription])
  }

  const removePrescription = (id: string) => {
    const updatedPrescriptions = prescriptions.filter((p) => p.id !== id)
    setPrescriptions(updatedPrescriptions)
    handleAntibioticChange(updatedPrescriptions)
  }

  const updatePrescription = (id: string, field: keyof AntibioticPrescription, value: string) => {
    const updatedPrescriptions = prescriptions.map((p) =>
      p.id === id ? { ...p, [field]: value } : p
    )
    setPrescriptions(updatedPrescriptions)
    handleAntibioticChange(updatedPrescriptions)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Antibiotic Prescription</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Antibiotic Name</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Dose</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((prescription) => (
                <TableRow key={prescription.id}>
                  <TableCell>
                    <Input
                      value={prescription.name}
                      onChange={(e) => updatePrescription(prescription.id, "name", e.target.value)}
                      placeholder="Enter antibiotic name"
                      disabled={isEditing}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={prescription.stage}
                      onValueChange={(value) => updatePrescription(prescription.id, "stage", value)}
                      disabled={isEditing}
                    >
                      <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                      {["prior", "pre_peri", "after"].map((stage) => (
                        <SelectItem key={stage} value={stage}>
                        {stage}
                        </SelectItem>
                      ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={prescription.dose}
                      onChange={(e) => updatePrescription(prescription.id, "dose", e.target.value)}
                      placeholder="Enter dose"
                      disabled={isEditing}
                      type="number"
                      min="0"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={prescription.route}
                      onValueChange={(value) => updatePrescription(prescription.id, "route", value)}
                      disabled={isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select route" />
                      </SelectTrigger>
                      <SelectContent>
                        {routes.map((route) => (
                          <SelectItem key={route} value={route}>
                            {route}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={prescription.duration}
                      onChange={(e) => updatePrescription(prescription.id, "duration", e.target.value)}
                      placeholder="Enter duration (in Minutes)"
                      disabled={isEditing}
                      type="number"
                      min="0"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removePrescription(prescription.id)}
                      disabled={isEditing}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={addPrescription} disabled={isEditing} className="bg-black hover:bg-gray-800">
            <Plus className="mr-2 h-4 w-4" /> Add Prescription
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}