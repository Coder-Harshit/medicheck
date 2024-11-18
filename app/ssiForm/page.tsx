"use client"

import * as React from "react"
import SSIFormContent from "./ssiFormContent"


export default function SSIForm() {
    
    return (
        <React.Suspense fallback={
            <div className="flex justify-center items-center h-screen">
                <div className="h-8 w-8 animate-spin">Loading...</div>
            </div>
        }>
            <SSIFormContent />
        </React.Suspense>
    )
}
