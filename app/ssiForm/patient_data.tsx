import React from 'react';
import InputBox from '../components/InputBox';
import DropdownBox from '../components/DropdownBox';
import DatePickerBox from '../components/DatePickerBox';
import TimePickerBox from '../components/TimePickerBox';
import DateTimePickerBox from '../components/DateTimePickerBox';
import { FormData } from './page';

interface PatientDataProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const PatientData: React.FC<PatientDataProps> = ({ formData, handleChange }) => {
  return (
    <div className="container mx-auto p-4 rounded-lg section_box">
      <h3 className="text-2xl font-bold mt-4 mb-6 text-center">BASIC DETAILS</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* PatientName Input */}
        <InputBox
          label='Patient Name'
          type='text'
          value={formData.patientName}
          id={''}
          name={''}
          onChange={handleChange}
          className="input p-3 rounded-md"
        />

        {/* Admitting Department Dropdown */}
        <DropdownBox
          label="Admitting Department"
          id="admittingDepartment"
          name="admittingDepartment"
          value={formData.admittingDepartment}
          options={[
            // { value: '', label: 'Select Department' },
            // { value: '', label: '----' },
            // Add department options here
          ]}
          onChange={handleChange}
          className="select p-3 rounded-md"
        />

        {/* OutPatient Procedure Dropdown */}
        <DropdownBox
          label="Outpatient Procedure"
          id="outpatientProcedure"
          name="outpatientProcedure"
          value={formData.outpatientProcedure ? 'Yes' : 'No'}
          options={[
            // { value: '', label: '----' },
            { value: 'Yes', label: 'Yes' },
            { value: 'No', label: 'No' },
          ]}
          onChange={handleChange}
          className="select p-3 rounded-md"
        />

        {/* PatientID Input */}
        <InputBox
          label='Patient ID'
          type='number'
          value={formData.patientId}
          id={''}
          name={''}
          onChange={handleChange}
          className="input p-3 rounded-md"
        />

        {/* Department of Primary Surgeon Dropdown */}
        <DropdownBox
          label="Department (Primary Surgeon)"
          id="departmentPrimarySurgeon"
          name="departmentPrimarySurgeon"
          value={formData.departmentPrimarySurgeon}
          options={[
            // { value: '', label: 'Select Surgeon Department' },
            // { value: '', label: '----' },
            // Add surgeon department options here
          ]}
          onChange={handleChange}
          className="select p-3 rounded-md"
        />

        {/* Procedure Scenario */}
        <DropdownBox
          label="Scenario of Procedure"
          id="scenarioOfProcedure"
          name="scenarioOfProcedure"
          value={formData.scenarioOfProcedure}
          options={[
            // { value: '', label: 'Scenario of Procedure' },
            // { value: '', label: '----' },
            // Add Scenario of Procedure options here
          ]}
          onChange={handleChange}
          className="select p-3 rounded-md"
        />

        {/* Patient Age Input */}
        <InputBox
          label='Age'
          type='number'
          value={formData.age.toString()} // Convert number to string
          id={''}
          name={''}
          onChange={handleChange}
          className="input p-3 rounded-md"
        />

        {/* Procedure Name Input */}
        <DropdownBox
          label="Procedure Name"
          id="procedureName"
          name="procedureName"
          value={formData.procedureName}
          options={[
            // { value: '', label: 'Name of Procedure' },
            // { value: '', label: '----' },
            // Add Name of Procedure options here
          ]}
          onChange={handleChange}
          className="select p-3 rounded-md"
        />

        {/* Wound Class Input */}
        <DropdownBox
          label="Wound Class"
          id="woundClass"
          name="woundClass"
          value={formData.woundClass}
          options={[
            // { value: '', label: 'Wound Class' },
            // { value: '', label: '----' },
            { value: 'clean', label: 'Clean' },
            { value: 'clean_contaminated', label: 'Clean Contaminated' },
            { value: 'contaminated', label: 'Contaminated' },
            { value: 'dirty_infected', label: 'Dirty/Infected' },
            // Add Wound Class options here
          ]}
          onChange={handleChange}
          className="select p-3 rounded-md"
        />

