import React from 'react';
import ToggleSwitch from '../../components/ToggleSwitch';
import { FormData } from './page';
import { days, symptoms } from './constants';

interface PostOpProps {
  formData: FormData;
  handlePostOpChange: (
    symptom: string,
    day: number | string,
    value: boolean
  ) => void;
}

const PostOpForm: React.FC<PostOpProps> = ({
  formData,
  handlePostOpChange,
}) => {
  const handleToggleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    symptom: string,
    day: string
  ) => {
    handlePostOpChange(symptom, day, e.target.checked);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">
        Post-op Monitoring Form
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Symptom
              </th>
              {days.map((day, index) => (
                <th
                  key={index}
                  className="px-4 py-2 text-center text-sm font-medium text-gray-700"
                >
                  Day {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {symptoms.map((symptom, symptomIndex) => (
              <tr key={symptomIndex}>
                <td className="px-4 py-2 text-sm font-semibold text-gray-800">
                  {symptom}
                </td>
                {days.map((day, dayIndex) => (
                  <td key={dayIndex} className="px-4 py-2 text-center">
                    <ToggleSwitch
                      id={`symptom_${symptomIndex}_day_${dayIndex}`}
                      name={`symptom_${symptomIndex}_day_${dayIndex}`}
                      checked={!!formData.symptomsDict[symptom][day]}
                      onChange={(e) => handleToggleChange(e, symptom, day)}
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
