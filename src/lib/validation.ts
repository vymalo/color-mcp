import {CMYKColor, HSLColor, HSVColor, RGBColor} from './color-interfaces';
import validator from 'validator';

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}

// Helper to validate color channels for RGB, HSL, HSV, CMYK
function validateColorChannels<T extends Record<string, any>>(
    obj: T,
    {
        requiredFields,
        fractionRanges,
        intRanges,
        fractionError,
        intError,
        modelName
    }: {
        requiredFields: string[],
        fractionRanges: Record<string, [number, number]>,
        intRanges: Record<string, [number, number]>,
        fractionError: (obj: T) => string,
        intError: (obj: T) => string,
        modelName: string
    }
): T {
    if (typeof obj !== 'object' || obj === null) {
        throw new ValidationError(`${modelName} color input must be an object.`);
    }
    const {is_fraction} = obj as any;
    const ranges = is_fraction ? fractionRanges : intRanges;
    for (const field of requiredFields) {
        const val = obj[field];
        if (typeof val !== 'number' || Number.isNaN(val)) {
            throw new ValidationError(`${modelName} channel '${field}' must be a number.`);
        }
        const [min, max] = ranges[field];
        if (val < min || val > max) {
            if (is_fraction) {
                throw new ValidationError(fractionError(obj));
            } else {
                throw new ValidationError(intError(obj));
            }
        }
    }
    return obj;
}

export function validateHex(hex: string): string {
    if (!hex || typeof hex !== 'string') {
        throw new ValidationError("Hexadecimal color input must be a non-empty string.");
    }
    const cleanHex = hex.startsWith('#') ? hex.substring(1) : hex;
    // Use validator for hex check and length
    if (
        !(validator.isHexadecimal(cleanHex) &&
            (cleanHex.length === 3 || cleanHex.length === 6))
    ) {
        throw new ValidationError(`Invalid hexadecimal color format: ${hex}. Expected 3 or 6 hexadecimal characters.`);
    }
    return `#${cleanHex.toUpperCase()}`;
}

export function validateRGB(rgb: RGBColor): RGBColor {
    return validateColorChannels(rgb, {
        requiredFields: ['r', 'g', 'b'],
        fractionRanges: {r: [0, 1], g: [0, 1], b: [0, 1]},
        intRanges: {r: [0, 255], g: [0, 255], b: [0, 255]},
        fractionError: ({r, g, b}) =>
            `Invalid RGB fraction values: r=${r}, g=${g}, b=${b}. Expected numbers between 0 and 1.`,
        intError: ({r, g, b}) =>
            `Invalid RGB values: r=${r}, g=${g}, b=${b}. Expected integers between 0 and 255.`,
        modelName: 'RGB'
    });
}

export function validateHSL(hsl: HSLColor): HSLColor {
    return validateColorChannels(hsl, {
        requiredFields: ['h', 's', 'l'],
        fractionRanges: {h: [0, 1], s: [0, 1], l: [0, 1]},
        intRanges: {h: [0, 360], s: [0, 100], l: [0, 100]},
        fractionError: ({h, s, l}) =>
            `Invalid HSL fraction values: h=${h}, s=${s}, l=${l}. Expected numbers between 0 and 1.`,
        intError: ({h, s, l}) =>
            `Invalid HSL values: h=${h} (0-360), s=${s} (0-100), l=${l} (0-100).`,
        modelName: 'HSL'
    });
}

export function validateHSV(hsv: HSVColor): HSVColor {
    return validateColorChannels(hsv, {
        requiredFields: ['h', 's', 'v'],
        fractionRanges: {h: [0, 1], s: [0, 1], v: [0, 1]},
        intRanges: {h: [0, 360], s: [0, 100], v: [0, 100]},
        fractionError: ({h, s, v}) =>
            `Invalid HSV fraction values: h=${h}, s=${s}, v=${v}. Expected numbers between 0 and 1.`,
        intError: ({h, s, v}) =>
            `Invalid HSV values: h=${h} (0-360), s=${s} (0-100), v=${v} (0-100).`,
        modelName: 'HSV'
    });
}

export function validateCMYK(cmyk: CMYKColor): CMYKColor {
    return validateColorChannels(cmyk, {
        requiredFields: ['c', 'm', 'y', 'k'],
        fractionRanges: {c: [0, 1], m: [0, 1], y: [0, 1], k: [0, 1]},
        intRanges: {c: [0, 100], m: [0, 100], y: [0, 100], k: [0, 100]},
        fractionError: ({c, m, y, k}) =>
            `Invalid CMYK fraction values: c=${c}, m=${m}, y=${y}, k=${k}. Expected numbers between 0 and 1.`,
        intError: ({c, m, y, k}) =>
            `Invalid CMYK values: c=${c}, m=${m}, y=${y}, k=${k}. Expected integers between 0 and 100.`,
        modelName: 'CMYK'
    });
}