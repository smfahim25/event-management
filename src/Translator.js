import axios from 'axios';

const API_URL = 'https://libretranslate.com/translate';

export const translateText = async (text, targetLanguage) => {
  try {
    const response = await axios.post(API_URL, {
      q: text,
      source: 'en', // Source language (e.g., English)
      target: targetLanguage, // Target language (e.g., French: 'fr')
      format: 'text',
    });
    return response.data.translatedText;
  } catch (error) {
    console.error('Error translating text:', error);
    return text; // Fallback to original text in case of error
  }
};
