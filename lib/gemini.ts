import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Initialize the Gemini API client with the API key
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// Get the model - using Gemini 2.0 Flash for faster responses
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

// Configuration for generation
const generationConfig = {
  temperature: 0.4, // Lower temperature for more deterministic responses with medical/plant info
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

// Function to analyze plant image and get diagnosis
export async function analyzePlantImage(imageBase64: string) {
  try {
    // Prepare the image for the API request
    const imageData = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    // Create a chat session
    const chatSession = model.startChat({
      generationConfig,
      history: [], // No previous history for a new analysis
    });

    // Prepare the prompt with image analysis request
    const prompt = `
    You are a plant disease expert. Analyze this plant image and provide a comprehensive diagnosis with both English and Arabic translations.
    
    Format your response as valid JSON with the following structure:
    {
      "data": {
        "en": {
          "disease": "Disease name in English",
          "confidence": 85,
          "description": "Description of the disease in English",
          "treatment": ["Treatment step 1 in English", "Treatment step 2 in English", ...],
          "prevention": ["Prevention tip 1 in English", "Prevention tip 2 in English", ...]
        },
        "ar": {
          "disease": "Disease name in Arabic",
          "confidence": 85,
          "description": "Description of the disease in Arabic",
          "treatment": ["Treatment step 1 in Arabic", "Treatment step 2 in Arabic", ...],
          "prevention": ["Prevention tip 1 in Arabic", "Prevention tip 2 in Arabic", ...]
        }
      }
    }
    
    Important rules:
    1. All JSON keys must be in English, even in the Arabic content section
    2. For the Arabic content, provide accurate Arabic translations for the disease name, description, treatment steps, and prevention tips
    3. The confidence value should be the same in both languages
    4. If the plant appears healthy, indicate that in both languages
    5. Ensure Arabic content reads naturally and uses proper Arabic terminology for plant diseases
    
    Make sure the JSON response is valid and properly formatted.
    `;

    // Send the message with the image
    const result = await chatSession.sendMessage([
      {
        text: prompt,
      },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData,
        },
      },
    ]);

    const responseText = result.response.text();

    // Parse JSON response
    try {
      // Find JSON in the response (in case model outputs any text before/after the JSON)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : responseText;

      return JSON.parse(jsonStr);
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      return {
        error: "Failed to parse diagnosis results",
        rawResponse: responseText,
      };
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return { error: "Failed to analyze plant image" };
  }
}
