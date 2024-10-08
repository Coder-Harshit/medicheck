'use client';

import React, { useState } from 'react';
import PatientData from './patient_data';
import MicrobiologyData from './microbiology_data';
import AntibioticPrescription from './antibiotic_prescription';
import SSIEval from './ssiEval';
import './style.css';
import PostOp_Sheet from './postop_form';
import { days, symptoms } from './constants';
import { supabase } from '@/utils/supabase/client';
import { formatDate } from '@/utils/dateHandling';
import SSIEvent from './ssiEvent';
import { useUser } from '@/hooks/useUser';

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
  // did: number;
}

const SSISurveillanceForm: React.FC = () => {
  const { userID } = useUser();
  const [formData, setFormData] = useState<FormData>({
    patientName: '',
    patientId: '',
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
    symptomsDict: symptomsDict,
    SSIEvalCheckList: SSIEvalChecklistItems.map((item) => ({
      item: item,
      yesNo: false, // null initially, then true for "Yes", false for "No"
      remark: "",
    })),
    specificEvent: '',
    organSpace: '',
    detected: '',
    status: 'ongoing',
  });
  console.log(userID);
  const [currentStep, setCurrentStep] = useState(0);


  // Generalized handler for both input and dropdown changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log('Event:', e.target);
    const { name, value, type } = e.target;

    // Handle input and select elements consistently
    let updatedValue: string | boolean | Date | string[];
    if (['papGiven', 'outpatientProcedure', 'ssiEventOccurred', 'secondaryBSI'].includes(name)) {
      updatedValue = value === 'Yes';
    }
    else if (type === 'date') {
      updatedValue = formatDate(new Date(value));
    } else if (type === 'time') {
      updatedValue = value;
    } else if (name === 'microorganism1' || name === 'microorganism2') {
      console.log('Microorganisms:', name, value);
      const index = name === 'microorganism1' ? 0 : 1;
      setFormData((prevData) => {
        const updatedMicroorganisms = [...prevData.microorganisms];
        updatedMicroorganisms[index] = value;
        return {
          ...prevData,
          microorganisms: updatedMicroorganisms,
        };
      });
      return; // Exit early as we've already updated the state
    } else {
      updatedValue = value;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));
  };
  // Handler for updating antibiotics array
  const handleAntibioticChange = (index: number, name: string, value: string | number) => {
    const updatedAntibiotics = formData.antibiotics.map((antibiotic, i) =>
      i === index ? { ...antibiotic, [name]: value } : antibiotic
    );
    setFormData({ ...formData, antibiotics: updatedAntibiotics });
  };

  const handleIsolateChange = (isolate: 'isolate1' | 'isolate2', category: 'sensitive' | 'resistant' | 'intermediate', value: string) => {
    const updatedIsolate = { ...formData[isolate], [category]: value };
    setFormData({ ...formData, [isolate]: updatedIsolate });
  }

  const handleYesNoChange = (index: number, value: boolean) => {
    const newChecklist = [...formData.SSIEvalCheckList];
    newChecklist[index].yesNo = value;
    setFormData({ ...formData, SSIEvalCheckList: newChecklist });
  };

  const handleRemarkChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newChecklist = [...formData.SSIEvalCheckList];
    newChecklist[index].remark = value;
    setFormData({ ...formData, SSIEvalCheckList: newChecklist });
  };

  const handleSpecificEventChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFormData({
      ...formData,
      specificEvent: value,
      organSpace: value !== 'organSpace' ? '' : formData.organSpace // Reset organSpace if not selected
    });
  };

  const handleDetectedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFormData({
      ...formData,
      detected: value
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };


  // Add new antibiotic
  const addAntibiotic = () => {
    setFormData({
      ...formData,
      antibiotics: [...formData.antibiotics, {
        abop_stage: 'prior',
        antibiotic: '',
        route: '',
        duration: 0,
        doses: 0,
      }],
    });
  };

  // Remove last antibiotic (ensure at least one remains)
  const removeAntibiotic = () => {
    if (formData.antibiotics.length > 1) {
      const newAntibiotics = formData.antibiotics.slice(0, -1);
      setFormData({ ...formData, antibiotics: newAntibiotics });
    }
  };

  const handlePostOpChange = (symptom: string, day: number | string, value: boolean) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      symptomsDict: {
        ...prevFormData.symptomsDict,
        [symptom]: {
          ...prevFormData.symptomsDict[symptom],
          [day]: value,
        },
      },
    }));
  };

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
          handleDetectedChange={handleDetectedChange}
          handleInputChange={handleInputChange}
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

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();

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

    const status = isDraft ? 'ongoing' : 'to-be-reviewed';// Set form status as 'ongoing' if it's a draft, otherwise 'to-be-reviewed'

    const sanitizedData = {
      ...formData,
      nuid: userID,
      status: status,  // Set the status based on whether it's a draft or final submission
    };

    console.log('Form Data:', sanitizedData);
    // Check if a draft already exists
    const { data: existingDraft, error: fetchError } = await supabase
      .from('SSI_Form')
      .select('*')
      .eq('patientId', formData.patientId)
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
        .eq('patientId', formData.patientId)
        .eq('nuid', userID)
        .eq('status', 'ongoing');

      if (error) {
        console.error('Error updating draft:', error);
      } else {
        console.log('Draft updated successfully!', data);
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
      }
    }
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    handleSubmit(e, true);  // Save the form as a draft
  };

  // const loadDraft = async () => {
  //   const { data, error } = await supabase
  //     .from('SSI_Form')
  //     .select('*')
  //     .eq('nuid', userID)
  //     .eq('status', 'ongoing');  // Only fetch forms with 'ongoing' status

  //   if (error) {
  //     console.error('Error Fetching Draft:', error);
  //   } else if (data && data.length > 0) {
  //     setFormData(data[0]);  // Load the first draft found
  //   }
  // };



  return (
    <div className="container mx-auto p-4">
      <h2 className="text-4xl font-bold mb-6 text-center">Surgical Site Infection Surveillance Form</h2>


      {/* Step Indicator */}
      <div className="flex justify-center mb-6">
        {steps.map((step, index) => (
          <div key={step.id}
            className={`mx-2 py-2 px-4 ${index === currentStep ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'} rounded`}
          >
            {step.title}
          </div>
        ))}
      </div>

      <form>
        {/* Render current step component */}
        {steps[currentStep].component}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            className={`px-4 py-2 bg-gray-500 text-white rounded ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handlePreviousStep}
            disabled={currentStep === 0}
          >
            Previous
          </button>

          <button
            type="button"
            className={`px-4 py-2 bg-gray-500 text-white rounded`}
            onClick={handleSaveDraft}
          >
            Save Draft
          </button>


          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              className="bg-indigo-500 text-white hover:bg-indigo-600 w-max
                      px-4 py-2 rounded"
              onClick={handleNextStep}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={handleSubmit}
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SSISurveillanceForm;
