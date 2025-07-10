import {CMYKColor, HSLColor, HSVColor, RGBColor} from './color-interfaces';

interface QueryColors {
    hex?: string | null;
    hsl?: string | null;
    rgb?: string | null;
    cmyk?: string | null;
    hsv?: string | null;
}

export interface ParsedColors {
    hsl: HSLColor;
    rgb: RGBColor;
    cmyk: CMYKColor;
    hsv: HSVColor;
    hex: string | null;
}

export const parseQueryColors = (q: QueryColors): ParsedColors => {
    const hsl: HSLColor = {h: 0, s: 0, l: 0, is_fraction: false};
    const rgb: RGBColor = {r: 0, g: 0, b: 0, is_fraction: false};
    const cmyk: CMYKColor = {c: 0, m: 0, y: 0, k: 0, is_fraction: false};
    const hsv: HSVColor = {h: 0, s: 0, v: 0, is_fraction: false};
    const hex: string | null = q.hex ? q.hex : null;

    return {
        hsl: maybeSplitParen(q.hsl, hsl),
        rgb: maybeSplitParen(q.rgb, rgb),
        cmyk: maybeSplitParen(q.cmyk, cmyk),
        hsv: maybeSplitParen(q.hsv, hsv),
        hex: hex
    };

    function maybeSplitParen<T extends RGBColor | HSLColor | HSVColor | CMYKColor>(str: string | undefined | null, obj: T): T {
        if (str) {
            let s: string[] = str.split('(');
            const k = Object.keys(obj).filter(key => key !== 'is_fraction'); // Exclude is_fraction from keys

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
