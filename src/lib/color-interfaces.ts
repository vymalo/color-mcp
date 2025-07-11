export interface ColorInput {
	color: string;
}

export interface ColorOutput {
	minified: string;
	hue: number;
	brightness: number;
	isLight: boolean;
	isDark: boolean;
	luminance: number;
	hex: {
		value: string;
		clean: string;
	};
	rgb: {
		r: number;
		g: number;
		b: number;
		a: number;
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
		a: number;
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
		A: number;
	};
	name: {
		value?: string;
		closest_named_hex?: string;
		exact_match_name: boolean;
	};
	contrast: {
		value: string;
		contrast: number;
	};
}
