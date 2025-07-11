import colorBlind from 'color-blind';
import { colord, random } from 'colord';
import { z } from 'zod';
import { deltaE76, type Hex } from '../../lib/color-scheme';
import { colorMe } from '../../lib/colored';
import { server } from '../../server';

export function registerColorAnalysisTools() {
	const isValidColorSchema = z.object({
		color: z.string().describe('The color string.'),
	});
	server.tool(
		'is-valid-color',
		'Checks if a color string is valid.',
		isValidColorSchema.shape,
		async ({ color }: z.infer<typeof isValidColorSchema>) => {
			const result = colord(color).isValid();
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify({ 'is-valid-color': result }, null, 2),
					},
				],
			} as const;
		},
	);

	const areColorsEqualSchema = z.object({
		color1: z.string().describe('The first color string.'),
		color2: z.string().describe('The second color string.'),
	});
	server.tool(
		'are-colors-equal',
		'Checks if two colors are equal.',
		areColorsEqualSchema.shape,
		async ({ color1, color2 }: z.infer<typeof areColorsEqualSchema>) => {
			const result = colord(color1).isEqual(color2);
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify({ 'are-colors-equal': result }, null, 2),
					},
				],
			} as const;
		},
	);

	const getColorAlphaSchema = z.object({
		color: z.string().describe('The color string.'),
	});
	server.tool(
		'get-color-alpha',
		'Gets the alpha (opacity) of a color.',
		getColorAlphaSchema.shape,
		async ({ color }: z.infer<typeof getColorAlphaSchema>) => {
			const result = colord(color).alpha();
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify({ 'get-color-alpha': result }, null, 2),
					},
				],
			} as const;
		},
	);

	const getColorHueSchema = z.object({
		color: z.string().describe('The color string.'),
	});
	server.tool(
		'get-color-hue',
		'Gets the hue of a color.',
		getColorHueSchema.shape,
		async ({ color }: z.infer<typeof getColorHueSchema>) => {
			const result = colord(color).hue();
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify({ 'get-color-hue': result }, null, 2),
					},
				],
			} as const;
		},
	);

	const getColorBrightnessSchema = z.object({
		color: z.string().describe('The color string.'),
	});
	server.tool(
		'get-color-brightness',
		'Gets the brightness of a color.',
		getColorBrightnessSchema.shape,
		async ({ color }: z.infer<typeof getColorBrightnessSchema>) => {
			const result = colord(color).brightness();
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify({ 'get-color-brightness': result }, null, 2),
					},
				],
			} as const;
		},
	);

	const isColorLightSchema = z.object({
		color: z.string().describe('The color string.'),
	});
	server.tool(
		'is-color-light',
		'Checks if a color is light.',
		isColorLightSchema.shape,
		async ({ color }: z.infer<typeof isColorLightSchema>) => {
			const result = colord(color).isLight();
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify({ 'is-color-light': result }, null, 2),
					},
				],
			} as const;
		},
	);

	const isColorDarkSchema = z.object({
		color: z.string().describe('The color string.'),
	});
	server.tool(
		'is-color-dark',
		'Checks if a color is dark.',
		isColorDarkSchema.shape,
		async ({ color }: z.infer<typeof isColorDarkSchema>) => {
			const result = colord(color).isDark();
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify({ 'is-color-dark': result }, null, 2),
					},
				],
			} as const;
		},
	);

	const getColorLuminanceSchema = z.object({
		color: z.string().describe('The color string.'),
	});
	server.tool(
		'get-color-luminance',
		'Gets the luminance of a color.',
		getColorLuminanceSchema.shape,
		async ({ color }: z.infer<typeof getColorLuminanceSchema>) => {
			const result = colord(color).luminance();
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify({ 'get-color-luminance': result }, null, 2),
					},
				],
			} as const;
		},
	);

	const getColorContrastSchema = z.object({
		color1: z.string().describe('The first color string.'),
		color2: z.string().describe('The second color string.'),
	});
	server.tool(
		'get-color-contrast',
		'Gets the contrast ratio between two colors.',
		getColorContrastSchema.shape,
		async ({ color1, color2 }: z.infer<typeof getColorContrastSchema>) => {
			const result = colord(color1).contrast(color2);
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify({ 'get-color-contrast': result }, null, 2),
					},
				],
			} as const;
		},
	);

	const isColorReadableSchema = z.object({
		color1: z.string().describe('The first color string.'),
		color2: z.string().describe('The second color string.'),
		options: z
			.object({
				level: z
					.enum(['AA', 'AAA'])
					.optional()
					.describe('WCAG level (AA or AAA).'),
				size: z
					.enum(['large', 'normal'])
					.optional()
					.describe('Text size (large or normal).'),
			})
			.optional()
			.describe('Readability options.'),
	});
	server.tool(
		'is-color-readable',
		'Checks if two colors are readable according to WCAG.',
		isColorReadableSchema.shape,
		async ({
			color1,
			color2,
			options,
		}: z.infer<typeof isColorReadableSchema>) => {
			const result = colord(color1).isReadable(color2, options);
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify({ 'is-color-readable': result }, null, 2),
					},
				],
			} as const;
		},
	);

	const getColorDeltaESchema = z.object({
		color1: z.string().describe('The first color string.'),
		color2: z.string().describe('The second color string.'),
	});
	server.tool(
		'get-color-delta-e',
		'Gets the Delta E (CIE2000) difference between two colors.',
		getColorDeltaESchema.shape,
		async ({ color1, color2 }: z.infer<typeof getColorDeltaESchema>) => {
			const result = colord(color1).delta(color2);
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify({ 'get-color-delta-e': result }, null, 2),
					},
				],
			} as const;
		},
	);

	const getRandomColorSchema = z.object({});
	server.tool(
		'get-random-color',
		'Generates a random color.',
		getRandomColorSchema.shape,
		async () => {
			const color = random().toHex();
			return {
				content: [{ type: 'text', text: JSON.stringify({ color }, null, 2) }],
			} as const;
		},
	);

	const minifyColorSchema = z.object({
		color: z.string().describe('The color string.'),
		options: z
			.object({
				hex: z.boolean().optional().describe('Minify to hex format.'),
				rgb: z.boolean().optional().describe('Minify to rgb format.'),
				hsl: z.boolean().optional().describe('Minify to hsl format.'),
				hwb: z.boolean().optional().describe('Minify to hwb format.'),
				name: z.boolean().optional().describe('Minify to named color.'),
			})
			.optional()
			.describe('Minification options.'),
	});
	server.tool(
		'minify-color',
		'Minifies a color string to its shortest possible representation.',
		minifyColorSchema.shape,
		async ({ color, options }: z.infer<typeof minifyColorSchema>) => {
			const result = colord(color).minify(options);
			return {
				content: [
					{ type: 'text', text: JSON.stringify({ color: result }, null, 2) },
				],
			} as const;
		},
	);

	server.tool(
		'get-color-info',
		'Get complete color information in JSON format',
		{
			color: z
				.string()
				.describe(
					'Color string (e.g., be it hex, rgb, rgba, cmyk, hsv or hsl)',
				),
		},
		async ({ color: colorStr }) => {
			const color = await colorMe({ color: colorStr });
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(color, null, 2),
					},
				],
			} as const;
		},
	);

	const colorBlindSafeSchema = z.object({
		palette: z
			.array(z.string())
			.min(2)
			.describe('Array of hex colors to verify / adjust.'),
		type: z
			.enum(['protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'])
			.default('deuteranopia')
			.optional(),
		minDelta: z
			.number()
			.default(10)
			.optional()
			.describe(
				'Minimum ΔE (CIE76) difference that colors must have once simulated.',
			),
	});
	server.tool(
		'ensure-color-blind-safe',
		'Checks a palette under color‑blind simulation and nudges hues until they are distinguishable.',
		colorBlindSafeSchema.shape,
		async ({
			palette,
			type,
			minDelta,
		}: z.infer<typeof colorBlindSafeSchema>) => {
			const adjusted = [...palette] as Hex[];
			const simulate = (h: Hex) =>
				(colorBlind[type ?? 'deuteranopia'] ?? colorBlind.deuteranopia)(h);

			for (let i = 0; i < adjusted.length; i++) {
				for (let attempt = 0; attempt < 15; attempt++) {
					const sim = adjusted.map(simulate);
					const clashes = sim.flatMap((c, idx) =>
						sim.slice(idx + 1).map((d) => ({
							ok: deltaE76(c as Hex, d as Hex) >= (minDelta ?? 10),
						})),
					);
					if (clashes.every((x) => x.ok)) break;
					adjusted[i] = colord(adjusted[i])
						.rotate(attempt % 2 === 0 ? attempt : -attempt)
						.toHex() as Hex;
				}
			}

			const safe = adjusted.every((a, idx) =>
				adjusted
					.slice(idx + 1)
					.every(
						(b) =>
							deltaE76(simulate(a) as Hex, simulate(b) as Hex) >=
							(minDelta ?? 10),
					),
			);

			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(
							{
								safe,
								palette: adjusted,
							},
							null,
							2,
						),
					},
				],
			} as const;
		},
	);
}
