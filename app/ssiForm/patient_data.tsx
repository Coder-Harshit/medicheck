import React from 'react';


interface FormData {
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
}


interface PatientDataProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDropdownChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PatientData: React.FC<PatientDataProps> = ({ formData, handleInputChange, handleDropdownChange, handleCheckboxChange }) => {
  return (
    <div className="container mx-auto p-4">
      <h3 className="text-2xl font-bold mt-4 mb-6 text-center">Patient Data</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">Gender</label>
          <select name="gender" value={formData.gender} onChange={handleDropdownChange} className="select text-black p-2 border rounded">
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">Date of Admission</label>
          <input type="date" name="dateOfAdmission" value={formData.dateOfAdmission} onChange={handleInputChange} className="input text-black p-2 border rounded" />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">Date of Operative Procedure</label>
          <input type="date" name="dateOfProcedure" value={formData.dateOfProcedure} onChange={handleInputChange} className="input text-black p-2 border rounded" />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">Admitting Department</label>
          <select name="admittingDepartment" value={formData.admittingDepartment} onChange={handleDropdownChange} className="select text-black p-2 border rounded">
            <option value="">Select Department</option>
            {/* Add department options here */}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">Department (Primary Surgeon)</label>
          <select name="departmentPrimarySurgeon" value={formData.departmentPrimarySurgeon} onChange={handleDropdownChange} className="select text-black p-2 border rounded">
            <option value="">Select Surgeon Department</option>
            {/* Add surgeon department options here */}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">Outpatient Procedure</label>
          <input type="checkbox" name="outpatientProcedure" checked={formData.outpatientProcedure} onChange={handleCheckboxChange} className="mt-2" />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">Scenario of Procedure</label>
          <select name="scenarioOfProcedure" value={formData.scenarioOfProcedure} onChange={handleDropdownChange} className="select text-black p-2 border rounded">
            <option value="Elective">Elective</option>
            <option value="Emergency">Emergency</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">Wound Class</label>
          <select name="woundClass" value={formData.woundClass} onChange={handleDropdownChange} className="select text-black p-2 border rounded">
            <option value="Clean">Clean</option>
            <option value="Clean Contaminated">Clean Contaminated</option>
            <option value="Contaminated">Contaminated</option>
            <option value="Dirty/Infected">Dirty/Infected</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PatientData;
