import {ColorOutput} from "./color-interfaces";

/**
 * Escape special XML characters in text content.
 */
function escapeXml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

/**
 * Generate a single-color SVG with optional centered text.
 */
export function generateColorSVG(
    color: ColorOutput,
    width: number,
    height: number,
    named: boolean
): string {
    const bgColor = color.hex.value;
    const textColor = color.contrast.value;
    const text = named ? (color.name.value ? escapeXml(color.name.value) : color.hex.value) : "";

    // Start SVG element
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;

    // Background
    svg += `<rect width="${width}" height="${height}" fill="${bgColor}" />`;

    // Centered text (if any)
    if (text) {
        svg +=
            `<text x="${width / 2}" y="${height / 2}" ` +
            `fill="${textColor}" font-family="Arial" font-size="20" ` +
            `text-anchor="middle" dominant-baseline="middle">` +
            `${text}` +
            `</text>`;
    }

    // Close SVG
    svg += `</svg>`;
    return svg;
}

/**
 * Generate a vertical color scheme SVG with one section per color,
 * each with centered text either as the color name or hex value.
 */
export function generateSchemeSVG(
    colors: ColorOutput[],
    width: number,
    height: number,
    named: boolean
): string {
    const sectionHeight = Math.round(height / colors.length);

    // Start SVG element
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;

    colors.forEach((color, index) => {
        const y = index * sectionHeight;
        const fill = color.hex.value;
        const textColor = color.contrast.value;
        const textContent = named
            ? (color.name.value ? escapeXml(color.name.value) : color.hex.value)
            : escapeXml(color.hex.value);
        const fontSize = 16;

        // Section background
        svg += `<rect x="0" y="${y}" width="${width}" height="${sectionHeight}" fill="${fill}" />`;

        // Centered text
        svg +=
            `<text x="${width / 2}" y="${y + sectionHeight / 2}" ` +
            `fill="${textColor}" font-family="Arial" font-size="${fontSize}" ` +
            `text-anchor="middle" dominant-baseline="middle">` +
            `${textContent}` +
            `</text>`;
    });

    // Close SVG
    svg += `</svg>`;
    return svg;
}