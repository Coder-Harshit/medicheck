"use client"

import * as React from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'
import { useUser } from '@/hooks/useUser'
import { formatDate } from '@/utils/dateHandling'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, Send } from 'lucide-react'
import PatientData from './patient_data'
import MicrobiologyData from './microbiology_data'
import AntibioticPrescription from './antibiotic_prescription'
import PostOpSheet from './postop_form'
import SSIEvent from './ssiEvent'
import SSIEval from './ssiEval'
import { days, symptoms } from './constants';



interface Antibiotic {
    abop_stage: 'prior' | 'pre_peri' | 'after';
    antibiotic: string;
    route: string;
    duration: number;
    doses: number;
}

export interface SSIEvalCheckListItem {
    item: string;   // The description of the checklist item.
    yesNo: boolean | null;  // Boolean value for Yes/No selection (null if not answered).
    remark: string; // Any remarks for that checklist item.
}

const symptomsDict: { [key: string]: { [key: string]: boolean } } = {};

symptoms.forEach(symptom => {
    symptomsDict[symptom] = {};
    days.forEach(day => {
        symptomsDict[symptom][day] = false;
    });
});

const SSIEvalChecklistItems = [
    "Administer antimicrobial prophylaxis in accordance with evidence-based standards.",
    "Administer antimicrobial prophylaxis within 1 hour prior to incision.",
    "Select antimicrobial prophylaxis agents on basis of surgical procedure.",
    "Select antimicrobial prophylaxis agents on basis of SSI pathogens.",
    "Select antimicrobial prophylaxis agents on published recommendations.",
    "Discontinue antibiotics within 24 hours after surgery end.",
    "Redose antibiotic at 3-hour interval in procedures > 3 hours.",
    "Adjust antimicrobial prophylaxis dose for obese patients (BMI>30).",
    "Not remove hair at operative site unless it interferes with operation.",
    "Use razors for hair removal at operative site.",
    "Use clippers or depilatory agent for hair removal.",
    "Use appropriate antiseptic agent for skin preparation.",
    "Mechanically prepare the colon (enemas, cathartic agents).",
    "Administer non-absorbable oral antimicrobial agents before operation.",
    "Keep OR doors closed during surgery except as needed.",
    "Maintain immediate post-op normothermia.",
];


export interface FormData {
    patientName: string;
    patientId: string;
    age: number;
    gender: 'M' | 'F';
    dateOfAdmission: string;
    dateOfProcedure: string;
    admittingDepartment: string;
    procedureDoneBy: string;
    departmentPrimarySurgeon: string;
    procedureName: string;
    diagnosis: string;
    otno: number;
    outpatientProcedure: boolean;
    scenarioOfProcedure: 'Elective' | 'Emergency';
    woundClass: 'Clean' | 'Clean Contaminated' | 'Contaminated' | 'Dirty/Infected';
    papGiven: boolean;
    papDuration: string;
    antibioticGiven: string;
    ssiEventOccurred: boolean;
    dateOfSSIEvent: string;
    microorganism1: string;
    microorganism2: string;
    secondaryBSIdeath: boolean;
    antibiotics: Antibiotic[];
    timeOfInduction: string;
    timeOfSkinIncision: string;
    timeOfEndSurgery: string;
    isolate1: {
        sensitive: string;
        resistant: string;
        intermediate: string;
    };
    isolate2: {
        sensitive: string;
        resistant: string;
        intermediate: string;
    };
    symptomsDict: {
        [key: string]: { [key: string]: boolean }
    };
    SSIEvalCheckList: SSIEvalCheckListItem[];
    specificEvent: string;
    organSpace: string;
    detected: string;
    status: 'ongoing' | 'to-be-reviewed' | 'reviewed';
}

