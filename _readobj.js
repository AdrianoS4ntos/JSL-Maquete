// Lê objetos git soltos (loose) via zlib, sem usar o binário git.
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const GIT = path.join(__dirname, '.git');
function read(sha) {
  const p = path.join(GIT, 'objects', sha.slice(0, 2), sha.slice(2));
  if (!fs.existsSync(p)) throw new Error('objeto não solto (possivelmente em pack): ' + sha);
  const buf = zlib.inflateSync(fs.readFileSync(p));
  const nul = buf.indexOf(0);
  const [type] = buf.slice(0, nul).toString().split(' ');
  return { type, body: buf.slice(nul + 1) };
}
function tree(sha) {
  const { body } = read(sha); const out = {}; let i = 0;
  while (i < body.length) {
    const sp = body.indexOf(32, i), nul = body.indexOf(0, sp);
    const mode = body.slice(i, sp).toString(), name = body.slice(sp + 1, nul).toString('utf8');
    out[name] = { mode, sha: body.slice(nul + 1, nul + 21).toString('hex') }; i = nul + 21;
  }
  return out;
}
function fileAt(commit, rel) {
  let t = read(commit).body.toString().match(/^tree ([0-9a-f]{40})/m)[1];
  const parts = rel.split('/');
  for (let k = 0; k < parts.length; k++) {
    const e = tree(t)[parts[k]]; if (!e) throw new Error('não encontrado: ' + rel);
    if (k === parts.length - 1) return read(e.sha).body; t = e.sha;
  }
}
const [mode, commit, ...files] = process.argv.slice(2);
if (mode === 'show') { console.log(read(commit).body.toString()); }
else if (mode === 'extract') {
  const outDir = files.shift();
  for (const f of files) {
    const dst = path.join(outDir, f); fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.writeFileSync(dst, fileAt(commit, f)); console.log('ok', f, '->', dst);
  }
}
