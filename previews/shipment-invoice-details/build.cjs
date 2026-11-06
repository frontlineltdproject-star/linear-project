const fs=require('node:fs'),path=require('node:path');
const file=path.join(__dirname,'index.html');
const html=fs.readFileSync(file,'utf8');
fs.writeFileSync(file,html.replace(/<script>[\s\S]*?<\/script>/,'<script>\n'+fs.readFileSync(path.join(__dirname,'preview.js'),'utf8')+'\n</script>'));
