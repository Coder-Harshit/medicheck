"use client"

import * as React from "react";
import {useFormData} from "@/hooks/useFormData";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Loader2, Save, Send, ArrowBigRight} from 'lucide-react';
import PatientData from './patient_data';
import MicrobiologyData from './microbiology_data';
import AntibioticPrescription from './antibiotic_prescription';
import PostOpSheet from './postop_form';
import SSIEvent from './ssiEvent';
import SSIEval from './ssiEval';
import {useRouter} from "next/navigation";
import {useUser} from "@/hooks/useUser";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";

// export interface SSIFormData {
//     patientName: string;
//     patientId: string;
//     age: number;
//     gender: 'M' | 'F';
//     dateOfAdmission: string;
//     dateOfProcedure: string;
//     admittingDepartment: string;
//     procedureDoneBy: string;
//     departmentPrimarySurgeon: string;
//     procedureName: string;
//     diagnosis: string;
//     otno: number;
//     outpatientProcedure: boolean;
//     scenarioOfProcedure: 'Elective' | 'Emergency';
//     woundClass: 'Clean' | 'Clean Contaminated' | 'Contaminated' | 'Dirty/Infected';
//     papGiven: boolean;
//     papDuration: string;
//     antibioticGiven: string;
//     ssiEventOccurred: boolean;
//     dateOfSSIEvent: string;
//     microorganism1: string;
//     microorganism2: string;
//     secondaryBSIdeath: boolean;
//     timeOfInduction: string;
//     timeOfSkinIncision: string;
//     timeOfEndSurgery: string;
//     isolate1: {
//         sensitive: string[];
//         resistant: string[];
//         intermediate: string[];
//     };
//     isolate2: {
//         sensitive: string[];
//         resistant: string[];
//         intermediate: string[];
//     };
//     symptomsDict: {
//         [key: string]: { [key: string]: boolean }
//     };
//     SSIEvalCheckList: SSIEvalCheckListItem[];
//     specificEvent: string;
//     organSpace: string;
//     detected: string;
//     status: 'ongoing' | 'to-be-reviewed' | 'reviewed';
//     antibioticPrescriptions: {
//         id: string
//         name: string
//         stage: 'prior' | 'pre_peri' | 'after'
//         dose: number
//         route: string
//         duration: string
//     }[]
// }

export default function SSIFormContent() {
    const {
        formData,
        isLoading,
        isSaving,
        handleChange,
        handleSubmit,
        handleAntibioticChange,
        handleIsolateChange,
        handleYesNoChange,
        handleRemarkChange,
        handleSpecificEventChange,
        handlePostOpChange,
        isEditing,
        toggleEditing,
        activeTab,
        setActiveTab,
        handlePrediction,
        predictionResult,
        predictionError,
        isPredicting,
        getNextTab
    } = useFormData();
    const router = useRouter();
    const {userRole} = useUser();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin"/>
            </div>
        );
    }

    // formData.patientId = formId || ''

    return (
        // <React.Suspense>
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
                        <TabsList
                            className={`grid w-full ${userRole?.role === 'doctor' ? 'grid-cols-7' : 'grid-cols-6'}`}>
                            <TabsTrigger value="patient-data">Patient Data</TabsTrigger>
                            <TabsTrigger value="microbiology-data">Microbiology</TabsTrigger>
                            <TabsTrigger value="antibiotic-prescription">Antibiotics</TabsTrigger>
                            <TabsTrigger value="post-op-sheet">Post-Op Sheet</TabsTrigger>
                            {userRole?.role === 'doctor' &&
                                <TabsTrigger value="summary_and_predict">Summary & Prediction</TabsTrigger>}
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
                                <div className="flex flex-col space-y-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold">Summary & Prediction</h3>
                                        <Button onClick={handlePrediction} disabled={isPredicting} className="bg-black">
                                            {isPredicting ?
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : 'Predict SSI'}
                                        </Button>
                                    </div>
                                    {predictionResult && (
                                        <div className="p-4 bg-green-100 text-green-800 rounded-md">
                                            <p>Prediction: {predictionResult}</p>
                                        </div>
                                    )}
                                    {predictionError && (
                                        <div className="p-4 bg-red-100 text-red-800 rounded-md">
                                            <p>Error: {predictionError}</p>
                                        </div>
                                    )}
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
                            <SSIEval formData={formData} handleRemarkChange={handleRemarkChange}
                                     handleYesNoChange={handleYesNoChange} isEditing={isEditing.ssiEvalData}/>
                        </TabsContent>
                        {/* )} */}
                    </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => router.push('/dashboard')}>
                        Cancel
                    </Button>
                    <div className="space-x-2">
                        {userRole?.role === 'nurse' && (
                            <Button
                                variant="secondary"
                                onClick={() => handleSubmit(true)}
                                disabled={isSaving}
                                className="bg-lime-500 text-primary hover:bg-lime-600"
                            >
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> :
                                    <Save className="mr-2 h-4 w-4"/>}
                                Save Draft
                            </Button>
                        )}
                        {activeTab === 'ssi-eval' ? (
                            <Button
                                onClick={() => handleSubmit(false)}
                                disabled={isSaving}
                                className="bg-green-500 hover:bg-green-600"
                            >
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> :
                                    <Send className="mr-2 h-4 w-4"/>}
                                Submit
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setActiveTab(getNextTab(activeTab))}
                                className="bg-blue-500 hover:bg-blue-600"
                            >
                                <ArrowBigRight className="mr-2 h-4 w-4"/>
                                Next
                            </Button>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </div>
        // </React.Suspense>
    )
}
