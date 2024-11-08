// FILE: app/ssiForm/[id]/page.tsx

'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { FormData } from '@/app/ssiForm/page';

const SSIDetail = () => {
  const { id } = useParams(); // Get the dynamic id from the URL
  const router = useRouter();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    };

    fetchFormData();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  if (!formData) return <div>No data found</div>;

  const handleEditDraft = () => {
    router.push(`/ssiForm/edit/${id}`);
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg text-black">
      <h1 className="text-2xl font-bold mb-4">SSI Form Details</h1>
      {/* Display the form data */}
      {/* {formData.patientName && (
        <p><strong>Patient Name:</strong> {formData.patientName}</p>
      )
      }
      {formData.age !== 0 && formData.age && (
        <p><strong>Patient Age:</strong> {formData.age}</p>
      )
      }
      {formData.gender && (
        <p><strong>Patient Gender:</strong> {formData.gender == 'M' ? 'Male' : 'Female'}</p>
      )
      }
      {formData.dateOfAdmission && (
        <p><strong>Date Of Admission:</strong> {formData.dateOfAdmission}</p>
      )
      }
      {formData.dateOfProcedure && (
        <p><strong>Date Of Procedure:</strong> {formData.dateOfProcedure}</p>
      )
      }
      {formData.admittingDepartment && (
        <p><strong>Admitting Department:</strong> {formData.admittingDepartment}</p>
      )
      }
      {formData.departmentPrimarySurgeon && (
        <p><strong>Primary Surgeon Dept.:</strong> {formData.departmentPrimarySurgeon}</p>
      )
      }
      {formData.primarySurgeonName && (
        <p><strong>Primary Surgeon:</strong> {formData.primarySurgeonName}</p>
      )
      }
      {formData.procedureName && (
        <p><strong>Procedure:</strong> {formData.procedureName}</p>
      )
      }
      {formData.diagnosis && (
        <p><strong>Diagnosis:</strong> {formData.diagnosis}</p>
      )
      }
      {formData.otno && (
        <p><strong>Operation Threater:</strong> OT-{formData.otno}</p>
      )
      }
      {formData.procedureDoneBy && (
        <p><strong>Procedure Done By:</strong> {formData.procedureDoneBy}</p>
      )
      }
      {formData.outpatientProcedure == true && (
        <p><strong>Out Patient Procedure:</strong> {formData.outpatientProcedure == true ? 'Yes' : 'No'}</p>
      )
      }
      {formData.scenarioOfProcedure && (
        <p><strong>Procedure Scenario:</strong> {formData.scenarioOfProcedure}</p>
      )
      }
      {formData.woundClass && (
        <p><strong>Wound Class:</strong> {formData.woundClass}</p>
      )
      }
      {formData.papGiven && (
        <p><strong>PAP :</strong> {formData.papGiven ? 'Given' : 'Not Given'}</p>
      )
      }
      {formData.antibioticsGiven && (
        <p><strong>Antibiotics Given:</strong> {formData.antibioticsGiven}</p>
      )
      }
      {formData.papDuration && (
        <p><strong>PAP Duration:</strong> {formData.papDuration}</p>
      )
      }
      {formData.ssiEventOccurred !== undefined && (
        <p><strong>SSI Event Occurred:</strong> {formData.ssiEventOccurred ? 'Yes' : 'No'}</p>
      )
      }
      {formData.dateOfSSIEvent && (
        <p><strong>Date Of SSI Event:</strong> {formData.dateOfSSIEvent}</p>
      )
      }
      {formData.eventDetails && (
        <p><strong>Event Details:</strong> {formData.eventDetails}</p>
      )
      }
      {formData.microorganisms && formData.microorganisms.length > 0 && (
        <p><strong>Microorganisms:</strong> {formData.microorganisms.join(', ')}</p>
      )
      }
      {formData.secondaryBSI !== undefined && (
        <p><strong>Secondary BSI:</strong> {formData.secondaryBSI ? 'Yes' : 'No'}</p>
      )
      }
      {formData.antibiotics && formData.antibiotics.filter(antibiotic => antibiotic.doses > 0).length > 0 && (
        <p><strong>Antibiotics:</strong> {formData.antibiotics.map((antibiotic, index) => (
          <span key={index}>
            {antibiotic.doses > 0 && (
              <span>
                {antibiotic.abop_stage}: patient given {antibiotic.doses} doses of {antibiotic.antibiotic}{index < formData.antibiotics.length - 1 ? ', ' : ''}
              </span>
            )}
          </span>
        )
        )}</p>
      )
      }
      {formData.timeOfInduction && (
        <p><strong>Time Of Induction:</strong> {formData.timeOfInduction}</p>
      )
      }
      {formData.timeOfSkinIncision && (
        <p><strong>Time Of Skin Incision:</strong> {formData.timeOfSkinIncision}</p>
      )
      }
      {formData.timeOfEndSurgery && (
        <p><strong>Time Of End Surgery:</strong> {formData.timeOfEndSurgery}</p>
      )
      }
      {formData.isolate1 && (
        (formData.isolate1.sensitive || formData.isolate1.resistant || formData.isolate1.intermediate) && (
          <div>
            <p><strong>Isolate 1:</strong></p>
            {formData.isolate1.sensitive && <p>Sensitive: {formData.isolate1.sensitive}</p>}
            {formData.isolate1.resistant && <p>Resistant: {formData.isolate1.resistant}</p>}
            {formData.isolate1.intermediate && <p>Intermediate: {formData.isolate1.intermediate}</p>}
          </div>
        )
      )}
      {formData.isolate2 && (
        (formData.isolate2.sensitive || formData.isolate2.resistant || formData.isolate2.intermediate) && (
          <div>
            <p><strong>Isolate 2:</strong></p>
            {formData.isolate2.sensitive && <p>Sensitive: {formData.isolate2.sensitive}</p>}
            {formData.isolate2.resistant && <p>Resistant: {formData.isolate2.resistant}</p>}
            {formData.isolate2.intermediate && <p>Intermediate: {formData.isolate2.intermediate}</p>}
          </div>
        )
      )}
      {formData.symptomsDict && Object.keys(formData.symptomsDict).some(symptom =>
        Object.values(formData.symptomsDict[symptom]).some(value => value)
      ) && (
          <div>
            <p><strong>Symptoms:</strong></p>
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
          </div>
        )
      }
      {formData.SSIEvalCheckList && formData.SSIEvalCheckList.length > 0 && (
        <div>
          <p><strong>SSI Evaluation Checklist:</strong></p>
          {formData.SSIEvalCheckList.map((item, index) => (
            // item.yesNo && (
            <p key={index}>{item.item}: {item.yesNo ? 'Yes' : 'No'}</p>
          // )
          ))}
        </div>
      )
      }
      {formData.specificEvent && (
        <p><strong>Specific Event:</strong> {formData.specificEvent}</p>
      )
      }
      {formData.organSpace && (
        <p><strong>Organ Space:</strong> {formData.organSpace}</p>
      )
      }
      {formData.detected && (
        <p><strong>Detected:</strong> {formData.detected}</p>
      )
      } */}
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
          {formData.primarySurgeonName && (
            <tr>
              <td className="table-cell border font-bold">Primary Surgeon:</td>
              <td className='table-cell border'>{formData.primarySurgeonName}</td>
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
          {formData.outpatientProcedure == true && (
            <tr>
              <td className="table-cell border font-bold">Out Patient Procedure:</td>
              <td className='table-cell border'>{formData.outpatientProcedure == true ? 'Yes' : 'No'}</td>
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
          {formData.antibioticsGiven && (
            <tr>
              <td className="table-cell border font-bold">Antibiotics Given:</td>
              <td className='table-cell border'>{formData.antibioticsGiven}</td>
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
          {formData.eventDetails && (
            <tr>
              <td className="table-cell border font-bold">Event Details:</td>
              <td className='table-cell border'>{formData.eventDetails}</td>
            </tr>
          )}
          {formData.microorganisms && formData.microorganisms.length > 0 && (
            <tr>
              <td className="table-cell border font-bold">Microorganisms:</td>
              <td className='table-cell border'>{formData.microorganisms.join(', ')}</td>
            </tr>
          )}
          {formData.secondaryBSI !== undefined && (
            <tr>
              <td className="table-cell border font-bold">Secondary BSI:</td>
              <td className='table-cell border'>{formData.secondaryBSI ? 'Yes' : 'No'}</td>
            </tr>
          )}
          {formData.antibiotics && formData.antibiotics.filter(antibiotic => antibiotic.doses > 0).length > 0 && (
            <tr>
              <td className="table-cell border font-bold">Antibiotics:</td>
              <td className='table-cell border'>{formData.antibiotics.map((antibiotic, index) => (
                <span key={index}>
                  {antibiotic.doses > 0 && (
                    <span>
                      {antibiotic.abop_stage}: patient given {antibiotic.doses} doses of {antibiotic.antibiotic}{index < formData.antibiotics.length - 1 ? ', ' : ''}
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
      {/* </div> */}
      {/* {formData.status && (
        <p><strong>Status:</strong> {formData.status}</p>
      )
      } */}
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
};

export default SSIDetail;