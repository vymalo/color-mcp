import { colord } from 'colord';

// ────────────────────────────────────────────────────────────
// Shared helper utilities
// ────────────────────────────────────────────────────────────
export type Hex = `#${string}`;

export type Swatch = {
	hex: Hex;
	role: string; // e.g. "primary‑60"
	onColor: '#000000' | '#FFFFFF';
	contrast: number; // against onColor
};

export type Palette = Record<string, Swatch[]>;

/** Rotate a hue by n degrees in HSL space and return hex. */
export function rotateHue(seed: string, offsetDeg: number): Hex {
	const base = colord(seed);
	return base.hue((base.hue() + offsetDeg + 360) % 360).toHex() as Hex;
}

export function harmony(
	seed: string,
	mode: 'analogous' | 'complementary' | 'triadic' | 'tetradic',
): Hex[] {
	switch (mode) {
		case 'analogous':
			return [-30, 0, 30].map((d) => rotateHue(seed, d));
		case 'complementary':
			return [0, 180].map((d) => rotateHue(seed, d));
		case 'triadic':
			return [0, 120, 240].map((d) => rotateHue(seed, d));
		case 'tetradic':
			return [0, 90, 180, 270].map((d) => rotateHue(seed, d));
	}
}

export function toneRamp(hex: string): Swatch[] {
	const baseLch = colord(hex).toLch();
	const ramp: Swatch[] = [];
	const tones = [95, 90, 80, 70, 60, 50, 40, 30, 20, 10, 5];

	tones.forEach((tone) => {
		const swatchHex = colord({ l: tone, c: baseLch.c, h: baseLch.h }).toHex();
		const onColor = colord(swatchHex).isLight() ? '#000000' : '#FFFFFF';
		const contrast = colord(swatchHex).contrast(onColor);

		ramp.push({
			hex: swatchHex as Hex,
			role: `${Math.round(tone)}`,
			onColor: onColor as '#000000' | '#FFFFFF',
			contrast: Number(contrast.toFixed(2)),
		});
	});
	return ramp;
}

export function generatePalette(
	seed: string,
	mode: 'analogous' | 'complementary' | 'triadic' | 'tetradic' = 'analogous',
): Palette {
	const hues = harmony(seed, mode);
	const names = ['primary', 'secondary', 'tertiary', 'quaternary'];
	const palette: Palette = {};

	hues.forEach((hex, i) => {
		palette[names[i]] = toneRamp(hex);
	});
	return palette;
}

export function deltaE76(a: Hex, b: Hex): number {
	const labA = colord(a).toLab();
	const labB = colord(b).toLab();
	const dL = labA.l - labB.l;
	const dA = labA.a - labB.a;
	const dB = labA.b - labB.b;
	return Math.sqrt(dL * dL + dA * dA + dB * dB);
}

export function paletteToCssVars(palette: Palette): string {
	const lines: string[] = [':root {'];
	Object.entries(palette).forEach(([role, swatches]) => {
		swatches.forEach((s) => {
			lines.push(`  --${role}-${s.role}: ${s.hex};`);
		});
	});
	lines.push('}');
	return lines.join('\n');
}

export function paletteToScssMap(palette: Palette): string {
	const lines: string[] = ['$palette: (']; // open map
	Object.entries(palette).forEach(([role, swatches]) => {
		lines.push(`  ${role}: (`);
		swatches.forEach((s) => {
			lines.push(`    ${s.role}: ${s.hex},`);
		});
		lines.push('  ),');
	});
	lines.push(');');
	return lines.join('\n');
}
