import React from 'react';
import InputBox from '../../components/InputBox';
import DropdownBox from '../../components/DropdownBox';
import DateTimePickerBox from '../../components/DateTimePickerBox';
import { FormData } from './page';

interface PatientDataProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const PatientData: React.FC<PatientDataProps> = ({ formData, handleChange }) => {
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-6 text-center text-primary">Basic Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Patient Name */}
        <InputBox
          label="Patient Name"
          labelClass="truncate"
          type="text"
          value={formData.patientName}
          id="patientName"
          name="patientName"
          onChange={handleChange}
          className="input-field"
          required={true}
        />
        {/* Patient ID */}
        <InputBox
          label="Patient ID"
          labelClass="truncate"
          type="number"
          value={formData.patientId.toString()}
          id="patientId"
          name="patientId"
          onChange={handleChange}
          nonnegative={true}
          className="input-field"
          disabled={true}
          required={true}
        />
        {/* Age */}
        <InputBox
          label="Age"
          labelClass="truncate"
          type="number"
          value={formData.age.toString()}
          id="age"
          name="age"
          onChange={handleChange}
          nonnegative={true}
          className="input-field"
          required={true}
        />
        {/* Gender */}
        <DropdownBox
          label="Gender"
          labelClass="truncate"
          id="gender"
          name="gender"
          value={formData.gender}
          options={[
            { value: 'M', label: 'Male' },
            { value: 'F', label: 'Female' },
          ]}
          onChange={handleChange}
          required={true}
          className="input-field"
        />
        {/* Date of Admission */}
        <DateTimePickerBox
          label="Date of Admission"
          labelClass="truncate"
          id="dateOfAdmission"
          name="dateOfAdmission"
          value={formData.dateOfAdmission}
          onChange={handleChange}
          type="date"
          required={true}
          className="input-field"
        />
        {/* Date of Operative Procedure */}
        <DateTimePickerBox
          label="Date of Operative Procedure"
          labelClass="truncate"
          id="dateOfProcedure"
          name="dateOfProcedure"
          value={formData.dateOfProcedure}
          onChange={handleChange}
          type="date"
          required={true}
          className="input-field"
        />
        {/* Admitting Department */}
        <DropdownBox
          label="Admitting Department"
          labelClass="truncate"
          id="admittingDepartment"
          name="admittingDepartment"
          value={formData.admittingDepartment}
          options={[
            { value: 'Cardiology', label: 'Cardiology' },
            { value: 'Dermatology', label: 'Dermatology' },
            { value: 'Endocrinology', label: 'Endocrinology' },
            { value: 'Gastroenterology', label: 'Gastroenterology' },
            { value: 'General Surgery', label: 'General Surgery' },
            { value: 'Neurology', label: 'Neurology' },
            { value: 'Others', label: 'Others' },
          ]}
          required={true}
          onChange={handleChange}
          className="input-field"
        />
        {/* Primary Surgeon Name */}
        <DropdownBox
          label="Primary Surgeon Name"
          labelClass="truncate"
          id="primarySurgeonName"
          name="primarySurgeonName"
          value={formData.primarySurgeonName}
          options={[
            { value: 'Dr. A', label: 'Dr. A' },
            { value: 'Dr. B', label: 'Dr. B' },
            { value: 'Dr. C', label: 'Dr. C' },
            { value: 'Dr. D', label: 'Dr. D' },
          ]}
          required={true}
          onChange={handleChange}
          className="input-field"
        />
        {/* Primary Surgeon's Department */}
        <DropdownBox
          label="Primary Surgeon's Department"
          labelClass="truncate"
          id="departmentPrimarySurgeon"
          name="departmentPrimarySurgeon"
          value={formData.departmentPrimarySurgeon}
          options={[
            { value: 'Cardiology', label: 'Cardiology' },
            { value: 'Dermatology', label: 'Dermatology' },
            { value: 'Endocrinology', label: 'Endocrinology' },
            { value: 'Gastroenterology', label: 'Gastroenterology' },
            { value: 'General Surgery', label: 'General Surgery' },
            { value: 'Neurology', label: 'Neurology' },
            { value: 'Others', label: 'Others' },
          ]}
          required={true}
          onChange={handleChange}
          className="input-field"
        />
        {/* Procedure Name */}
        <DropdownBox
          label="Procedure Name"
          required={true}
          labelClass="truncate"
          id="procedureName"
          name="procedureName"
          value={formData.procedureName}
          options={[
            { value: 'Appendectomy', label: 'Appendectomy' },
            { value: 'Cholecystectomy', label: 'Cholecystectomy' },
            { value: 'Hernioplasty', label: 'Hernioplasty' },
            { value: 'Hysterectomy', label: 'Hysterectomy' },
            { value: 'Mastectomy', label: 'Mastectomy' },
            { value: 'Thyroidectomy', label: 'Thyroidectomy' },
            { value: 'Others', label: 'Others' },
          ]}
          onChange={handleChange}
          className="input-field"
        />
        {/* Scenario of Procedure */}
        <DropdownBox
          label="Scenario of Procedure"
          labelClass="truncate"
          id="scenarioOfProcedure"
          name="scenarioOfProcedure"
          value={formData.scenarioOfProcedure}
          options={[
            { value: 'Elective', label: 'Elective' },
            { value: 'Emergency', label: 'Emergency' },
          ]}
          required={true}
          onChange={handleChange}
          className="input-field"
        />
        {/* Diagnosis */}
        <DropdownBox
          label="Diagnosis"
          labelClass="truncate"
          id="diagnosis"
          name="diagnosis"
          value={formData.diagnosis}
          options={[
            { value: 'Appendicitis', label: 'Appendicitis' },
            { value: 'Cholecystitis', label: 'Cholecystitis' },
            { value: 'Hernia', label: 'Hernia' },
            { value: 'Malignancy', label: 'Malignancy' },
            { value: 'Thyroid Disease', label: 'Thyroid Disease' },
            { value: 'Others', label: 'Others' },
          ]}
          onChange={handleChange}
          required={true}
          className="input-field"
        />
        {/* Wound Class */}
        <DropdownBox
          label="Wound Class"
          labelClass="truncate"
          id="woundClass"
          name="woundClass"
          value={formData.woundClass}
          options={[
            { value: 'clean', label: 'Clean' },
            { value: 'clean_contaminated', label: 'Clean Contaminated' },
            { value: 'contaminated', label: 'Contaminated' },
            { value: 'dirty_infected', label: 'Dirty/Infected' },
          ]}
          onChange={handleChange}
          className="input-field"
        />
        {/* PAP Given */}
        <DropdownBox
          label="PAP Given"
          labelClass="truncate"
          id="papGiven"
          name="papGiven"
          value={formData.papGiven ? 'true' : 'false'}
          options={[
            { value: 'true', label: 'Yes' },
            { value: 'false', label: 'No' },
          ]}
          onChange={handleChange}
          required={true}
          className="input-field"
        />
        {/* PAP Duration */}
        {formData.papGiven && (
          <DateTimePickerBox
            label="PAP Duration"
            labelClass="truncate"
            id="papDuration"
            name="papDuration"
            value={formData.papDuration}
            onChange={handleChange}
            type="time"
            upperLimitMins={60}
          className="input-field"
        />
        )}
        {/* Outpatient Procedure */}
        <DropdownBox
          label="Outpatient Procedure"
          labelClass="truncate"
          id="outpatientProcedure"
          name="outpatientProcedure"
          value={formData.outpatientProcedure ? 'true' : 'false'}
          options={[
            { value: 'true', label: 'Yes' },
            { value: 'false', label: 'No' },
          ]}
          onChange={handleChange}
          required={true}
          className="input-field"
        />
        {/* Operation Theatre Number */}
        <DropdownBox
          label="Operation Theatre Number"
          labelClass="truncate"
          id="otno"
          name="otno"
          value={formData.otno?.toString() || ''}
          options={[
            { value: '1', label: 'Operation Theatre 1' },
            { value: '2', label: 'Operation Theatre 2' },
            { value: '3', label: 'Operation Theatre 3' },
          ]}
          required={true}
          onChange={handleChange}
          className="input-field"
        />
        {/* SSI Event Occurred */}
        <DropdownBox
          label="SSI Event Occurred"
          labelClass="truncate"
          id="ssiEventOccurred"
          name="ssiEventOccurred"
          value={formData.ssiEventOccurred ? 'true' : 'false'}
          options={[
            { value: 'true', label: 'Yes' },
            { value: 'false', label: 'No' },
          ]}
          onChange={handleChange}
          required={true}
          className="input-field"
        />
      </div>
    </div>
  );
};

export default PatientData;
