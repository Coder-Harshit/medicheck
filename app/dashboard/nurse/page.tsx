"use client"

import * as React from "react"
import { useUser } from '@/hooks/useUser'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'
import OngoingSSITable from '@/components/ssiForms/OngoingSSITable'
import { SSIFormData as FormData } from '@/app/ssiForm/ssiFormContent'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, LogOut, Plus } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

export default function NurseDashboard() {
  const { user, userRole, loading } = useUser()
  const router = useRouter()
  const [ssiForms, setSsiForms] = React.useState<FormData[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const { toast } = useToast()

  React.useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (user && userRole && userRole.role !== 'nurse') {
        router.push(`/dashboard/${userRole.role}`)
      } else {
        fetchSSIForms()
      }
    }
  }, [user, userRole, loading, router])

  async function fetchSSIForms() {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('SSI_Form')
        .select('*')
        .eq('nuid', user.id)
        .eq('status', 'ongoing')
      
      if (error) throw error
      
      setSsiForms(data || [])
    } catch (error) {
      console.error('Error fetching SSI forms:', error)
      toast({
        title: "Error",
        description: "Failed to fetch SSI forms. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleNewForm = async () => {
    try {
      const { data, error } = await supabase
        .from('SSI_Form')
        .select('patientId')
        .order('patientId', { ascending: false })
        .limit(1)

      if (error) throw error

      const lastId = data && data.length > 0 ? parseInt(data[0].patientId) : 0
      const newId = lastId + 1
      router.push(`/ssiForm?formId=${newId}`)
    } catch (error) {
      console.error('Error creating new form:', error)
      toast({
        title: "Error",
        description: "Failed to create a new form. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Nurse Dashboard</CardTitle>
            <CardDescription>Manage your ongoing SSI surveillance forms</CardDescription>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button onClick={handleNewForm} className="bg-black hover:bg-gray-800">
              <Plus className="mr-2 h-4 w-4" />
              New SSI Form
            </Button>
          </div>
          <OngoingSSITable data={ssiForms} />
        </CardContent>
      </Card>
    </div>
  )
}