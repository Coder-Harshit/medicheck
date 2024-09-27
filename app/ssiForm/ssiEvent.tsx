import React from 'react';
import { FormData } from './page';

interface SSIEventProps {
    formData: FormData;
    // handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSpecificEventChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDetectedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SSIEvent: React.FC<SSIEventProps> = ({ formData, handleSpecificEventChange, handleInputChange, handleDetectedChange }) => {
    return (
        <div className="container mx-auto p-4 rounded-lg section_box">
            <h3 className="text-2xl font-bold mt-4 mb-6 text-center capitalize">Event Details</h3>

            {/* Specific Event Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pb-4">
                <h4 className="col-span-2 font-semibold text-center">Specific Event:</h4>

                <div className="flex items-center space-x-4">
                    <input
                        type="radio"
                        id="sip"
                        name="specificEvent"
                        value="sip"
                        checked={formData.specificEvent === 'sip'}
                        onChange={handleSpecificEventChange}
                    />
                    <label htmlFor="sip" className="font-semibold">Superficial Incisional Primary (SIP)</label>
                </div>

                <div className="flex items-center space-x-4">
                    <input
                        type="radio"
                        id="sis"
                        name="specificEvent"
                        value="sis"
                        checked={formData.specificEvent === 'sis'}
                        onChange={handleSpecificEventChange}
                    />
                    <label htmlFor="sis" className="font-semibold">Superficial Incisional Secondary (SIS)</label>
                </div>

                <div className="flex items-center space-x-4">
                    <input
                        type="radio"
                        id="dip"
                        name="specificEvent"
                        value="dip"
                        checked={formData.specificEvent === 'dip'}
                        onChange={handleSpecificEventChange}
                    />
                    <label htmlFor="dip" className="font-semibold">Deep Incisional Primary (DIP)</label>
                </div>

                <div className="flex items-center space-x-4">
                    <input
                        type="radio"
                        id="dis"
                        name="specificEvent"
                        value="dis"
                        checked={formData.specificEvent === 'dis'}
                        onChange={handleSpecificEventChange}
                    />
                    <label htmlFor="dis" className="font-semibold">Deep Incisional Secondary (DIS)</label>
                </div>

                <div className="col-span-2 flex items-center space-x-4">
                    <input
                        type="radio"
                        id="organSpace"
                        name="specificEvent"
                        value="organSpace"
                        checked={formData.specificEvent === 'organSpace'}
                        onChange={handleSpecificEventChange}
                    />
                    <label htmlFor="organSpace" className="font-semibold">Organ/Space (specify site):</label>
                    {formData.specificEvent === 'organSpace' && (
                        <input
                            type="text"
                            id="organSpaceInput"
                            name="organSpace"
                            value={formData.organSpace}
                            onChange={handleInputChange}
                            className="border p-2 rounded text-black"
                            placeholder="Enter organ/space site"
                        />
                    )}
                </div>
            </div>

            {/* Detected Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pt-4">
                <h4 className="col-span-2 font-semibold text-center">Detected:</h4>

                <div className="flex items-center space-x-4">
                    <input
                        type="radio"
                        id="duringAdmission"
                        name="detected"
                        value="A"
                        checked={formData.detected === 'A'}
                        onChange={handleDetectedChange}
                    />
                    <label htmlFor="duringAdmission" className="font-semibold">A (During admission)</label>
                </div>

                <div className="flex items-center space-x-4">
                    <input
                        type="radio"
                        id="postDischarge"
                        name="detected"
                        value="P"
                        checked={formData.detected === 'P'}
                        onChange={handleDetectedChange}
                    />
                    <label htmlFor="postDischarge" className="font-semibold">P (Post-discharge surveillance)</label>
                </div>

                <div className="flex items-center space-x-4">
                    <input
                        type="radio"
                        id="readmissionFacility"
                        name="detected"
                        value="RF"
                        checked={formData.detected === 'RF'}
                        onChange={handleDetectedChange}
                    />
                    <label htmlFor="readmissionFacility" className="font-semibold">RF (Readmission to facility)</label>
                </div>
            </div>
        </div>
    );
};


export default SSIEvent;
