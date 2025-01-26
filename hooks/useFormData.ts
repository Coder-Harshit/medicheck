// hooks/useFormData.ts
import { useState, useEffect } from 'react';
import { SSIFormData } from '@/app/interfaces';
import { supabase } from '@/utils/supabase/client';
import { useUser } from '@/hooks/useUser';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import {formatDate} from "@/utils/dateHandling";
import { SSIEvalChecklistItems, symptoms, days} from "@/app/ssiForm/constants";
import * as React from "react";

function getInitialFormData(): SSIFormData {
    const symptomsDict: { [key: string]: { [key: string]: boolean } } = {};
    symptoms.forEach(symptom => {
        symptomsDict[symptom] = {};
        days.forEach(day => {
            symptomsDict[symptom][day] = false;
        });
    });

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

export const useFormData = () => {
    const { user, userRole, loading, userID } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();
    const formId = searchParams.get('formId');
    const [formData, setFormData] = useState<SSIFormData>(getInitialFormData());
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isPredicting, setIsPredicting] = useState(false);
    const [predictionResult, setPredictionResult] = useState<string | null>(null);
    const [predictionError, setPredictionError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("patient-data");

    console.log(formId)
    console.log(formData)

    // For granular editing control
    const [isEditing, setIsEditing] = React.useState({
        patientData: userRole?.role === 'nurse',
        microbiologyData: userRole?.role === 'nurse',
        antibioticData: userRole?.role === 'nurse',
        postOpData: userRole?.role === 'nurse',
        ssiEventData: userRole?.role === 'nurse',
        ssiEvalData: false, // Always locked initially for doctors
    })


    formData.patientId = formId || ''

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (userRole?.role !== 'nurse' && userRole?.role !== 'doctor') {
                router.push('/dashboard');
            } else {
                fetchFormData();
                if (userRole?.role === 'doctor') {
                    // Unlock SSI Evaluation section by default for doctors
                    setIsEditing((prev) => ({ ...prev, ssiEvalData: false }));
                }
            }
        }
    }, [user, loading, userRole, router]);

    const fetchFormData = async () => {
        if (!formId || !user) return;

        setIsLoading(true);
        // try {
        //     const { data, error } = await supabase
        //         .from('SSI_Form')
        //         .select('*')
        //         .eq('patientId', formId)
        //         .eq('nuid', userID)
        //         .single();

        try {
            let query = supabase
                .from('SSI_Form')
                .select('*')
                .eq('patientId', formId);

            if (userRole?.role === 'nurse') {
                query = query.eq('nuid', userID);
            }

            const { data, error } = await query.single();


            if (error) throw error;

            if (data) {
                const symptomsDict: { [key: string]: { [key: string]: boolean } } = {};
                symptoms.forEach(symptom => {
                    symptomsDict[symptom] = {};
                    days.forEach(day => {
                        symptomsDict[symptom][day] = false;
                    });
                });

                setFormData({
                    ...getInitialFormData(),
                    ...data,
                    dateOfAdmission: data.dateOfAdmission || formatDate(new Date()),
                    dateOfProcedure: data.dateOfProcedure || formatDate(new Date()),
                    dateOfSSIEvent: data.dateOfSSIEvent || formatDate(new Date()),
                    symptomsDict: {
                        ...symptomsDict,
                        ...(data.symptomsDict || {}),
                    },
                    SSIEvalCheckList: Array.isArray(data.SSIEvalCheckList)
                        ? data.SSIEvalCheckList
                        : getInitialFormData().SSIEvalCheckList,
                });
            }
        } catch (error) {
            console.error('Error fetching form data:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch form data. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'papGiven' || name === 'outpatientProcedure' || name === 'ssiEventOccurred' || name === 'secondaryBSIdeath'
                ? value === 'true'
                : type === 'number'
                    ? Number(value)
                    : value,
        }));
    };

    const handleAntibioticChange = (prescriptions: SSIFormData['antibioticPrescriptions']) => {
        setFormData((prev) => ({
            ...prev,
            antibioticPrescriptions: prescriptions,
        }));
    };

    const handleIsolateChange = (
        isolate: 'isolate1' | 'isolate2',
        category: 'sensitive' | 'resistant' | 'intermediate',
        value: string[]
    ) => {
        setFormData((prevData) => ({
            ...prevData,
            [isolate]: {
                ...prevData[isolate] || {},
                [category]: value,
            },
        }));
    };

    const handleYesNoChange = (index: number, value: boolean) => {
        setFormData((prevData) => ({
            ...prevData,
            SSIEvalCheckList: prevData.SSIEvalCheckList.map((item, i) =>
                i === index ? { ...item, yesNo: value, remark: value ? item.remark : '' } : item
            ),
        }));
    };

    const handleRemarkChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevData) => ({
            ...prevData,
            SSIEvalCheckList: prevData.SSIEvalCheckList.map((item, i) =>
                i === index ? { ...item, remark: e.target.value } : item
            ),
        }));
    };

    const handleSpecificEventChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            specificEvent: value,
            organSpace: value !== 'organSpace' ? '' : prevData.organSpace,
        }));
    };

    const handlePostOpChange = (symptom: string, day: number | string, value: boolean) => {
        setFormData((prevData) => ({
            ...prevData,
            symptomsDict: {
                ...prevData.symptomsDict,
                [symptom]: {
                    ...prevData.symptomsDict[symptom],
                    [day]: value,
                },
            },
        }));
    };

    const handleSubmit = async (isDraft: boolean = false) => {
        console.log('Submitting form...');
        console.log('Form data:', formData);

        setIsSaving(true);
        if (!isDraft) {
            for (const key in formData) {
                if (Object.prototype.hasOwnProperty.call(formData, key)) {
                    const value = formData[key as keyof SSIFormData];

                    if (key === 'organSpace' && formData.specificEvent !== 'organSpace') {
                        continue;
                    }
                    if ((key === 'antibioticGiven' || key === 'papDuration') && !formData.papGiven) {

                    } else if (key === 'microorganism1' || key === 'microorganism2' || key === 'isloate1' || key === 'isloate2' || key === 'reviewedAt' || key === 'reviewedBy' || key === 'specificEvent' || key === 'detected') {

                    } else if (value === null || value === undefined || value === "") {
                        alert(`Please fill out the ${key} field.`);
                        setIsSaving(false);
                        return;
                    }
                }
            }
        }

        try {
            const status = isDraft ? 'ongoing' : 'to-be-reviewed';
            const { error } = await supabase
                .from('SSI_Form')
                .upsert({
                    ...formData,
                    nuid: userID,
                    status: status,
                });

            if (error) throw error;

            toast({
                title: isDraft ? 'Draft Saved' : 'Form Submitted',
                description: isDraft ? 'Your progress has been saved.' : 'The form has been submitted for review.',
            });

            router.push('/dashboard');
        } catch (error) {
            console.error('Error saving form:', error);
            toast({
                title: 'Error',
                description: 'Failed to save the form. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };
    const handlePrediction = async () => {
        console.log('Predicting SSI...');
        console.log('Form data:', formData);
        setIsPredicting(true);
        setPredictionError(null);
        try {
            const formDataToSubmit = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                    formDataToSubmit.append(key, JSON.stringify(value));
                } else {
                    formDataToSubmit.append(key, value as string);
                }
            });

            const response = await fetch('https://medicheck-prediction-api.onrender.com/predict', {
                method: 'POST',
                body: formDataToSubmit,
            });
            console.log('Response:', response);
            if (!response.ok) {
                throw new Error('Prediction request failed');
            }

            const result = await response.json();
            setPredictionResult(result.message);
        } catch (err) {
            setPredictionError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsPredicting(false);
        }
    };

    const toggleEditing = (section: keyof typeof isEditing) => {
        if (userRole?.role === 'doctor') {
            setIsEditing(prev => ({
                ...prev,
                [section]: !prev[section]
            }));
            toast({
                title: isEditing[section] ? `${section} Locked` : `${section} Unlocked`,
                description: isEditing[section] ? `${section} is now in read-only mode.` : `You can now edit ${section}.`,
            });
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

    return {
        formData,
        setFormData,
        isLoading,
        setIsLoading,
        isSaving,
        setIsSaving,
        handleChange,
        handleAntibioticChange,
        handleIsolateChange,
        handleYesNoChange,
        handleRemarkChange,
        handleSpecificEventChange,
        handlePostOpChange,
        handleSubmit,
        predictionResult,
        setPredictionResult,
        predictionError,
        setPredictionError,
        isPredicting,
        setIsPredicting,
        isEditing,
        toggleEditing,
        activeTab,
        setActiveTab,
        handlePrediction,
        getNextTab,
        formId
    };
};