export interface ColorNames {
    colors: Array<{
        name: string;
        r: number;
        g: number;
        b: number;
        hex: string;
        h: number;
        s: number;
        l: number;
    }>;
}

export interface RGBColor {
    r: number;
    g: number;
    b: number;
    is_fraction?: boolean;
}

export interface HSLColor {
    h: number;
    s: number;
    l: number;
    is_fraction?: boolean;
}

export interface HSVColor {
    h: number;
    s: number;
    v: number;
    is_fraction?: boolean;
}

export interface CMYKColor {
    c: number;
    m: number;
    y: number;
    k: number;
    is_fraction?: boolean;
}

export interface ColorInput {
    rgb?: RGBColor;
    hex?: string;
    hsl?: HSLColor;
    hsv?: HSVColor;
    cmyk?: CMYKColor;
}

export interface ColorOutput {
    hex: {
        value: string;
        clean: string;
    };
    rgb: {
        r: number;
        g: number;
        b: number;
        value: string;
        fraction: {
            r: number;
            g: number;
            b: number;
        };
    };
    hsl: {
        h: number;
        s: number;
        l: number;
        value: string;
        fraction: {
            h: number;
            s: number;
            l: number;
        };
    };
    hsv: {
        h: number;
        s: number;
        v: number;
        value: string;
        fraction: {
            h: number;
            s: number;
            v: number;
        };
    };
    cmyk: {
        c: number;
        m: number;
        y: number;
        k: number;
        value: string;
        fraction: {
            c: number;
            m: number;
            y: number;
            k: number;
        };
    };
    XYZ: {
        X: number;
        Y: number;
        Z: number;
        value: string;
        fraction: {
            X: number;
            Y: number;
            Z: number;
        };
    };
    name: {
        value: string;
        closest_named_hex: string;
        exact_match_name: boolean;
        distance: number;
    };
    contrast: {
        value: string;
    };
    image: {
        bare: string;
        named: string;
    };
    _links: {
        self: {
            href: string;
        };
    };
    _embedded: Record<string, any>;
}