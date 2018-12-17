var fs=require("fs"), keys;
console.log(keys=Object.keys(fs));
console.log(fs.readdirSync('.'));
var txt=fs.readFileSync("logDump.txt","utf8");
console.log(txt.length);
var names={};
txt.replace(/f\.([a-zA-Z0-9]+)/g,f=>{names[f]=names[f]||0,names[f]++});
console.log(Object.keys(names).sort());

/*
tools:

  f.eval   
  f.getToken
  f.executeWord
  
  f.code
  f.createWord 
  f.addWord 
   
  f.getTokenx
  f.analizeArgs 
  f.getArgs 
  f.setArgs
  
  f.compile 
  f.compileNumber 
  f.compileOffset 
  f.compileWord
  
  f.panic(msg)
  f.dotR(n,width,leadingChar)
  f.emit(asciiCode)
  f.toString(obj)
  f.printLn(msg) 
  f.print(msg)
  
system variables:
  f.base // between 2 .. 36 as integer conversion base
  f.callingLevel // high level (colon type word) calling depth
  f.compiling // interpreting/compiling state
  f.head // calling word, head.parm and head.ip used in colon type word calling
  f.iInp // index of input script
  f.last // word created
  f.tib // input buffer
  f.tob // output buffer
  f.toIn // input buffer entry
  f.token // token parsed from input buffer
  f.tracing // tracing level
  f.word // word executed
  
primitives:

  f.doCon() // constant type word handler, return value
  f.doVal() // value type word handler, return value
  f.doVar() // variable type word handler, return address
  
  f.doCol() // colon type word handler, call word list
  f.doRet() // exit from word list
  
  f.branch() // unconditional branching handler (forward or backward)
  f.zBranch() // conditional branching handler (forward or backward)
  
  f.doFor() // setup for-next loop
  f.doNext() // decrease loop counter and conditional branch backward

resource:

  f.dStk // list as data stack
  f.dict // objec as dictionayt
  f.inps // list as input script
  f.rStk // list as return stack
  f.ram // list as variable space
  
*/