import '../lib/color-extends';
import { registerColorAnalysisTools } from './organized/color-analysis';
import { registerColorManipulationTools } from './organized/color-manipulation';
import { registerColorSchemeGenerationTools } from './organized/color-scheme-generation';
import { registerOutputGenerationTools } from './organized/output-generation';

registerColorManipulationTools();
registerColorSchemeGenerationTools();
registerColorAnalysisTools();
registerOutputGenerationTools();
