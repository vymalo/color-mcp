import {server} from "../server";
import {z} from "zod";
import {colorMe, generateRandomScheme} from "../lib/colored";
import {generateColorSVG, generateSchemeSVG} from "../lib/svg";
import {nanoid} from "nanoid";

export function registerSvgGenerationTools() {
    server.tool(
        "generate-color-svg",
        "Get SVG representation of a color",
        {
            color: z.string().describe("Color string (e.g., be it hex, rgb, rgba, cmyk, hsv or hsl)"),
            width: z.number().optional().default(100).describe("Width of the SVG colorbox"),
            height: z.number().optional().default(100).describe("Height of the SVG colorbox"),
            named: z.boolean().optional().nullable().describe("Whether to display the color name"),
        },
        async ({color: colorStr, width, height, named}) => {
            const color = await colorMe({color: colorStr});
            const svg = generateColorSVG(color, width, height, named || false);
            return {
                content: [{
                    type: "image",
                    data: Buffer.from(svg).toString('base64'),
                    mimeType: "image/svg+xml"
                }]
            };
        },
    );

    server.tool(
        "generate-scheme-svg",
        "Get SVG representation of a color scheme",
        {
            color: z.string().describe("Color string (e.g., be it hex, rgb, rgba, cmyk, hsv or hsl)"),
            mode: z.enum([
                "analogous",
                "complementary",
                "double-split-complementary",
                "rectangle",
                "split-complementary",
                "tetradic",
                "triadic",
            ]).optional().nullable().describe("Color scheme mode"),
            count: z.number().optional().default(6).describe("Number of colors in the scheme"),
            seed: z.string().optional().nullable().describe("A seed for the scheme generation. The same seed and color would produce the same colorscheme"),
            width: z.number().optional().default(100).describe("Width of the SVG schemebox"),
            height: z.number().optional().default(200).describe("Height of the SVG schemebox"),
        },
        async ({color, mode, width, height, count, seed}) => {
            const scheme = await generateRandomScheme(color, count, seed ?? nanoid(), mode);
            const svg = generateSchemeSVG(scheme, width, height, false);
            return {
                content: [{
                    type: "image",
                    data: Buffer.from(svg).toString('base64'),
                    mimeType: "image/svg+xml"
                }]
            };
        },
    );
}