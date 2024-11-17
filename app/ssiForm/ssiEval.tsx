// FILE: ssiEval.tsx

import React from 'react';
import { SSIEvalCheckListItem } from './page';
import { FormData } from './page';
import InputBox from '../../components/InputBox';
import ToggleSwitch from '../../components/ToggleSwitch';

interface SSIEvalProps {
  formData: FormData;
  handleYesNoChange: (index: number, value: boolean) => void;
  handleRemarkChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing?: boolean;
}

const SSIEval: React.FC<SSIEvalProps> = ({
  formData,
  isEditing,
  handleYesNoChange,
  handleRemarkChange,
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-6 text-center text-primary">
        SSI Evaluation
      </h3>

      {/* Patient Information */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div>
          <label
            htmlFor="patient_name"
            className="block text-sm font-medium text-gray-700"
            title="Patient Name"
          >
            Patient Name
          </label>
          <div
            id="patient_name"
            className="input-field bg-gray-100 text-gray-800"
          >
            {formData.patientName}
          </div>
        </div>

        <div>
          <label
            htmlFor="patientId"
            className="block text-sm font-medium text-gray-700"
            title="Patient ID"
          >
            Patient ID
          </label>
          <div
            id="patientId"
            className="input-field bg-gray-100 text-gray-800"
          >
            {formData.patientId}
          </div>
        </div>

        <div>
          <label
            htmlFor="age"
            className="block text-sm font-medium text-gray-700"
            title="Age"
          >
            Age
          </label>
          <div id="age" className="input-field bg-gray-100 text-gray-800">
            {formData.age}
          </div>
        </div>

        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700"
            title="Gender"
          >
            Gender
          </label>
          <div
            id="gender"
            className="input-field bg-gray-100 text-gray-800"
          >
            {formData.gender}
          </div>
        </div>
      </div>

      {/* Procedure Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label
            htmlFor="procedureName"
            className="block text-sm font-medium text-gray-700"
            title="Procedure Name"
          >
            Procedure Name
          </label>
          <div
            id="procedureName"
            className="input-field bg-gray-100 text-gray-800"
          >
            {formData.procedureName}
          </div>
        </div>

        <div>
          <label
            htmlFor="dateOfProcedure"
            className="block text-sm font-medium text-gray-700"
            title="Date of Procedure"
          >
            Date of Procedure
          </label>
          <div
            id="dateOfProcedure"
            className="input-field bg-gray-100 text-gray-800"
          >
            {formData.dateOfProcedure}
          </div>
        </div>
      </div>

      {/* Checklist Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                S.No
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Items
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Yes/No
              </th>
              {/* <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Yes
              </th> */}
              {/* <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                No
              </th> */}
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {formData.SSIEvalCheckList.map(
              (item: SSIEvalCheckListItem, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-center text-sm text-gray-800">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {item.item}
                  </td>
                  {/* <td className="px-4 py-2 text-center">
                    <input
                      type="radio"
                      id={`yes-${index}`}
                      name={`yesNo-${index}`}
                      checked={item.yesNo === true}
                      onChange={() => handleYesNoChange(index, true)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                  </td> */}
                  <td className="px-4 py-2 text-center">
                  <ToggleSwitch
                      id={`yesNo-${index}`}
                      name={`yesNo-${index}`}
                      checked={!!item.yesNo}
                      onChange={(e) => handleYesNoChange(index, e.target.checked)}
                      disabled={isEditing}
                    />
                    {/* <input
                      type="radio"
                      id={`no-${index}`}
                      name={`yesNo-${index}`}
                      checked={item.yesNo === false}
                      onChange={() => handleYesNoChange(index, false)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    /> */}
                  </td>
                  <td className="px-4 py-2">
                    <InputBox
                      id={`remark-${index}`}
                      name={`remark-${index}`}
                      value={item.remark}
                      onChange={(e) => handleRemarkChange(index, e)}
                      placeholder="Enter remarks"
                      className="input-field"
                      disabled={isEditing}
                      // disabled={!item.yesNo}
                    />
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SSIEval;