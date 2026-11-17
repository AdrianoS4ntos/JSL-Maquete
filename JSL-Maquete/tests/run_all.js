// Executa todos os testes Node e resume PASS/FAIL. Uso: node tests/run_all.js
const {spawnSync}=require('child_process'),path=require('path');
const T=['test','extra','cam','motion','features','camsim','zf','walls'];let bad=0;
for(const t of T){const r=spawnSync(process.execPath,[path.join(__dirname,t+'.js')],{encoding:'utf8'});const o=(r.stdout||'')+(r.stderr||'');
 const pass=(o.match(/^PASS/gm)||[]).length,fail=(o.match(/^FAIL/gm)||[]).length;const zf=(o.match(/Z-FIGHTING[^\n]*/)||[''])[0];
 console.log(`${t.padEnd(9)} exit=${r.status} PASS=${pass} FAIL=${fail} ${zf}`);o.split('\n').filter(l=>/^FAIL|Error/.test(l)).slice(0,8).forEach(l=>console.log('   '+l));
 if(r.status!==0||fail)bad++}
process.exitCode=bad?1:0;
