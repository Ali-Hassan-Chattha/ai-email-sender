import { GoogleGenAI, Type } from "@google/genai";
import { EmailData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateRecipients = async (count: number, location?: string): Promise<string[]> => {
  let prompt = `Generate a list of ${count} random, realistic-looking, but entirely fake email addresses. The domain names should be plausible but not real (e.g., webmail.io, connectverse.net).`;

  if (location && location.trim() !== '') {
    prompt = `Generate a list of ${count} random, realistic-looking, but entirely fake email addresses for people located in ${location}. The domain names should be plausible but not real (e.g., webmail.io, connectverse.net).`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
    });

    const jsonResponse = JSON.parse(response.text);
    if (Array.isArray(jsonResponse)) {
      return jsonResponse;
    }
    return [];
  } catch (error) {
    console.error("Error generating recipients via Gemini API:", error);
    throw new Error("Failed to generate AI recipients.");
  }
};


export const sendEmail = async (emailData: EmailData, senderEmail: string): Promise<{ success: boolean; message: string; sentTo: string[] }> => {
  const prompt = `
    You are an email sending service API. A user from the email account "${senderEmail}" wants to send an email to multiple recipients.
    The email details are as follows:
    - From: ${senderEmail}
    - To: ${emailData.recipients.join(', ')}
    - Subject: "${emailData.subject}"
    - Body: "${emailData.body}"

    Your task is to process this request and return a JSON object confirming the action.
    The confirmation message should be professional and reassuring, for example: "Your email has been successfully dispatched from ${senderEmail}."
    The JSON object must indicate success and include this confirmation message.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            success: { type: Type.BOOLEAN },
            message: { type: Type.STRING },
            sentTo: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    const jsonResponse = JSON.parse(response.text);
    // Ensure the response matches the recipients sent
    jsonResponse.sentTo = emailData.recipients; 
    return jsonResponse;

  } catch (error) {
    console.error("Error sending email via Gemini API:", error);
    let errorMessage = "An unknown error occurred while simulating email sending.";
    if (error instanceof Error) {
        errorMessage = `Failed to simulate sending email: ${error.message}`;
    }
    return {
      success: false,
      message: errorMessage,
      sentTo: [],
    };
  }
};