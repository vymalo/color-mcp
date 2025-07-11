import {extend} from "colord";
import mixPlugin from "colord/plugins/mix";
import harmoniesPlugin from "colord/plugins/harmonies";
import a11yPlugin from "colord/plugins/a11y";
import labPlugin from "colord/plugins/lab";
import minifyPlugin from "colord/plugins/minify";
import namesPlugin from "colord/plugins/names";
import lchPlugin from "colord/plugins/lch";
import xyzPlugin from "colord/plugins/xyz";
import hwbPlugin from "colord/plugins/hwb";
import cmykPlugin from "colord/plugins/cmyk";

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
