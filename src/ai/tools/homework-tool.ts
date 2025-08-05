'use server';
/**
 * @fileOverview A tool for Miya to generate homework assignments.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const HomeworkInputSchema = z.object({
  topic: z.string().describe('The topic for the homework. For example: "N5 vocabulary", "particle に", "past tense of verbs".'),
});

const HomeworkOutputSchema = z.string().describe(`The generated homework assignment, formatted in Markdown. It should include a title, a brief description, and 3-5 exercises of different types (e.g., multiple choice, fill in the blank, sentence construction). The entire response should be in Russian.`);

const homeworkPrompt = ai.definePrompt({
    name: 'homeworkGenerator',
    input: { schema: HomeworkInputSchema },
    output: { schema: HomeworkOutputSchema },
    prompt: `You are a Japanese language teacher creating a homework assignment.
The user wants homework on the following topic: {{{topic}}}.

Based on this topic, generate a short but effective homework assignment. The assignment must be in Russian.
Include the following:
1.  A clear title for the homework (e.g., "Домашка: Частица に").
2.  A mix of 3-5 exercises. Try to use different formats:
    - Multiple choice (Выбери правильный вариант).
    - Fill in the blank (Вставь пропущенное слово).
    - Sentence construction (Составь предложение из слов).
    - Translation (Переведи на русский/японский).
3.  Format the entire output using Markdown for clear presentation. Use headings, bold text, and lists.
`,
});


export const generateHomeworkTool = ai.defineTool(
  {
    name: 'generateHomeworkTool',
    description: 'Generates a short homework assignment for a user on a given Japanese language topic. Use this when the user asks for homework, exercises, or a test.',
    inputSchema: HomeworkInputSchema,
    outputSchema: HomeworkOutputSchema,
  },
  async (input) => {
    const { output } = await homeworkPrompt(input);
    return output || 'Не получилось придумать домашку, пон. Попробуй еще раз.';
  }
);
