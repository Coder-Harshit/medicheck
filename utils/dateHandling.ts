export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// // utils/dateHandling.ts

// // Function to format date for database (YYYY-MM-DD)
// export const formatDateForDB = (date: string | Date): string => {
//   if (!date) return '';
//   const d = new Date(date);
//   return d.toISOString().split('T')[0];
// };

// // Function to validate date
// export const isValidDate = (dateString: string): boolean => {
//   const regex = /^\d{4}-\d{2}-\d{2}$/;
//   if (!regex.test(dateString)) return false;

//   const parts = dateString.split("-");
//   const day = parseInt(parts[2], 10);
//   const month = parseInt(parts[1], 10);
//   const year = parseInt(parts[0], 10);

//   if (year < 1000 || year > 3000 || month === 0 || month > 12) return false;

//   const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
//   if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
//     monthLength[1] = 29;
//   }

//   return day > 0 && day <= monthLength[month - 1];
// };

// // Function to sanitize form data before submission
// export const sanitizeFormData = (formData: any): any => {
//   const sanitized = { ...formData };
//   for (const key in sanitized) {
//     if (typeof sanitized[key] === 'string' && sanitized[key].includes('-')) {
//       if (isValidDate(sanitized[key])) {
//         sanitized[key] = formatDateForDB(sanitized[key]);
//       } else {
//         sanitized[key] = null;  // or '' depending on your database requirements
//       }
//     }
//   }
//   return sanitized;
// };
