import React from 'react';

interface PatientDataProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDropdownChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PatientData: React.FC<PatientDataProps> = ({ formData, handleInputChange, handleDropdownChange, handleCheckboxChange }) => {
  return (
    <div>
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
    </div>
  );
};

export default PatientData;
