# superAnthony4

I am trying to draw a 3D robot so called Super Anthony animated via webGL programming in js.

## show the robot on web html page, in superAnthony3.html

## use a 3D cube as the basic object, in cube.js

## animate 3D objects via webGL GPU shader programs, in index.js

## rotate angles of 16 motors to move the robot and the scene in superAnthony.js 

## handle UI controls via event handlers, in eventHandlers.js

## calculate 3D motion via matrix operation, in glMatrix-0.9.5.js

## repeat animation frames via the function called in webgl-utils.js

## provide a one word VM, in oneWordVM.js

### ### an instence f of the one word VM uses js console as output device
### ### use fuction key, e.g. f12 for chrome, to open a js console
### ### f.eval(script) gives the f a script to execute
#### $$$$ f.eval parses tokens from script, (taking white space as delimiter)
#### $$$$ if token is a word name in dictionary, f.dict, f executes the word
#### $$$$ if token is a number, interger or float, f pushs the it onto data stack, f.dStk
#### $$$$ if token is a js object, f pushs the object onto data stack, f.dStk
#### $$$$ else f reports the token as unDef
#### $$$$ e.g. f.eval('1.2 3')
The given script '1.2 3' pushs two numbers 1.2 and 3 onto data stack, f.dStk
#### $$$$ e.g. f.eval('code + var x=f.dStk.pop(); f.dStk.push(f.dStk.pop()+x); end-code')
The given script defines + as the name of word to do f.dStk.push(f.dStk.pop()+f.dStk.pop());
Pops two numbers from stack, e.g. 1.2 and 3, adds them as sum, e.g. 4.2, pushs it onto stack
#### $$$$ e.g. f.eval('code . f.print(f.dStk.pop()); end-code')
The given script defines . as the name of word to do f.print(f.dStk.pop());
Pops a data (number or js object) from stack, e.g. 4.2, print the data
#### $$$$ e.g. f.eval('1.2 3 + .')
Two numbers 1.2 and 3 are added, then print the sum 4.2
#### $$$$ e.g. f.eval('"data1" . "data" 2 + .')
String "data1" is printed first, then "data" and 2 are added, then print the result string "data2"
#### $$$$ e.g. f.eval()
Default script is given to add 123 words into dictionary f.dict
### ### f.dict[wordName] and f.dStk[i]

### ### the word w in f.dict
#### $$$$ primitive word, the word code or the word of w.definedBy="code"
##### ***** w.name
##### ***** w.code
#### $$$$ other word types, each of same w.code but differnt w.parm
##### ***** constant word, w.code=f.doCon and w.definedBy="constant"
##### ***** value word, w.code=f.doVal and w.definedBy="value"
##### ***** variable word, w.code=f.doVar and w.definedBy="variable"
##### ***** colon word, w.code=f.doCol and w.definedBy=":"
#### $$$$ compilation and execution of the colon word 
##### ***** w.immediate
##### ***** w.compileOnly
##### ***** f.rStk[i]
#### $$$$ other word attributes
##### ***** w.id
##### ***** w.src
##### ***** w.iInp
##### ***** w.srcBgn
##### ***** w.srcEnd
### ### testing and checking
#### $$$$ f.eval(script)
#### $$$$ f.dStk
#### $$$$ w=f.dict[wordName]
#### $$$$ f.execute(w) 
#### $$$$ f.word=w and w.code()
#### $$$$ w.src
#### $$$$ f.tracing=true

