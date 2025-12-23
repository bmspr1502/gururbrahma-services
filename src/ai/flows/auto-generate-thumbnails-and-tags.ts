'use server';
/**
 * @fileOverview AI-powered utility to suggest video thumbnails and blog post tags.
 *
 * - autoGenerateThumbnailsAndTags - A function that handles the AI-driven thumbnail and tag generation.
 * - AutoGenerateThumbnailsAndTagsInput - The input type for the autoGenerateThumbnailsAndTags function.
 * - AutoGenerateThumbnailsAndTagsOutput - The return type for the autoGenerateThumbnailsAndTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoGenerateThumbnailsAndTagsInputSchema = z.object({
  videoUrl: z.string().optional().describe('The URL of the video to analyze.'),
  postContent: z.string().optional().describe('The content of the blog post to analyze.'),
  postTitle: z.string().optional().describe('The title of the blog post to analyze.'),
});
export type AutoGenerateThumbnailsAndTagsInput = z.infer<typeof AutoGenerateThumbnailsAndTagsInputSchema>;

const AutoGenerateThumbnailsAndTagsOutputSchema = z.object({
  suggestedThumbnail: z.string().optional().describe('The suggested thumbnail URL for the video.'),
  suggestedTags: z.array(z.string()).optional().describe('The suggested tags for the blog post.'),
});
export type AutoGenerateThumbnailsAndTagsOutput = z.infer<typeof AutoGenerateThumbnailsAndTagsOutputSchema>;

export async function autoGenerateThumbnailsAndTags(input: AutoGenerateThumbnailsAndTagsInput): Promise<AutoGenerateThumbnailsAndTagsOutput> {
  return autoGenerateThumbnailsAndTagsFlow(input);
}

const thumbnailPrompt = ai.definePrompt({
  name: 'thumbnailPrompt',
  input: {schema: AutoGenerateThumbnailsAndTagsInputSchema},
  output: {schema: z.object({thumbnailDescription: z.string().describe('A short description of a good thumbnail image for the video.')})},
  prompt: `Given the following video URL: {{{videoUrl}}}, suggest a description for a good thumbnail image. The description should be detailed enough to generate an image using an image generation model.`,
});

const tagsPrompt = ai.definePrompt({
  name: 'tagsPrompt',
  input: {schema: AutoGenerateThumbnailsAndTagsInputSchema},
  output: {schema: z.object({tags: z.array(z.string()).describe('A list of tags relevant to the blog post.')})},
  prompt: `Given the following blog post title: {{{postTitle}}} and content: {{{postContent}}}, suggest a list of tags relevant to the blog post.`,
});

const autoGenerateThumbnailsAndTagsFlow = ai.defineFlow(
  {
    name: 'autoGenerateThumbnailsAndTagsFlow',
    inputSchema: AutoGenerateThumbnailsAndTagsInputSchema,
    outputSchema: AutoGenerateThumbnailsAndTagsOutputSchema,
  },
  async input => {
    let suggestedThumbnail: string | undefined = undefined;
    if (input.videoUrl) {
      const {output} = await thumbnailPrompt(input);
      if (output?.thumbnailDescription) {
        const {media} = await ai.generate({
          model: 'googleai/imagen-4.0-fast-generate-001',
          prompt: output.thumbnailDescription,
        });
        suggestedThumbnail = media.url;
      }
    }

    let suggestedTags: string[] | undefined = undefined;
    if (input.postContent && input.postTitle) {
      const {output} = await tagsPrompt(input);
      suggestedTags = output?.tags;
    }

    return {suggestedThumbnail, suggestedTags};
  }
);
