"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { SSIFormData as FormData } from "@/app/ssiForm/ssiFormContent"
import { days, symptoms } from "./constants"
import PostOpSheetProps from "@/interfaces"

// interface PostOpSheetProps {
//   formData: FormData
//   handlePostOpChange: (symptom: string, day: number | string, value: boolean) => void
//   isEditing?: boolean
// }

const symptomLabels: Record<string, string> = {
  purulentDischarge: "Purulent Discharge",
  localizedPain: "Localized Pain",
  localizedSwelling: "Localized Swelling",
  fever: "Fever",
  incisionOpened: "Incision Opened",
  dehiscence: "Dehiscence",
  abscess: "Abscess",
  microorganismsSeen: "Microorganisms Seen",
  imagingEvidence: "Imaging Evidence",
  positiveCulture: "Positive Culture",
  bloodCultureSent: "Blood Culture Sent",
  diagnosisSSI: "Diagnosis SSI"
}

export default function PostOpSheet({
  formData,
  handlePostOpChange,
  isEditing
}: PostOpSheetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Post-operative Monitoring Sheet</CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Symptom</TableHead>
              {days.map((day) => (
                <TableHead key={day} className="text-center">
                  Day {day}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {symptoms.map((symptom) => (
              <TableRow key={symptom}>
                <TableCell className="font-medium">
                  {symptomLabels[symptom] || symptom}
                </TableCell>
                {days.map((day) => (
                  <TableCell key={`${symptom}-${day}`} className="text-center">
                    <Switch
                      checked={!!formData.symptomsDict[symptom][day]}
                      onCheckedChange={(checked) => handlePostOpChange(symptom, day, checked)}
                      disabled={isEditing}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}