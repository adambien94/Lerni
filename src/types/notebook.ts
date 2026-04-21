export type NotebookSourceDto = {
  id: string;
  url: string;
  checked: boolean;
  customTitle?: string;
  title?: string;
};

export type NotebookSummaryDto = {
  contentMarkdown: string;
  sourceCount: number;
};

/** Odpowiedz Edge Function `generate-notebook-summary` (HTTP 200). */
export type GenerateNotebookSummaryResponse =
  | {
      ok: true;
      contentMarkdown: string;
      sourceCount: number;
      failedUrls: string[];
    }
  | { ok: false; error: string };

export type NotebookFlashcardDto = {
  id: string;
  front: string;
  back: string;
};

export type NotebookQuizOptionDto = {
  id: string;
  key: string;
  text: string;
};

export type NotebookQuizQuestionDto = {
  id: string;
  questionText: string;
  hint: string;
  correctOptionId: string;
  options: NotebookQuizOptionDto[];
};

export type NotebookQuizDto = {
  id: string;
  title: string;
  contextLabel: string | null;
  sourceCount: number;
  totalQuestions: number;
  questions: NotebookQuizQuestionDto[];
};

export type NotebookDto = {
  id: string;
  title: string;
  status: "draft" | "ready" | "archived";
  createdAt: string;
  updatedAt: string;
  sources: NotebookSourceDto[];
  summary: NotebookSummaryDto | null;
  flashcards: NotebookFlashcardDto[];
  quizzes: NotebookQuizDto[];
};

export type NotebookListItemDto = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  sourceCount: number;
};
