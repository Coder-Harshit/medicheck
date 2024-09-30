import React from 'react';
import { SSIEvalCheckListItem } from './page';
import { FormData } from './page';

interface SSIEvalProps {
    formData: FormData;
    handleYesNoChange: (index: number, value: boolean) => void;
    handleRemarkChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SSIEval: React.FC<SSIEvalProps> = ({ formData, handleYesNoChange, handleRemarkChange }) => {
    return (
        <div className="container mx-auto p-4 rounded-lg section_box">
            <h3 className="text-2xl font-bold mt-4 mb-6 text-center">SSI EVALUATION</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6 pb-4">

                <div className="flex flex-col">
                    <label htmlFor="patient_name" className="p-2 font-semibold text-center">Patient Name</label>
                    <div id="patient_name" className="input rounded bg-transparent text-red-300 text-center">
                        {formData.patientName}
                    </div>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="patientId" className="p-2 font-semibold text-center">Patient ID</label>
                    <div id="patientId" className="input rounded bg-transparent text-red-300 text-center">
                        {formData.patientId}
                    </div>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="age" className="p-2 font-semibold text-center">Age</label>
                    <div id="age" className="input rounded bg-transparent text-red-300 text-center">
                        {formData.age}
                    </div>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="gender" className="p-2 font-semibold text-center">Gender</label>
                    <div id="gender" className="input rounded bg-transparent text-red-300 text-center">
                        {formData.gender}
                    </div>
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pt-4">

                <div className="flex flex-col">
                    {/* default value not being handled */}
                    <label htmlFor="procName" className="p-2 font-semibold text-center">Procedure Name</label>
                    <div id="procedureName" className="input rounded bg-transparent text-red-300 text-center">
                        {formData.procedureName}
                    </div>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="dop" className="p-2 font-semibold text-center">Date Of Procedure</label>
                    <div id="dateOfProcedure" className="input rounded bg-transparent text-red-300 text-center">
                        {formData.dateOfProcedure}
                    </div>
                </div>

            </div>

            {/* Checklist Table */}
            <table className="w-full border-collapse border border-gray-400 mt-6">
                <thead>
                    <tr className="bg-transparent">
                        <th className="border border-gray-400 p-2">S.No</th>
                        <th className="border border-gray-400 p-2">ITEMS</th>
                        <th className="border border-gray-400 p-2">YES</th>
                        <th className="border border-gray-400 p-2">NO</th>
                        <th className="border border-gray-400 p-2">REMARKS</th>
                    </tr>
                </thead>
                <tbody>
                    {formData.SSIEvalCheckList.map((item: SSIEvalCheckListItem, index: number) => (
                        <tr key={index} className="hover:bg-gray-700">
                            <td className="border border-gray-400 p-2 text-center">{index + 1}</td>
                            <td className="border border-gray-400 p-2">{item.item}</td>
                            <td className="border border-gray-400 p-2 text-center">
                                <input
                                    type="radio"
                                    name={`yesNo-${index}`}
                                    checked={item.yesNo === true}
                                    onChange={() => handleYesNoChange(index, true)}
                                />
                            </td>
                            <td className="border border-gray-400 p-2 text-center">
                                <input
                                    type="radio"
                                    name={`yesNo-${index}`}
                                    checked={item.yesNo === false}
                                    onChange={() => handleYesNoChange(index, false)}
                                />
                            </td>
                            <td className="border border-gray-400 p-2">
                                <input
                                    type="text"
                                    value={item.remark}
                                    onChange={(e) => handleRemarkChange(index, e)}
                                    className="w-full p-2 border border-gray-300 rounded text-black"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SSIEval;
