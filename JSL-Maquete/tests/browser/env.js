// Configuração comum dos scripts de navegador (Playwright + WebGL via SwiftShader).
// O Three.js r128 é servido a partir de vendor/three.min.js, então os scripts rodam offline.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const THREE = fs.readFileSync(path.join(ROOT, 'vendor', 'three.min.js'), 'utf8');
const LAUNCH = { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] };
const fileUrl = p => 'file:///' + path.resolve(p || path.join(ROOT, 'index.html')).replace(/\\/g, '/');
const routeThree = page => page.route('**/three*.js', r => r.fulfill({ contentType: 'application/javascript', body: THREE }));
module.exports = { ROOT, THREE, LAUNCH, fileUrl, routeThree };
