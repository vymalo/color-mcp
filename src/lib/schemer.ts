import { ColorOutput } from './colored';

// Type definitions for color bounds
interface ColorBound {
    min: number;
    max: number;
    f: number;
}

interface ColorBounds {
    [key: string]: ColorBound;
}

interface AllColorBounds {
    hex: ColorBounds;
    rgb: ColorBounds;
    hsl: ColorBounds;
    hsv: ColorBounds;
    cmy: ColorBounds;
    cmyk: ColorBounds;
    XYZ: ColorBounds;
    Yxy: ColorBounds;
    lab: ColorBounds;
    validate: (type: string, values: any, factorize?: boolean) => any;
}

// Type definitions for color values
interface ColorValues {
    [key: string]: number;
}

interface RGBValues {
    r: number;
    g: number;
    b: number;
}

interface HSLValues {
    h: number;
    s: number;
    l: number;
}

interface HSVValues {
    h: number;
    s: number;
    v: number;
}

interface CMYValues {
    c: number;
    m: number;
    y: number;
}

interface CMYKValues {
    c: number;
    m: number;
    y: number;
    k: number;
}

interface XYZValues {
    X: number;
    Y: number;
    Z: number;
}

interface YxyValues {
    Y: number;
    x: number;
    y: number;
}

interface LabValues {
    l: number;
    a: number;
    b: number;
}

// Type definitions for conversion functions
interface BaseConversions {
    'rgb-to-rgb': (values: RGBValues) => RGBValues;
    'hex-to-rgb': (values: RGBValues) => RGBValues;
    'rgb-to-hex': (values: RGBValues) => RGBValues;
    'rgb-to-fgc': (values: RGBValues) => RGBValues;
    'hsl-to-rgb': (values: HSLValues) => RGBValues;
    'rgb-to-hsl': (values: RGBValues) => HSLValues;
    'hsv-to-rgb': (values: HSVValues) => RGBValues;
    'rgb-to-hsv': (values: RGBValues) => HSVValues;
    'cmy-to-rgb': (values: CMYValues) => RGBValues;
    'rgb-to-cmy': (values: RGBValues) => CMYValues;
    'cmyk-to-rgb': (values: CMYKValues) => RGBValues;
    'rgb-to-cmyk': (values: RGBValues) => CMYKValues;
    'XYZ-to-rgb': (values: XYZValues) => RGBValues;
    'rgb-to-XYZ': (values: RGBValues) => XYZValues;
    'Yxy-to-rgb': (values: YxyValues) => RGBValues;
    'rgb-to-Yxy': (values: RGBValues) => YxyValues;
    'lab-to-rgb': (values: LabValues) => RGBValues;
    'rgb-to-lab': (values: RGBValues) => LabValues;
}

// Type definitions for stringlify functions
interface StringlifyFunctions {
    tags: (tag: string | null, str: string) => string;
    rgb: (values: RGBValues, tag?: string | null) => string;
    hex: (values: RGBValues, tag?: string | null) => string;
    fgc: (values: RGBValues, tag?: string | null) => string;
    hsl: (values: HSLValues, tag?: string | null) => string;
    hsv: (values: HSVValues, tag?: string | null) => string;
    cmy: (values: CMYValues, tag?: string | null) => string;
    cmyk: (values: CMYKValues, tag?: string | null) => string;
    XYZ: (values: XYZValues, tag?: string | null) => string;
    Yxy: (values: YxyValues, tag?: string | null) => string;
    lab: (values: LabValues, tag?: string | null) => string;
}

// Type definitions for scheme configuration
interface SchemeConfig {
    ratio: number;
    h: {
        mode: 'global' | 'fixed' | 'uniform' | 'single';
        origin: (value: number, seed: number) => number;
    };
    s: {
        mode: 'global' | 'fixed' | 'uniform' | 'single';
        origin: (value: number, seed: number) => number;
    };
    l: {
        mode: 'global' | 'fixed' | 'uniform' | 'single';
        origin: (value: number, seed: number) => number;
    };
}

