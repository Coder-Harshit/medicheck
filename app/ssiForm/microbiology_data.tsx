"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormData } from "@/app/ssiForm/page"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { MultiSelect } from "@/components/multi-select-dropdown"

interface MicrobiologyDataProps {
  formData: FormData
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  handleIsolateChange: (
    isolate: 'isolate1' | 'isolate2',
    category: 'sensitive' | 'resistant' | 'intermediate',
    values: string[]
  ) => void
  isEditing?: boolean
}

const antibioticOptions = [
  { value: "amoxicillin", label: "Amoxicillin" },
  { value: "ampicillin", label: "Ampicillin" },
  { value: "azithromycin", label: "Azithromycin" },
  { value: "cefazolin", label: "Cefazolin" },
  { value: "ceftriaxone", label: "Ceftriaxone" },
  { value: "ciprofloxacin", label: "Ciprofloxacin" },
  { value: "clindamycin", label: "Clindamycin" },
  { value: "doxycycline", label: "Doxycycline" },
  // "Erythromycin", "Gentamicin", "Levofloxacin", "Metronidazole",
  // "Penicillin", "Tetracycline", "Trimethoprim-Sulfamethoxazole", "Vancomycin"
]

const microorganisms = [
  "Staphylococcus aureus",
  "Escherichia coli",
  "Pseudomonas aeruginosa",
  "Klebsiella pneumoniae",
  "Enterococcus faecalis",
  "Proteus mirabilis",
  "Candida albicans",
  "Acinetobacter baumannii",
]

export default function MicrobiologyData({
  formData,
  handleChange,
  handleIsolateChange,
  isEditing,
}: MicrobiologyDataProps) {
  const handleIsolateDataChange = (
    isolateKey: 'isolate1' | 'isolate2',
    category: 'sensitive' | 'resistant' | 'intermediate',
    values: string[]
  ) => {
    handleIsolateChange(isolateKey, category, values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Microbiology Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-semibold">Micro-organisms Implicated in SSI</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              name="microorganism1"
              value={formData.microorganism1}
              onValueChange={(value) => handleChange({ target: { name: "microorganism1", value } } as React.ChangeEvent<HTMLSelectElement>)}
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select microorganism 1" />
              </SelectTrigger>
              <SelectContent>
                {microorganisms.map((organism) => (
                  <SelectItem key={organism} value={organism}>{organism}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              name="microorganism2"
              value={formData.microorganism2}
              onValueChange={(value) => handleChange({ target: { name: "microorganism2", value } } as React.ChangeEvent<HTMLSelectElement>)}
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select microorganism 2" />
              </SelectTrigger>
              <SelectContent>
                {microorganisms.map((organism) => (
                  <SelectItem key={organism} value={organism}>{organism}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <IsolateForm
          isolate="isolate1"
          formData={formData.isolate1}
          handleIsolateChange={handleIsolateChange}
          isEditing={isEditing}
          title="Isolate-1 (Antibiotic Susceptibility Pattern)"
        />

        <IsolateForm
          isolate="isolate2"
          formData={formData.isolate2}
          handleIsolateChange={handleIsolateChange}
          isEditing={isEditing}
          title="Isolate-2 (Antibiotic Susceptibility Pattern)"
        />
      </CardContent>
    </Card>
  )
}

interface IsolateFormProps {
  isolate: 'isolate1' | 'isolate2'
  formData: { sensitive: string; resistant: string; intermediate: string }
  handleIsolateChange: (
    isolate: 'isolate1' | 'isolate2',
    category: 'sensitive' | 'resistant' | 'intermediate',
    value: string[]
  ) => void
  isEditing?: boolean
  title: string
}

function IsolateForm({ isolate, formData, handleIsolateChange, isEditing, title }: IsolateFormProps) {
  const categories = ['sensitive', 'resistant', 'intermediate'] as const;

  const [selectedAntibiotic, setSelectedAntibiotic] = React.useState<string[]>([]);

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">{title}</Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category} className="space-y-2">
            <Label htmlFor={`${isolate}_${category}`} className="capitalize">
              {category}
            </Label>
            <MultiSelect
              options={antibioticOptions}
              onValueChange={(selectedValues) =>
                handleIsolateChange(isolate, category, selectedValues)
              }
              defaultValue={formData[category]}
              placeholder={`Select ${category} antibiotics`}
              disabled={isEditing}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// interface MultiSelectProps {
//   options: string[]
//   selected: string[]
//   onChange: (value: string[]) => void
//   placeholder: string
//   disabled?: boolean
// }

// function MultiSelect({ options, selected, onChange, placeholder, disabled }: MultiSelectProps) {
//   const [open, setOpen] = React.useState(false)

//   const handleSelect = (option: string) => {
//     const updatedSelected = selected.includes(option)
//       ? selected.filter((item) => item !== option)
//       : [...selected, option]
//     onChange(updatedSelected)
//   }

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           role="combobox"
//           aria-expanded={open}
//           className="w-full justify-between"
//           disabled={disabled}
//         >
//           {selected.length > 0
//             ? `${selected.length} selected`
//             : placeholder}
//           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-full p-0">
//         <Command>
//           <CommandInput placeholder="Search antibiotics..." />
//           <CommandEmpty>No antibiotic found.</CommandEmpty>
//           <CommandGroup className="max-h-64 overflow-auto">
//             {options.map((option) => (
//               <CommandItem
//                 key={option}
//                 onSelect={() => handleSelect(option)}
//               >
//                 <Check
//                   className={cn(
//                     "mr-2 h-4 w-4",
//                     selected.includes(option) ? "opacity-100" : "opacity-0"
//                   )}
//                 />
//                 {option}
//               </CommandItem>
//             ))}
//           </CommandGroup>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   )
// }