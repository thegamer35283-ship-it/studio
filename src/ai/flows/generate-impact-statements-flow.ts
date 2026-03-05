'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating compelling impact statements
 * for charitable donation campaigns, designed to help content administrators quickly create
 * conversion-driving messages for various donation tiers.
 *
 * - generateImpactStatements - A function that generates impact statements.
 * - GenerateImpactStatementsInput - The input type for the generateImpactStatements function.
 * - GenerateImpactStatementsOutput - The return type for the generateImpactStatements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImpactStatementsInputSchema = z.object({
  campaignName: z
    .string()
    .describe(
      'The name of the charitable campaign (e.g., "Child Education", "Clean Water Initiative").'
    ),
  donationTier: z
    .string()
    .describe(
      'The specific donation amount or tier (e.g., "$10", "Monthly Supporter", "Annual Partner").'
    ),
  impactGoalDescription: z
    .string()
    .describe(
      'A detailed description of what the specified donation tier aims to achieve (e.g., "provides school supplies for one child for a year", "funds a week of clean water for a village").'
    ),
});
export type GenerateImpactStatementsInput = z.infer<
  typeof GenerateImpactStatementsInputSchema
>;

const GenerateImpactStatementsOutputSchema = z.object({
  statements: z
    .array(z.string().describe('A compelling and concise impact statement.'))
    .describe(
      'A list of suggested impact statements for the given donation tier and campaign.'
    ),
});
export type GenerateImpactStatementsOutput = z.infer<
  typeof GenerateImpactStatementsOutputSchema
>;

export async function generateImpactStatements(
  input: GenerateImpactStatementsInput
): Promise<GenerateImpactStatementsOutput> {
  return generateImpactStatementsFlow(input);
}

const impactStatementPrompt = ai.definePrompt({
  name: 'impactStatementPrompt',
  input: {schema: GenerateImpactStatementsInputSchema},
  output: {schema: GenerateImpactStatementsOutputSchema},
  prompt: `You are an expert copywriter for a charitable organization. Your goal is to create compelling, concise, and conversion-oriented impact statements.

Generate 3-5 distinct impact statements for the following scenario, focusing on the tangible benefits to potential donors.

Campaign: {{{campaignName}}}
Donation Tier: {{{donationTier}}}
What the donation achieves: {{{impactGoalDescription}}}

Make sure each statement clearly communicates the positive outcome of the donation and encourages giving.`,
});

const generateImpactStatementsFlow = ai.defineFlow(
  {
    name: 'generateImpactStatementsFlow',
    inputSchema: GenerateImpactStatementsInputSchema,
    outputSchema: GenerateImpactStatementsOutputSchema,
  },
  async input => {
    const {output} = await impactStatementPrompt(input);
    return output!;
  }
);
