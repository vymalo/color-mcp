
// Type definitions
interface ColorObject {
    [key: string]: number | boolean | undefined;
    is_fraction?: boolean;
}

interface HSLColor extends ColorObject {
    h: number | null;
    s: number | null;
    l: number | null;
}

interface RGBColor extends ColorObject {
    r: number | null;
    g: number | null;
    b: number | null;
}

interface CMYKColor extends ColorObject {
    c: number | null;
    m: number | null;
    y: number | null;
    k: number | null;
}

interface HSVColor extends ColorObject {
    h: number | null;
    s: number | null;
    v: number | null;
}

interface QueryColors {
    hex?: string | null;
    hsl?: string | null;
    rgb?: string | null;
    cmyk?: string | null;
    hsv?: string | null;
}

interface ParsedColors {
    hsl: HSLColor;
    rgb: RGBColor;
    cmyk: CMYKColor;
    hsv: HSVColor;
    hex: string | null;
}

export const parseQueryColors = (q: QueryColors): ParsedColors => {
    const hsl: HSLColor = { h: null, s: null, l: null };
    const rgb: RGBColor = { r: null, g: null, b: null };
    const cmyk: CMYKColor = { c: null, m: null, y: null, k: null };
    const hsv: HSVColor = { h: null, s: null, v: null };
    const hex: string | null = q.hex ? q.hex : null;

    return {
        hsl: maybeSplitParen(q.hsl, hsl),
        rgb: maybeSplitParen(q.rgb, rgb),
        cmyk: maybeSplitParen(q.cmyk, cmyk),
        hsv: maybeSplitParen(q.hsv, hsv),
        hex: hex
    };

    function maybeSplitParen<T extends ColorObject>(str: string | undefined | null, obj: T): T {
        if (str) {
            let s: string[] = str.split('(');
            const k = Object.keys(obj);

            if (s.length > 1) {
                s = s[1].split(')')[0].split(',');
            } else {
                s = s[0].split(',');
            }

            for (let i = 0; i < s.length; i++) {
                if (s[i].split('.').length > 1) {
                    (obj as any)[k[i]] = parseFloat(s[i]);
                    obj.is_fraction = true;
                } else {
                    (obj as any)[k[i]] = parseInt(s[i], 10);
                }
            }
        }
        return obj;
    }
};

export const getRandomHex = (): string => {
    const letters: string[] = '0123456789ABCDEF'.split('');
    let color: string = '#';

    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
};

export const parseUnknownType = (input: string): ParsedColors => {
    const hex: string | null = (input.substring(0, 1) === '#' || input.length === 3 || input.length === 6) ? input : null;
    const cmyk: string | null = input.substring(0, 4).toLowerCase() === 'cmyk' ? input : null;
    const hsl: string | null = input.substring(0, 3).toLowerCase() === 'hsl' ? input : null;
    const hsv: string | null = input.substring(0, 3).toLowerCase() === 'hsv' ? input : null;
    const rgb: string | null = input.substring(0, 3).toLowerCase() === 'rgb' ? input : null;

    return parseQueryColors({
        hex: hex,
        cmyk: cmyk,
        hsl: hsl,
        rgb: rgb,
        hsv: hsv
    });
};