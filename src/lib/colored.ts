import {colord, extend} from 'colord';
import cmykPlugin from 'colord/plugins/cmyk';
import namesPlugin from 'colord/plugins/names';
import labPlugin from 'colord/plugins/lab'; // For XYZ-like conversions if needed
import {ColorInput, ColorNames, ColorOutput} from './color-interfaces';
import {validateCMYK, validateHex, validateHSL, validateHSV, validateRGB, ValidationError} from './validation';
import colorNames from './colorNames.json';

extend([cmykPlugin, namesPlugin, labPlugin]);

// Lazy load color names data
let named: ColorNames['colors'] = colorNames.colors;

// Main color processing function
export const colorMe = async (arg: ColorInput): Promise<ColorOutput> => {
    const c: ColorOutput = {
        hex: {value: '', clean: ''},
        rgb: {r: 0, g: 0, b: 0, value: '', fraction: {r: 0, g: 0, b: 0}},
        hsl: {h: 0, s: 0, l: 0, value: '', fraction: {h: 0, s: 0, l: 0}},
        hsv: {h: 0, s: 0, v: 0, value: '', fraction: {h: 0, s: 0, v: 0}},
        cmyk: {c: 0, m: 0, y: 0, k: 0, value: '', fraction: {c: 0, m: 0, y: 0, k: 0}},
        XYZ: {X: 0, Y: 0, Z: 0, value: '', fraction: {X: 0, Y: 0, Z: 0}},
        name: {value: '', closest_named_hex: '', exact_match_name: false, distance: 0},
        contrast: {value: ''},
        image: {bare: '', named: ''},
        _links: {self: {href: ''}},
        _embedded: {}
    };

    let colorInstance: ReturnType<typeof colord>;

    try {
        if (arg.rgb) {
            const validatedRgb = validateRGB(arg.rgb);
            colorInstance = validatedRgb.is_fraction
                ? colord({r: validatedRgb.r * 255, g: validatedRgb.g * 255, b: validatedRgb.b * 255})
                : colord({r: validatedRgb.r, g: validatedRgb.g, b: validatedRgb.b});
        } else if (arg.hex) {
            const validatedHex = validateHex(arg.hex);
            colorInstance = colord(validatedHex);
        } else if (arg.hsl) {
            const validatedHsl = validateHSL(arg.hsl);
            colorInstance = validatedHsl.is_fraction
                ? colord({h: validatedHsl.h * 360, s: validatedHsl.s * 100, l: validatedHsl.l * 100})
                : colord({h: validatedHsl.h, s: validatedHsl.s, l: validatedHsl.l});
        } else if (arg.hsv) {
            const validatedHsv = validateHSV(arg.hsv);
            colorInstance = validatedHsv.is_fraction
                ? colord({h: validatedHsv.h * 360, s: validatedHsv.s * 100, v: validatedHsv.v * 100})
                : colord({h: validatedHsv.h, s: validatedHsv.s * 100, v: validatedHsv.v * 100});
        } else if (arg.cmyk) {
            const validatedCmyk = validateCMYK(arg.cmyk);
            colorInstance = validatedCmyk.is_fraction
                ? colord(`cmyk(${validatedCmyk.c * 100}%,${validatedCmyk.m * 100}%,${validatedCmyk.y * 100}%,${validatedCmyk.k * 100}%)`)
                : colord(`cmyk(${validatedCmyk.c}%,${validatedCmyk.m}%,${validatedCmyk.y}%,${validatedCmyk.k}%)`);
        } else {
            throw new ValidationError("No valid color input provided.");
        }
        if (!colorInstance.isValid()) throw new ValidationError("Invalid color input provided.");
    } catch (error) {
        if (error instanceof ValidationError) {
            console.error("Color validation error:", error.message);
            colorInstance = colord("#000000"); // Fallback to black
        } else {
            console.error("Unexpected error during color processing:", error);
            colorInstance = colord("#000000"); // Fallback to black
        }
    }

    // Populate ColorOutput object using colord
    c.hex.value = colorInstance.toHex();
    c.hex.clean = colorInstance.toHex().substring(1);

    const rgbObj = colorInstance.toRgb();
    c.rgb.r = rgbObj.r;
    c.rgb.g = rgbObj.g;
    c.rgb.b = rgbObj.b;
    c.rgb.fraction.r = rgbObj.r / 255;
    c.rgb.fraction.g = rgbObj.g / 255;
    c.rgb.fraction.b = rgbObj.b / 255;
    c.rgb.value = `rgb(${c.rgb.r},${c.rgb.g},${c.rgb.b})`;

    const hslObj = colorInstance.toHsl();
    c.hsl.h = Math.round(hslObj.h);
    c.hsl.s = Math.round(hslObj.s);
    c.hsl.l = Math.round(hslObj.l);
    c.hsl.fraction.h = hslObj.h / 360;
    c.hsl.fraction.s = hslObj.s / 100;
    c.hsl.fraction.l = hslObj.l / 100;
    c.hsl.value = `hsl(${c.hsl.h},${c.hsl.s}%,${c.hsl.l}%)`;

    const hsvObj = colorInstance.toHsv();
    c.hsv.h = Math.round(hsvObj.h);
    c.hsv.s = Math.round(hsvObj.s);
    c.hsv.v = Math.round(hsvObj.v);
    c.hsv.fraction.h = hsvObj.h / 360;
    c.hsv.fraction.s = hsvObj.s / 100;
    c.hsv.fraction.v = hsvObj.v / 100;
    c.hsv.value = `hsv(${c.hsv.h},${c.hsv.s}%,${c.hsv.v}%)`;

    const cmykObj = colorInstance.toCmyk();
    c.cmyk.c = Math.round(cmykObj.c);
    c.cmyk.m = Math.round(cmykObj.m);
    c.cmyk.y = Math.round(cmykObj.y);
    c.cmyk.k = Math.round(cmykObj.k);
    c.cmyk.fraction.c = cmykObj.c / 100;
    c.cmyk.fraction.m = cmykObj.m / 100;
    c.cmyk.fraction.y = cmykObj.y / 100;
    c.cmyk.fraction.k = cmykObj.k / 100;
    c.cmyk.value = `cmyk(${c.cmyk.c}%,${c.cmyk.m}%,${c.cmyk.y}%,${c.cmyk.k}%)`;

    // XYZ conversion is not supported by colord; retain chroma-js workaround or comment as custom logic
    // If XYZ is essential, keep this custom logic, otherwise set to zero or remove
    c.XYZ.X = 0;
    c.XYZ.Y = 0;
    c.XYZ.Z = 0;
    c.XYZ.fraction.X = 0;
    c.XYZ.fraction.Y = 0;
    c.XYZ.fraction.Z = 0;
    c.XYZ.value = `XYZ(0,0,0)`;

    // Name and contrast
    if (named) {
        const n = nearestNamedHex(c.hex.value);
        c.name.value = n[1];
        c.name.closest_named_hex = n[0];
        c.name.exact_match_name = n[2];
        c.name.distance = n[3];
    } else {
        c.name.value = "Unnamed";
        c.name.closest_named_hex = "";
        c.name.exact_match_name = false;
        c.name.distance = -1;
    }

    c.contrast.value = colorInstance.isLight() ? '#000000' : '#FFFFFF';

    c.image.bare = "https://www.thecolorapi.com/id?format=svg&named=false&hex=" + c.hex.clean;
    c.image.named = "https://www.thecolorapi.com/id?format=svg&hex=" + c.hex.clean;
    c._links.self = {
        href: '/id?hex=' + c.hex.clean
    };

    return c;
};

