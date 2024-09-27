import React from 'react';
import DropdownBox from '../components/DropdownBox';
import {FormData} from './page';
import { days, symptoms } from './constants';
interface PostOpProps {
  formData: FormData;
  handlePostOpChange: (symptom: string, day: number | string, value: boolean) => void;
}

const PostOpForm: React.FC<PostOpProps> = ({ formData, handlePostOpChange }) => {
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>, symptom: string, day: string) => {
    handlePostOpChange(symptom, day, e.target.value === 'true');
  };

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
                    <DropdownBox
                      id={`${dayIndex}-${symptomIndex}`}
                      name={`${dayIndex}-${symptomIndex}`}
                      className='select p-1 rounded-md'
                      value={formData.symptomsDict[symptom][day] ? 'true' : 'false'}
                      options={[
                        { value: 'true', label: 'Yes' },
                        { value: 'false', label: 'No' },
                      ]}
                      onChange={(e) => handleDropdownChange(e, symptom, day)}
                    />
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
