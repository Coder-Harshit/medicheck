export const predictSSI = async (formData: FormData) => {
    try {
      const response = await fetch('http://localhost:5050/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error making prediction:', error);
      throw error;
    }
  };