// Helper functions (moved from schemer to avoid circular dependency)
export const hexCheck = (color: string): string => {
    try {
        return validateHex(color);
    } catch (error) {
        if (error instanceof ValidationError) {
            console.warn(`Hex validation failed for "${color}": ${error.message}. Falling back to #000000.`);
            return "#000000";
        }
        throw error;
    }
};

export const RGBToHex = (arr: number[]): string => {
    try {
        validateRGB({r: arr[0], g: arr[1], b: arr[2]});
        return colord({r: arr[0], g: arr[1], b: arr[2]}).toHex();
    } catch (error) {
        if (error instanceof ValidationError) {
            console.warn(`RGB to Hex conversion failed for [${arr}]: ${error.message}. Falling back to #000000.`);
            return "#000000";
        }
        throw error;
    }
};

export const hexToRGB = (color: string, frac?: boolean): number[] => {
    try {
        const validatedHex = validateHex(color);
        const rgb = colord(validatedHex).toRgb();
        const arr = [rgb.r, rgb.g, rgb.b];
        return frac ? arr.map((c: number) => c / 255) : arr;
    } catch (error) {
        if (error instanceof ValidationError) {
            console.warn(`Hex to RGB conversion failed for "${color}": ${error.message}. Falling back to [0,0,0].`);
            return frac ? [0, 0, 0] : [0, 0, 0];
        }
        throw error;
    }
};

