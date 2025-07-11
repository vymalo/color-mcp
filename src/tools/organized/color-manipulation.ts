import { colord } from 'colord';
import { z } from 'zod';
import { server } from '../../server';

export function registerColorManipulationTools() {
	const setColorAlphaSchema = z.object({
		color: z
			.string()
			.describe(
				'The color string (e.g., "#RRGGBB", "rgb(R,G,B)", "hsl(H,S,L)").',
			),
		value: z.number().min(0).max(1).describe('The alpha value (0-1).'),
	});
	server.tool(
		'set-color-alpha',
		'Sets the alpha (opacity) of a color.',
		setColorAlphaSchema.shape,
		async ({ color, value }: z.infer<typeof setColorAlphaSchema>) => {
			const result = colord(color).alpha(value).toHex();
			return {
				content: [
					{ type: 'text', text: JSON.stringify({ color: result }, null, 2) },
				],
			} as const;
		},
	);

	const invertColorSchema = z.object({
		color: z.string().describe('The color string.'),
	});
	server.tool(
		'invert-color',
		'Inverts the color.',
		invertColorSchema.shape,
		async ({ color }: z.infer<typeof invertColorSchema>) => {
			const result = colord(color).invert().toHex();
			return {
				content: [
					{ type: 'text', text: JSON.stringify({ color: result }, null, 2) },
				],
			} as const;
		},
	);

	const saturateColorSchema = z.object({
		color: z.string().describe('The color string.'),
		amount: z.number().min(0).max(1).describe('The amount to saturate (0-1).'),
	});
	server.tool(
		'saturate-color',
		'Saturates the color by a given amount.',
		saturateColorSchema.shape,
		async ({ color, amount }: z.infer<typeof saturateColorSchema>) => {
			const result = colord(color).saturate(amount).toHex();
			return {
				content: [
					{ type: 'text', text: JSON.stringify({ color: result }, null, 2) },
				],
			} as const;
		},
	);

	const desaturateColorSchema = z.object({
		color: z.string().describe('The color string.'),
		amount: z
			.number()
			.min(0)
			.max(1)
			.describe('The amount to desaturate (0-1).'),
	});
	server.tool(
		'desaturate-color',
		'Desaturates the color by a given amount.',
		desaturateColorSchema.shape,
		async ({ color, amount }: z.infer<typeof desaturateColorSchema>) => {
			const result = colord(color).desaturate(amount).toHex();
			return {
				content: [
					{ type: 'text', text: JSON.stringify({ color: result }, null, 2) },
				],
			} as const;
		},
	);

	const grayscaleColorSchema = z.object({
		color: z.string().describe('The color string.'),
	});
	server.tool(
		'grayscale-color',
		'Converts the color to grayscale.',
		grayscaleColorSchema.shape,
		async ({ color }: z.infer<typeof grayscaleColorSchema>) => {
			const result = colord(color).grayscale().toHex();
			return {
				content: [
					{ type: 'text', text: JSON.stringify({ color: result }, null, 2) },
				],
			} as const;
		},
	);

	const lightenColorSchema = z.object({
		color: z.string().describe('The color string.'),
		amount: z.number().min(0).max(1).describe('The amount to lighten (0-1).'),
	});
	server.tool(
		'lighten-color',
		'Lightens the color by a given amount.',
		lightenColorSchema.shape,
		async ({ color, amount }: z.infer<typeof lightenColorSchema>) => {
			const result = colord(color).lighten(amount).toHex();
			return {
				content: [
					{ type: 'text', text: JSON.stringify({ color: result }, null, 2) },
				],
			} as const;
		},
	);

	const darkenColorSchema = z.object({
		color: z.string().describe('The color string.'),
		amount: z.number().min(0).max(1).describe('The amount to darken (0-1).'),
	});
	server.tool(
		'darken-color',
		'Darkens the color by a given amount.',
		darkenColorSchema.shape,
		async ({ color, amount }: z.infer<typeof darkenColorSchema>) => {
			const result = colord(color).darken(amount).toHex();
			return {
				content: [
					{ type: 'text', text: JSON.stringify({ color: result }, null, 2) },
				],
			} as const;
		},
	);

	const setColorHueSchema = z.object({
		color: z.string().describe('The color string.'),
		value: z.number().min(0).max(360).describe('The hue value (0-360).'),
	});
	server.tool(
		'set-color-hue',
		'Sets the hue of a color.',
		setColorHueSchema.shape,
		async ({ color, value }: z.infer<typeof setColorHueSchema>) => {
			const result = colord(color).rotate(value).toHslString();
			return {
				content: [
					{ type: 'text', text: JSON.stringify({ color: result }, null, 2) },
				],
			} as const;
		},
	);

	const rotateColorHueSchema = z.object({
		color: z.string().describe('The color string.'),
		amount: z.number().describe('The amount to rotate the hue by.'),
	});
	server.tool(
		'rotate-color-hue',
		'Rotates the hue of a color by a given amount.',
		rotateColorHueSchema.shape,
		async ({ color, amount }: z.infer<typeof rotateColorHueSchema>) => {
			const result = colord(color).rotate(amount).toHslString();
			return {
				content: [
					{ type: 'text', text: JSON.stringify({ color: result }, null, 2) },
				],
			} as const;
		},
	);

	const mixColorsSchema = z.object({
		color1: z.string().describe('The first color string.'),
		color2: z.string().describe('The second color string.'),
		ratio: z.number().min(0).max(1).describe('The mixing ratio (0-1).'),
	});
	server.tool(
		'mix-colors',
		'Mixes two colors together.',
		mixColorsSchema.shape,
		async ({ color1, color2, ratio }: z.infer<typeof mixColorsSchema>) => {
			const result = colord(color1).mix(color2, ratio).toHex();
			return {
				content: [
					{ type: 'text', text: JSON.stringify({ color: result }, null, 2) },
				],
			} as const;
		},
	);
}
