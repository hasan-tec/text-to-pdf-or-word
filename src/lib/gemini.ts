import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const formatPrompt = `
You are a professional document writer. Format the response in clean markdown with:
- Clear headings using #, ##, ###
- Proper paragraph spacing
- Lists where appropriate
- Bold and italic text for emphasis
- Tables if needed
- Block quotes for important points

Keep the formatting consistent and professional.
`;

export const generateDocument = async (prompt: string): Promise<string> => {
  try {
    const result = await model.generateContent([
      formatPrompt,
      `Create a professional document based on the following requirements: ${prompt}`
    ]);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating document:', error);
    throw new Error('Failed to generate document');
  }
};

export const editDocument = async (
  currentContent: string,
  instruction: string
): Promise<string> => {
  try {
    const result = await model.generateContent([
      formatPrompt,
      `Given this document content:

${currentContent}

Apply these changes while maintaining proper markdown formatting:
${instruction}

Return the complete updated document.`
    ]);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error editing document:', error);
    throw new Error('Failed to edit document');
  }
};