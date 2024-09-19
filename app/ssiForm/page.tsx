'use client';

import React, { useState } from 'react';

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
        {/* PATIENT DATA */}
        <h3 className="font-bold mb-2">Patient Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Patient Name</label>
            <input type="text" name="patientName" value={formData.patientName} onChange={handleInputChange} className="input text-black" />
          </div>
          <div>
            <label>Patient ID</label>
            <input type="text" name="patientId" value={formData.patientId} onChange={handleInputChange} className="input text-black" />
          </div>
          <div>
            <label>Patient Age</label>
            <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="input text-black" />
          </div>
          <div>
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleDropdownChange} className="select text-black">
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div>
            <label>Date of Admission</label>
            <input type="date" name="dateOfAdmission" value={formData.dateOfAdmission} onChange={handleInputChange} className="input text-black" />
          </div>
          <div>
            <label>Date of Operative Procedure</label>
            <input type="date" name="dateOfProcedure" value={formData.dateOfProcedure} onChange={handleInputChange} className="input text-black" />
          </div>

          {/* Dropdowns for departments, procedures, and diagnosis */}
          <div>
            <label>Admitting Department</label>
            <select name="admittingDepartment" value={formData.admittingDepartment} onChange={handleDropdownChange} className="select text-black">
              <option value="">Select Department</option>
              {/* Add department options here */}
            </select>
          </div>
          <div>
            <label>Department (Primary Surgeon)</label>
            <select name="departmentPrimarySurgeon" value={formData.departmentPrimarySurgeon} onChange={handleDropdownChange} className="select text-black">
              <option value="">Select Surgeon Department</option>
              {/* Add surgeon department options here */}
            </select>
          </div>

          <div>
            <label>Outpatient Procedure</label>
            <input type="checkbox" name="outpatientProcedure" checked={formData.outpatientProcedure} onChange={handleCheckboxChange} />
          </div>
          <div>
            <label>Scenario of Procedure</label>
            <select name="scenarioOfProcedure" value={formData.scenarioOfProcedure} onChange={handleDropdownChange} className="select text-black">
              <option value="Elective">Elective</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
          <div>
            <label>Wound Class</label>
            <select name="woundClass" value={formData.woundClass} onChange={handleDropdownChange} className="select text-black">
              <option value="Clean">Clean</option>
              <option value="Clean Contaminated">Clean Contaminated</option>
              <option value="Contaminated">Contaminated</option>
              <option value="Dirty/Infected">Dirty/Infected</option>
            </select>
          </div>
        </div>

        {/* MICROBIOLOGY DATA */}
        <h3 className="font-bold mt-4">Microbiology Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Micro-organisms Implicated in SSI</label>
            <select name="microorganisms" multiple={true} value={formData.microorganisms} onChange={handleDropdownChange} className="select text-black">
              {/* Add options for microorganisms */}
            </select>
          </div>
          <div>
            <label>Secondary BSI contributed to death?</label>
            <input type="checkbox" name="secondaryBSI" checked={formData.secondaryBSI} onChange={handleCheckboxChange} />
          </div>
        </div>

        {/* ANTIBIOTIC PRESCRIPTION */}
        <h3 className="font-bold mt-4">Antibiotic Prescription</h3>
        {formData.antibiotics.map((antibiotic, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label>Antibiotic Given Prior to Operation</label>
              <input
                type="text"
                value={antibiotic.antibiotic}
                onChange={(e) => handleAntibioticChange(index, 'antibiotic', e.target.value)}
                className="input text-black"
              />
            </div>
            <div>
              <label>Route of Administration</label>
              <select value={antibiotic.route} onChange={(e) => handleAntibioticChange(index, 'route', e.target.value)} className="select text-black">
                <option value="">Select Route</option>
                {/* Add route options */}
              </select>
            </div>
            <div>
              <label>Duration (mins)</label>
              <input
                type="number"
                value={antibiotic.duration}
                onChange={(e) => handleAntibioticChange(index, 'duration', e.target.value)}
                className="input text-black"
              />
            </div>
            <div>
              <label>No. of Doses</label>
              <input
                type="number"
                value={antibiotic.doses}
                onChange={(e) => handleAntibioticChange(index, 'doses', e.target.value)}
                className="input text-black"
              />
            </div>
          </div>
        ))}

        {/* Operation Timings */}
        <h3 className="font-bold mt-4">Operation Timings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Time of Induction</label>
            <input type="datetime-local" name="timeOfInduction" value={formData.timeOfInduction} onChange={handleInputChange} className="input text-black" />
          </div>
          <div>
            <label>Time of Skin Incision</label>
            <input type="datetime-local" name="timeOfSkinIncision" value={formData.timeOfSkinIncision} onChange={handleInputChange} className="input text-black" />
          </div>
          <div>
            <label>Time of End of Surgery</label>
            <input type="datetime-local" name="timeOfEndSurgery" value={formData.timeOfEndSurgery} onChange={handleInputChange} className="input text-black" />
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-4">Submit</button>
      </form>
    </div>
  );
};

export default SSISurveillanceForm;
