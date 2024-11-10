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
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
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
    departmentPrimarySurgeon: string;
    primarySurgeonName: string;
    procedureName: string;
    diagnosis: string;
    otno: number;
    procedureDoneBy: string;
    outpatientProcedure: boolean;
    scenarioOfProcedure: 'Elective' | 'Emergency';
    woundClass: 'Clean' | 'Clean Contaminated' | 'Contaminated' | 'Dirty/Infected';
    papGiven: boolean;
    papDuration: string;
    antibioticsGiven: string;
    ssiEventOccurred: boolean;
    dateOfSSIEvent: string;
    eventDetails: string;
    microorganisms: string[];
    secondaryBSI: boolean;
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
    const { userID } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();
    const formId = searchParams.get('formId');
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState<string | null>(null);

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
        primarySurgeonName: '',
        procedureName: '',
        diagnosis: '',
        otno: 1,
        procedureDoneBy: '',
        outpatientProcedure: true,
        scenarioOfProcedure: 'Elective',
        woundClass: 'Clean',
        papGiven: true,
        antibioticsGiven: '',
        papDuration: '',
        ssiEventOccurred: true,
        dateOfSSIEvent: formatDate(new Date()),
        eventDetails: '',
        microorganisms: [],
        secondaryBSI: false,
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

            setLoading(true);
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
            } catch (err) {
                // console.error('Error fetching SSI form:', err);
                // setError(err instanceof Error ? err.message : 'Error loading form data');
            } finally {
                setLoading(false);
            }
        };

        fetchFormData();
    }, [formId, userID]);

    // Improved form field change handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        console.log('Change event:', { name, value, type });
        setFormData(prevData => ({
            ...prevData,
            // [name]: type === 'number' ? Number(value) : value
            
            [name]: name === 'papGiven' || name === 'outpatientProcedure' || name === 'ssiEventOccurred'
                ? value === "true" ? 'true' : 'false'
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
                : prevData.antibiotics
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

    // // Improved form submission handler
    // const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    //     e.preventDefault();
    //     setError(null);

    //     try {
    //         if (!isDraft) {
    //             // Validate required fields
    //             const requiredFields = ['patientName', 'patientId', 'dateOfProcedure'];
    //             for (const field of requiredFields) {
    //                 if (!formData[field as keyof FormData]) {
    //                     throw new Error(`Please fill out the ${field} field.`);
    //                 }
    //             }
    //         }

    //         const sanitizedData = {
    //             ...formData,
    //             nuid: userID,
    //             status: isDraft ? 'ongoing' : 'to-be-reviewed',
    //             lastModified: new Date().toISOString()
    //         };

    //         const { error: upsertError } = await supabase
    //             .from('SSI_Form')
    //             .upsert([sanitizedData], {
    //                 onConflict: 'patientId',
    //                 ignoreDuplicates: false
    //             });

    //         if (upsertError) throw upsertError;

    //         if (!isDraft) {
    //             router.push('/dashboard');
    //         } else {
    //             alert('Draft saved successfully.');
    //         }
    //     } catch (err) {
    //         console.error('Error saving form:', err);
    //         setError(err instanceof Error ? err.message : 'Error saving form');
    //         alert(err instanceof Error ? err.message : 'Error saving form');
    //     }
    // };

    // const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    //     e.preventDefault();
    //     setError(null);

    //     // FORM VALIDATION
    //     if (!isDraft) {
    //         for (const key in formData) {
    //             // Use Object.prototype.hasOwnProperty to avoid inherited properties
    //             if (Object.prototype.hasOwnProperty.call(formData, key)) {
    //                 const value = formData[key as keyof FormData];

    //                 if (!value) {
    //                     alert(`Please fill out the ${key} field.`);
    //                     return;
    //                 }
    //             }
    //         }
    //     }

    //     const status = isDraft ? 'ongoing' : 'to-be-reviewed';// Set form status as 'ongoing' if it's a draft, otherwise 'to-be-reviewed'

    //     const sanitizedData = {
    //         ...formData,
    //         nuid: userID,
    //         status: status,  // Set the status based on whether it's a draft or final submission
    //     };

    //     console.log('Form Data:', sanitizedData);
    //     // Check if a draft already exists
    //     const { data: existingDraft, error: fetchError } = await supabase
    //         .from('SSI_Form')
    //         .select('*')
    //         .eq('patientId', formData.patientId)
    //         .eq('nuid', userID)
    //         .eq('status', 'ongoing')
    //         .single();

    //     if (fetchError && fetchError.code !== 'PGRST116') {
    //         console.error('Error fetching existing draft:', fetchError);
    //         return;
    //     }

    //     if (existingDraft) {
    //         // Update existing draft
    //         const { data, error } = await supabase
    //             .from('SSI_Form')
    //             .update(sanitizedData)
    //             .eq('patientId', existingDraft.patientId)

    //         if (error) {
    //             console.error('Error updating draft:', error);
    //         } else {
    //             console.log('Draft updated successfully!', data);
    //             // if (!isDraft) {
    //             //   router.push('/dashboard');
    //             // } else {
    //             //   alert('Draft saved successfully.');
    //             // }
    //             if (isDraft) {
    //                 alert('Draft saved successfully.');
    //             }
    //             router.push('/dashboard');
    //         }
    //     } else {
    //         // Insert new row
    //         const { data, error } = await supabase
    //             .from('SSI_Form')
    //             .insert([sanitizedData]);

    //         if (error) {
    //             console.error('Error inserting data:', error);
    //         } else {
    //             console.log('Data insertion successful!', data);
    //             // if (!isDraft) {
    //             //   router.push('/dashboard');
    //             // } else {
    //             //   alert('Draft saved successfully.');
    //             // }
    //             if (isDraft) {
    //                 alert('Draft saved successfully.');
    //             }
    //             router.push('/dashboard');
    //         }
    //     }
    // };
    
    const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
        e.preventDefault();
        setError(null);
      
        // FORM VALIDATION
        if (!isDraft) {
          for (const key in formData) {
            // Use Object.prototype.hasOwnProperty to avoid inherited properties
            if (Object.prototype.hasOwnProperty.call(formData, key)) {
              const value = formData[key as keyof FormData];
      
              if (!value) {
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
          status: status, // Set the status based on whether it's a draft or final submission
        };
      
        console.log('Form Data:', sanitizedData);
        // Check if a draft already exists
        const { data: existingDraft, error: fetchError } = await supabase
          .from('SSI_Form')
          .select('*')
        //   .eq('formId', formId)
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
          const { data, error } = await supabase
            .from('SSI_Form')
            .update(sanitizedData)
            .eq('patientId', existingDraft.patientId);
      
          if (error) {
            console.error('Error updating draft:', error);
          } else {
            console.log('Draft updated successfully!', data);
            if (isDraft) {
              alert('Draft saved successfully.');
            }
            router.push('/dashboard');
          }
        } else {
          // Insert new row
          const { data, error } = await supabase
            .from('SSI_Form')
            .insert([sanitizedData]);
      
          if (error) {
            console.error('Error inserting data:', error);
          } else {
            console.log('Data insertion successful!', data);
            if (isDraft) {
              alert('Draft saved successfully.');
            }
            router.push('/dashboard');
          }
        }
      };


    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    const steps = [
        {
            id: 0, title: 'Patient Data', component:
                <PatientData
                    formData={formData}
                    handleChange={handleChange}
                />
        },
        {
            id: 1, title: 'Microbiology Data', component:
                <MicrobiologyData
                    formData={formData}
                    handleChange={handleChange}
                    handleIsolateChange={handleIsolateChange}
                />
        },
        {
            id: 2, title: 'Antibiotic Prescription', component:
                <AntibioticPrescription
                    formData={formData}
                    handleAntibioticChange={handleAntibioticChange}
                    addAntibiotic={addAntibiotic}
                    removeAntibiotic={removeAntibiotic}
                    handleChange={handleChange}
                />
        },
        {
            id: 3, title: 'Post-Op Sheet', component:
                <PostOp_Sheet
                    formData={formData}
                    handlePostOpChange={handlePostOpChange}
                />
        },
        {
            id: 4, title: 'SSI Event Details', component:
                <SSIEvent
                    formData={formData}
                    handleSpecificEventChange={handleSpecificEventChange}
                    // handleDetectedChange={handleDetectedChange}
                    handleDetectedChange={handleChange}
                    // handleInputChange={handleInputChange}
                    handleInputChange={handleChange}
                />
        },

        {
            id: 5, title: 'SSI Evaluation', component:
                <SSIEval
                    formData={formData}
                    handleYesNoChange={handleYesNoChange}
                    handleRemarkChange={handleRemarkChange}
                />
        },

    ]


    return (
        <div className="container mx-auto p-4">
            <h2 className="text-4xl font-bold mb-6 text-center">Surgical Site Infection Surveillance Form</h2>

            <div className="flex justify-center mb-6">
                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        className={`mx-2 py-2 px-4 ${index === currentStep ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700'
                            } rounded cursor-pointer`}
                        onClick={() => setCurrentStep(index)}
                    >
                        {step.title}
                    </div>
                ))}
            </div>

            <form onSubmit={(e) => handleSubmit(e, false)}>
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
                        >
                            Submit
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

const SSISurveillanceFormPage: React.FC = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <SSISurveillanceForm />
    </Suspense>
);

export default SSISurveillanceFormPage;