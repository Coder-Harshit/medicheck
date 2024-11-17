'use client';

import './style.css';
import React, { useState, useEffect, Suspense } from 'react';
import PatientData from './patient_data';
import MicrobiologyData from './microbiology_data';
import AntibioticPrescription from './antibiotic_prescription';
import SSIEval from './ssiEval';
import PostOp_Sheet from './postop_form';
import { days, symptoms } from './constants';
import { supabase } from '@/utils/supabase/client';
import { formatDate } from '@/utils/dateHandling';
import SSIEvent from './ssiEvent';
import { useUser } from '@/hooks/useUser';
import { useRouter, useSearchParams } from 'next/navigation';


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

const SSISurveillanceForm: React.FC = () => {
    const { user, userID, userRole, loading } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();
    const formId = searchParams.get('formId');
    const [dataLoading, setDataLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState<string | null>(null);
    // const [formData, setFormData] = useState<FormData | null>(null);


    // State to control editing sections
    const [isEditing, setIsEditing] = useState({
        patientData: false,
        microbiologyData: false,
        antibioticData: false,
        postOpData: false,
        ssiEventData: false,
        ssiEvalData: false, // Unlocked by default for doctors
    });

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (userRole?.role === 'doctor') {
            // Unlock SSI Evaluation section by default for doctors
            setIsEditing((prev) => ({ ...prev, ssiEvalData: false }));
        }
    }, [user, loading, userRole, router]);

    // Initialize form data with default values in a separate function
    const getInitialFormData = (): FormData => ({
        patientName: '',
        patientId: formId || '',
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
    });

    const [formData, setFormData] = useState<FormData>(getInitialFormData());

    // Improved form data fetching
    useEffect(() => {
        const fetchFormData = async () => {
            if (!formId || !userID) return;

            setDataLoading(true);
            setError(null);

            try {
                const { data, error } = await supabase
                    .from('SSI_Form')
                    .select('*')
                    .eq('patientId', formId)
                    .eq('nuid', userID)
                    .eq('status', 'ongoing')
                    .single();

                if (error) throw error;

                if (data) {
                    // Ensure all required fields are present
                    const sanitizedData = {
                        ...getInitialFormData(),
                        ...data,
                        // Ensure dates are properly formatted
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
                    };
                    setFormData(sanitizedData);
                }
            } finally {
                setDataLoading(false);
            }
        };

        fetchFormData();
    }, [formId, user]);

    const toggleEdit = (section: keyof typeof isEditing) => {
        setIsEditing((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    // Improved form field change handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        console.log('Change event:', { name, value, type });
        setFormData(prevData => ({
            ...prevData,
            [name]: (name === 'papGiven' || name === 'outpatientProcedure' || name === 'ssiEventOccurred' || name === 'secondaryBSIdeath')
                ? value === "true"
                : type === 'number'
                    ? Number(value) // Convert numeric string to a number
                    : value // Default to string for other types
        }));
        console.log(value)

    };

    // Improved antibiotic change handler
    const handleAntibioticChange = (index: number, name: string, value: string | number) => {
        setFormData(prevData => ({
            ...prevData,
            antibiotics: prevData.antibiotics.map((antibiotic, i) =>
                i === index ? { ...antibiotic, [name]: value } : antibiotic
            )
        }));
    };

    // Improved isolate change handler
    const handleIsolateChange = (isolate: 'isolate1' | 'isolate2', category: 'sensitive' | 'resistant' | 'intermediate', value: string) => {
        setFormData(prevData => ({
            ...prevData,
            [isolate]: {
                ...prevData[isolate],
                [category]: value
            }
        }));
    };

    // Improved checklist handlers
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

    // Improved specific event change handler
    const handleSpecificEventChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            specificEvent: value,
            organSpace: value !== 'organSpace' ? '' : prevData.organSpace
        }));
    };

    // Improved antibiotic add/remove handlers
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

    // Improved post-op change handler
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

    const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        // If not a draft and not on the last step, prevent submission
        // if (!isDraft && currentStep !== steps.length - 1) {
        if (!isDraft) {
            alert("Please complete all steps before submitting");
            return;
        }

        setError(null);

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

        const status = isDraft ? 'ongoing' : 'to-be-reviewed'; // Set form status as 'ongoing' if it's a draft, otherwise 'to-be-reviewed'

        const sanitizedData = {
            ...formData,
            nuid: userID,
            // nuid: user,
            status: status, // Set the status based on whether it's a draft or final submission
        };

        // Check if a draft already exists
        const { data: existingDraft, error: fetchError } = await supabase
            .from('SSI_Form')
            .select('*')
            .eq('patientId', formId)
            .eq('nuid', userID)
            .eq('status', 'ongoing')
            .single();
        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error fetching existing draft:', fetchError);
            return;
        }

        if (existingDraft) {
            // Update existing draft
            const { error } = await supabase
                .from('SSI_Form')
                .update(sanitizedData)
                .eq('patientId', existingDraft.patientId);

            if (error) {
                console.error('Error updating draft:', error);
            } else {
                if (isDraft) {
                    alert('Draft saved successfully.');
                }
                router.push('/dashboard');
            }
        } else {
            // Insert new row
            const { error } = await supabase
                .from('SSI_Form')
                .insert([sanitizedData]);

            if (error) {
                console.error('Error inserting data:', error);
            } else {
                if (isDraft) {
                    alert('Draft saved successfully.');
                }
                router.push('/dashboard');
            }
        }
    };

    const handleReviewSubmit = async () => {
        try {
            const { error } = await supabase
                .from('SSI_Form')
                .update({
                    status: 'reviewed',
                    reviewedBy: user?.id,
                    reviewedAt: new Date().toISOString(),
                    // Include any updated formData fields if necessary
                })
                .eq('patientId', formData?.patientId);

            if (error) throw error;

            router.push('/dashboard/doctor');
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    // **Nurse View**
    if (userRole?.role === 'nurse') {
        // Existing nurse form steps
        const steps = [
            {
                id: 0,
                title: 'Patient Data',
                component: (
                    <PatientData
                        formData={formData}
                        handleChange={handleChange}
                    />
                ),
            },
            {
                id: 1,
                title: 'Microbiology Data',
                component: (
                    <MicrobiologyData
                        formData={formData}
                        handleChange={handleChange}
                        handleIsolateChange={handleIsolateChange}
                    />
                ),
            },
            {
                id: 2,
                title: 'Antibiotic Prescription',
                component: (
                    <AntibioticPrescription
                        formData={formData}
                        handleAntibioticChange={handleAntibioticChange}
                        addAntibiotic={addAntibiotic}
                        removeAntibiotic={removeAntibiotic}
                        handleChange={handleChange}
                    />
                ),
            },
            {
                id: 3,
                title: 'Post-Op Sheet',
                component: (
                    <PostOp_Sheet
                        formData={formData}
                        handlePostOpChange={handlePostOpChange}
                    />
                ),
            },
            {
                id: 4,
                title: 'SSI Event Details',
                component: (
                    <SSIEvent
                        formData={formData}
                        handleSpecificEventChange={handleSpecificEventChange}
                        handleDetectedChange={handleChange}
                        handleInputChange={handleChange}
                    />
                ),
            },
            // {
            //     id: 5, title: 'SSI Evaluation', component:
            //         <SSIEval
            //             formData={formData}
            //             handleYesNoChange={handleYesNoChange}
            //             handleRemarkChange={handleRemarkChange}
            //         />
            // },
        ];
        return (
            <div className="container mx-auto p-4">
                <h2 className="text-4xl font-bold mb-6 text-center">Surgical Site Infection Surveillance Form</h2>
                <div className="w-full mx-auto px-4 py-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                onClick={() => setCurrentStep(index)}
                                className={`
          flex items-center justify-center text-center
          px-4 py-4 rounded-lg cursor-pointer transition duration-300
          ${index === currentStep
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white'
                                    }
        `}
                            >
                                <span className="font-medium">{step.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <form onSubmit={(e) => e.preventDefault()}>
                    {steps[currentStep].component}

                    <div className="flex justify-between mt-6">
                        <button
                            type="button"
                            className={`px-4 py-2 bg-gray-500 text-white rounded ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                            disabled={currentStep === 0}
                        >
                            Previous
                        </button>

                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-500 text-white rounded"
                            onClick={(e) => handleSubmit(e, true)}
                        >
                            Save Draft
                        </button>

                        {currentStep < steps.length - 1 ? (
                            <button
                                type="button"
                                className="bg-primary-600 text-white hover:bg-primary-500 w-max px-4 py-2 rounded"
                                onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                onClick={(e) => handleSubmit(e, false)}
                            >
                                Submit
                            </button>
                        )}
                    </div>
                </form>
            </div>
        );
    }
    // **Doctor View**
    else if (userRole?.role === 'doctor') {
        // Render form with lock/unlock toggles
        return (
            <div className="p-6 bg-white rounded-lg shadow-lg text-black">
                <h1 className="text-2xl font-bold mb-4">SSI Form Review</h1>

                {/* Patient Data Section */}
                <div className="mb-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Patient Data</h2>
                        <button
                            onClick={() => toggleEdit('patientData')}
                            className="text-blue-500 underline"
                        >
                            {isEditing.patientData ? 'Lock' : 'Unlock'}
                        </button>
                    </div>
                    <PatientData
                        formData={formData}
                        handleChange={handleChange}
                        isEditing={isEditing.patientData}
                    />
                </div>

                {/* Microbiology Data Section */}
                <div className="mb-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Microbiology Data</h2>
                        <button
                            onClick={() => toggleEdit('microbiologyData')}
                            className="text-blue-500 underline"
                        >
                            {isEditing.microbiologyData ? 'Lock' : 'Unlock'}
                        </button>
                    </div>
                    <MicrobiologyData
                        formData={formData}
                        handleChange={handleChange}
                        handleIsolateChange={handleIsolateChange}
                        isEditing={isEditing.microbiologyData}
                    />
                </div>
                {/* Antibiotic Prescription Section */}
                <div className="mb-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Antibiotic Prescription</h2>
                        <button
                            onClick={() => toggleEdit('antibioticData')}
                            className="text-blue-500 underline"
                        >
                            {isEditing.antibioticData ? 'Lock' : 'Unlock'}
                        </button>
                    </div>
                    <AntibioticPrescription
                        formData={formData}
                        handleAntibioticChange={handleAntibioticChange}
                        addAntibiotic={addAntibiotic}
                        removeAntibiotic={removeAntibiotic}
                        handleChange={handleChange}
                        isEditing={isEditing.antibioticData}
                    />
                </div>

                {/* Post-Op Sheet Section */}
                <div className="mb-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Post-Op Sheet</h2>
                        <button
                            onClick={() => toggleEdit('postOpData')}
                            className="text-blue-500 underline"
                        >
                            {isEditing.postOpData ? 'Lock' : 'Unlock'}
                        </button>
                    </div>
                    <PostOp_Sheet
                        formData={formData}
                        handlePostOpChange={handlePostOpChange}
                        isEditing={isEditing.postOpData}
                    />
                </div>

                {/* SSI Event Section */}
                <div className="mb-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">SSI Event Details</h2>
                        <button
                            onClick={() => toggleEdit('ssiEventData')}
                            className="text-blue-500 underline"
                        >
                            {isEditing.ssiEventData ? 'Lock' : 'Unlock'}
                        </button>
                    </div>
                    <SSIEvent
                        formData={formData}
                        handleSpecificEventChange={handleSpecificEventChange}
                        handleDetectedChange={handleChange}
                        handleInputChange={handleChange}
                        isEditing={isEditing.ssiEventData}
                    />
                </div>
                {/* SSI Evaluation Section (Unlocked by default) */}
                <div className="mb-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">SSI Evaluation</h2>
                        <button
                            onClick={() => toggleEdit('ssiEvalData')}
                            className="text-blue-500 underline"
                        >
                            {isEditing.ssiEvalData ? 'Lock' : 'Unlock'}
                        </button>
                    </div>
                    <SSIEval
                        formData={formData}
                        handleYesNoChange={handleYesNoChange}
                        handleRemarkChange={handleRemarkChange}
                        isEditing={isEditing.ssiEvalData}
                    />
                </div>

                {/* Submit Review Button */}
                <button
                    onClick={handleReviewSubmit}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Submit Review
                </button>
            </div>
        );
    } else {
        return <div className="text-center mt-20">Unauthorized Access</div>;
    }
};

const SSISurveillanceFormPage: React.FC = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <SSISurveillanceForm />
    </Suspense>
);

export default SSISurveillanceFormPage;