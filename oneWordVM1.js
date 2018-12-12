// OneWordVM1.js @ https://github.com/samsuanchen/superAnthony4
const OneWordVM = function () {
const f = {}; 				// the virtual machine
f.dStk = [];				// the data stack
f.rStk = [];				// the return stack
f.ram = [10, 0, 0];			// the ram to keep variables
f.base = 0;					// the system variable word "base" at ram 0 to encode/decode number digits
f.toIn = 1;					// the system variable word ">in" at ram 1 to interpret/compile forth scripte
f.tracing = 2;				// the system variable word "tracing" at ram 2 as a flag of tracing colon word
f.callingLevel = 0;			// colon word calling level 
f.compiling = false; 		// the switching flag of compiling or interpreting
f.token = ""; 				// the working token
f.tib = ""; 		 		// the terminal input buffer
f.tob = "";					// the terminal output buffer
f.printLn = function( msg ){// print message
	console.log( msg );
}
f.panic = function( msg ){	// print given message and system info
	var m = {};
	m.msg = msg, m.token = f.token, m.base = f.ram[f.base];
	m.word = f.word, m.dStk = f.dStk;
	if( f.last ) m.last = f.last.name;
	m.compiling = f.compiling;
	if( f.head ) m.head = f.head.name, m.ip = f.head.ip, m.rStk = f.rStk;
	m.toIn = f.ram[f.toIn], m.tib = f.tib.substr( 0, 100 );
	if( f.tib.substr(100) ) m.tib +'...';
	m = JSON.stringify( m, null, 2 );
	if( f.ram[f.tracing] ) window.alert(m);
	f.printLn(m);
	exit;
}
f.cr = function( msg ){		// type message to terminal output buffer
	f.printLn( f.tob + ( msg || '' ) ), f.tob = '';
}
f.emit = function( charCode ){// emit a char to terminal output buffer
	if( charCode == 13 )
		f.cr();
	else
		f.tob += String.fromCharCode( charCode );
}
f.type = function( msg ){	// type message to terminal output buffer
	f.tob += msg;
	var lineFeed = String.fromCharCode( 10 ), lines = f.tob.split(lineFeed);
	f.tob = lines.pop();	// the last line is not printed
	if( lines.length ) f.printLn( lines.join( lineFeed ) );
}
f.compileOffset = function( n ){// append n to parm list of colon type forth word
	if( f.ram[f.tracing] )
		f.traceInfo( 'compile ' + f.last.parm.length + ' offset ' + f.dotR( n ) );
	f.compile( n );
}
f.compileNumber = function( n ){// compile n to colon parm list
	if( f.ram[f.tracing] )
		f.traceInfo('compile ' + f.last.parm.length + ' doLit ' + f.dotR( n ) );
	f.compile( f.dict.doLit ), f.compile( n );
}
f.numberToStack = function( n ){// push n to data stack
	if( f.ram[f.tracing] )
		f.traceInfo( 'push number ' + f.dotR( n ) + ' to data stack', 1 );
	f.dStk.push(n);
}
f.executeWord = function( w ){// execute given word w
	if( f.ram[f.tracing] ){
		f.traceInfo( 'execute '+(f.head ? ( ( f.head.ip - 1 ) + ' ' ) : '' ) + ' W'+w.id+' ' + w.name, 1 );
	}
	f.word=w, w.code();
}
f.compileWord = function( w ){// compile a word into colon parm-list
	if( f.ram[f.tracing] )
		f.traceInfo('compile '+f.last.parm.length+' word '+w.name);
	f.compile( w );
}
f.doCon = function(){		// constant word handler
	f.dStk.push(f.word.parm);
}
f.doVar = function(){		// variable word handler
	f.dStk.push(f.word.parm);
}
f.doVal = function(){		// value word handler
	f.dStk.push(f.word.parm);
}
f.doCol = function(){		// colon word handler
	var w = f.word; f.rStk.push( f.head ), w.ip = 0, f.head = w, f.callingLevel++;
	while( f.head )
		f.executeWord( f.head.parm[f.head.ip++] );
}
f.doRet = function(){		// return from calling colon word
	f.head = f.rStk.pop(), f.callingLevel--;
}
f.noop = function(){		// no operation
}
f.branch = function(){		// branch to relative ip addr in the cell pointed by ip
	f.head.ip += f.head.parm[f.head.ip];
}
f.zBranch = function( n ){		// branch to relative ip addr if TOS is 0 or undefined
	if( n ) f.head.ip++;
	else f.head.ip += f.head.parm[f.head.ip];
}
f.doFor = function( n ){	// push the loop counter for-next to return stack
	f.rStk.push( n );
}
f.doNext = function(){		// dec counter and loop back to relative ip addr if counter is 0
	var r = f.rStk, t = r.length - 1, counter = -- r[t];
	if( counter < 0 ) f.head.ip++, r.pop();
	else f.head.ip += f.head.parm[f.head.ip];
}
f.compile = function( w ){	// compile a word into colon word-list
	f.last.parm.push( w );
}
function adjustName( name ){
	return name.replace( /[.+*?|{}()\\[\]$^]/g, function(c){ return '\\'+c; } );
}
f.createWord = function( name, code, tag, value ){ // 
//	if(name=='(')
//		console.log("name=='(' in f.createWord()");
	var p0 = RegExp( '(\\s*)' +
		adjustName(f.word.name) + '\\s+' +
		adjustName(name) + '\\s[^\\0]*$'
	);
	var p = RegExp( '(\\s*)'+
		adjustName(f.word.name) + '\\s+' +
		adjustName(name) + '\\s.*$'
	);
	var toIn = f.ram[f.toIn], t = f.tib.substr( 0, toIn ), m0 = t.match( p0 ), m = t.match( p );
	if( m0 == undefined )
		f.printLn('( m0 == undefined ) in createWord()');
	if( m && m.index>m0.index ) m0 = m;
	var srcBgn = m0.index+(m0[1]?m0[1].length:0);
	if( f.ram[f.tracing] ) f.traceInfo( 'create a new word ' + name );
	if( ! name )
		f.panic("name not given to createWord()");
	var w = f.dict[name], id;
	if( w ) f.printLn('reDef W' + (id = w.id) + ' ' + name );
	else    f.printLn('def W' + (id = Object.keys( f.dict ).length ) + ' ' + name );
	w = f.last = { name: name };
	w.definedBy = f.word.name;
	w.srcBgn = srcBgn;
	w.id = id;
	if( code ) w.code = code;
	if( tag ) w[tag] = value;
	return w;
}
f.addWord = function( w ){ // add given forth word into dictionary
	f.dict[w.name] = w;
	w.src = f.tib.substring(f.last.srcBgn,f.ram[f.toIn]).trim();
	w.srcEnd = f.last.srcBgn + w.src.length;
	w.iInp = f.nInp - 1;
}
f.getToken = function( delimiter ) { // parse next token from tib by given delimiter
	var delimiter = delimiter || ' ';
	var m, t = f.tib.substr( f.ram[f.toIn] );
	
	if( delimiter != ' ' ){
		delimiter = delimiter.replace( /[()]/g, (c)=>('\\'+c) );
		var regexp = RegExp( '^(|([^\\0]+?)' + (delimiter.length>2?'\\s)':')') + delimiter );
	//	regexp=/^(|([^\0]+?)\s)end-code/
		m = t.match( regexp );
		if( m ) {
			f.ram[f.toIn] += m[0].length;  return m[1]; 
		}
		if( delimiter != '\n') return;
		f.ram[f.toIn] += t.length; return t;
	}
	m = t.match( /^[\s]*(\S+)\s?/ );
	if( !m ) return;
	f.ram[f.toIn] += m[0].length;
	return m[1];
}
f.getTokenx = function( delimiter0, delimiter1 ) { // parse next token from tib between two delimiters
	delimiter0 = delimiter0.replace( /[()]/g, (c)=>('\\'+c) );
	delimiter1 = delimiter1.replace( /[()]/g, (c)=>('\\'+c) );
	var t = f.tib.substr( f.ram[f.toIn] );
	var regexp = RegExp('^\\s*'+delimiter0+'(\\s.+?\\s)'+delimiter1+'(\\s|$)');
	var m = t.match( regexp );
	if( ! m ) return undefined;
	f.ram[f.toIn] += m[0].length;
	return m[1].trim();
}
f.toString = function( number, base ){
	if( isNaN(number) ) {
		const type = typeof(number);
		if( type == "string" ) return number;
		if( type == "object" ){
			const x = JSON.stringify(number);
			if( x == "" || x == "{}" ) return "" +number;
			return x;
		}
		f.panic( "unable convert " + number + " to string" ); return; }
	return number.toString( base || f.ram[f.base] );
}
f.dotR = function( n, width, leadingChr, base ){
	base = base || f.ram[f.base]; var sign;
	leadingChr = leadingChr || ' ';
	width = width || 1;
	if( isNaN(n) || typeof( n ) == 'string' ){
		if( n && n.name ) n = n.name;
		else n = JSON.stringify( n );
	} else {
		if( n < 0 && leadingChr != ' ' ) sign = '-', n = -n;
		n = n.toString( base );
	}
	if( sign ) width--;
	n += '';
	while( n.length < width ) n = leadingChr + n;
	if( sign ) n = sign + n;
	return n;
}
f.d9 = function( n ){
	return f.dotR( n, 9, ' ', 10 );
}
f.d04 = function( n ){
	return f.dotR( n, 4, '0', 10 );
}
f.traceInfo = function( msg, indent ) {
	const D = f.dStk, dt = D.length-1, dT = D[dt], dN = D[dt-1],
		  R = f.rStk, rt = R.length-1, rT = R[rt], rN = R[rt-1];
	var t = 'tib:' + f.d04( f.ram[f.toIn] ) +
			' D ' + D.length + ' ['+f.d9( dN ) + ',' + f.d9( dT ) + ']' +
			' R ' + R.length + ' ['+f.d9( rN ) + ',' + f.d9( rT ) + '] ';
	if( indent ) for(var i=0; i < f.callingLevel; i++) t+='| ';
	f.printLn( t + msg );
}
f.isNotADigit = function( asciiCode, base ){
	if( asciiCode < 0x30 ) return true;
	if( asciiCode >= 0x61 && asciiCode <= 0x7a ) asciiCode ^= 0x20;
	var i = asciiCode - ( asciiCode <= 0x39 ? 0x30 : ( 0x41 - 10 ) );
	return i < 0 || i >= base;
}
f.isNotANumber = function ( n ) {
	if( f.ram[f.base] == 10 ) return isNaN( n );
	if( typeof(n) == "number" ) return false;
	if( typeof(n) != "string" ) return true;
	for ( var i=0; i<n.length; i++ ) if( f.isNotADigit( n.charCodeAt( i ), f.ram[f.base] ) ) return true;
	return false;
}
f.psee = function( w ){ // 
  var src=w.src, definedBy=w.definedBy, n; 
  if(!src) src='code '+w.name+w.code.toString().match(/^function\(\)\{([^\0]+)\}$/)[1]+'end-code';
  if(definedBy=='alias'){ 
   var L=Object.keys(f.dict).sort( function(a,b){ 
    return f.dict[a].id-f.dict[b].id; 
   }).slice(0,w.id); 
   for(var i=L.length-1; i>=0; i--){ 
    n=f.dict[L[i]]; 
    if(n.code==w.code) break; 
   } 
   if(i>=0) src="' "+n.name+" "+src; 
  } else if(definedBy=='constant' || definedBy=='value'){ 
   var m=w.code.toString().match(/function\(\)\{f\.dStk\.push\((.+)\);\}/);
   src=(m?m[1]:JSON.stringify(w.parm))+" "+src; 
  } 
  if(w.immediate) src+=" immediate"; 
  if(w.compileOnly) src+=" compile-only"; 
  return 'W'+w.id+' '+src;
}
f.code = function(){
	var name = f.getToken(), args = f.getTokenx( '(', ')' );
	if( name=='(')
		console.log("name=='(' in f.code()");
	var js = f.getToken( 'end-code' );
	if( js==undefined )
		panic( 'end-code not given' );
	var w = f.createWord( name );
    var code = "";
	if( args ){
		code += "// ( " + args + " )\n";
		
		var a = args.split( /\s*--\s*/ );			//  split input/output
		var ai = a[0].split( /\s+/ );				//  input args
		var ao = a[1] ? a[1].split( /\s+/ ) : a[1];	// output args
		var vi = {};								//  input var names
		var vo = {};								// output var names
		var vt = [];								//  input var from f.tib
		var vd = [];								//  input var from f.dStk
		
		var ni, lst = ai;
		ai.forEach( function(ni){
			m = ni.match( /^((.*?)<)?([a-zA-Z][a-zA-Z0-9]*)(>(.*?))?$/ );
			if( ! m ) return;
			vi[m[3]]=true; 
			if( m[2] && m[5] )
				vt.push( m[3] + "=f.getTokenx('" + m[2] + "','" + m[5] + "')" );
			else if( m[5] ){
				var m5 = m[5].replace('\\','\\\\');
				vt.push( m[3] + "=f.getToken('" + m5 + "')" ); }
			else if( m[4] )
				vt.push( m[3] + "=f.getToken()" );
			else
				vd.push( ni + "=f.dStk.pop()" );
		});
		var s; while( s = vd.pop() ) vt.push( s );
		if( ao ){
			ao.forEach( no => {
				m = no.match(/^(i:)?([a-zA-Z][a-zA-Z0-9]*)$/);
				if( m ) {
					if ( ! vi[m[2]] )
						vo[m[2]] = true;
				}
			} );
		}
		Object.keys(vo).forEach( no => vt.push(no) );
	} // else
	  // f.printLn('(! args) in code()');
	
	var _fun_;
	var code = "_fun_ = function(){\n";
	if( args ){ // before js
		if( vt.length )
			code += "var " + vt.join() + ";\n";
	}
	code += js;
	if( args ){ // after js
		code += ( ao ? ( "\n" + ao.map( function(no){
			var s = '', m = no.match(/^(i:)?(.+)$/);
			if( m[1] )
				s += "if(!f.compiling)";
			s += "f.dStk.push(" + m[2] + ")";
			return s;
		}).join(";") ) : "" );
	}
	code += "\n}";

	try {
		eval( code ); w.code = _fun_, f.addWord( w );
	} catch ( err ) {
		f.printLn( 'eval("' + code + '")' );
		f.panic( err )
	}
}
var src=f.code.toString();
var w={
	id: 0,
	name: 'code',
	src: 'code code'+src.substr(11,src.length-12)+f.endCode,
	code: f.code };
f.dict = {	// So far the word "code" is the only word in dictionary.
			// New words can be defined by "code" in javascript via f.eval() later.
	"code": w
};
f.inps = [], f.nInp = 0;
f.toData = function( token ) {
	var data, n;
	if( f.isNotANumber( token ) ) {
		if( ! isNaN( token ) )
			f.panic( "not number of base "+f.ram[f.base]+" '" + token + "'" );
		var code = "n=" + token;
		try {
			eval( code );					//	a. data is js object
		} catch ( err ) {
			f.panic( "unDef "+token );
		}
	} else if( m = token.match(/^0x(.+)$/) )//	b. data is hex integer
		n = parseInt( m[1], 16 );
	else if( token.indexOf( '.' )<0 )		//	c. data is integer of any base
		n = parseInt( token, f.ram[f.base] );
	else									//	d. data is decimal float number
		n = parseFloat( token );
	return n
}
f.eval = function(tib) { // evaluate given script in tib
	tib = tib || f.defaultScript;
	f.inps.push(tib);
	f.cr("inp "+(f.nInp++)+" > `"+tib+"`");
	f.tib = tib || "", f.ram[f.toIn] = 0, f.rStk=[], f.compiling = f.errorMessage = false;
	var token;
	while( f.token = token = f.getToken() ){
		var w, n;
		if( f.word = w = f.dict[f.token] ){
			if( w.immediate || ! f.compiling ){		// 1. execute other type word
				f.executeWord(w);
			} else									// 2. compile word
				f.compileWord(w);
		} else {
			var n = f.toData( token );
			if( n == undefined )					// 3. abort if token is not data
				f.panic( "unDef "+token );
			if( f.compiling )						// 4. compile data into colon definition
				f.compileNumber( n );
			else 									// 5. push data onto data stack
				f.numberToStack( n );
		}
	}
}
f.printLn( "javascript oneWordVm 20181212 samsuanchen@gmail.com" );
return f;
}
const f = new OneWordVM();