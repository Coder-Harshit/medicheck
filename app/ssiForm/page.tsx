'use client';

import React, { useState } from 'react';
import PatientData from './patient_data';
import MicrobiologyData from './microbiology_data';
import AntibioticPrescription from './antibiotic_prescription';
import OperationTimings from './operation_timings';

const SSISurveillanceForm: React.FC = () => {
  const [formData, setFormData] = useState({
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
      duration: '',
      doses: ''
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
    const updatedAntibiotics: { antibiotic: string; route: string; duration: string; doses: string; }[] = [...formData.antibiotics];
    (updatedAntibiotics[index] as any)[name] = value;
    setFormData({ ...formData, antibiotics: updatedAntibiotics });
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
