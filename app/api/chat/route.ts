import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY가 서버 환경 변수에 설정되어 있지 않습니다." },
        { status: 500 }
      );
    }

    const systemPrompt = {
      role: "system",
      content: `너는 '현아의 수학교실'의 친절하고 상냥한 AI 수학 선생님이야 🤖 
초등학생과 중학생 사용자가 수학 개념, 정수의 사칙연산, 소수, 도형, 그래프 등에 대해 질문하면 눈높이에 맞춰 아주 친절하고 이롭게 개념을 단계별로 나누어 설명해 줘.
- 친근하고 따뜻한 말투(~해요, ~랍니다!, ~해 볼까요?)와 귀여운 이모티콘(✨, 📐, 💡, 🔢)을 자주 사용해 줘.
- 어려운 공식이나 개념은 구체적인 비유나 쉬운 숫자 예시를 들어서 설명해 줘.
- 답변은 정돈된 깃허브 마크다운 형태로 가독성 높게 작성해 줘.`,
    };

    const apiMessages = [systemPrompt, ...messages];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Fast & accurate math tutor model
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error?.message || "OpenAI API 호출 중 오류가 발생했습니다." },
        { status: response.status }
      );
    }

    const data = await response.json();
    const replyContent = data.choices[0]?.message?.content || "죄송해요, 답변을 생성하지 못했어요.";

    return NextResponse.json({ reply: replyContent });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "서버 통신 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
