import { nanoid } from 'nanoid';
import { Vibrant } from 'node-vibrant/node';
import { z } from 'zod';
import {
	type Palette,
	paletteToCssVars,
	paletteToScssMap,
} from '../../lib/color-scheme';
import { colorMe, generateRandomScheme } from '../../lib/colored';
import { generateColorSVG, generateSchemeSVG } from '../../lib/svg';
import { server } from '../../server';

export function registerOutputGenerationTools() {
	const exportTokensSchema = z.object({
		palette: z
			.unknown()
			.describe('Palette object returned by generate-color-scheme.'),
		format: z
			.enum(['json', 'css', 'scss'])
			.default('json')
			.optional()
			.describe('Token output format.'),
	});
	server.tool(
		'export-color-tokens',
		'Serializes a palette to JSON, CSS custom properties or SCSS map.',
		exportTokensSchema.shape,
		async ({ palette, format }: z.infer<typeof exportTokensSchema>) => {
			let output: string;
			switch (format ?? 'json') {
				case 'css':
					output = paletteToCssVars(palette as Palette);
					break;
				case 'scss':
					output = paletteToScssMap(palette as Palette);
					break;
				default:
					output = JSON.stringify(palette, null, 2);
			}
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify({ output }),
					},
				],
			} as const;
		},
	);

	const extractImageColorsSchema = z.object({
		imageBase64: z.string().base64().describe('Base64 of the source image.'),
		count: z
			.number()
			.min(1)
			.max(16)
			.default(6)
			.optional()
			.describe('Number of dominant colors to extract (default 6).'),
	});
	server.tool(
		'extract-image-colors',
		'Extracts dominant colors from an image using k‑means clustering.',
		extractImageColorsSchema.shape,
		async ({
			imageBase64,
			count,
		}: z.infer<typeof extractImageColorsSchema>) => {
			const palette = await Vibrant.from(imageBase64)
				.maxColorCount(count ?? 6)
				.getPalette();

			const colors = Object.values(palette)
				.filter(Boolean)
				.map((swatch) => {
					if (!swatch) {
						throw new Error(`Unable to parse image colors for "${swatch}"`);
					}
					return swatch.hex;
				});

			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify({ colors }, null, 2),
					},
				],
			} as const;
		},
	);

	server.tool(
		'generate-color-svg',
		'Get SVG representation of a color',
		{
			color: z
				.string()
				.describe(
					'Color string (e.g., be it hex, rgb, rgba, cmyk, hsv or hsl)',
				),
			width: z
				.number()
				.optional()
				.default(100)
				.describe('Width of the SVG colorbox'),
			height: z
				.number()
				.optional()
				.default(100)
				.describe('Height of the SVG colorbox'),
			named: z
				.boolean()
				.optional()
				.nullable()
				.describe('Whether to display the color name'),
		},
		async ({ color: colorStr, width, height, named }) => {
			const color = await colorMe({ color: colorStr });
			const svg = generateColorSVG(color, width, height, named || false);
			return {
				content: [
					{
						type: 'image',
						data: Buffer.from(svg).toString('base64'),
						mimeType: 'image/svg+xml',
					},
				],
			} as const;
		},
	);

	server.tool(
		'generate-scheme-svg',
		'Get SVG representation of a color scheme',
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
			width: z
				.number()
				.optional()
				.default(100)
				.describe('Width of the SVG schemebox'),
			height: z
				.number()
				.optional()
				.default(200)
				.describe('Height of the SVG schemebox'),
		},
		async ({ color, mode, width, height, count, seed }) => {
			const scheme = await generateRandomScheme(
				color,
				count,
				seed ?? nanoid(),
				mode,
			);
			const svg = generateSchemeSVG(scheme, width, height, false);
			return {
				content: [
					{
						type: 'image',
						data: Buffer.from(svg).toString('base64'),
						mimeType: 'image/svg+xml',
					},
				],
			} as const;
		},
	);
}
