import {server} from '../server';
import {z} from 'zod';
import {colord, random} from 'colord';

export function registerColorTools() {
    // Color Manipulation
    const setColorAlphaSchema = z.object({
        color: z.string().describe('The color string (e.g., "#RRGGBB", "rgb(R,G,B)", "hsl(H,S,L)").'),
        value: z.number().min(0).max(1).describe('The alpha value (0-1).'),
    });
    server.tool(
        'set-color-alpha',
        'Sets the alpha (opacity) of a color.',
        setColorAlphaSchema.shape,
        async ({color, value}: z.infer<typeof setColorAlphaSchema>) => {
            const result = colord(color).alpha(value).toHex();
            return {
                content: [{type: 'text', text: JSON.stringify(result, null, 2)}],
            };
        },
    );

    const invertColorSchema = z.object({
        color: z.string().describe('The color string.'),
    });
    server.tool(
        'invert-color',
        'Inverts the color.',
        invertColorSchema.shape,
        async ({color}: z.infer<typeof invertColorSchema>) => {
            const result = colord(color).invert().toHex();
            return {
                content: [{type: 'text', text: JSON.stringify(result, null, 2)}],
            };
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
        async ({color, amount}: z.infer<typeof saturateColorSchema>) => {
            const result = colord(color).saturate(amount).toHex();
            return {
                content: [{type: 'text', text: JSON.stringify(result, null, 2)}],
            };
        },
    );

    const desaturateColorSchema = z.object({
        color: z.string().describe('The color string.'),
        amount: z.number().min(0).max(1).describe('The amount to desaturate (0-1).'),
    });
    server.tool(
        'desaturate-color',
        'Desaturates the color by a given amount.',
        desaturateColorSchema.shape,
        async ({color, amount}: z.infer<typeof desaturateColorSchema>) => {
            const result = colord(color).desaturate(amount).toHex();
            return {
                content: [{type: 'text', text: JSON.stringify(result, null, 2)}],
            };
        },
    );

    const grayscaleColorSchema = z.object({
        color: z.string().describe('The color string.'),
    });
    server.tool(
        'grayscale-color',
        'Converts the color to grayscale.',
        grayscaleColorSchema.shape,
        async ({color}: z.infer<typeof grayscaleColorSchema>) => {
            const result = colord(color).grayscale().toHex();
            return {
                content: [{type: 'text', text: JSON.stringify(result, null, 2)}],
            };
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
        async ({color, amount}: z.infer<typeof lightenColorSchema>) => {
            const result = colord(color).lighten(amount).toHex();
            return {
                content: [{type: 'text', text: JSON.stringify(result, null, 2)}],
            };
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
        async ({color, amount}: z.infer<typeof darkenColorSchema>) => {
            const result = colord(color).darken(amount).toHex();
            return {
                content: [{type: 'text', text: JSON.stringify(result, null, 2)}],
            };
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
        async ({color, value}: z.infer<typeof setColorHueSchema>) => {
            const result = colord(color).rotate(value).toHslString();
            return {
                content: [{type: 'text', text: JSON.stringify(result, null, 2)}],
            };
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
        async ({color, amount}: z.infer<typeof rotateColorHueSchema>) => {
            const result = colord(color).rotate(amount).toHslString();
            return {
                content: [{type: 'text', text: JSON.stringify(result, null, 2)}],
            };
        },
    );

    // Color Mixing
    const mixColorsSchema = z.object({
        color1: z.string().describe('The first color string.'),
        color2: z.string().describe('The second color string.'),
        ratio: z.number().min(0).max(1).describe('The mixing ratio (0-1).'),
    });
    server.tool(
        'mix-colors',
        'Mixes two colors together.',
        mixColorsSchema.shape,
        async ({color1, color2, ratio}: z.infer<typeof mixColorsSchema>) => {
            const result = colord(color1).mix(color2, ratio).toHex();
            return {
                content: [{type: 'text', text: JSON.stringify(result, null, 2)}],
            };
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
        async ({color, count}: z.infer<typeof generateTintsSchema>) => {
            const result = colord(color).tints(count).map((c) => c.toHex());
            return {
                content: [{type: 'text', text: JSON.stringify(result, null, 2)}],
            };
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
        async ({color, count}: z.infer<typeof generateShadesSchema>) => {
            const result = colord(color).shades(count).map((c) => c.toHex());
            return {
                content: [{type: 'text', text: JSON.stringify(result, null, 2)}],
            };
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
        async ({color, count}: z.infer<typeof generateTonesSchema>) => {
            const result = colord(color).tones(count).map((c) => c.toHex());
            return {
                content: [{type: 'text', text: JSON.stringify(result, null, 2)}],
            };
        },
    );

    // Color Harmony
    const generateColorHarmoniesSchema = z.object({
        color: z.string().describe('The color string.'),
        type: z.enum([
            "analogous", "complementary", "double-split-complementary", "rectangle", "split-complementary", "tetradic", "triadic"
        ]).describe('The type of harmony to generate.'),
    });
    server.tool(
        'generate-color-harmonies',
        'Generates color harmonies based on a given type.',
        generateColorHarmoniesSchema.shape,
        async ({color, type}: z.infer<typeof generateColorHarmoniesSchema>) => {
            const result = colord(color).harmonies(type).map((c) => c.toHex());
            return {
                content: [{type: 'text', text: JSON.stringify(result, null, 2)}],
            };
        },
    );

    // Color Analysis
    const isValidColorSchema = z.object({
        color: z.string().describe('The color string.'),
    });
    server.tool(
        'is-valid-color',
        'Checks if a color string is valid.',
        isValidColorSchema.shape,
        async ({color}: z.infer<typeof isValidColorSchema>) => {
            const result = colord(color).isValid();
            return {
                content: [{type: 'text', text: JSON.stringify(result, null, 2)}],
            };
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
        async ({color1, color2}: z.infer<typeof areColorsEqualSchema>) => {
            const result = colord(color1).isEqual(color2);
            return {
                content: [{type: 'text', text: JSON.stringify(result, null, 2)}],
            };
        },
    );

    const getColorAlphaSchema = z.object({
        color: z.string().describe('The color string.'),
    });
    server.tool(
        'get-color-alpha',
        'Gets the alpha (opacity) of a color.',
        getColorAlphaSchema.shape,
        async ({color}: z.infer<typeof getColorAlphaSchema>) => {
            const result = colord(color).alpha();
            return {
                content: [{type: 'text', text: JSON.stringify(result, null, 2)}],
            };
        },
    );

    const getColorHueSchema = z.object({
        color: z.string().describe('The color string.'),
    });
    server.tool(
        'get-color-hue',
        'Gets the hue of a color.',
        getColorHueSchema.shape,
        async ({color}: z.infer<typeof getColorHueSchema>) => {
            const result = colord(color).hue();
            return {
                content: [{type: 'text', text: JSON.stringify(result, null, 2)}],
            };
        },
    );

    const getColorBrightnessSchema = z.object({
        color: z.string().describe('The color string.'),
    });
    server.tool(
        'get-color-brightness',
        'Gets the brightness of a color.',
        getColorBrightnessSchema.shape,
        async ({color}: z.infer<typeof getColorBrightnessSchema>) => {
            const result = colord(color).brightness();
            return {
                content: [{type: 'text', text: JSON.stringify(result, null, 2)}],
            };
        },
    );

    const isColorLightSchema = z.object({
        color: z.string().describe('The color string.'),
    });
    server.tool(
        'is-color-light',
        'Checks if a color is light.',
        isColorLightSchema.shape,
        async ({color}: z.infer<typeof isColorLightSchema>) => {
            const result = colord(color).isLight();
            return {
                content: [{type: 'text', text: JSON.stringify(result, null, 2)}],
            };
        },
    );

    const isColorDarkSchema = z.object({
        color: z.string().describe('The color string.'),
    });
    server.tool(
        'is-color-dark',
        'Checks if a color is dark.',
        isColorDarkSchema.shape,
        async ({color}: z.infer<typeof isColorDarkSchema>) => {
            const result = colord(color).isDark();
            return {
                content: [{type: 'text', text: JSON.stringify(result, null, 2)}],
            };
        },
    );

    const getColorLuminanceSchema = z.object({
        color: z.string().describe('The color string.'),
    });
    server.tool(
        'get-color-luminance',
        'Gets the luminance of a color.',
        getColorLuminanceSchema.shape,
        async ({color}: z.infer<typeof getColorLuminanceSchema>) => {
            const result = colord(color).luminance();
            return {
                content: [{type: 'text', text: JSON.stringify(result, null, 2)}],
            };
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
        async ({color1, color2}: z.infer<typeof getColorContrastSchema>) => {
            const result = colord(color1).contrast(color2);
            return {
                content: [{type: 'text', text: JSON.stringify(result, null, 2)}],
            };
        },
    );

    const isColorReadableSchema = z.object({
        color1: z.string().describe('The first color string.'),
        color2: z.string().describe('The second color string.'),
        options: z.object({
            level: z.enum(['AA', 'AAA']).optional().describe('WCAG level (AA or AAA).'),
            size: z.enum(['large', 'normal']).optional().describe('Text size (large or normal).'),
        }).optional().describe('Readability options.'),
    });
    server.tool(
        'is-color-readable',
        'Checks if two colors are readable according to WCAG.',
        isColorReadableSchema.shape,
        async ({color1, color2, options}: z.infer<typeof isColorReadableSchema>) => {
            const result = colord(color1).isReadable(color2, options);
            return {
                content: [{type: 'text', text: JSON.stringify(result, null, 2)}],
            };
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
        async ({color1, color2}: z.infer<typeof getColorDeltaESchema>) => {
            const result = colord(color1).delta(color2);
            return {
                content: [{type: 'text', text: JSON.stringify(result, null, 2)}],
            };
        },
    );

    // Color Utilities
    const getRandomColorSchema = z.object({});
    server.tool(
        'get-random-color',
        'Generates a random color.',
        getRandomColorSchema.shape,
        async () => {
            const result = random().toHex();
            return {
                content: [{type: 'text', text: JSON.stringify(result, null, 2)}],
            };
        },
    );

    const minifyColorSchema = z.object({
        color: z.string().describe('The color string.'),
        options: z.object({
            hex: z.boolean().optional().describe('Minify to hex format.'),
            rgb: z.boolean().optional().describe('Minify to rgb format.'),
            hsl: z.boolean().optional().describe('Minify to hsl format.'),
            hwb: z.boolean().optional().describe('Minify to hwb format.'),
            name: z.boolean().optional().describe('Minify to named color.'),
        }).optional().describe('Minification options.'),
    });
    server.tool(
        'minify-color',
        'Minifies a color string to its shortest possible representation.',
        minifyColorSchema.shape,
        async ({color, options}: z.infer<typeof minifyColorSchema>) => {
            const result = colord(color).minify(options);
            return {
                content: [{type: 'text', text: JSON.stringify(result, null, 2)}],
            };
        },
    );
}