import { QUESTIONS } from "@/lib/questions";
import { StoredAnswer } from "@/types";

// 결과 공유 링크(?a=...)에 답변을 직접 인코딩한다. 추천 알고리즘은 answers만
// 있으면 결과를 그대로 재현할 수 있는 순수 함수라서, DB 조회 없이 URL만으로
// 결과 페이지를 복원할 수 있다. Supabase 저장/조회에 의존하면 삽입 타이밍이나
// RLS 설정 문제로 링크가 깨질 수 있어(실제로 발생했던 버그) 공유 기능 자체는
// 클라이언트에서 완결시킨다.
export function encodeAnswers(answers: StoredAnswer[]): string {
  const optionIds = answers.map((answer) => answer.optionId);
  return btoa(JSON.stringify(optionIds));
}

export function decodeAnswers(encoded: string): StoredAnswer[] | null {
  try {
    const optionIds = JSON.parse(atob(encoded));
    if (!Array.isArray(optionIds)) return null;

    const answers: StoredAnswer[] = [];
    for (const optionId of optionIds) {
      const question = QUESTIONS.find((q) =>
        q.options.some((option) => option.id === optionId)
      );
      if (!question || typeof optionId !== "string") return null;
      answers.push({ questionId: question.id, optionId });
    }
    return answers;
  } catch {
    return null;
  }
}
