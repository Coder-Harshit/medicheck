"use client"

import * as React from "react"
// import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Hospital, Eye, EyeOff, Lock, Mail, LoaderCircle } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'
import { toast } from '@/hooks/use-toast'
import { motion } from "framer-motion"

const LoginPage = () => {
    const [email, setEmail] = React.useState<string>('')
    const [password, setPassword] = React.useState<string>('')
    const [loading, setLoading] = React.useState<boolean>(false)
    const [showPassword, setShowPassword] = React.useState<boolean>(false)
    const router = useRouter()

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        setLoading(false)

        if (error) {
            toast({
                title: "Error! Login Failed",
                description: (error.message),
                variant: "destructive",
                duration: 5000,
            })
        } else {
            toast({
                title: "Success",
                description: "You have been logged in successfully.",
                duration: 3000,
            })
            router.push('/dashboard')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
            >
                {/* Decorative elements */}
                <div className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20">
                    <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700" />
                    <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600" />
                </div>
                <Card className="w-[380px] shadow-xl">
                    <CardHeader className="space-y-1">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="flex justify-center mb-4"
                        >
                            <div className="p-3 rounded-full bg-slate-200">
                                <Hospital className="w-10 h-10 text-black" />
                            </div>
                        </motion.div>
                        <CardTitle className="text-2xl text-center font-bold">JAYPEE HOSPITAL</CardTitle>
                        <CardDescription className="text-center">
                            Healthcare Information Management System
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@jaypeehealthcare.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                        required
                                        className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                        required
                                        className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <div className="relative">
                                    <Button
                                        type="submit"
                                        className=" bg-black hover:bg-black w-full font-semibold transition-all duration-200 hover:scale-[1.02]"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Lock className="mr-2 h-4 w-4" />
                                        )}
                                        Sign In
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <p className="text-center text-sm text-muted-foreground">
                                Protected by Jaypee Hospital Security
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div>
    )
}

export default LoginPage