interface SchemeDefinitions {
    [key: string]: SchemeConfig[];
    monochrome: SchemeConfig[];
    'monochrome-light': SchemeConfig[];
    'monochrome-dark': SchemeConfig[];
    analogic: SchemeConfig[];
    complement: SchemeConfig[];
    'analogic-complement': SchemeConfig[];
    triad: SchemeConfig[];
    quad: SchemeConfig[];
    generate: (mode: string, colors: ColorOutput[], seed: ColorOutput) => ColorOutput[];
}

// Type definitions for scheme result
interface SchemeResult {
    mode: string;
    count: number;
    colors: ColorOutput[];
    seed: ColorOutput;
    image: {
        bare: string;
        named: string;
    };
    _links: {
        self: string;
        schemes: {
            [key: string]: string;
        };
    };
    _embedded: Record<string, any>;
}

// Type definitions for schemer methods
interface SchemerMethods {
    bounds: AllColorBounds;
    base: BaseConversions;
    stringlify: StringlifyFunctions;
    scheme: SchemeDefinitions;
}

// Export function
export const getScheme = (mode: string, count: number, seed: ColorOutput): SchemeResult => {
    const c: SchemeResult = {
        mode: mode,
        count: count,
        colors: [],
        seed: seed,
        image: {
            bare: 'https://www.thecolorapi.com/scheme?format=svg&named=false&hex=' + seed.hex.clean + '&mode=' + mode + '&count=' + count,
            named: 'https://www.thecolorapi.com/scheme?format=svg&hex=' + seed.hex.clean + '&mode=' + mode + '&count=' + count
        },
        _links: {
            self: '/scheme?hex=' + seed.hex.clean + '&mode=' + mode + '&count=' + count,
            schemes: {
                monochrome: '/scheme?hex=' + seed.hex.clean + '&mode=monochrome&count=' + count,
                "monochrome-dark": '/scheme?hex=' + seed.hex.clean + '&mode=monochrome-dark&count=' + count,
                "monochrome-light": '/scheme?hex=' + seed.hex.clean + '&mode=monochrome-light&count=' + count,
                analogic: '/scheme?hex=' + seed.hex.clean + '&mode=analogic&count=' + count,
                complement: '/scheme?hex=' + seed.hex.clean + '&mode=complement&count=' + count,
                "analogic-complement": '/scheme?hex=' + seed.hex.clean + '&mode=analogic-complement&count=' + count,
                triad: '/scheme?hex=' + seed.hex.clean + '&mode=triad&count=' + count,
                quad: '/scheme?hex=' + seed.hex.clean + '&mode=quad&count=' + count
            }
        },
        _embedded: {}
    };

    const colors: ColorOutput[] = [];
    for (let i = count - 1; i >= 0; i--) {
        colors.push(seed);
    }
    c.colors = schemer.scheme.generate(mode, colors, seed);
    return c;
};