export default function SSIForm() {
    const { user, userRole, loading, userID } = useUser()
    const router = useRouter()
    const searchParams = useSearchParams()
    const formId = searchParams.get('formId')
    const [formData, setFormData] = React.useState<FormData>(getInitialFormData())
    const [isLoading, setIsLoading] = React.useState(true)
    const [isSaving, setIsSaving] = React.useState(false)
    const [activeTab, setActiveTab] = React.useState("patient-data")
    const { toast } = useToast()

    // State to control editing sections
    const [isEditing, setIsEditing] = React.useState({
        patientData: true,
        microbiologyData: true,
        antibioticData: true,
        postOpData: true,
        ssiEventData: true,
        ssiEvalData: true, // Unlocked by default for doctors   
    });

    React.useEffect(() => {
        if (!loading) {
            // console.log('Auth state:', {
            //     user: user,
            //     userRole: userRole,
            //     loading: loading,
            //     userID: userID
            // })            
            if (!user) {
                // console.log('No user found, redirecting to login')
                router.push('/login')
            } else if (userRole?.role !== 'nurse' && userRole?.role !== 'doctor') {
                // console.log('Invalid role, redirecting to dashboard')
                router.push('/dashboard')
            } else {
                // console.log('User authorized, fetching form data')
                fetchFormData()
            }
        }
    }, [user, loading, userRole, router])
        
    React.useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login')
            } else if (userRole?.role !== 'nurse' && userRole?.role !== 'doctor') {
                router.push('/dashboard')
            } else {
                fetchFormData()
                if (userRole?.role === 'doctor') {
                    // Unlock SSI Evaluation section by default for doctors
                    setIsEditing((prev) => ({ ...prev, ssiEvalData: false }));
                }
            }
        }
    }, [user, loading, userRole, router])

    const fetchFormData = async () => {
        // if (!formId || !userID) return
        if (!formId || !user) return

        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('SSI_Form')
                .select('*')
                .eq('patientId', formId)
                .eq('nuid', userID)
                // .eq('nuid', user)
                // .eq('status', 'ongoing')
                .single()

            if (error) throw error

            if (data) {
                setFormData({
                    ...getInitialFormData(),
                    ...data,
                    dateOfAdmission: data.dateOfAdmission || formatDate(new Date()),
                    dateOfProcedure: data.dateOfProcedure || formatDate(new Date()),
                    dateOfSSIEvent: data.dateOfSSIEvent || formatDate(new Date()),
                    // Ensure arrays and objects are properly structured
                    antibiotics: Array.isArray(data.antibiotics) ? data.antibiotics : [getInitialFormData().antibiotics[0]],
                    symptomsDict: {
                        ...symptomsDict,
                        ...(data.symptomsDict || {})
                    },
                    SSIEvalCheckList: Array.isArray(data.SSIEvalCheckList)
                        ? data.SSIEvalCheckList
                        : getInitialFormData().SSIEvalCheckList
                });
            }
        } catch (error) {
            console.error('Error fetching form data:', error)
            toast({
                title: "Error",
                description: "Failed to fetch form data. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setFormData(prevData => ({
            ...prevData,
            // [name]: type === 'number' ? Number(value) : value
            [name]: (name === 'papGiven' || name === 'outpatientProcedure' || name === 'ssiEventOccurred' || name === 'secondaryBSIdeath')
                ? value === "true"
                : type === 'number'
                    ? Number(value)
                    : value
        }));
    }

    const toggleEdit = (section: keyof typeof isEditing) => {
        setIsEditing((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleAntibioticChange = (index: number, name: string, value: string | number) => {
        setFormData(prevData => ({
            ...prevData,
            antibiotics: prevData.antibiotics.map((antibiotic, i) =>
                i === index ? { ...antibiotic, [name]: value } : antibiotic
            )
        }));
    };

    const handleIsolateChange = (isolate: 'isolate1' | 'isolate2', category: 'sensitive' | 'resistant' | 'intermediate', value: string) => {
        setFormData(prevData => ({
            ...prevData,
            [isolate]: {
                ...prevData[isolate],
                [category]: value
            }
        }));
    };

    const handleYesNoChange = (index: number, value: boolean) => {
        setFormData(prevData => ({
            ...prevData,
            SSIEvalCheckList: prevData.SSIEvalCheckList.map((item, i) =>
                i === index ? { ...item, yesNo: value, remark: value ? item.remark : '' } : item
            )
        }));
    };

    const handleRemarkChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prevData => ({
            ...prevData,
            SSIEvalCheckList: prevData.SSIEvalCheckList.map((item, i) =>
                i === index ? { ...item, remark: e.target.value } : item
            )
        }));
    };

    const handleSpecificEventChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            specificEvent: value,
            organSpace: value !== 'organSpace' ? '' : prevData.organSpace
        }));
    };

    const addAntibiotic = () => {
        setFormData(prevData => ({
            ...prevData,
            antibiotics: [...prevData.antibiotics, {
                abop_stage: 'prior',
                antibiotic: '',
                route: '',
                duration: 0,
                doses: 0,
            }]
        }));
    };

    const removeAntibiotic = () => {
        setFormData(prevData => ({
            ...prevData,
            antibiotics: prevData.antibiotics.length > 1
                ? prevData.antibiotics.slice(0, -1)
                : [getInitialFormData().antibiotics[0]]
        }));
    };

    const handlePostOpChange = (symptom: string, day: number | string, value: boolean) => {
        setFormData(prevData => ({
            ...prevData,
            symptomsDict: {
                ...prevData.symptomsDict,
                [symptom]: {
                    ...prevData.symptomsDict[symptom],
                    [day]: value
                }
            }
        }));
    };


    // const handleSubmit = async (isDraft: boolean = false) => {
    //     setIsSaving(true)
    //     try {
    //         const status = isDraft ? 'ongoing' : 'to-be-reviewed'
    //         const { error } = await supabase
    //             .from('SSI_Form')
    //             .upsert({
    //                 ...formData,
    //                 nuid: userID,
    //                 status: status,
    //             })

    //         if (error) throw error

    //         toast({
    //             title: isDraft ? "Draft Saved" : "Form Submitted",
    //             description: isDraft ? "Your progress has been saved." : "The form has been submitted for review.",
    //         })

    //         if (!isDraft) {
    //             router.push('/dashboard')
    //         }
    //     } catch (error) {
    //         console.error('Error saving form:', error)
    //         toast({
    //             title: "Error",
    //             description: "Failed to save the form. Please try again.",
    //             variant: "destructive",
    //         })
    //     } finally {
    //         setIsSaving(false)
    //     }
    // }
    const handleSubmit = async (isDraft: boolean = false) => {
        // e.preventDefault();
        if (!isDraft) {
            alert("Please complete all steps before submitting");
            return;
        }

        setIsSaving(true)
        // FORM VALIDATION
        if (!isDraft) {
            for (const key in formData) {
                // Use Object.prototype.hasOwnProperty to avoid inherited properties
                if (Object.prototype.hasOwnProperty.call(formData, key)) {
                    const value = formData[key as keyof FormData];

                    // Skip validation for `organSpace` unless specificEvent is 'organSpace'
                    if (key === 'organSpace' && formData.specificEvent !== 'organSpace') {
                        continue;
                    }
                    if ((key === 'antibioticGiven' || key === 'papDuration') && formData.papGiven == false) {
                        continue;
                    }
                    // non-required fields
                    else if (key === 'microorganism1' || key === 'microorganism2' || key === 'isloate1' || key === 'isloate2') { continue; }
                    else if (value === null || value === undefined || value === "") {
                        alert(`Please fill out the ${key} field.`);
                        return;
                    }
                }
            }
        }

        try {
            const status = isDraft ? 'ongoing' : 'to-be-reviewed'
            const { error } = await supabase
                .from('SSI_Form')
                .upsert({
                    ...formData,
                    // nuid: userID,
                    nuid: user,
                    status: status,
                })

            if (error) throw error

            toast({
                title: isDraft ? "Draft Saved" : "Form Submitted",
                description: isDraft ? "Your progress has been saved." : "The form has been submitted for review.",
            })

            // if (!isDraft) {
            //     router.push('/dashboard')
            // }
        } catch (error) {
            console.error('Error saving form:', error)
            toast({
                title: "Error",
                description: "Failed to save the form. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
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
                <CardHeader>
                    <CardTitle>Surgical Site Infection Surveillance Form</CardTitle>
                    <CardDescription>
                        Please fill out all sections of this form carefully.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                            <TabsTrigger value="patient-data">Patient Data</TabsTrigger>
                            <TabsTrigger value="microbiology-data">Microbiology</TabsTrigger>
                            <TabsTrigger value="antibiotic-prescription">Antibiotics</TabsTrigger>
                            <TabsTrigger value="post-op-sheet">Post-Op Sheet</TabsTrigger>
                            <TabsTrigger value="ssi-event">SSI Event</TabsTrigger>
                            {userRole?.role === 'doctor' && (
                                <TabsTrigger value="ssi-eval">SSI Evaluation</TabsTrigger>
                            )}
                        </TabsList>
                        <TabsContent value="patient-data">
                            <PatientData formData={formData} handleChange={handleChange} />
                        </TabsContent>
                        <TabsContent value="microbiology-data">
                            <MicrobiologyData formData={formData} handleChange={handleChange} handleIsolateChange={handleIsolateChange}/>
                        </TabsContent>
                        <TabsContent value="antibiotic-prescription">
                            <AntibioticPrescription formData={formData} handleChange={handleChange} addAntibiotic={addAntibiotic} removeAntibiotic={removeAntibiotic} handleAntibioticChange={handleAntibioticChange}/>
                        </TabsContent>
                        <TabsContent value="post-op-sheet">
                            <PostOpSheet formData={formData} handlePostOpChange={handlePostOpChange} />
                        </TabsContent>
                        <TabsContent value="ssi-event">
                            <SSIEvent formData={formData} handleSpecificEventChange={handleSpecificEventChange} handleChange={handleChange}/>
                        </TabsContent>
                        {userRole?.role === 'doctor' && (
                            <TabsContent value="ssi-eval">
                                <SSIEval formData={formData} handleRemarkChange={handleRemarkChange} handleYesNoChange={handleYesNoChange} />
                            </TabsContent>
                        )}
                    </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => router.push('/dashboard')}>
                        Cancel
                    </Button>
                    <div className="space-x-2">
                        <Button
                            variant="secondary"
                            onClick={() => handleSubmit(true)}
                            disabled={isSaving}
                            // className="bg-green-500"
                        >
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Draft
                        </Button>
                        <Button
                            onClick={() => handleSubmit(false)}
                            disabled={isSaving}
                            className="bg-green-500"
                        >
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            Submit
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

function getInitialFormData(): FormData {
    return {
        patientName: '',
        patientId: '',
        age: 0,
        gender: 'M',
        dateOfAdmission: formatDate(new Date()),
        dateOfProcedure: formatDate(new Date()),
        admittingDepartment: '',
        departmentPrimarySurgeon: '',
        procedureDoneBy: '',
        procedureName: '',
        diagnosis: '',
        otno: 1,
        outpatientProcedure: true,
        scenarioOfProcedure: 'Elective',
        woundClass: 'Clean',
        papGiven: true,
        antibioticGiven: '',
        papDuration: '',
        ssiEventOccurred: true,
        dateOfSSIEvent: formatDate(new Date()),
        microorganism1: '',
        microorganism2: '',
        secondaryBSIdeath: false,
        antibiotics: [{
            abop_stage: 'prior',
            antibiotic: '',
            route: '',
            duration: 0,
            doses: 0,
        }],
        timeOfInduction: new Date().toLocaleTimeString(),
        timeOfSkinIncision: new Date().toLocaleTimeString(),
        timeOfEndSurgery: new Date().toLocaleTimeString(),
        isolate1: {
            sensitive: '',
            resistant: '',
            intermediate: '',
        },
        isolate2: {
            sensitive: '',
            resistant: '',
            intermediate: '',
        },
        symptomsDict: { ...symptomsDict },
        SSIEvalCheckList: SSIEvalChecklistItems.map((item) => ({
            item: item,
            yesNo: false,
            remark: "",
        })),
        specificEvent: '',
        organSpace: '',
        detected: '',
        status: 'ongoing',
    };
}