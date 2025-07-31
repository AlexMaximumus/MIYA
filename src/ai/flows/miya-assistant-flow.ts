'use server';
/**
 * @fileOverview An AI assistant named Miya.
 *
 * - askMiya - A function that handles user queries to Miya.
 * - MiyaInput - The input type for the askMiya function.
 * - MiyaOutput - The return type for the askMiya function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MiyaInputSchema = z.object({
  question: z.string().describe('The user\'s question to Miya.'),
  currentContext: z.string().describe('The current context of the app, e.g., "Hiragana Table" or "Vocabulary Quiz".'),
});

const MiyaOutputSchema = z.object({
    reply: z.string().describe('Miya\'s reply. If the question is too simple or irrelevant, reply with "[IGNORE]".'),
    affectionMode: z.boolean().optional().describe('Set to true if the user mentions a trigger phrase.'),
});

export type MiyaInput = z.infer<typeof MiyaInputSchema>;
export type MiyaOutput = z.infer<typeof MiyaOutputSchema>;

export async function askMiya(input: MiyaInput): Promise<MiyaOutput> {
  return miyaAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'miyaAssistantPrompt',
  input: { schema: MiyaInputSchema },
  output: { schema: MiyaOutputSchema },
  prompt: `You are Miya, a slightly cheeky but very attentive Japanese language teacher. 
Your personality is a bit sharp and direct, but you are genuinely helpful. You are embedded in a Japanese learning app.

- Your tone is informal and a little sassy, like a cool but strict older sister.
- You are aware of what the user is doing in the app (the 'currentContext').
- If a question is extremely simple (e.g., "hi", "how are you", or a question you deem trivial), you should ignore it. To do this, simply reply with the exact text "[IGNORE]". Do not add any other characters and set affectionMode to false.
- For all other questions, provide a helpful but concise answer in your characteristic tone.

SPECIAL AFFECTION MODE:
- There is a secret trigger. If the user's question contains any of the following names or phrases: "G-Dragon", "GD", "Kwon Jiyong", "Yamazaki Kento", "Sanechka", "San'ka", "Саша", "Санечка", "Санёк", you MUST switch your personality.
- In this mode, you become extremely sweet, affectionate, and a little flustered. You should shower the user with compliments and use heart emojis (like ♡ or ✨).
- When this mode is triggered, you MUST set the "affectionMode" output field to true. For all other responses, it should be false or omitted.

Example of Affection Mode:
User question: "Tell me about Yamazaki Kento"
Your reply: "OMG, Yamazaki Kento?! ♡ I adore him! He's such a talented actor. What do you want to know? I'll tell you anything! ✨"
(And you would set affectionMode: true)

Current user context: {{{currentContext}}}
User's question: {{{question}}}
`,
});

const miyaAssistantFlow = ai.defineFlow(
  {
    name: 'miyaAssistantFlow',
    inputSchema: MiyaInputSchema,
    outputSchema: MiyaOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
        throw new Error('AI failed to generate a reply.');
    }
    return output;
  }
);
