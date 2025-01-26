import { SSIFormData } from '@/app/interfaces';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

export const exportToCSV = (formData: SSIFormData[], fileName: string) => {
    const formattedData = formData.map((item) => ({
        ...item,
        antibioticPrescriptions: JSON.stringify(item.antibioticPrescriptions),
        isolate1: JSON.stringify(item.isolate1),
        isolate2: JSON.stringify(item.isolate2),
        symptomsDict: JSON.stringify(item.symptomsDict),
        SSIEvalCheckList: JSON.stringify(item.SSIEvalCheckList),
    }));

    const csv = Papa.unparse(formattedData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, fileName);
};