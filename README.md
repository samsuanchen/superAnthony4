# superAnthony4

I am trying to draw a 3D robot so called Super Anthony animated via webGL programming in js.

## show the robot on web html page, in superAnthony3.html

## use a 3D cube as the basic object, in cube.js

## animate 3D objects via webGL GPU shader programs, in index.js

## rotate angles of 16 motors to move the robot and the scene in superAnthony.js 

## handle UI controls via event handlers, in eventHandlers.js

## calculate 3D motion via matrix operation, in glMatrix-0.9.5.js

## repeat animation frames via the function called in webgl-utils.js

## provide forth eval via oneWordVM, in oneWordVM.js

### ### f.eval(script)

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

