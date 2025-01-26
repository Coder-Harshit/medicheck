"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {PatientDataProps} from "@/app/interfaces"

// interface PatientDataProps {
//   formData: FormData
//   handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
//   isEditing?: boolean
// }

export default function PatientData({ formData, handleChange, isEditing }: PatientDataProps) {
  const [dateOfAdmission, setDateOfAdmission] = React.useState<Date | undefined>(
    formData.dateOfAdmission ? new Date(formData.dateOfAdmission) : undefined
  )
  const [dateOfProcedure, setDateOfProcedure] = React.useState<Date | undefined>(
    formData.dateOfProcedure ? new Date(formData.dateOfProcedure) : undefined
  )

  const handleDateChange = (date: Date | undefined, field: string) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd")
      handleChange({
        target: { name: field, value: formattedDate }
      } as React.ChangeEvent<HTMLInputElement>)
      if (field === "dateOfAdmission") setDateOfAdmission(date)
      if (field === "dateOfProcedure") setDateOfProcedure(date)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Patient Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="patientName">Patient Name</Label>
            <Input
              id="patientName"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              disabled={isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patientId">Patient ID</Label>
            <Input
              id="patientId"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              disabled={true}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              disabled={isEditing}
              min={0}
              max={200}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              name="gender"
              value={formData.gender}
              onValueChange={(value) => handleChange({ target: { name: "gender", value } } as React.ChangeEvent<HTMLSelectElement>)}
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Male</SelectItem>
                <SelectItem value="F">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfAdmission">Date of Admission</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateOfAdmission && "text-muted-foreground"
                  )}
                  disabled={isEditing}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateOfAdmission ? format(dateOfAdmission, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateOfAdmission}
                  onSelect={(date) => handleDateChange(date, "dateOfAdmission")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfProcedure">Date of Procedure</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateOfProcedure && "text-muted-foreground"
                  )}
                  disabled={isEditing}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateOfProcedure ? format(dateOfProcedure, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateOfProcedure}
                  onSelect={(date) => handleDateChange(date, "dateOfProcedure")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="admittingDepartment">Admitting Department</Label>
            <Select
              name="admittingDepartment"
              value={formData.admittingDepartment}
              onValueChange={(value) => handleChange({ target: { name: "admittingDepartment", value } } as React.ChangeEvent<HTMLSelectElement>)}
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {["Cardiology", "Dermatology", "Endocrinology", "Gastroenterology", "General Surgery", "Neurology", "GIS Hepatobiliary Surgery", "Others"].map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="departmentPrimarySurgeon">Department&#39;s Primary Surgeon</Label>
            <Select
              name="departmentPrimarySurgeon"
              value={formData.departmentPrimarySurgeon}
              onValueChange={(value) => handleChange({ target: { name: "departmentPrimarySurgeon", value } } as React.ChangeEvent<HTMLSelectElement>)}
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select surgeon" />
              </SelectTrigger>
              <SelectContent>
                {["Dr. A", "Dr. B", "Dr. C", "Dr. D", "Dr. Rajesh Kapoor"].map((surgeon) => (
                  <SelectItem key={surgeon} value={surgeon}>{surgeon}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="procedureName">Procedure Name</Label>
            <Select
              name="procedureName"
              value={formData.procedureName}
              onValueChange={(value) => handleChange({ target: { name: "procedureName", value } } as React.ChangeEvent<HTMLSelectElement>)}
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select procedure" />
              </SelectTrigger>
              <SelectContent>
                {["Appendectomy", "Cholecystectomy", "Hernioplasty", "Hysterectomy", "Mastectomy", "Thyroidectomy", "Exploratory Laprotomy", "Others"].map((procedure) => (
                  <SelectItem key={procedure} value={procedure}>{procedure}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnosis</Label>
            <Select
              name="diagnosis"
              value={formData.diagnosis}
              onValueChange={(value) => handleChange({ target: { name: "diagnosis", value } } as React.ChangeEvent<HTMLSelectElement>)}
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select diagnosis" />
              </SelectTrigger>
              <SelectContent>
                {["Appendicitis", "Cholecystitis", "Hernia", "Malignancy", "Thyroid Disease", "Acute Intestinal Obstruction, COPD", "Others"].map((diagnosis) => (
                  <SelectItem key={diagnosis} value={diagnosis}>{diagnosis}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="procedureDoneBy">Procedure Done By</Label>
            <Select
              name="procedureDoneBy"
              value={formData.procedureDoneBy}
              onValueChange={(value) => handleChange({ target: { name: "procedureDoneBy", value } } as React.ChangeEvent<HTMLSelectElement>)}
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select surgeon" />
              </SelectTrigger>
              <SelectContent>
                {["Dr. A", "Dr. B", "Dr. C", "Dr. D", "Dr. Rajesh Kapoor"].map((surgeon) => (
                  <SelectItem key={surgeon} value={surgeon}>{surgeon}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="otno">Operation Theatre Number</Label>
            <Select
              name="otno"
              value={formData.otno?.toString()}
              onValueChange={(value) => handleChange({ target: { name: "otno", value } } as React.ChangeEvent<HTMLSelectElement>)}
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select OT number" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3].map((num) => (
                  <SelectItem key={num} value={num.toString()}>Operation Theatre {num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="outpatientProcedure">Outpatient Procedure</Label>
            <Select
              name="outpatientProcedure"
              value={formData.outpatientProcedure ? "true" : "false"}
              onValueChange={(value) => handleChange({ target: { name: "outpatientProcedure", value } } as React.ChangeEvent<HTMLSelectElement>)}
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="scenarioOfProcedure">Scenario of Procedure</Label>
            <Select
              name="scenarioOfProcedure"
              value={formData.scenarioOfProcedure}
              onValueChange={(value) => handleChange({ target: { name: "scenarioOfProcedure", value } } as React.ChangeEvent<HTMLSelectElement>)}
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select scenario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Elective">Elective</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="woundClass">Wound Class</Label>
            <Select
              name="woundClass"
              value={formData.woundClass}
              onValueChange={(value) => handleChange({ target: { name: "woundClass", value } } as React.ChangeEvent<HTMLSelectElement>)}
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select wound class" />
              </SelectTrigger>
              <SelectContent>
                {["Clean", "Clean Contaminated", "Contaminated", "Dirty/Infected"].map((woundClass) => (
                  <SelectItem key={woundClass} value={woundClass}>{woundClass}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="papGiven">PAP Given</Label>
            <Select
              name="papGiven"
              value={formData.papGiven ? "true" : "false"}
              onValueChange={(value) => handleChange({ target: { name: "papGiven", value } } as React.ChangeEvent<HTMLSelectElement>)}
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.papGiven && (
            <div className="space-y-2">
              <Label htmlFor="papDuration">PAP Duration (HH:MM)</Label>
              <Input
                id="papDuration"
                name="papDuration"
                type="time"
                value={formData.papDuration}
                onChange={handleChange}
                disabled={isEditing}
              />
            </div>
          )}
          {formData.papGiven && (
            <div className="space-y-2">
              <Label htmlFor="antibioticGiven">Antibiotic Given</Label>
              <Input
                id="antibioticGiven"
                name="antibioticGiven"
                value={formData.antibioticGiven}
                onChange={handleChange}
                disabled={isEditing}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="ssiEventOccurred">SSI Event Occurred</Label>
            <Select
              name="ssiEventOccurred"
              value={formData.ssiEventOccurred ? "true" : "false"}
              onValueChange={(value) => handleChange({ target: { name: "ssiEventOccurred", value } } as React.ChangeEvent<HTMLSelectElement>)}
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.ssiEventOccurred && (
            <div className="space-y-2">
              <Label htmlFor="dateOfSSIEvent">Date of SSI Event</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dateOfSSIEvent && "text-muted-foreground"
                    )}
                    disabled={isEditing}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateOfSSIEvent ? format(new Date(formData.dateOfSSIEvent), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dateOfSSIEvent ? new Date(formData.dateOfSSIEvent) : undefined}
                    onSelect={(date) => handleDateChange(date, "dateOfSSIEvent")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}