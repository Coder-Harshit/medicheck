// FILE: app/ssiForm/[id]/page.tsx

'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { SSIFormData as FormData } from '@/app/interfaces';
import { useUser } from '@/hooks/useUser';

const SSIDetail = () => {
  const { user, userRole, loading } = useUser();
  const { id } = useParams(); // Get the dynamic id from the URL
  const router = useRouter();
  const [formData, setFormData] = useState<FormData | null>(null);
  // const [dataLoading, setDataLoading] = useState(true);
  const [,setDataLoading] = useState(true);

  useEffect(() => {
    const fetchFormData = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('SSI_Form')
        .select('*')
        .eq('patientId', id)
        .single();

      if (error) {
        console.error('Error fetching SSI form:', error);
      } else {
        setFormData(data);
      }
      setDataLoading(false);
    };
    if (user) {
      fetchFormData();
    }
  }, [id, user]);

  if (loading) return <div>Loading...</div>;

  if (!formData) return <div>No data found</div>;
  // if (!formData)
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
  //     <div className="text-center p-8 bg-white rounded-lg shadow-lg">
  //       <h2 className="text-2xl font-bold mb-4">No SSI Form Found</h2>
  //       <p className="mb-6 text-gray-600">Would you like to create a new SSI Form?</p>
  //       <div className="space-x-4">
  //         <button
  //           onClick={() => router.push(`/ssiForm?formId=${id}`)}
  //           className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700"
  //         >
  //           Create New Form
  //         </button>
  //         {/* <button
  //           onClick={handleBackToDashboard}
  //           className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
  //         >
  //           Back to Dashboard
  //         </button> */}
  //       </div>
  //     </div>
  //   </div>
  //   );

  const handleEditDraft = () => {
    router.push(`/ssiForm/edit/${id}`);
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  if (userRole?.role === 'doctor') {
    router.push(`/ssiForm/edit/${id}`);
  }
  else if (userRole?.role === 'nurse') {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg text-black">
        <h1 className="text-2xl font-bold mb-4">SSI Form Details</h1>

        <div className="mt-6"></div>
        <h2 className="text-xl font-semibold mb-2">Patient Information</h2>
        <table className="table-auto w-full mb-4">
          <tbody>
            {formData.patientName && (
              <tr>
                <td className="table-cell border font-bold">Patient Name:</td>
                <td className='table-cell border'>{formData.patientName}</td>
              </tr>
            )}
            {formData.age !== 0 && formData.age && (
              <tr>
                <td className="table-cell border font-bold">Patient Age:</td>
                <td className='table-cell border'>{formData.age}</td>
              </tr>
            )}
            {formData.gender && (
              <tr>
                <td className="table-cell border font-bold">Patient Gender:</td>
                <td className='table-cell border'>{formData.gender == 'M' ? 'Male' : 'Female'}</td>
              </tr>
            )}
            {formData.dateOfAdmission && (
              <tr>
                <td className="table-cell border font-bold">Date Of Admission:</td>
                <td className='table-cell border'>{formData.dateOfAdmission}</td>
              </tr>
            )}
            {formData.dateOfProcedure && (
              <tr>
                <td className="table-cell border font-bold">Date Of Procedure:</td>
                <td className='table-cell border'>{formData.dateOfProcedure}</td>
              </tr>
            )}
            {formData.admittingDepartment && (
              <tr>
                <td className="table-cell border font-bold">Admitting Department:</td>
                <td className='table-cell border'>{formData.admittingDepartment}</td>
              </tr>
            )}
            {formData.departmentPrimarySurgeon && (
              <tr>
                <td className="table-cell border font-bold">Primary Surgeon Dept.:</td>
                <td className='table-cell border'>{formData.departmentPrimarySurgeon}</td>
              </tr>
            )}
            {formData.departmentPrimarySurgeon && (
              <tr>
                <td className="table-cell border font-bold">Primary Surgeon:</td>
                <td className='table-cell border'>{formData.departmentPrimarySurgeon}</td>
              </tr>
            )}
            {formData.procedureName && (
              <tr>
                <td className="table-cell border font-bold">Procedure:</td>
                <td className='table-cell border'>{formData.procedureName}</td>
              </tr>
            )}
            {formData.diagnosis && (
              <tr>
                <td className="table-cell border font-bold">Diagnosis:</td>
                <td className='table-cell border'>{formData.diagnosis}</td>
              </tr>
            )}
            {formData.otno && (
              <tr>
                <td className="table-cell border font-bold">Operation Theater:</td>
                <td className='table-cell border'>OT-{formData.otno}</td>
              </tr>
            )}
            {formData.procedureDoneBy && (
              <tr>
                <td className="table-cell border font-bold">Procedure Done By:</td>
                <td className='table-cell border'>{formData.procedureDoneBy}</td>
              </tr>
            )}
            {formData.outpatientProcedure && (
              <tr>
                <td className="table-cell border font-bold">Out Patient Procedure:</td>
                <td className='table-cell border'>{formData.outpatientProcedure ? 'Yes' : 'No'}</td>
              </tr>
            )}
            {formData.scenarioOfProcedure && (
              <tr>
                <td className="table-cell border font-bold">Procedure Scenario:</td>
                <td className='table-cell border'>{formData.scenarioOfProcedure}</td>
              </tr>
            )}
            {formData.woundClass && (
              <tr>
                <td className="table-cell border font-bold">Wound Class:</td>
                <td className='table-cell border'>{formData.woundClass}</td>
              </tr>
            )}
            {formData.papGiven && (
              <tr>
                <td className="table-cell border font-bold">PAP:</td>
                <td className='table-cell border'>{formData.papGiven ? 'Given' : 'Not Given'}</td>
              </tr>
            )}
            {formData.antibioticGiven && (
              <tr>
                <td className="table-cell border font-bold">Antibiotics Given:</td>
                <td className='table-cell border'>{formData.antibioticGiven}</td>
              </tr>
            )}
            {formData.papDuration && (
              <tr>
                <td className="table-cell border font-bold">PAP Duration:</td>
                <td className='table-cell border'>{formData.papDuration}</td>
              </tr>
            )}
            {formData.ssiEventOccurred !== undefined && (
              <tr>
                <td className="table-cell border font-bold">SSI Event Occurred:</td>
                <td className='table-cell border'>{formData.ssiEventOccurred ? 'Yes' : 'No'}</td>
              </tr>
            )}
            {formData.dateOfSSIEvent && (
              <tr>
                <td className="table-cell border font-bold">Date Of SSI Event:</td>
                <td className='table-cell border'>{formData.dateOfSSIEvent}</td>
              </tr>
            )}
            {formData.microorganism1 || formData.microorganism2 && (
              <tr>
                <td className="table-cell border font-bold">Microorganisms:</td>
                <td className='table-cell border'>{formData.microorganism1}, {formData.microorganism2}</td>
              </tr>
            )}
            {formData.secondaryBSIdeath !== undefined && (
              <tr>
                <td className="table-cell border font-bold">Secondary BSI:</td>
                <td className='table-cell border'>{formData.secondaryBSIdeath ? 'Yes' : 'No'}</td>
              </tr>
            )}
            {formData.antibioticPrescriptions && formData.antibioticPrescriptions.filter(antibiotic => antibiotic.dose > 0).length > 0 && (
              <tr>
                <td className="table-cell border font-bold">Antibiotics:</td>
                <td className='table-cell border'>{formData.antibioticPrescriptions.map((antibiotic, index) => (
                  <span key={index}>
                    {antibiotic.dose > 0 && (
                      <span>
                        {antibiotic.stage}: patient given {antibiotic.dose} doses of {antibiotic.name}{index < formData.antibioticPrescriptions.length - 1 ? ', ' : ''}
                      </span>
                    )}
                  </span>
                ))}</td>
              </tr>
            )}
            {formData.timeOfInduction && (
              <tr>
                <td className="table-cell border font-bold">Time Of Induction:</td>
                <td className='table-cell border'>{formData.timeOfInduction}</td>
              </tr>
            )}
            {formData.timeOfSkinIncision && (
              <tr>
                <td className="table-cell border font-bold">Time Of Skin Incision:</td>
                <td className='table-cell border'>{formData.timeOfSkinIncision}</td>
              </tr>
            )}
            {formData.timeOfEndSurgery && (
              <tr>
                <td className="table-cell border font-bold">Time Of End Surgery:</td>
                <td className='table-cell border'>{formData.timeOfEndSurgery}</td>
              </tr>
            )}
            {formData.isolate1 && (
              (formData.isolate1.sensitive || formData.isolate1.resistant || formData.isolate1.intermediate) && (
                <tr>
                  <td className="font-bold">Isolate 1:</td>
                  <td>
                    {formData.isolate1.sensitive && <p>Sensitive: {formData.isolate1.sensitive}</p>}
                    {formData.isolate1.resistant && <p>Resistant: {formData.isolate1.resistant}</p>}
                    {formData.isolate1.intermediate && <p>Intermediate: {formData.isolate1.intermediate}</p>}
                  </td>
                </tr>
              )
            )}
            {formData.isolate2 && (
              (formData.isolate2.sensitive || formData.isolate2.resistant || formData.isolate2.intermediate) && (
                <tr>
                  <td className="font-bold">Isolate 2:</td>
                  <td>
                    {formData.isolate2.sensitive && <p>Sensitive: {formData.isolate2.sensitive}</p>}
                    {formData.isolate2.resistant && <p>Resistant: {formData.isolate2.resistant}</p>}
                    {formData.isolate2.intermediate && <p>Intermediate: {formData.isolate2.intermediate}</p>}
                  </td>
                </tr>
              )
            )}
            {formData.symptomsDict && Object.keys(formData.symptomsDict).some(symptom =>
              Object.values(formData.symptomsDict[symptom]).some(value => value)
            ) && (
                <tr>
                  <td className="font-bold">Symptoms:</td>
                  <td>
                    {Object.keys(formData.symptomsDict).map((symptom, index) => {
                      const daysWithSymptoms = Object.keys(formData.symptomsDict[symptom]).filter(day => formData.symptomsDict[symptom][day]);
                      if (daysWithSymptoms.length > 0) {
                        return (
                          <div key={index}>
                            <p>{symptom}:</p>
                            {daysWithSymptoms.map((day, subIndex) => (
                              <p key={subIndex}>{day}: Yes</p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </td>
                </tr>
              )}
            {formData.SSIEvalCheckList && formData.SSIEvalCheckList.length > 0 && (
              <tr>
                <td className="table-cell border font-bold">SSI Evaluation Checklist:</td>
                <td className='table-cell border'>
                  <table className="table-auto w-full">
                    <tbody>
                      {formData.SSIEvalCheckList.map((item, index) => (
                        <tr key={index}>
                          <td className="table-cell border font-bold">{item.item}:</td>
                          <td className="table-cell border">{item.yesNo ? 'Yes' : 'No'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            )}
            {formData.specificEvent && (
              <tr>
                <td className="table-cell border font-bold">Specific Event:</td>
                <td className='table-cell border'>{formData.specificEvent}</td>
              </tr>
            )}
            {formData.organSpace && (
              <tr>
                <td className="table-cell border font-bold">Organ Space:</td>
                <td className='table-cell border'>{formData.organSpace}</td>
              </tr>
            )}
            {formData.detected && (
              <tr>
                <td className="table-cell border font-bold">Detected:</td>
                <td className='table-cell border'>{formData.detected}</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-4">
          <button
            onClick={handleEditDraft}
            className="btn-primary mr-2"
          >
            Edit Draft
          </button>
          <button
            onClick={handleBackToDashboard}
            className="btn-secondary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
};

export default SSIDetail;