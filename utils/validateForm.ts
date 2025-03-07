// utils/validateForm.ts
import { SSIFormData } from '@/app/interfaces';

export const validateForm = (formData: SSIFormData): string | null => {
  for (const key in formData) {
    const value = formData[key as keyof SSIFormData];
    if (key === 'organSpace' && formData.specificEvent !== 'organSpace') continue;
    if ((key === 'antibioticGiven' || key === 'papDuration') && !formData.papGiven) continue;
    if (value === null || value === undefined || value === '') {
      return `Please fill out the ${key} field.`;
    }
  }
  return null;
};