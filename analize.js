var fs=require("fs"), keys;
console.log(keys=Object.keys(fs));
console.log(fs.readdirSync('.'));
var txt=fs.readFileSync("logDump.txt","utf8");
console.log(txt.length);
var names={};
txt.replace(/f\.([a-zA-Z0-9]+)/g,f=>{names[f]=names[f]||0,names[f]++});
console.log(Object.keys(names).sort());