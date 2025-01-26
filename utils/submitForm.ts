// utils/submitForm.ts
import { supabase } from '@/utils/supabase/client';
import { SSIFormData } from '@/app/ssiForm/ssiFormContent';
import { handleApiError } from './api';

export const submitForm = async (formData: SSIFormData, userID: string, isDraft: boolean) => {
  try {
    const status = isDraft ? 'ongoing' : 'to-be-reviewed';
    const { error } = await supabase
      .from('SSI_Form')
      .upsert({
        ...formData,
        nuid: userID,
        status: status,
      });

    if (error) throw error;

    return { success: true, message: isDraft ? 'Draft Saved' : 'Form Submitted' };
  } catch (error) {
    handleApiError(error);
    return { success: false, message: 'Failed to save the form. Please try again.' };
  }
};