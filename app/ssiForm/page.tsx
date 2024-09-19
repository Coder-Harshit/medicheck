'use client';

import React, { useState } from 'react';
import PatientData from './patient_data';
import MicrobiologyData from './microbiology_data';
import AntibioticPrescription from './antibiotic_prescription';
import OperationTimings from './operation_timings';

interface formData {
  patientName: string;
  patientId: string;
  age: string
  gender: 'M' | 'F';
  dateOfAdmission: string;
  dateOfProcedure: string;
  admittingDepartment: string;
  departmentPrimarySurgeon: string;
  procedureName: string;
  diagnosis: string;
  procedureDoneBy: string;
  operationTheatre: string;
  outpatientProcedure: boolean;
  scenarioOfProcedure: 'Elective' | 'Emergency';
  woundClass: 'Clean' | 'Clean Contaminated' | 'Contaminated' | 'Dirty/Infected';
  papGiven: boolean;
  antibioticsGiven: string;
  durationOfPAP: string;
  ssiEventOccurred: boolean;
  dateOfSSIEvent: string;
  eventDetails: string;
  detected: 'A' | 'P' | 'RF';
  microorganisms: string[];
  secondaryBSI: boolean;
  antibiotics: {
    antibiotic: string;
    route: string;
    duration: number;
    doses: number;
  }[];
  timeOfInduction: string;
  timeOfSkinIncision: string;
  timeOfEndSurgery: string;
}

const SSISurveillanceForm: React.FC = () => {
  const [formData, setFormData] = useState<formData>({
    patientName: '',
    patientId: '',
    age: '',
    gender: 'M', // 'M' or 'F'
    dateOfAdmission: '',
    dateOfProcedure: '',
    admittingDepartment: '',
    departmentPrimarySurgeon: '',
    procedureName: '',
    diagnosis: '',
    procedureDoneBy: '',
    operationTheatre: '',
    outpatientProcedure: false,
    scenarioOfProcedure: 'Elective', // 'Elective' or 'Emergency'
    woundClass: 'Clean', // 'Clean', 'Clean Contaminated', 'Contaminated', 'Dirty/Infected'
    papGiven: false,
    antibioticsGiven: '',
    durationOfPAP: '',
    ssiEventOccurred: false,
    dateOfSSIEvent: '',
    eventDetails: '',
    detected: 'A', // 'A', 'P', 'RF'
    microorganisms: [],
    secondaryBSI: false,
    antibiotics: [{
      antibiotic: '',
      route: '',
      duration: 0,
      doses: 0
    }],
    timeOfInduction: '',
    timeOfSkinIncision: '',
    timeOfEndSurgery: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAntibioticChange = (index: number, name: string, value: string) => {
    const updatedAntibiotics = formData.antibiotics.map((antibiotic, i) => i===index ? { ...antibiotic, [name]: value } : antibiotic);
    setFormData({ ...formData, antibiotics: updatedAntibiotics });
  };

  const addAntibiotic = () => {
    setFormData({
      ...formData,
      antibiotics: [...formData.antibiotics, { antibiotic: '', route: '', duration: 0, doses: 0 }]
    });
  };

  const removeAntibiotic = () => {
    if (formData.antibiotics.length > 1) {
      const newAntibiotics = formData.antibiotics.slice(0, -1);
      setFormData({ ...formData, antibiotics: newAntibiotics });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    // Handle form submission, e.g., send data to API
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Surgical Site Infection Surveillance Form</h2>
      <form onSubmit={handleSubmit}>
        <PatientData
          formData={formData}
          handleInputChange={handleInputChange}
          handleDropdownChange={handleDropdownChange}
          handleCheckboxChange={handleCheckboxChange}
        />
        <MicrobiologyData
          formData={formData}
          handleDropdownChange={handleDropdownChange}
          handleCheckboxChange={handleCheckboxChange}
        />
        <AntibioticPrescription
          formData={formData}
          handleAntibioticChange={handleAntibioticChange}
          addAntibiotic={addAntibiotic}
          removeAntibiotic={removeAntibiotic}
        />
        <OperationTimings
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <button type="submit" className="btn btn-primary mt-4">Submit</button>
      </form>
    </div>
  );
};

export default SSISurveillanceForm;
