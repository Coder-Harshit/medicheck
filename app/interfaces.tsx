interface AntibioticPrescriptionProps {
  formData: FormData
  handleAntibioticChange: (prescriptions: AntibioticPrescription[]) => void
  isEditing?: boolean
}
  
interface AntibioticPrescription {
  id: string
  name: string
  stage: 'prior' | 'pre_peri' | 'after'
  dose: number
  route: string
  duration: string
}
  
interface SSIEventProps {
  formData: FormData
  handleSpecificEventChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isEditing?: boolean
}

interface SSIEvalCheckListItem {
  item: string;   // The description of the checklist item.
  yesNo: boolean | null;  // Boolean value for Yes/No selection (null if not answered).
  remark: string; // Any remarks for that checklist item.
}

interface SSIFormData {
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
      [key: string]: { [key: string]: boolean }
  };
  SSIEvalCheckList: SSIEvalCheckListItem[];
  specificEvent: string;
  organSpace: string;
  detected: string;
  status: 'ongoing' | 'to-be-reviewed' | 'reviewed';
  antibioticPrescriptions: {
      id: string
      name: string
      stage: 'prior' | 'pre_peri' | 'after'
      dose: number
      route: string
      duration: string
  }[]
}


interface SSIEvalProps {
  formData: FormData
  handleYesNoChange: (index: number, value: boolean) => void
  handleRemarkChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void
  isEditing?: boolean
}


interface PatientDataProps {
  formData: FormData
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  isEditing?: boolean
}

interface MicrobiologyDataProps {
  formData: FormData
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  handleIsolateChange: (
    isolate: 'isolate1' | 'isolate2',
    category: 'sensitive' | 'resistant' | 'intermediate',
    values: string[]
  ) => void
  isEditing?: boolean
}
