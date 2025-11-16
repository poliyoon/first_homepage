import { GoogleGenAI } from "@google/genai";

// API 키는 실행 환경에서 자동으로 제공됩니다.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDescription = async (productName: string, keywords: string): Promise<string> => {
  try {
    const systemInstruction = "당신은 친환경 및 지속 가능한 제품을 전문으로 하는 이커머스 카피라이터 전문가입니다. 당신의 톤은 따뜻하고 유익하며 설득력이 있습니다. 제품의 이점, 소재, 지속 가능한 측면에 중점을 둡니다.";
    
    const userPrompt = `'${productName}'이라는 이름의 제품에 대한 매력적인 제품 설명을 한국어로 생성해주세요. 설명은 400자에서 600자 사이여야 합니다. 다음 키워드와 컨셉을 강조해주세요: ${keywords}. 의식 있는 소비자를 위한 친환경 기능과 이점에 초점을 맞추세요. 출력은 마크다운 제목이나 글머리 기호와 같은 특별한 서식 없이 단일 텍스트 단락이어야 합니다.`;

    // `systemInstruction` 파라미터가 문제를 일으킬 경우를 대비하여, 지침과 프롬프트를 하나로 결합합니다.
    const combinedPrompt = `${systemInstruction}\n\n---\n\n${userPrompt}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: combinedPrompt,
        config: {
            temperature: 0.7,
            topP: 1,
            topK: 32,
        },
    });

    return response.text.trim();

  } catch (error) {
    console.error("Error generating description with Gemini API:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
};
