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
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Loader2, Save, Send, ArrowBigRight } from 'lucide-react'
import PatientData from './patient_data'
import MicrobiologyData from './microbiology_data'
import AntibioticPrescription from './antibiotic_prescription'
import PostOpSheet from './postop_form'
import SSIEvent from './ssiEvent'
import SSIEval from './ssiEval'
import { days, symptoms, SSIEvalChecklistItems } from './constants';
// import { predictSSI } from '@/api';


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

export interface SSIFormData {
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
    timeOfInduction: string;
    timeOfSkinIncision: string;
    timeOfEndSurgery: string;
    isolate1: {
        sensitive: string[];
        resistant: string[];
        intermediate: string[];
    };
    isolate2: {
        sensitive: string[];
        resistant: string[];
        intermediate: string[];
    };
    symptomsDict: {
        [key: string]: { [key: string]: boolean }
    };
    SSIEvalCheckList: SSIEvalCheckListItem[];
    specificEvent: string;
    organSpace: string;
    detected: string;
    status: 'ongoing' | 'to-be-reviewed' | 'reviewed';
    antibioticPrescriptions: {
        id: string
        name: string
        stage: 'prior' | 'pre_peri' | 'after'
        dose: number
        route: string
        duration: string
    }[]
}

export default function SSIFormContent() {
    const { user, userRole, loading, userID } = useUser()
    const router = useRouter()
    const searchParams = useSearchParams()
    const formId = searchParams.get('formId')
    const [formData, setFormData] = React.useState<SSIFormData>(getInitialFormData())
    const [isLoading, setIsLoading] = React.useState(true)
    const [isSaving, setIsSaving] = React.useState(false)
    const [activeTab, setActiveTab] = React.useState("patient-data")
    const { toast } = useToast()
    formData.patientId = formId || ''
    const [predictionResult, setPredictionResult] = React.useState<string | null>(null);
    const [predictionError, setPredictionError] = React.useState<string | null>(null);
    const [isPredicting, setIsPredicting] = React.useState(false);

    // For granular editing control
    const [isEditing, setIsEditing] = React.useState({
        patientData: userRole?.role === 'nurse',
        microbiologyData: userRole?.role === 'nurse',
        antibioticData: userRole?.role === 'nurse',
        postOpData: userRole?.role === 'nurse',
        ssiEventData: userRole?.role === 'nurse',
        ssiEvalData: false, // Always locked initially for doctors
    })

    React.useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login')
            } else if (userRole?.role !== 'nurse' && userRole?.role !== 'doctor') {
                router.push('/dashboard')
            } else {
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

    const handlePrediction = async () => {
        console.log('Predicting SSI...');
        console.log('Form data:', formData);
        setIsPredicting(true);
        setPredictionError(null);

        try {
            const formDataToSubmit = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'symptomsDict') {
                    const convertedSymptomsDict = Object.fromEntries(
                        Object.entries(value).map(([symptom, days]) => [
                            symptom,
                            Object.fromEntries(
                                Object.entries(days as { [key: string]: boolean }).map(([day, val]) => [day, val])
                            )
                        ])
                    );
                    formDataToSubmit.append(key, JSON.stringify(convertedSymptomsDict));
                } else if (typeof value === 'object' && value !== null) {
                    formDataToSubmit.append(key, JSON.stringify(value));
                } else {
                    formDataToSubmit.append(key, value as string);
                }
            });

            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                body: formDataToSubmit,
            });
            console.log('Response:', response);
            if (!response.ok) {
                throw new Error('Prediction request failed');
            }

            const result = await response.json();
            setPredictionResult(result);
        } catch (err) {
            setPredictionError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsPredicting(false);
        }
    };

    const getNextTab = (currentTab: string) => {
        const tabs = userRole?.role === 'doctor' ?
            [
                'patient-data',
                'microbiology-data',
                'antibiotic-prescription',
                'post-op-sheet',
                'summary_and_predict',
                'ssi-event',
                'ssi-eval'
            ] : [
                'patient-data',
                'microbiology-data',
                'post-op-sheet',
                'ssi-event',
                'ssi-eval'
            ];

        const currentIndex = tabs.indexOf(currentTab);
        return tabs[currentIndex + 1] || 'ssi-eval';
    };

    const fetchFormData = async () => {
        if (!formId || !user) return

        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('SSI_Form')
                .select('*')
                .eq('patientId', formId)
                .eq('nuid', userID)
                .single()

            if (error) throw error

            if (data) {
                setFormData({
                    ...getInitialFormData(),
                    ...data,
                    dateOfAdmission: data.dateOfAdmission || formatDate(new Date()),
                    dateOfProcedure: data.dateOfProcedure || formatDate(new Date()),
                    dateOfSSIEvent: data.dateOfSSIEvent || formatDate(new Date()),
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
            [name]: (name === 'papGiven' || name === 'outpatientProcedure' || name === 'ssiEventOccurred' || name === 'secondaryBSIdeath')
                ? value === "true"
                : type === 'number'
                    ? Number(value)
                    : value
        }));
    }

    const handleAntibioticChange = (prescriptions: SSIFormData['antibioticPrescriptions']) => {
        setFormData(prev => ({
            ...prev,
            antibioticPrescriptions: prescriptions
        }))
    }

    const handleIsolateChange = (
        isolate: 'isolate1' | 'isolate2',
        category: 'sensitive' | 'resistant' | 'intermediate',
        value: string[]
    ) => {
        setFormData(prevData => ({
            ...prevData,
            [isolate]: {
                ...prevData[isolate] || {},
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

    const handleSubmit = async (isDraft: boolean = false) => {
        console.log('Submitting form...');
        console.log('Form data:', formData);
        // e.preventDefault();
        // if (!isDraft) {
        //     alert("Please complete all steps before submitting");
        //     return;
        // }

        setIsSaving(true)
        // FORM VALIDATION
        if (!isDraft) {
            for (const key in formData) {
                // Use Object.prototype.hasOwnProperty to avoid inherited properties
                if (Object.prototype.hasOwnProperty.call(formData, key)) {
                    const value = formData[key as keyof SSIFormData];

                    // Skip validation for `organSpace` unless specificEvent is 'organSpace'
                    if (key === 'organSpace' && formData.specificEvent !== 'organSpace') {
                        continue;
                    }
                    if ((key === 'antibioticGiven' || key === 'papDuration') && formData.papGiven == false) {
                        continue;
                    }
                    // non-required fields
                    else if (key === 'microorganism1' || key === 'microorganism2' || key === 'isloate1' || key === 'isloate2' || key==='reviewedAt' || key==='reviewedBy') { continue; }
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
                    nuid: userID,
                    status: status,
                })

            if (error) throw error

            toast({
                title: isDraft ? "Draft Saved" : "Form Submitted",
                description: isDraft ? "Your progress has been saved." : "The form has been submitted for review.",
            })

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
        router.push('/dashboard')
    }

    const toggleEditing = (section: keyof typeof isEditing) => {
        if (userRole?.role === 'doctor') {
            setIsEditing(prev => ({
                ...prev,
                [section]: !prev[section]
            }))
            toast({
                title: isEditing[section] ? `${section} Locked` : `${section} Unlocked`,
                description: isEditing[section] ? `${section} is now in read-only mode.` : `You can now edit ${section}.`,
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
        <React.Suspense>
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
                            <TabsList className={`grid w-full ${userRole?.role === 'doctor' ? 'grid-cols-7' : 'grid-cols-6'}`}>
                                <TabsTrigger value="patient-data">Patient Data</TabsTrigger>
                                <TabsTrigger value="microbiology-data">Microbiology</TabsTrigger>
                                <TabsTrigger value="antibiotic-prescription">Antibiotics</TabsTrigger>
                                <TabsTrigger value="post-op-sheet">Post-Op Sheet</TabsTrigger>
                                {userRole?.role === 'doctor' && <TabsTrigger value="summary_and_predict">Summary & Prediction</TabsTrigger>}
                                <TabsTrigger value="ssi-event">SSI Event</TabsTrigger>
                                <TabsTrigger value="ssi-eval">SSI Evaluation</TabsTrigger>
                            </TabsList>

                            <TabsContent value="patient-data">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Patient Data</h3>
                                    {userRole?.role === 'doctor' && (
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="patient-data-lock"
                                                checked={isEditing.patientData}
                                                onCheckedChange={() => toggleEditing('patientData')}
                                                className="data-[state=checked]:bg-red-400"
                                            />
                                            <Label htmlFor="patient-data-lock">
                                                {isEditing.patientData ? 'Locked' : 'Unlocked'}
                                            </Label>
                                        </div>
                                    )}
                                </div>
                                <PatientData
                                    formData={formData}
                                    handleChange={handleChange}
                                    isEditing={isEditing.patientData}
                                />
                            </TabsContent>

                            <TabsContent value="microbiology-data">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Microbiology Data</h3>
                                    {userRole?.role === 'doctor' && (
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="microbiology-data-lock"
                                                checked={isEditing.microbiologyData}
                                                onCheckedChange={() => toggleEditing('microbiologyData')}
                                                className="data-[state=checked]:bg-red-400"
                                            />
                                            <Label htmlFor="microbiology-data-lock">
                                                {isEditing.microbiologyData ? 'Locked' : 'Unlocked'}
                                            </Label>
                                        </div>
                                    )}
                                </div>
                                <MicrobiologyData
                                    formData={formData}
                                    handleChange={handleChange}
                                    handleIsolateChange={handleIsolateChange}
                                    isEditing={isEditing.microbiologyData}
                                />
                            </TabsContent>

                            <TabsContent value="antibiotic-prescription">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Antibiotic Prescription</h3>
                                    {userRole?.role === 'doctor' && (
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="antibiotic-data-lock"
                                                checked={isEditing.antibioticData}
                                                onCheckedChange={() => toggleEditing('antibioticData')}
                                                className="data-[state=checked]:bg-red-400"
                                            />
                                            <Label htmlFor="antibiotic-data-lock">
                                                {isEditing.antibioticData ? 'Locked' : 'Unlocked'}
                                            </Label>
                                        </div>
                                    )}
                                </div>
                                <AntibioticPrescription
                                    formData={formData}
                                    handleAntibioticChange={handleAntibioticChange}
                                    isEditing={isEditing.antibioticData}
                                />
                            </TabsContent>

                            <TabsContent value="post-op-sheet">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Post-Op Sheet</h3>
                                    {userRole?.role === 'doctor' && (
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="post-op-data-lock"
                                                checked={isEditing.postOpData}
                                                onCheckedChange={() => toggleEditing('postOpData')}
                                                className="data-[state=checked]:bg-red-400"
                                            />
                                            <Label htmlFor="post-op-data-lock">
                                                {isEditing.postOpData ? 'Locked' : 'Unlocked'}
                                            </Label>
                                        </div>
                                    )}
                                </div>
                                <PostOpSheet
                                    formData={formData}
                                    handlePostOpChange={handlePostOpChange}
                                    isEditing={isEditing.postOpData}
                                />
                            </TabsContent>

                            {userRole?.role === 'doctor' && (
                                <TabsContent value="summary_and_predict">
                                    return (
                                    <div>
                                        <Button onClick={handlePrediction} disabled={isPredicting} className="bg-black">
                                            {isPredicting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Predict SSI'}
                                        </Button>
                                        {predictionResult && <p>Prediction: {predictionResult}</p>}
                                        {predictionError && <p className="text-red-500">Error: {predictionError}</p>}
                                    </div>
                                    );
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold">Summary & Prediction</h3>
                                        <Label htmlFor="prediction">
                                            Prediction: <span className="font-semibold">No</span>
                                        </Label>
                                    </div>
                                </TabsContent>
                            )}
                            <TabsContent value="ssi-event">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">SSI Event</h3>
                                    {userRole?.role === 'doctor' && (
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="ssi-event-data-lock"
                                                checked={isEditing.ssiEventData}
                                                onCheckedChange={() => toggleEditing('ssiEventData')}
                                                className="data-[state=checked]:bg-red-400"
                                            />
                                            <Label htmlFor="ssi-event-data-lock">
                                                {isEditing.ssiEventData ? 'Locked' : 'Unlocked'}
                                            </Label>
                                        </div>
                                    )}
                                </div>
                                <SSIEvent
                                    formData={formData}
                                    handleSpecificEventChange={handleSpecificEventChange}
                                    handleChange={handleChange}
                                    isEditing={isEditing.ssiEventData}
                                />
                            </TabsContent>
                            {/* {userRole?.role === 'doctor' && ( */}
                            <TabsContent value="ssi-eval">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">SSI Evaluation</h3>
                                    {userRole?.role === 'doctor' && (
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="ssi-eval-data-lock"
                                                checked={isEditing.ssiEvalData}
                                                onCheckedChange={() => toggleEditing('ssiEvalData')}
                                                className="data-[state=checked]:bg-red-400"
                                            />
                                            <Label htmlFor="ssi-eval-data-lock">
                                                {isEditing.ssiEvalData ? 'Locked' : 'Unlocked'}
                                            </Label>
                                        </div>
                                    )}
                                </div>
                                <SSIEval formData={formData} handleRemarkChange={handleRemarkChange} handleYesNoChange={handleYesNoChange} isEditing={isEditing.ssiEvalData} />
                            </TabsContent>
                            {/* )} */}
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
                                className="bg-lime-500 text-primary hover:bg-lime-600"
                            >
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Draft
                            </Button>
                            {activeTab === 'ssi-eval' ? (
                                <Button
                                    onClick={() => handleSubmit(false)}
                                    disabled={isSaving}
                                    className="bg-green-500 hover:bg-green-600"
                                >
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                    Submit
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => setActiveTab(getNextTab(activeTab))}
                                    className="bg-blue-500 hover:bg-blue-600"
                                >

                                    <ArrowBigRight className="mr-2 h-4 w-4" />
                                    Next
                                </Button>
                            )}
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </React.Suspense>
    )
}

function getInitialFormData(): SSIFormData {
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
        antibioticPrescriptions: [{
            id: '',
            name: '',
            stage: 'prior',
            dose: 0,
            route: '',
            duration: '',
        }],
        timeOfInduction: new Date().toLocaleTimeString(),
        timeOfSkinIncision: new Date().toLocaleTimeString(),
        timeOfEndSurgery: new Date().toLocaleTimeString(),
        isolate1: {
            sensitive: [],
            resistant: [],
            intermediate: [],
        },
        isolate2: {
            sensitive: [],
            resistant: [],
            intermediate: [],
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