import {server} from "../server";
import {z} from "zod";
import {generateRandomScheme} from "../lib/colored";
import {nanoid} from "nanoid";

export function registerColorSchemeTools() {
    server.tool(
        "get-color-scheme-info",
        "Get color scheme information in JSON format",
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
        },
        async ({color, mode, count, seed}) => {
            const scheme = await generateRandomScheme(color, count, seed ?? nanoid(), mode);
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(scheme, null, 2)
                }]
            };
        },
    );
}