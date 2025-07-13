const fs = require('fs');
const path = require('path');
const pkgPath = path.resolve(__dirname, '../package.json');
const pkg = require(pkgPath);

delete pkg.scripts.prepare; // or .prepare
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');