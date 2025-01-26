// app/interfaces.ts

import {formatDate} from "@/utils/dateHandling";
import {SSIEvalChecklistItems} from "@/app/ssiForm/constants";

export interface AntibioticPrescriptionProps {
  formData: SSIFormData;
  handleAntibioticChange: (prescriptions: AntibioticPrescription[]) => void;
  isEditing?: boolean;
}

export interface AntibioticPrescription {
  id: string;
  name: string;
  stage: 'prior' | 'pre_peri' | 'after';
  dose: number;
  route: string;
  duration: string;
}

export interface SSIEvalCheckListItem {
  item: string; // The description of the checklist item.
  yesNo: boolean | null; // Boolean value for Yes/No selection (null if not answered).
  remark: string; // Any remarks for that checklist item.
}

export interface SSIFormData {
  patientName: string;
  patientId: string;
  age: number;
  gender: 'M' | 'F';
  dateOfAdmission: string;
  dateOfProcedure: string;
  admittingDepartment: string;
  procedureDoneBy: string;
  departmentPrimarySurgeon: string;
  procedureName: string;
  diagnosis: string;
  otno: number;
  outpatientProcedure: boolean;
  scenarioOfProcedure: 'Elective' | 'Emergency';
  woundClass: 'Clean' | 'Clean Contaminated' | 'Contaminated' | 'Dirty/Infected';
  papGiven: boolean;
  papDuration: string;
  antibioticGiven: string;
  ssiEventOccurred: boolean;
  dateOfSSIEvent: string;
  microorganism1: string;
  microorganism2: string;
  secondaryBSIdeath: boolean;
  timeOfInduction: string;
  timeOfSkinIncision: string;
  timeOfEndSurgery: string;
  isolate1: {
    sensitive: string[];
    resistant: string[];
    intermediate: string[];
  };
  isolate2: {
    sensitive: string[];
    resistant: string[];
    intermediate: string[];
  };
  symptomsDict: {
    [key: string]: { [key: string]: boolean };
  };
  SSIEvalCheckList: SSIEvalCheckListItem[];
  specificEvent: string;
  organSpace: string;
  detected: string;
  status: 'ongoing' | 'to-be-reviewed' | 'reviewed';
  antibioticPrescriptions: {
    id: string;
    name: string;
    stage: 'prior' | 'pre_peri' | 'after';
    dose: number;
    route: string;
    duration: string;
  }[];
}

export interface SSIEventProps {
  formData: SSIFormData;
  handleSpecificEventChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing?: boolean;
}

export interface SSIEvalProps {
  formData: SSIFormData;
  handleYesNoChange: (index: number, value: boolean) => void;
  handleRemarkChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing?: boolean;
}

export interface PatientDataProps {
  formData: SSIFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isEditing?: boolean;
}

export interface MicrobiologyDataProps {
  formData: SSIFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleIsolateChange: (
      isolate: 'isolate1' | 'isolate2',
      category: 'sensitive' | 'resistant' | 'intermediate',
      values: string[]
  ) => void;
  isEditing?: boolean;
}

export interface PostOpSheetProps {
  formData: SSIFormData;
  handlePostOpChange: (symptom: string, day: number | string, value: boolean) => void;
  isEditing?: boolean;
}

export interface FormattedSSIFormData {
  patientName: string;
  age: number;
  gender: string;
  dateOfAdmission: string;
  dateOfProcedure: string;
  admittingDepartment: string;
  departmentPrimarySurgeon: string;
  procedureDoneBy: string;
  procedureName: string;
  diagnosis: string;
  otno: number;
  outpatientProcedure: boolean;
  scenarioOfProcedure: string;
  woundClass: string;
  papGiven: boolean;
  papDuration: string;
  ssiEventOccurred: boolean;
  dateOfSSIEvent: string | null;
  microorganism1: string | null;
  antibioticPrescriptions: string;
  timeOfInduction: string;
  timeOfSkinIncision: string;
  timeOfEndSurgery: string;
  isolate1: string;
  isolate2: string;
  symptomsDict: string;
  SSIEvalCheckList: string;
  specificEvent: string;
  organSpace: string;
  detected: string;
  status: string | null;
  patientId: number;
  microorganism2: string | null;
  secondaryBSIdeath: boolean | null;
  antibioticGiven: string | null;
  // reviewedBy: string | null;
  // reviewedAt: string | null;
}