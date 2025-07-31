'use server';
/**
 * @fileOverview A tool for generating images using an AI model.
 * 
 * - generateImageTool - A Genkit tool definition for image generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const generateImageTool = ai.defineTool(
    {
      name: 'generateImageTool',
      description: 'Generates an image from a text prompt. Use this to create visuals, memes, or other creative images.',
      inputSchema: z.object({
        prompt: z.string().describe('A detailed text description of the image to generate.'),
      }),
      outputSchema: z.object({
        imageUrl: z.string().describe("The generated image as a data URI. Format: 'data:image/png;base64,<encoded_data>'."),
      }),
    },
    async (input) => {
      console.log(`Generating image with prompt: ${input.prompt}`);
      try {
        const { media } = await ai.generate({
          model: 'googleai/gemini-2.0-flash-preview-image-generation',
          prompt: input.prompt,
          config: {
            responseModalities: ['TEXT', 'IMAGE'],
          },
        });
        
        if (!media?.url) {
            throw new Error('Image generation failed to return a valid URL.');
        }

        return { imageUrl: media.url };

      } catch (error) {
        console.error('Error during image generation:', error);
        // Silently fail for now, or return a specific error message.
        // In a real app, you might want to return a placeholder or error image URL.
        return { imageUrl: '' };
      }
    }
  );
