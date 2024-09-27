import React from 'react';
// import InputBox from '../components/InputBox';
import DropdownBox from '../components/DropdownBox';
// import DateTimePickerBox from '../components/DateTimePickerBox';
import { FormData, days, symptoms } from './page';

interface PostOpProps {
  formData: FormData;
  handleChange: (symptom: string, day: number | string, value: boolean) => void;
}

const PostOpForm: React.FC<PostOpProps> = ({ formData, handleChange }) => {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Post-op Monitoring Form</h2>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse w-full text-center">
          <thead>
            <tr>
              <th className="border p-2">Symptom</th>
              {days.map((day, index) => (
                <th key={index} className="border p-2">Day {day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {symptoms.map((symptom, symptomIndex) => (
              <tr key={symptomIndex}>
                <td className="border p-2 text-left font-semibold">{symptom}</td>
                {days.map((day, dayIndex) => (
                  <td key={dayIndex} className="border p-2">
                    <select
                      value={formData.symptomsDict[symptom][day] ? 'true' : 'false'}
                      onChange={(e) => handleChange(symptom, day, e.target.value === 'true')}
                      className="border rounded p-1 text-black"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostOpForm;
