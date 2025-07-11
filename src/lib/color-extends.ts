import { extend } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';
import cmykPlugin from 'colord/plugins/cmyk';
import harmoniesPlugin from 'colord/plugins/harmonies';
import hwbPlugin from 'colord/plugins/hwb';
import labPlugin from 'colord/plugins/lab';
import lchPlugin from 'colord/plugins/lch';
import minifyPlugin from 'colord/plugins/minify';
import mixPlugin from 'colord/plugins/mix';
import namesPlugin from 'colord/plugins/names';
import xyzPlugin from 'colord/plugins/xyz';

extend([
	mixPlugin,
	harmoniesPlugin,
	a11yPlugin,
	labPlugin,
	minifyPlugin,
	namesPlugin,
	lchPlugin,
	xyzPlugin,
	hwbPlugin,
	cmykPlugin,
]);
