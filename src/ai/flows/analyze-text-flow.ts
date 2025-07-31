'use server';
/**
 * @fileOverview A Japanese text analysis AI agent.
 *
 * - analyzeJapaneseText - A function that handles the Japanese text analysis process.
 * - JapaneseAnalysisInput - The input type for the analyzeJapaneseText function.
 * - JapaneseAnalysisOutput - The return type for the analyzeJapaneseText function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const WordAnalysisSchema = z.object({
  word: z.string().describe('The Japanese word, kanji, or particle.'),
  furigana: z.string().describe('The furigana (reading in hiragana) for the word.'),
  translation: z.string().describe('The Russian translation of the word or particle.'),
  partOfSpeech: z.string().describe('The part of speech (e.g., noun, verb, particle).'),
});

const JapaneseAnalysisInputSchema = z.object({
  text: z.string().describe('The Japanese text to analyze.'),
});

const JapaneseAnalysisOutputSchema = z.object({
  sentence: z.array(WordAnalysisSchema).describe('An array of analyzed words from the sentence.'),
  fullTranslation: z.string().describe('The full translation of the sentence in Russian.'),
});

export type JapaneseAnalysisInput = z.infer<typeof JapaneseAnalysisInputSchema>;
export type JapaneseAnalysisOutput = z.infer<typeof JapaneseAnalysisOutputSchema>;

export async function analyzeJapaneseText(input: JapaneseAnalysisInput): Promise<JapaneseAnalysisOutput> {
  return analyzeTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeJapaneseTextPrompt',
  input: { schema: JapaneseAnalysisInputSchema },
  output: { schema: JapaneseAnalysisOutputSchema },
  prompt: `You are an expert in Japanese linguistics. Analyze the provided Japanese text.
Break down the sentence into individual words, including particles.
For each word or particle, provide its plain form, the furigana reading, its part of speech, and a concise Russian translation.
Also, provide a full, natural-sounding Russian translation of the entire sentence.

Example:
Input: 猫が魚を食べます。
Output:
{
  "sentence": [
    {
      "word": "猫",
      "furigana": "ねこ",
      "translation": "кошка",
      "partOfSpeech": "существительное"
    },
    {
      "word": "が",
      "furigana": "が",
      "translation": "частица (им. падеж)",
      "partOfSpeech": "частица"
    },
    {
      "word": "魚",
      "furigana": "さかな",
      "translation": "рыба",
      "partOfSpeech": "существительное"
    },
    {
      "word": "を",
      "furigana": "を",
      "translation": "частица (вин. падеж)",
      "partOfSpeech": "частица"
    },
    {
      "word": "食べます",
      "furigana": "たべます",
      "translation": "ест",
      "partOfSpeech": "глагол"
    }
  ],
  "fullTranslation": "Кошка ест рыбу."
}


Analyze the following text:
{{{text}}}`,
});

const analyzeTextFlow = ai.defineFlow(
  {
    name: 'analyzeTextFlow',
    inputSchema: JapaneseAnalysisInputSchema,
    outputSchema: JapaneseAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
        throw new Error('AI failed to analyze the text.');
    }
    return output;
  }
);
