"use client"

import * as React from "react"
import { Lock, Unlock } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormLockToggleProps {
  isLocked: boolean
  onToggle: (locked: boolean) => void
  className?: string
}

export default function FormLockToggle({ isLocked, onToggle, className }: FormLockToggleProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Switch
        id="form-lock"
        checked={!isLocked}
        onCheckedChange={(checked) => onToggle(!checked)}
        className="data-[state=checked]:bg-green-500"
      />
      <Label htmlFor="form-lock" className="flex items-center gap-2 cursor-pointer">
        {isLocked ? (
          <>
            <Lock className="h-4 w-4" />
            <span>Form Locked</span>
          </>
        ) : (
          <>
            <Unlock className="h-4 w-4" />
            <span>Form Unlocked</span>
          </>
        )}
      </Label>
    </div>
  )
}