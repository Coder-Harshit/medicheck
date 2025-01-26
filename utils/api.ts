// utils/api.ts
import { toast } from '@/hooks/use-toast';

export const handleApiError = (error: never) => {
  console.error('API Error:', error);
  toast({
    title: 'Error',
    description: 'An error occurred. Please try again.',
    variant: 'destructive',
  });
};