import {server} from "./server";
import {z} from "zod";
import {colorMe} from "./lib/colored";
import {getRandomHex, parseQueryColors} from "./lib/cutils";
import {getScheme} from "./lib/schemer";
import {ColorInput, ColorOutput} from "./lib/color-interfaces";

// Helper function to convert query parameters to ColorInput
function getColorInput(params: any): ColorInput {
    const parsed = parseQueryColors(params);
    const colorInput: ColorInput = {};

    if (parsed.hex) {
        colorInput.hex = parsed.hex;
    }
    if (parsed.rgb.r !== null && parsed.rgb.g !== null && parsed.rgb.b !== null) {
        colorInput.rgb = {r: parsed.rgb.r, g: parsed.rgb.g, b: parsed.rgb.b, is_fraction: parsed.rgb.is_fraction};
    }
    if (parsed.hsl.h !== null && parsed.hsl.s !== null && parsed.hsl.l !== null) {
        colorInput.hsl = {h: parsed.hsl.h, s: parsed.hsl.s, l: parsed.hsl.l, is_fraction: parsed.hsl.is_fraction};
    }
    if (parsed.cmyk.c !== null && parsed.cmyk.m !== null && parsed.cmyk.y !== null && parsed.cmyk.k !== null) {
        colorInput.cmyk = {
            c: parsed.cmyk.c,
            m: parsed.cmyk.m,
            y: parsed.cmyk.y,
            k: parsed.cmyk.k,
            is_fraction: parsed.cmyk.is_fraction
        };
    }
    if (parsed.hsv.h !== null && parsed.hsv.s !== null && parsed.hsv.v !== null) {
        colorInput.hsv = {h: parsed.hsv.h, s: parsed.hsv.s, v: parsed.hsv.v, is_fraction: parsed.hsv.is_fraction};
    }
    return colorInput;
}

