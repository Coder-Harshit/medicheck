// FILE: ssiEvent.tsx

import React from 'react';
import { FormData } from './page';
import InputBox from '../../components/InputBox';

interface SSIEventProps {
  formData: FormData;
  handleSpecificEventChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDetectedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SSIEvent: React.FC<SSIEventProps> = ({
  formData,
  handleSpecificEventChange,
  handleInputChange,
  handleDetectedChange,
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-6 text-center text-primary">
        Event Details
      </h3>

      {/* Specific Event Section */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold mb-4 text-primary">
          Specific Event
          <span className="text-red-500 ml-1">*</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SIP */}
          <div className="flex items-center">
            <input
              type="radio"
              id="sip"
              name="specificEvent"
              value="sip"
              checked={formData.specificEvent === 'sip'}
              onChange={handleSpecificEventChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <label htmlFor="sip" className="ml-2 block text-sm font-medium text-gray-700">
              Superficial Incisional Primary (SIP)
            </label>
          </div>

          {/* SIS */}
          <div className="flex items-center">
            <input
              type="radio"
              id="sis"
              name="specificEvent"
              value="sis"
              checked={formData.specificEvent === 'sis'}
              onChange={handleSpecificEventChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <label htmlFor="sis" className="ml-2 block text-sm font-medium text-gray-700">
              Superficial Incisional Secondary (SIS)
            </label>
          </div>

          {/* DIP */}
          <div className="flex items-center">
            <input
              type="radio"
              id="dip"
              name="specificEvent"
              value="dip"
              checked={formData.specificEvent === 'dip'}
              onChange={handleSpecificEventChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <label htmlFor="dip" className="ml-2 block text-sm font-medium text-gray-700">
              Deep Incisional Primary (DIP)
            </label>
          </div>

          {/* DIS */}
          <div className="flex items-center">
            <input
              type="radio"
              id="dis"
              name="specificEvent"
              value="dis"
              checked={formData.specificEvent === 'dis'}
              onChange={handleSpecificEventChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <label htmlFor="dis" className="ml-2 block text-sm font-medium text-gray-700">
              Deep Incisional Secondary (DIS)
            </label>
          </div>

          {/* Organ/Space */}
          <div className="flex items-center md:col-span-2">
            <input
              type="radio"
              id="organSpace"
              name="specificEvent"
              value="organSpace"
              checked={formData.specificEvent === 'organSpace'}
              onChange={handleSpecificEventChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <label htmlFor="organSpace" className="ml-2 block text-sm font-medium text-gray-700">
              Organ/Space (specify site):
            </label>
            {formData.specificEvent === 'organSpace' && (
              <InputBox
                id="organSpaceInput"
                name="organSpace"
                value={formData.organSpace}
                onChange={handleInputChange}
                className="ml-4 input-field"
                placeholder="Enter organ/space site"
              />
            )}
          </div>
        </div>
      </div>

      {/* Detected Section */}
      <div className="mt-8 space-y-4">
        <h4 className="text-lg font-semibold mb-4 text-primary">
          Detected
          <span className="text-red-500 ml-1">*</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* During Admission (A) */}
          <div className="flex items-center">
            <input
              type="radio"
              id="duringAdmission"
              name="detected"
              value="A"
              checked={formData.detected === 'A'}
              onChange={handleDetectedChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <label htmlFor="duringAdmission" className="ml-2 block text-sm font-medium text-gray-700">
              A (During admission)
            </label>
          </div>

          {/* Post-discharge Surveillance (P) */}
          <div className="flex items-center">
            <input
              type="radio"
              id="postDischarge"
              name="detected"
              value="P"
              checked={formData.detected === 'P'}
              onChange={handleDetectedChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <label htmlFor="postDischarge" className="ml-2 block text-sm font-medium text-gray-700">
              P (Post-discharge surveillance)
            </label>
          </div>

          {/* Readmission to Facility (RF) */}
          <div className="flex items-center md:col-span-2">
            <input
              type="radio"
              id="readmissionFacility"
              name="detected"
              value="RF"
              checked={formData.detected === 'RF'}
              onChange={handleDetectedChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <label htmlFor="readmissionFacility" className="ml-2 block text-sm font-medium text-gray-700">
              RF (Readmission to facility)
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSIEvent;