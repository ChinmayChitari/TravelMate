import api from './api';

export const sendMessage = async (message, history = [], language = 'English') => {
  try {
    const response = await api.post('/chat', { message, history, language });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Connection failed. Please try again.');
  }
};

export const identifyLandmark = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post('/identify-landmark', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Connection failed. Please try again.');
  }
};

export const planTrip = async (tripDetails) => {
  try {
    const response = await api.post('/plan-trip', tripDetails);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Connection failed. Please try again.');
  }
};

export const getRecommendations = async () => {
  try {
    const response = await api.get('/places/recommendations');
    return response.data;
  } catch (error) {
    throw new Error('Connection failed. Please try again.');
  }
};
