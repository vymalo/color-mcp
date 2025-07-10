import {server} from "./server";
import {z} from "zod";
import {colorMe} from "./lib/colored";
import {getRandomHex, parseQueryColors} from "./lib/cutils";
import {getScheme, SchemeResult} from "./lib/schemer";
import {ValidationError} from './lib/validation';

import {Svg, SVG} from '@svgdotjs/svg.js';
import {ColorInput, ColorOutput} from "./lib/color-interfaces";

interface AColorInput {
    hex?: string | null;
    rgb?: string | null;
    hsl?: string | null;
    cmyk?: string | null;
    hsv?: string | null;
    width?: number | null;
    height?: number | null;
    named?: boolean | null;
}

function getColorInput(params: AColorInput) {
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

// Shared SVG generation utility
// Utility: wraps an SVG.js SVG object and returns SVG markup as string
function generateSVG(draw: Svg, width: number, height: number) {
    draw.size(width, height);
    draw.viewbox(0, 0, width, height);
    // SVG.js .svg() returns markup string
    return draw.svg();
}

// Helper function to generate SVG for colorbox
function generateColorSVG(color: ColorOutput, width: number, height: number, named: boolean) {
    const textColor = color.contrast.value;
    const text = named ? color.name.value : '';
    const draw = SVG();

    // Background rectangle
    draw.rect(width, height)
        .fill(color.hex.value);

    // Centered text
    draw.text(text)
        .font({family: "Arial", size: 20, anchor: "middle"})
        .fill(textColor)
        .attr({
            x: width / 2,
            y: height / 2,
            "alignment-baseline": "middle",
            "dominant-baseline": "middle",
            "text-anchor": "middle"
        });

    return generateSVG(draw, width, height);
}

// Helper function to generate SVG for schemebox
function generateSchemeSVG(scheme: SchemeResult, width: number, height: number, named: boolean) {
    const draw = SVG();
    const sectionHeight = Math.round(height / scheme.colors.length);

    scheme.colors.forEach((color, index) => {
        const y = index * sectionHeight;
        const textColor = color.contrast.value;
        const text = named ? color.name.value : '';

        // Section rectangle
        draw.rect(width, sectionHeight)
            .fill(color.hex.value)
            .move(0, y);

        // Centered text for each section
        draw.text(text)
            .font({family: "Arial", size: 16, anchor: "middle"})
            .fill(textColor)
            .attr({
                x: width / 2,
                y: y + sectionHeight / 2,
                "alignment-baseline": "middle",
                "dominant-baseline": "middle",
                "text-anchor": "middle"
            });
    });

    return generateSVG(draw, width, height);
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
        try {
            const colorInput = getColorInput({hex, rgb, hsl, cmyk, hsv});
            const color = await colorMe(colorInput);
            const svg = generateColorSVG(color, width, height, named || false);
            return {
                content: [{
                    type: "image",
                    data: Buffer.from(svg).toString('base64'),
                    mimeType: "image/svg+xml"
                }]
            };
        } catch (error) {
            if (error instanceof ValidationError) {
                return {
                    content: [{
                        type: "text",
                        text: `Validation Error: ${error.message}`
                    }],
                    _meta: {
                        error: true
                    }
                };
            }
            throw error;
        }
    },
);

server.tool(
    "get-scheme-box",
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
        try {
            const colorInput = getColorInput({hex, rgb, hsl, cmyk, hsv});
            const seedColor = await colorMe(colorInput);
            const scheme = getScheme(mode || 'monochrome', count || 5, seedColor);
            const svg = generateSchemeSVG(scheme, width, height, named || false);
            return {
                content: [{
                    type: "image",
                    data: Buffer.from(svg).toString('base64'),
                    mimeType: "image/svg+xml"
                }]
            };
        } catch (error) {
            if (error instanceof ValidationError) {
                return {
                    content: [{
                        type: "text",
                        text: `Validation Error: ${error.message}`
                    }],
                    _meta: {
                        error: true
                    }
                };
            }
            throw error;
        }
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
        try {
            const colorInput = getColorInput({hex, rgb, hsl, cmyk, hsv});
            const color = await colorMe(colorInput);

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
        } catch (error) {
            if (error instanceof ValidationError) {
                return {
                    content: [{
                        type: "text",
                        text: `Validation Error: ${error.message}`
                    }],
                    _meta: {
                        error: true
                    }
                };
            }
            throw error;
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
        try {
            const colorInput = getColorInput({hex, rgb, hsl, cmyk, hsv});
            const seedColor = await colorMe(colorInput);
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
        } catch (error) {
            if (error instanceof ValidationError) {
                return {
                    content: [{
                        type: "text",
                        text: `Validation Error: ${error.message}`
                    }],
                    _meta: {
                        error: true
                    }
                };
            }
            throw error;
        }
    },
);

server.tool(
    "get-random-color",
    "Get random color information",
    {},
    async () => {
        try {
            const randomHex = getRandomHex().substring(1);
            const color = await colorMe({hex: randomHex});
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(color, null, 2)
                }]
            };
        } catch (error) {
            if (error instanceof ValidationError) {
                return {
                    content: [{
                        type: "text",
                        text: `Validation Error: ${error.message}`
                    }],
                    _meta: {
                        error: true
                    }
                };
            }
            throw error;
        }
    },
);
