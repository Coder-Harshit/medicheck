"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { SSIFormData as FormData } from "@/app/ssiForm/ssiFormContent"
import ssionEventProps from "@/interfaces"
// interface SSIEventProps {
//   formData: FormData
//   handleSpecificEventChange: (e: React.ChangeEvent<HTMLInputElement>) => void
//   handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
//   isEditing?: boolean
// }

export default function SSIEvent({
  formData,
  handleSpecificEventChange,
  handleChange,
  isEditing,
}: SSIEventProps) {
  const specificEvents = [
    { id: "sip", label: "Superficial Incisional Primary (SIP)" },
    { id: "sis", label: "Superficial Incisional Secondary (SIS)" },
    { id: "dip", label: "Deep Incisional Primary (DIP)" },
    { id: "dis", label: "Deep Incisional Secondary (DIS)" },
    { id: "organSpace", label: "Organ/Space" },
  ]

  const detectionTypes = [
    { id: "A", label: "During admission (A)" },
    { id: "P", label: "Post-discharge surveillance (P)" },
    { id: "RF", label: "Readmission to facility (RF)" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Specific Event
            {/* <span className="text-red-500 ml-1">*</span> */}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            disabled={isEditing}
            value={formData.specificEvent}
            onValueChange={(value) => 
              handleSpecificEventChange({ 
                target: { name: "specificEvent", value } 
              } as React.ChangeEvent<HTMLInputElement>)
            }
            className="space-y-4"
          >
            {specificEvents.map((event) => (
              <div key={event.id} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={event.id} 
                  id={event.id}
                  disabled={isEditing}
                  className="text-blue-500 hover:text-blue-400 bg-gray-200"
                />
                <Label 
                  htmlFor={event.id}
                  className={cn(
                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  )}
                >
                  {event.label}
                </Label>
                {event.id === "organSpace" && formData.specificEvent === "organSpace" && (
                  <Input
                    id="organSpaceInput"
                    name="organSpace"
                    value={formData.organSpace}
                    onChange={handleChange}
                    placeholder="Specify site"
                    className="ml-4 w-[200px]"
                    disabled={isEditing}
                  />
                )}
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Detection Type
            {/* <span className="text-red-500 ml-1">*</span> */}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            disabled={isEditing}
            value={formData.detected}
            onValueChange={(value) =>
              handleChange({
                target: { name: "detected", value }
              } as React.ChangeEvent<HTMLInputElement>)
            }
            className="space-y-4"
          >
            {detectionTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={type.id} 
                id={type.id}
                disabled={isEditing}
                className="text-blue-500 hover:text-blue-400 bg-gray-200"
              />
                <Label
                  htmlFor={type.id}
                  className={cn(
                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  )}
                >
                  {type.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  )
}