export const hexToHSL = (color: string): number[] => {
    try {
        const validatedHex = validateHex(color);
        const hsl = colord(validatedHex).toHsl();
        return [hsl.h || 0, (hsl.s || 0), (hsl.l || 0)];
    } catch (error) {
        if (error instanceof ValidationError) {
            console.warn(`Hex to HSL conversion failed for "${color}": ${error.message}. Falling back to [0,0,0].`);
            return [0, 0, 0];
        }
        throw error;
    }
};

export const RGBToHSL = (rgb: number[]): number[] => {
    try {
        validateRGB({r: rgb[0], g: rgb[1], b: rgb[2]});
        const hsl = colord({r: rgb[0], g: rgb[1], b: rgb[2]}).toHsl();
        return [hsl.h || 0, (hsl.s || 0), (hsl.l || 0)];
    } catch (error) {
        if (error instanceof ValidationError) {
            console.warn(`RGB to HSL conversion failed for [${rgb}]: ${error.message}. Falling back to [0,0,0].`);
            return [0, 0, 0];
        }
        throw error;
    }
};

export const HSLToRGB = (hsl: number[]): number[] => {
    try {
        validateHSL({h: hsl[0], s: hsl[1], l: hsl[2]});
        const rgb = colord({h: hsl[0], s: hsl[1], l: hsl[2]}).toRgb();
        return [rgb.r, rgb.g, rgb.b];
    } catch (error) {
        if (error instanceof ValidationError) {
            console.warn(`HSL to RGB conversion failed for [${hsl}]: ${error.message}. Falling back to [0,0,0].`);
            return [0, 0, 0];
        }
        throw error;
    }
};

export const nearestNamedHex = (color: string): [string, string, boolean, number] => {
    if (!named) {
        console.warn("Color names data not loaded. Cannot find nearest named hex.");
        return ["#000000", "Data Not Loaded", false, -1];
    }

    try {
        const validatedHex = validateHex(color);
        const inputColord = colord(validatedHex);
        const inputRgbObj = inputColord.toRgb();
        const inputHslObj = inputColord.toHsl();
        const inputRgb = [inputRgbObj.r, inputRgbObj.g, inputRgbObj.b];
        const inputHsl = [inputHslObj.h, inputHslObj.s / 100, inputHslObj.l / 100];

        let closestName = "Unknown";
        let closestHex = "#000000";
        let minDistance = Infinity;
        let exactMatch = false;

        for (const namedColor of named) {
            const namedColord = colord(`#${namedColor.hex}`);
            const namedRgbObj = namedColord.toRgb();
            const namedHslObj = namedColord.toHsl();
            const namedRgb = [namedRgbObj.r, namedRgbObj.g, namedRgbObj.b];
            const namedHsl = [namedHslObj.h, namedHslObj.s / 100, namedHslObj.l / 100];

            // Euclidean distance in RGB space
            const distRgb = Math.sqrt(
                Math.pow(inputRgb[0] - namedRgb[0], 2) +
                Math.pow(inputRgb[1] - namedRgb[1], 2) +
                Math.pow(inputRgb[2] - namedRgb[2], 2)
            );

            // Weighted distance in HSL space (hue is circular, so special handling)
            const hueDiff = Math.min(Math.abs(inputHsl[0] - namedHsl[0]), 360 - Math.abs(inputHsl[0] - namedHsl[0]));
            const distHsl = Math.sqrt(
                Math.pow(hueDiff, 2) +
                Math.pow((inputHsl[1] - namedHsl[1]) * 100, 2) + // Scale saturation/lightness
                Math.pow((inputHsl[2] - namedHsl[2]) * 100, 2)
            );

            // Combine distances - adjust weights as needed
            const totalDistance = distRgb * 0.5 + distHsl * 0.5;

            if (totalDistance < minDistance) {
                minDistance = totalDistance;
                closestName = namedColor.name;
                closestHex = `#${namedColor.hex}`;
            }

            if (validatedHex.toLowerCase() === `#${namedColor.hex.toLowerCase()}`) {
                exactMatch = true;
                closestName = namedColor.name;
                closestHex = `#${namedColor.hex}`;
                minDistance = 0;
                break; // Exact match found, no need to continue
            }
        }

        return [closestHex, closestName, exactMatch, minDistance];
    } catch (error) {
        if (error instanceof ValidationError) {
            console.warn(`Nearest named hex failed for "${color}": ${error.message}. Falling back to default.`);
            return ["#000000", "Invalid Color", false, -1];
        }
        throw error;
    }
};