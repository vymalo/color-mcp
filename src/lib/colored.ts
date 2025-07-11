import {colord} from 'colord';
import {HarmonyType} from "colord/plugins/harmonies";
import {ColorInput, ColorOutput} from './color-interfaces';
import seedrandom, {PRNG} from "seedrandom";


export const colorMe = async (arg: ColorInput): Promise<ColorOutput> => {
    const colorInstance = colord(arg.color);

    const c: ColorOutput = {
        minified: '',
        hue: -1,
        brightness: -1,
        isLight: false,
        isDark: false,
        luminance: -1,
        hex: {value: '', clean: ''},
        rgb: {r: -1, g: -1, b: -1, a: -1, value: '', fraction: {r: -1, g: -1, b: -1}},
        hsl: {h: -1, s: -1, l: -1, a: -1, value: '', fraction: {h: -1, s: -1, l: -1}},
        hsv: {h: -1, s: -1, v: -1, value: '', fraction: {h: -1, s: -1, v: -1}},
        cmyk: {c: -1, m: -1, y: -1, k: -1, value: '', fraction: {c: -1, m: -1, y: -1, k: -1}},
        XYZ: {X: -1, Y: -1, Z: -1, A: -1},
        name: {value: '', closest_named_hex: '', exact_match_name: false},
        contrast: {value: '', contrast: -1},
    };

    c.minified = colorInstance.minify({ hex: true });
    c.hue = colorInstance.hue();
    c.brightness = colorInstance.brightness();
    c.isLight = colorInstance.isLight();
    c.isDark = colorInstance.isDark();
    c.luminance = colorInstance.luminance();
    c.contrast.contrast = colorInstance.contrast();

    c.hex.value = colorInstance.toHex();
    c.hex.clean = colorInstance.toHex().substring(1);

    const rgbObj = colorInstance.toRgb();
    c.rgb.r = rgbObj.r;
    c.rgb.g = rgbObj.g;
    c.rgb.b = rgbObj.b;
    c.rgb.a = rgbObj.a;
    c.rgb.fraction.r = rgbObj.r / 255;
    c.rgb.fraction.g = rgbObj.g / 255;
    c.rgb.fraction.b = rgbObj.b / 255;
    c.rgb.value = colorInstance.toRgbString();

    const hslObj = colorInstance.toHsl();
    c.hsl.h = Math.round(hslObj.h);
    c.hsl.s = Math.round(hslObj.s);
    c.hsl.l = Math.round(hslObj.l);
    c.hsl.a = hslObj.a;
    c.hsl.fraction.h = hslObj.h / 360;
    c.hsl.fraction.s = hslObj.s / 100;
    c.hsl.fraction.l = hslObj.l / 100;
    c.hsl.value = colorInstance.toHslString();

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
    c.cmyk.value = colorInstance.toCmykString();

    const xyzObj = colorInstance.toXyz();
    c.XYZ.X = xyzObj.x;
    c.XYZ.Y = xyzObj.y;
    c.XYZ.Z = xyzObj.z;
    c.XYZ.A = xyzObj.a;

    // Name and contrast
    c.name.value = colorInstance.toName()
    c.name.closest_named_hex = colorInstance.toName({closest: true});
    c.name.exact_match_name = c.name.value === c.name.closest_named_hex;

    c.contrast.value = colorInstance.isLight() ? '#000000' : '#FFFFFF';

    return c;
};

/**
 * Pick a harmony type that produces exactly `count` colors.
 */
const chooseHarmonyType = (count: number, rng: PRNG): HarmonyType | null => {
    const mapping: Record<number, HarmonyType[]> = {
        2: ['complementary'],
        3: ['analogous', 'triadic', 'split-complementary'],
        4: ['tetradic', 'rectangle'],
    };
    const types = mapping[count];
    return types ? types[Math.floor(rng() * types.length)] : null;
};

/**
 * Randomly partition `total` into `parts` non-negative integers.
 */
const randomPartition = (total: number, parts: number, rng: PRNG): number[] => {
    const cuts = Array.from({length: parts - 1}, () =>
        Math.floor(rng() * (total + 1))
    ).sort((a, b) => a - b);
    const counts: number[] = [];
    let prev = 0;
    for (const cut of cuts) {
        counts.push(cut - prev);
        prev = cut;
    }
    counts.push(total - prev);
    return counts;
};

export const generateRandomScheme = async (
    baseHex: string,
    n: number,
    seed: string,
    harmonyType?: HarmonyType | null
): Promise<ColorOutput[]> => {
    const rng = seedrandom(seed) as PRNG;
    const base = colord(baseHex);
    let scheme: string[] = [];

    // 1) Reserve user-specified harmony if it fits
    let reservedHarmonyCount = 0;
    if (harmonyType) {
        const candidate = base.harmonies(harmonyType);
        if (candidate.length <= n) {
            reservedHarmonyCount = candidate.length;
            scheme.push(...candidate.map(c => c.toHex()));
        }
    }

    // 2) Determine remaining slots
    const remaining = n - reservedHarmonyCount;
    let nTints: number;
    let nShades: number;
    let nTones: number;

    if (reservedHarmonyCount === 0) {
        // No fixed harmony: partition into 4 and auto-choose
        const [t, s, t2, h] = randomPartition(n, 4, rng);
        nTints = t;
        nShades = s;
        nTones = t2;

        const autoType = chooseHarmonyType(h, rng);
        if (autoType) {
            scheme.push(...base.harmonies(autoType).map(c => c.toHex()));
        } else {
            const {h: hue, s: sat, l, a} = base.toHsl();
            const step = 360 / Math.max(1, h);
            const fallback = Array.from({length: h}, (_, i) =>
                colord({h: (hue + step * i) % 360, s: sat, l, a}).toHex()
            );
            scheme.push(...fallback);
        }
    } else {
        // Fixed harmony: partition remaining into tints/shades/tones
        [nTints, nShades, nTones] = randomPartition(remaining, 3, rng);
    }

    // 3) Mix tints, shades, and tones
    if (nTints) scheme.push(...base.tints(nTints).map(c => c.toHex()));
    if (nShades) scheme.push(...base.shades(nShades).map(c => c.toHex()));
    if (nTones) scheme.push(...base.tones(nTones).map(c => c.toHex()));

    return await Promise.all(scheme.map((color) => colorMe({color})));
};