// Helper function to generate SVG for colorbox
function generateColorSVG(color: ColorOutput, width: number, height: number, named: boolean): string {
    const textColor = color.contrast.value;
    const text = named ? color.name.value : '';
    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="${color.hex.value}"/>
    <text x="50%" y="50%" font-family="Arial" font-size="20" fill="${textColor}" text-anchor="middle" alignment-baseline="middle">${text}</text>
</svg>`;
}

// Helper function to generate SVG for schemebox
function generateSchemeSVG(scheme: any, width: number, height: number, named: boolean): string {
    let svgContent = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
    const sectionHeight = Math.round(height / scheme.colors.length);

    scheme.colors.forEach((color: ColorOutput, index: number) => {
        const y = index * sectionHeight;
        const textColor = color.contrast.value;
        const text = named ? color.name.value : '';
        svgContent += `<rect x="0" y="${y}" width="${width}" height="${sectionHeight}" fill="${color.hex.value}"/>`;
        svgContent += `<text x="50%" y="${y + sectionHeight / 2}" font-family="Arial" font-size="16" fill="${textColor}" text-anchor="middle" alignment-baseline="middle">${text}</text>`;
    });

    svgContent += `</svg>`;
    return svgContent;
}

server.tool(
    "get-colorbox",
    "Get SVG representation of a color",
    {
        hex: z.string().optional().nullable().describe("Hexadecimal color code (e.g., FF0000)"),
        rgb: z.string().optional().nullable().describe("RGB color string (e.g., 'rgb(255,0,0)' or '255,0,0')"),
        hsl: z.string().optional().nullable().describe("HSL color string (e.g., 'hsl(0,100%,50%)' or '0,100,50')"),
        cmyk: z.string().optional().nullable().describe("CMYK color string (e.g., 'cmyk(0,100,100,0)' or '0,100,100,0')"),
        hsv: z.string().optional().nullable().describe("HSV color string (e.g., 'hsv(0,100%,100%)' or '0,100,100')"),
        width: z.number().optional().default(100).describe("Width of the SVG colorbox"),
        height: z.number().optional().default(100).describe("Height of the SVG colorbox"),
        named: z.boolean().optional().nullable().describe("Whether to display the color name"),
    },
    async ({hex, rgb, hsl, cmyk, hsv, width, height, named}) => {
        const colorInput = getColorInput({hex, rgb, hsl, cmyk, hsv});
        const color = colorMe(colorInput);
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
    "get-schemebox",
    "Get SVG representation of a color scheme",
    {
        hex: z.string().optional().nullable().describe("Hexadecimal color code (e.g., FF0000)"),
        rgb: z.string().optional().nullable().describe("RGB color string (e.g., 'rgb(255,0,0)' or '255,0,0')"),
        hsl: z.string().optional().nullable().describe("HSL color string (e.g., 'hsl(0,100%,50%)' or '0,100,50')"),
        cmyk: z.string().optional().nullable().describe("CMYK color string (e.g., 'cmyk(0,100,100,0)' or '0,100,100,0')"),
        hsv: z.string().optional().nullable().describe("HSV color string (e.g., 'hsv(0,100%,100%)' or '0,100,100')"),
        mode: z.string().optional().default('monochrome').describe("Color scheme mode (e.g., 'monochrome', 'analogic', 'complement')"),
        count: z.number().optional().default(5).describe("Number of colors in the scheme"),
        width: z.number().optional().default(100).describe("Width of the SVG schemebox"),
        height: z.number().optional().default(200).describe("Height of the SVG schemebox"),
        named: z.boolean().optional().nullable().describe("Whether to display the color names"),
    },
    async ({hex, rgb, hsl, cmyk, hsv, mode, count, width, height, named}) => {
        const colorInput = getColorInput({hex, rgb, hsl, cmyk, hsv});
        const seedColor = colorMe(colorInput);
        const scheme = getScheme(mode || 'monochrome', count || 5, seedColor);
        const svg = generateSchemeSVG(scheme, width, height, named || false);
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
    "identify-color",
    "Get complete color information in JSON format",
    {
        hex: z.string().optional().nullable().describe("Hexadecimal color code (e.g., FF0000)"),
        rgb: z.string().optional().nullable().describe("RGB color string (e.g., 'rgb(255,0,0)' or '255,0,0')"),
        hsl: z.string().optional().nullable().describe("HSL color string (e.g., 'hsl(0,100%,50%)' or '0,100,50')"),
        cmyk: z.string().optional().nullable().describe("CMYK color string (e.g., 'cmyk(0,100,100,0)' or '0,100,100,0')"),
        hsv: z.string().optional().nullable().describe("HSV color string (e.g., 'hsv(0,100%,100%)' or '0,100,100')"),
        format: z.enum(['json', 'html', 'svg']).optional().nullable().describe("Output format (json, html, svg)"),
    },
    async ({hex, rgb, hsl, cmyk, hsv, format}) => {
        const colorInput = getColorInput({hex, rgb, hsl, cmyk, hsv});
        const color = colorMe(colorInput);

        if (format === 'svg') {
            const svg = generateColorSVG(color, 100, 100, true);
            return {
                content: [{
                    type: "image",
                    data: Buffer.from(svg).toString('base64'),
                    mimeType: "image/svg+xml"
                }]
            };
        } else if (format === 'html') {
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(color, null, 2)
                }],
                _meta: {
                    note: "HTML format is not directly supported by MCP tools. Returning JSON instead."
                }
            };
        } else {
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(color, null, 2)
                }]
            };
        }
    },
);

server.tool(
    "get-color-scheme",
    "Get color scheme information in JSON format",
    {
        hex: z.string().optional().nullable().describe("Hexadecimal color code (e.g., FF0000)"),
        rgb: z.string().optional().nullable().describe("RGB color string (e.g., 'rgb(255,0,0)' or '255,0,0')"),
        hsl: z.string().optional().nullable().describe("HSL color string (e.g., 'hsl(0,100%,50%)' or '0,100,50')"),
        cmyk: z.string().optional().nullable().describe("CMYK color string (e.g., 'cmyk(0,100,100,0)' or '0,100,100,0')"),
        hsv: z.string().optional().nullable().describe("HSV color string (e.g., 'hsv(0,100%,100%)' or '0,100,100')"),
        mode: z.string().optional().default('monochrome').describe("Color scheme mode (e.g., 'monochrome', 'analogic', 'complement')"),
        count: z.number().optional().default(5).describe("Number of colors in the scheme"),
        format: z.enum(['json', 'html', 'svg']).optional().nullable().describe("Output format (json, html, svg)"),
    },
    async ({hex, rgb, hsl, cmyk, hsv, mode, count, format}) => {
        const colorInput = getColorInput({hex, rgb, hsl, cmyk, hsv});
        const seedColor = colorMe(colorInput);
        const scheme = getScheme(mode || 'monochrome', count || 5, seedColor);

        if (format === 'svg') {
            const svg = generateSchemeSVG(scheme, 100, 200, true);
            return {
                content: [{
                    type: "image",
                    data: Buffer.from(svg).toString('base64'),
                    mimeType: "image/svg+xml"
                }]
            };
        } else if (format === 'html') {
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(scheme, null, 2)
                }],
                _meta: {
                    note: "HTML format is not directly supported by MCP tools. Returning JSON instead."
                }
            };
        } else {
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(scheme, null, 2)
                }]
            };
        }
    },
);

server.tool(
    "get-random-color",
    "Get random color information",
    {},
    async () => {
        const randomHex = getRandomHex().substring(1);
        const color = colorMe({hex: randomHex});
        return {
            content: [{
                type: "text",
                text: JSON.stringify(color, null, 2)
            }]
        };
    },
);