// Adapted from https://github.com/Zaku-eu/colourco.de/
export const methods: SchemerMethods = {
    bounds: {
        hex: {
            r: {
                min: 0,
                max: 1,
                f: 255
            },
            g: {
                min: 0,
                max: 1,
                f: 255
            },
            b: {
                min: 0,
                max: 1,
                f: 255
            }
        },
        rgb: {
            r: {
                min: 0,
                max: 1,
                f: 255
            },
            g: {
                min: 0,
                max: 1,
                f: 255
            },
            b: {
                min: 0,
                max: 1,
                f: 255
            }
        },
        hsl: {
            h: {
                min: 0,
                max: 1,
                f: 360
            },
            s: {
                min: 0,
                max: 1,
                f: 100
            },
            l: {
                min: 0,
                max: 1,
                f: 100
            }
        },
        hsv: {
            h: {
                min: 0,
                max: 1,
                f: 360
            },
            s: {
                min: 0,
                max: 1,
                f: 100
            },
            v: {
                min: 0,
                max: 1,
                f: 100
            }
        },
        cmy: {
            c: {
                min: 0,
                max: 1,
                f: 100
            },
            m: {
                min: 0,
                max: 1,
                f: 100
            },
            y: {
                min: 0,
                max: 1,
                f: 100
            }
        },
        cmyk: {
            c: {
                min: 0,
                max: 1,
                f: 100
            },
            m: {
                min: 0,
                max: 1,
                f: 100
            },
            y: {
                min: 0,
                max: 1,
                f: 100
            },
            k: {
                min: 0,
                max: 1,
                f: 100
            }
        },
        XYZ: {
            X: {
                min: 0,
                max: 0.95047,
                f: 100
            },
            Y: {
                min: 0,
                max: 1.00000,
                f: 100
            },
            Z: {
                min: 0,
                max: 1.08883,
                f: 100
            }
        },
        Yxy: {
            Y: {
                min: 0,
                max: 1,
                f: 100
            },
            x: {
                min: 0,
                max: 1,
                f: 100
            },
            y: {
                min: 0,
                max: 1,
                f: 100
            }
        },
        lab: {
            l: {
                min: 0,
                max: 1,
                f: 100
            },
            a: {
                min: -1,
                max: 1,
                f: 100
            },
            b: {
                min: -1,
                max: 1,
                f: 100
            }
        },
        validate: function (type: string, values: ColorValues, factorize: boolean = false): ColorValues {
            const result: ColorValues = {};
            const bounds = methods.bounds[type] as ColorBounds;

            for (const key in bounds) {
                const b = bounds[key];
                if (factorize === true) {
                    result[key] = Math.max(b.min * b.f, Math.min(b.max * b.f, Math.round(values[key] * b.f)));
                } else {
                    result[key] = Math.max(b.min, Math.min(b.max, values[key]));
                }
            }
            return result;
        }
    },
    base: {
        "rgb-to-rgb": function (values: RGBValues): RGBValues {
            return methods.bounds.validate("rgb", values) as RGBValues;
        },
        "hex-to-rgb": function (values: RGBValues): RGBValues {
            return methods.bounds.validate("rgb", values) as RGBValues;
        },
        "rgb-to-hex": function (values: RGBValues): RGBValues {
            return methods.bounds.validate("rgb", values) as RGBValues;
        },
        "rgb-to-fgc": function (values: RGBValues): RGBValues {
            const rgb = methods.bounds.validate("rgb", values) as RGBValues;
            let m = 96 / 255;
            if (Math.max(rgb.r, rgb.g, rgb.b) > 1 - m) {
                m *= -1;
            }
            return methods.bounds.validate("rgb", {
                r: rgb.r + m,
                g: rgb.g + m,
                b: rgb.b + m
            }) as RGBValues;
        },
        "hsl-to-rgb": function (values: HSLValues): RGBValues {
            const hsl = methods.bounds.validate("hsl", values) as HSLValues;
            hsl.h = hsl.h % 1;

            const H = hsl.h * 6.0;
            const C = (1 - Math.abs(2 * hsl.l - 1)) * hsl.s;
            const X = C * (1 - Math.abs(H % 2 - 1));
            let r = 0, g = 0, b = 0;

            if (((0 <= H && H < 1)) || ((5 <= H && H < 6))) {
                r = C;
            }
            if (((1 <= H && H < 2)) || ((4 <= H && H < 5))) {
                r = X;
            }
            if ((1 <= H && H < 3)) {
                g = C;
            }
            if (((0 <= H && H < 1)) || ((3 <= H && H < 4))) {
                g = X;
            }
            if ((3 <= H && H < 5)) {
                b = C;
            }
            if (((2 <= H && H < 3)) || ((5 <= H && H < 6))) {
                b = X;
            }

            const m = hsl.l - 0.5 * C;
            return methods.bounds.validate("rgb", {
                r: r + m,
                g: g + m,
                b: b + m
            }) as RGBValues;
        },
        "rgb-to-hsl": function (values: RGBValues): HSLValues {
            const rgb = methods.bounds.validate("rgb", values) as RGBValues;
            const a = Math.min(rgb.r, rgb.g, rgb.b);
            const z = Math.max(rgb.r, rgb.g, rgb.b);
            const d = z - a;
            const l = (z + a) / 2;
            let h = 0, s = 0;

            if (d > 0) {
                s = d / (l < 0.5 ? z + a : 2 - z - a);
                const d2 = d / 2;
                const dr = (((z - rgb.r) / 6) + d2) / d;
                const dg = (((z - rgb.g) / 6) + d2) / d;
                const db = (((z - rgb.b) / 6) + d2) / d;

                if (rgb.r === z) {
                    h = (0 / 3) + db - dg;
                } else if (rgb.g === z) {
                    h = (1 / 3) + dr - db;
                } else if (rgb.b === z) {
                    h = (2 / 3) + dg - dr;
                }

                if (h < 0) {
                    h += 1;
                }
                if (h >= 1) {
                    h -= 1;
                }
            }

            return methods.bounds.validate("hsl", {
                h: h,
                s: s,
                l: l
            }) as HSLValues;
        },
        "hsv-to-rgb": function (values: HSVValues): RGBValues {
            const hsv = methods.bounds.validate("hsv", values) as HSVValues;
            hsv.h = hsv.h % 1;

            let r = hsv.v, g = hsv.v, b = hsv.v;

            if (hsv.s > 0) {
                const H = hsv.h * 6;
                const vi = Math.round(H);
                const v1 = hsv.v * (1 - hsv.s);
                const v2 = hsv.v * (1 - hsv.s * (H - vi));
                const v3 = hsv.v * (1 - hsv.s * (1 - (H - vi)));

                if (((0 <= H && H < 1)) || ((5 <= H && H < 6))) {
                    r = hsv.v;
                }
                if ((2 <= H && H < 4)) {
                    r = v1;
                }
                if ((1 <= H && H < 2)) {
                    r = v2;
                }
                if ((4 <= H && H < 5)) {
                    r = v3;
                }
                if ((1 <= H && H < 3)) {
                    g = hsv.v;
                }
                if ((4 <= H && H < 6)) {
                    g = v1;
                }
                if ((3 <= H && H < 4)) {
                    g = v2;
                }
                if ((0 <= H && H < 1)) {
                    g = v3;
                }
                if ((3 <= H && H < 5)) {
                    b = hsv.v;
                }
                if ((0 <= H && H < 2)) {
                    b = v1;
                }
                if ((5 <= H && H < 6)) {
                    b = v2;
                }
                if ((2 <= H && H < 3)) {
                    b = v3;
                }
            }

            return methods.bounds.validate("rgb", {
                r: r,
                g: g,
                b: b
            }) as RGBValues;
        },
        "rgb-to-hsv": function (values: RGBValues): HSVValues {
            const rgb = methods.bounds.validate("rgb", values) as RGBValues;
            const a = Math.min(rgb.r, rgb.g, rgb.b);
            const z = Math.max(rgb.r, rgb.g, rgb.b);
            const d = z - a;
            const v = z;
            let h = 0, s = 0;

            if (d > 0) {
                s = d / z;
                const d2 = d / 2;
                const dr = (((z - rgb.r) / 6) + d2) / d;
                const dg = (((z - rgb.g) / 6) + d2) / d;
                const db = (((z - rgb.b) / 6) + d2) / d;

                if (rgb.r === z) {
                    h = (0 / 3) + db - dg;
                } else if (rgb.g === z) {
                    h = (1 / 3) + dr - db;
                } else if (rgb.b === z) {
                    h = (2 / 3) + dg - dr;
                }

                if (h < 0) {
                    h += 1;
                }
                if (h >= 1) {
                    h -= 1;
                }
            }

            return methods.bounds.validate("hsv", {
                h: h,
                s: s,
                v: v
            }) as HSVValues;
        },
        "cmy-to-rgb": function (values: CMYValues): RGBValues {
            const cmy = methods.bounds.validate("cmy", values) as CMYValues;
            const r = 1 - cmy.c;
            const g = 1 - cmy.m;
            const b = 1 - cmy.y;

            return methods.bounds.validate("rgb", {
                r: r,
                g: g,
                b: b
            }) as RGBValues;
        },
        "rgb-to-cmy": function (values: RGBValues): CMYValues {
            const rgb = methods.bounds.validate("rgb", values) as RGBValues;
            const c = 1 - rgb.r;
            const m = 1 - rgb.g;
            const y = 1 - rgb.b;

            return methods.bounds.validate("cmy", {
                c: c,
                m: m,
                y: y
            }) as CMYValues;
        },
        "cmyk-to-rgb": function (values: CMYKValues): RGBValues {
            const cmyk = methods.bounds.validate("cmyk", values) as CMYKValues;
            const c = cmyk.c * (1 - cmyk.k) + cmyk.k;
            const m = cmyk.m * (1 - cmyk.k) + cmyk.k;
            const y = cmyk.y * (1 - cmyk.k) + cmyk.k;

            return methods.base["cmy-to-rgb"]({
                c: c,
                m: m,
                y: y
            });
        },
        "rgb-to-cmyk": function (values: RGBValues): CMYKValues {
            const cmy = methods.base["rgb-to-cmy"](values);
            const k = Math.min(1, cmy.c, cmy.m, cmy.y);
            let c = cmy.c;
            let m = cmy.m;
            let y = cmy.y;

            if (k > 0.997) {
                c = 0;
                m = 0;
                y = 0;
            }

            if (k > 0.003) {
                c = (cmy.c - k) / (1 - k);
                m = (cmy.m - k) / (1 - k);
                y = (cmy.y - k) / (1 - k);
            }

            return methods.bounds.validate("cmyk", {
                c: c,
                m: m,
                y: y,
                k: k
            }) as CMYKValues;
        },
        "XYZ-to-rgb": function (values: XYZValues): RGBValues {
            const XYZ = methods.bounds.validate("XYZ", values) as XYZValues;
            let r = XYZ.X * 3.2406 + XYZ.Y * -1.5372 + XYZ.Z * -0.4986;
            let g = XYZ.X * -0.9689 + XYZ.Y * 1.8758 + XYZ.Z * 0.0415;
            let b = XYZ.X * 0.0557 + XYZ.Y * -0.2040 + XYZ.Z * 1.0570;

            r = r > 0.0031308 ? 1.055 * Math.pow(r, (1 / 2.4)) - 0.055 : 12.92 * r;
            g = g > 0.0031308 ? 1.055 * Math.pow(g, (1 / 2.4)) - 0.055 : 12.92 * g;
            b = b > 0.0031308 ? 1.055 * Math.pow(b, (1 / 2.4)) - 0.055 : 12.92 * b;

            return methods.bounds.validate("rgb", {
                r: r,
                g: g,
                b: b
            }) as RGBValues;
        },
        "rgb-to-XYZ": function (values: RGBValues): XYZValues {
            const rgb = methods.bounds.validate("rgb", values) as RGBValues;
            const r = rgb.r > 0.04045 ? Math.pow((rgb.r + 0.055) / 1.055, 2.4) : rgb.r / 12.92;
            const g = rgb.g > 0.04045 ? Math.pow((rgb.g + 0.055) / 1.055, 2.4) : rgb.g / 12.92;
            const b = rgb.b > 0.04045 ? Math.pow((rgb.b + 0.055) / 1.055, 2.4) : rgb.b / 12.92;

            const X = r * 0.4124 + g * 0.3576 + b * 0.1805;
            const Y = r * 0.2126 + g * 0.7152 + b * 0.0722;
            const Z = r * 0.0193 + g * 0.1192 + b * 0.9505;

            return methods.bounds.validate("XYZ", {
                X: X,
                Y: Y,
                Z: Z
            }) as XYZValues;
        },
        "Yxy-to-rgb": function (values: YxyValues): RGBValues {
            const Yxy = methods.bounds.validate("Yxy", values) as YxyValues;
            const X = Yxy.x * (Yxy.Y / Yxy.y);
            const Y = Yxy.Y;
            const Z = (1 - Yxy.x - Yxy.y) * (Yxy.Y / Yxy.y);

            return methods.base["XYZ-to-rgb"]({
                X: X,
                Y: Y,
                Z: Z
            });
        },
        "rgb-to-Yxy": function (values: RGBValues): YxyValues {
            const rgb = methods.bounds.validate("rgb", values) as RGBValues;
            const XYZ = methods.base["rgb-to-XYZ"](rgb);
            let x = 1, y = 1;

            if (!(XYZ.X === XYZ.Y && XYZ.Y === XYZ.Z && XYZ.Z === 0)) {
                x = XYZ.X / (XYZ.X + XYZ.Y + XYZ.Z);
                y = XYZ.Y / (XYZ.X + XYZ.Y + XYZ.Z);
            }

            return methods.bounds.validate("Yxy", {
                Y: XYZ.Y,
                x: x,
                y: y
            }) as YxyValues;
        },
        "lab-to-rgb": function (values: LabValues): RGBValues {
            const lab = methods.bounds.validate("lab", values) as LabValues;
            let Y = (lab.l + 16) / 116;
            let X = lab.a / 500 + Y;
            let Z = Y - lab.b / 200;

            X = Math.pow(X, 3) > 0.008856 ? Math.pow(X, 3) : (X - 16 / 116) / 7.787;
            Z = Math.pow(Z, 3) > 0.008856 ? Math.pow(Z, 3) : (Z - 16 / 116) / 7.787;
            Y = Math.pow(Y, 3) > 0.008856 ? Math.pow(Y, 3) : (Y - 16 / 116) / 7.787;

            X *= methods.bounds.XYZ.X.max;
            Y *= methods.bounds.XYZ.Y.max;
            Z *= methods.bounds.XYZ.Z.max;

            return methods.base["XYZ-to-rgb"]({
                X: X,
                Y: Y,
                Z: Z
            });
        },
        "rgb-to-lab": function (values: RGBValues): LabValues {
            const rgb = methods.bounds.validate("rgb", values) as RGBValues;
            const XYZ = methods.base["rgb-to-XYZ"](values);
            let X = XYZ.X / methods.bounds.XYZ.X.max;
            let Y = XYZ.Y / methods.bounds.XYZ.Y.max;
            let Z = XYZ.Z / methods.bounds.XYZ.Z.max;

            X = X > 0.008856 ? Math.pow(X, (1 / 3)) : (7.787 * X) + (16 / 116);
            Y = Y > 0.008856 ? Math.pow(Y, (1 / 3)) : (7.787 * Y) + (16 / 116);
            Z = Z > 0.008856 ? Math.pow(Z, (1 / 3)) : (7.787 * Z) + (16 / 116);

            const l = (116 * Y) - 16;
            const a = 500 * (X - Y);
            const b = 200 * (Y - Z);

            return methods.bounds.validate("lab", {
                l: l,
                a: a,
                b: b
            }) as LabValues;
        }
    },
    stringlify: {
        tags: function (tag: string | null, str: string): string {
            let ot = "", ct = "";
            if (tag && tag.length > 0) {
                ot = "<" + tag + ">";
                ct = "</" + tag + ">";
            }
            return str.replace(/\[/g, ot).replace(/\]/g, ct);
        },
        rgb: function (values: RGBValues, tag: string | null = null): string {
            const rgb = methods.bounds.validate("rgb", values, true) as RGBValues;
            return methods.stringlify.tags(tag, "rgb([" + rgb.r + "], [" + rgb.g + "], [" + rgb.b + "])");
        },
        hex: function (values: RGBValues, tag: string | null = null): string {
            const hex = methods.bounds.validate("rgb", values, true) as RGBValues;
            let r = hex.r.toString(16);
            let g = hex.g.toString(16);
            let b = hex.b.toString(16);

            if (hex.r < 16) {
                r = "0" + r;
            }
            if (hex.g < 16) {
                g = "0" + g;
            }
            if (hex.b < 16) {
                b = "0" + b;
            }

            return methods.stringlify.tags(tag, "#[" + r + "][" + g + "][" + b + "]");
        },
        fgc: function (values: RGBValues, tag: string | null = null): string {
            const fgc = methods.bounds.validate("rgb", values, true) as RGBValues;
            return methods.stringlify.tags(tag, "rgb([" + fgc.r + "], [" + fgc.g + "], [" + fgc.b + "])");
        },
        hsl: function (values: HSLValues, tag: string | null = null): string {
            const hsl = methods.bounds.validate("hsl", values, true) as HSLValues;
            return methods.stringlify.tags(tag, "hsl([" + hsl.h + "], [" + hsl.s + "]%, [" + hsl.l + "]%)");
        },
        hsv: function (values: HSVValues, tag: string | null = null): string {
            const hsv = methods.bounds.validate("hsv", values, true) as HSVValues;
            return methods.stringlify.tags(tag, "hsv([" + hsv.h + "], [" + hsv.s + "]%, [" + hsv.v + "]%)");
        },
        cmy: function (values: CMYValues, tag: string | null = null): string {
            const cmy = methods.bounds.validate("cmy", values, true) as CMYValues;
            return methods.stringlify.tags(tag, "cmy([" + cmy.c + "], [" + cmy.m + "], [" + cmy.y + "])");
        },
        cmyk: function (values: CMYKValues, tag: string | null = null): string {
            const cmyk = methods.bounds.validate("cmyk", values, true) as CMYKValues;
            return methods.stringlify.tags(tag, "cmyk([" + cmyk.c + "], [" + cmyk.m + "], [" + cmyk.y + "], [" + cmyk.k + "])");
        },
        XYZ: function (values: XYZValues, tag: string | null = null): string {
            const XYZ = methods.bounds.validate("XYZ", values, true) as XYZValues;
            return methods.stringlify.tags(tag, "XYZ([" + XYZ.X + "], [" + XYZ.Y + "], [" + XYZ.Z + "])");
        },
        Yxy: function (values: YxyValues, tag: string | null = null): string {
            const Yxy = methods.bounds.validate("Yxy", values, true) as YxyValues;
            return methods.stringlify.tags(tag, "Yxy([" + Yxy.Y + "]%, [" + Yxy.x + "]%, [" + Yxy.y + "]%)");
        },
        lab: function (values: LabValues, tag: string | null = null): string {
            const lab = methods.bounds.validate("lab", values, true) as LabValues;
            return methods.stringlify.tags(tag, "lab([" + lab.l + "], [" + lab.a + "], [" + lab.b + "])");
        }
    },
    scheme: {
        "monochrome": [
            {
                ratio: 1,
                h: {
                    "mode": "global",
                    origin: function (value: number, seed: number): number {
                        return value;
                    }
                },
                s: {
                    "mode": "single",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.1;
                    }
                },
                l: {
                    "mode": "uniform",
                    origin: function (value: number, seed: number): number {
                        return value + seed;
                    }
                }
            }
        ],
        "monochrome-light": [
            {
                ratio: 0.4,
                h: {
                    "mode": "fixed",
                    origin: function (value: number, seed: number): number {
                        return 0;
                    }
                },
                s: {
                    "mode": "fixed",
                    origin: function (value: number, seed: number): number {
                        return 0;
                    }
                },
                l: {
                    "mode": "uniform",
                    origin: function (value: number, seed: number): number {
                        return value + seed;
                    }
                }
            }, {
                ratio: 0.6,
                h: {
                    "mode": "global",
                    origin: function (value: number, seed: number): number {
                        return value;
                    }
                },
                s: {
                    "mode": "single",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.1;
                    }
                },
                l: {
                    "mode": "uniform",
                    origin: function (value: number, seed: number): number {
                        return value + seed;
                    }
                }
            }
        ],
        "monochrome-dark": [
            {
                ratio: 0.6,
                h: {
                    "mode": "global",
                    origin: function (value: number, seed: number): number {
                        return value;
                    }
                },
                s: {
                    "mode": "single",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.1;
                    }
                },
                l: {
                    "mode": "uniform",
                    origin: function (value: number, seed: number): number {
                        return value + seed;
                    }
                }
            }, {
                ratio: 0.4,
                h: {
                    "mode": "fixed",
                    origin: function (value: number, seed: number): number {
                        return 0;
                    }
                },
                s: {
                    "mode": "fixed",
                    origin: function (value: number, seed: number): number {
                        return 0;
                    }
                },
                l: {
                    "mode": "uniform",
                    origin: function (value: number, seed: number): number {
                        return value + seed;
                    }
                }
            }
        ],
        "analogic": [
            {
                ratio: 1,
                h: {
                    "mode": "uniform",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.5;
                    }
                },
                s: {
                    "mode": "global",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.1;
                    }
                },
                l: {
                    "mode": "uniform",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.1;
                    }
                }
            }
        ],
        "complement": [
            {
                ratio: 0.4,
                h: {
                    "mode": "global",
                    origin: function (value: number, seed: number): number {
                        return value + 0.5;
                    }
                },
                s: {
                    "mode": "single",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.25;
                    }
                },
                l: {
                    "mode": "uniform",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.25;
                    }
                }
            }, {
                ratio: 0.6,
                h: {
                    "mode": "global",
                    origin: function (value: number, seed: number): number {
                        return value;
                    }
                },
                s: {
                    "mode": "single",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.25;
                    }
                },
                l: {
                    "mode": "uniform",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.25;
                    }
                }
            }
        ],
        "analogic-complement": [
            {
                ratio: 0.4,
                h: {
                    "mode": "global",
                    origin: function (value: number, seed: number): number {
                        return value + 0.5;
                    }
                },
                s: {
                    "mode": "single",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.5;
                    }
                },
                l: {
                    "mode": "uniform",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.5;
                    }
                }
            }, {
                ratio: 0.6,
                h: {
                    "mode": "uniform",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.75;
                    }
                },
                s: {
                    "mode": "single",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.1;
                    }
                },
                l: {
                    "mode": "global",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.1;
                    }
                }
            }
        ],
        "triad": [
            {
                ratio: 0.33,
                h: {
                    "mode": "global",
                    origin: function (value: number, seed: number): number {
                        return value + 0.33;
                    }
                },
                s: {
                    "mode": "single",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.2;
                    }
                },
                l: {
                    "mode": "uniform",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.2;
                    }
                }
            }, {
                ratio: 0.33,
                h: {
                    "mode": "global",
                    origin: function (value: number, seed: number): number {
                        return value + 0.66;
                    }
                },
                s: {
                    "mode": "single",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.2;
                    }
                },
                l: {
                    "mode": "uniform",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.2;
                    }
                }
            }, {
                ratio: 0.34,
                h: {
                    "mode": "global",
                    origin: function (value: number, seed: number): number {
                        return value;
                    }
                },
                s: {
                    "mode": "single",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.2;
                    }
                },
                l: {
                    "mode": "uniform",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.2;
                    }
                }
            }
        ],
        "quad": [
            {
                ratio: 0.25,
                h: {
                    "mode": "global",
                    origin: function (value: number, seed: number): number {
                        return value + 0.25;
                    }
                },
                s: {
                    "mode": "single",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.15;
                    }
                },
                l: {
                    "mode": "uniform",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.15;
                    }
                }
            }, {
                ratio: 0.25,
                h: {
                    "mode": "global",
                    origin: function (value: number, seed: number): number {
                        return value + 0.5;
                    }
                },
                s: {
                    "mode": "single",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.15;
                    }
                },
                l: {
                    "mode": "uniform",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.15;
                    }
                }
            }, {
                ratio: 0.25,
                h: {
                    "mode": "global",
                    origin: function (value: number, seed: number): number {
                        return value + 0.75;
                    }
                },
                s: {
                    "mode": "single",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.15;
                    }
                },
                l: {
                    "mode": "uniform",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.15;
                    }
                }
            }, {
                ratio: 0.25,
                h: {
                    "mode": "global",
                    origin: function (value: number, seed: number): number {
                        return value;
                    }
                },
                s: {
                    "mode": "single",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.15;
                    }
                },
                l: {
                    "mode": "uniform",
                    origin: function (value: number, seed: number): number {
                        return value + seed * 0.15;
                    }
                }
            }
        ],
        generate: function (mode: string, colors: ColorOutput[], seed: ColorOutput): ColorOutput[] {
            // This function would need to be implemented based on the original JavaScript logic
            // The truncated content doesn't show the complete implementation
            return colors;
        }
    }
};

// Create a reference to the schemer object for backwards compatibility
const schemer = methods;

// Export the schemer object as default
export default schemer;