        {/* Gender Dropdown */}
        <DropdownBox
          label="Gender"
          id="gender"
          name="gender"
          value={formData.gender}
          options={[
            // { value: '', label: '----' },
            { value: 'M', label: 'Male' },
            { value: 'F', label: 'Female' },
          ]}
          onChange={handleChange}
          className="select p-3 rounded-md"
        />

        {/* Diagnosis Dropdown */}
        <DropdownBox
          label="Diagnosis"
          id="diagnosis"
          name="diagnosis"
          value={formData.diagnosis}
          options={[
            // { value: '', label: '----' },

          ]}
          onChange={handleChange}
          className="select p-3 rounded-md"
        />

        {/* PAP given Dropdown */}
        <DropdownBox
          label="PAP Given"
          id="papGiven"
          name="papGiven"
          value={formData.papGiven ? 'Yes' : 'No'}
          options={[
            // { value: '', label: '----' },
            { value: 'Yes', label: 'Yes' },
            { value: 'No', label: 'No' },
          ]}
          onChange={handleChange}
          className="select p-3 rounded-md"
        />

        {/* <DatePickerBox
          label="Date of Admission"
          id="dateOfAdmission"
          name="dateOfAdmission"
          value={formData.dateOfAdmission}
          onChange={handleChange}
          className="input p-3 rounded-md"
        /> */}

        {/* Date of Admission */}
        <DateTimePickerBox
          label="Date of Admission"
          id="dateOfAdmission"
          name="dateOfAdmission"
          value={formData.dateOfAdmission}
          onChange={handleChange}
          className="input p-3 rounded-md"
          type='date'
        />


        {/* Primary Surgeon Name */}
        <DropdownBox
          label="Primary Surgeon Name"
          id="primarySurgeonName"
          name="primarySurgeonName"
          value={formData.primarySurgeonName}
          options={[
            // { value: '', label: 'Scenario of Procedure' },
            // { value: '', label: '----' },
            // Add Scenario of Procedure options here
          ]}
          onChange={handleChange}
          className="select p-3 rounded-md"
        />

        {/* {formData.papGiven && (
          <TimePickerBox
            label="PAP Duration"
            id="papDuration"
            name="papDuration"
            value={formData.papDuration}
            onChange={handleChange}
            className="input p-3 rounded-md" upperLimitMins={60}
          />
        )} */}

        {/* PAP Duration */}
        <DateTimePickerBox
          label="PAP Duration"
          id="papDuration"
          name="papDuration"
          value={formData.papDuration}
          onChange={handleChange}
          className="input p-3 rounded-md" upperLimitMins={60}
          type={'time'}
        />



        {/* <DatePickerBox
          label="Date of Operative Procedure"
          id="dateOfProcedure"
          name="dateOfProcedure"
          value={formData.dateOfProcedure}
          onChange={handleChange}
          className="input p-3 rounded-md"
        /> */}

        {/* Date of Operative Procedure */}
        <DateTimePickerBox
          label="Date of Operative Procedure"
          id="dateOfProcedure"
          name="dateOfProcedure"
          value={formData.dateOfProcedure}
          onChange={handleChange}
          className="input p-3 rounded-md"
          type={'date'}
        />

        {/* Operation Threater Number */}
        <DropdownBox
          label="Operation Theatre Number"
          id="otno"
          name="otno"
          value={formData.otno?.toString() || '1'} // Convert number to string
          options={[
            { value: '1', label: 'OperationTheater-1' },
            { value: '2', label: 'OperationTheater-2' },
            { value: '3', label: 'OperationTheater-3' },
            // { value: '', label: 'Scenario of Procedure' },
            // { value: '', label: '----' },
            // Add Scenario of Procedure options here
          ]}
          onChange={handleChange}
          className="select p-3 rounded-md"
        />

        {/* SSI Given */}
        <DropdownBox
          label="SSI Event Occurred"
          id="ssiEvent"
          name="ssiEvent"
          value={formData.ssiEventOccurred ? 'No' : 'Yes'}
          options={[
            // { value: '', label: '----' },
            { value: 'Yes', label: 'Yes' },
            { value: 'No', label: 'No' },
          ]}
          onChange={handleChange}
          className="select p-3 rounded-md"
        />
      </div>
      {/* <button className="mt-6 m-2 px-8 py-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 w-max self-center">
        Continue
      </button> */}

    </div>
  );
};

export default PatientData;
