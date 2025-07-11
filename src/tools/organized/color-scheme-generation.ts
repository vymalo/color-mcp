import { colord } from 'colord';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { generatePalette } from '../../lib/color-scheme';
import { generateRandomScheme } from '../../lib/colored';
import { server } from '../../server';

export function registerColorSchemeGenerationTools() {
	const generateColorSchemeSchema = z.object({
		seed: z.string().describe("Seed color (e.g. '#0057B8')."),
		mode: z
			.enum(['analogous', 'complementary', 'triadic', 'tetradic'])
			.optional()
			.describe('Color‑harmony template to use.'),
	});
	server.tool(
		'generate-color-scheme',
		'Generates a WCAG‑checked palette from a single seed color.',
		generateColorSchemeSchema.shape,
		async ({ seed, mode }: z.infer<typeof generateColorSchemeSchema>) => {
			const palette = generatePalette(seed, mode ?? 'analogous');
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(palette, null, 2),
					},
				],
			} as const;
		},
	);

	const generateColorHarmoniesSchema = z.object({
		color: z.string().describe('The color string.'),
		type: z
			.enum([
				'analogous',
				'complementary',
				'double-split-complementary',
				'rectangle',
				'split-complementary',
				'tetradic',
				'triadic',
			])
			.describe('The type of harmony to generate.'),
	});
	server.tool(
		'generate-color-harmonies',
		'Generates color harmonies based on a given type.',
		generateColorHarmoniesSchema.shape,
		async ({ color, type }: z.infer<typeof generateColorHarmoniesSchema>) => {
			const result = colord(color)
				.harmonies(type)
				.map((c) => c.toHex());
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify({ harmonies: result }, null, 2),
					},
				],
			} as const;
		},
	);

	const generateTintsSchema = z.object({
		color: z.string().describe('The color string.'),
		count: z.number().min(1).describe('The number of tints to generate.'),
	});
	server.tool(
		'generate-tints',
		'Generates tints of a color.',
		generateTintsSchema.shape,
		async ({ color, count }: z.infer<typeof generateTintsSchema>) => {
			const result = colord(color)
				.tints(count)
				.map((c) => c.toHex());
			return {
				content: [
					{ type: 'text', text: JSON.stringify({ tints: result }, null, 2) },
				],
			} as const;
		},
	);

	const generateShadesSchema = z.object({
		color: z.string().describe('The color string.'),
		count: z.number().min(1).describe('The number of shades to generate.'),
	});
	server.tool(
		'generate-shades',
		'Generates shades of a color.',
		generateShadesSchema.shape,
		async ({ color, count }: z.infer<typeof generateShadesSchema>) => {
			const result = colord(color)
				.shades(count)
				.map((c) => c.toHex());
			return {
				content: [
					{ type: 'text', text: JSON.stringify({ shades: result }, null, 2) },
				],
			} as const;
		},
	);

	const generateTonesSchema = z.object({
		color: z.string().describe('The color string.'),
		count: z.number().min(1).describe('The number of tones to generate.'),
	});
	server.tool(
		'generate-tones',
		'Generates tones of a color.',
		generateTonesSchema.shape,
		async ({ color, count }: z.infer<typeof generateTonesSchema>) => {
			const result = colord(color)
				.tones(count)
				.map((c) => c.toHex());
			return {
				content: [
					{ type: 'text', text: JSON.stringify({ tones: result }, null, 2) },
				],
			} as const;
		},
	);

	server.tool(
		'get-color-scheme-info',
		'Get color scheme information in JSON format',
		{
			color: z
				.string()
				.describe(
					'Color string (e.g., be it hex, rgb, rgba, cmyk, hsv or hsl)',
				),
			mode: z
				.enum([
					'analogous',
					'complementary',
					'double-split-complementary',
					'rectangle',
					'split-complementary',
					'tetradic',
					'triadic',
				])
				.optional()
				.nullable()
				.describe('Color scheme mode'),
			count: z
				.number()
				.optional()
				.default(6)
				.describe('Number of colors in the scheme'),
			seed: z
				.string()
				.optional()
				.nullable()
				.describe(
					'A seed for the scheme generation. The same seed and color would produce the same colorscheme',
				),
		},
		async ({ color, mode, count, seed }) => {
			const scheme = await generateRandomScheme(
				color,
				count,
				seed ?? nanoid(),
				mode,
			);
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify({ scheme }, null, 2),
					},
				],
			} as const;
		},
	);
}
