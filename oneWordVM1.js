// OneWordVM1.js @ https://github.com/samsuanchen/superAnthony4
const OneWordVM = function OneWordVM () {
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
	f.printLn = function printLn( msg ){// print message
		console.log( f.tob + ( msg || '' ) ), f.tob = '';
	}
	f.print = function print( msg ){// print message
		f.tob += ( msg || '' );
		var lines = f.tob.split( '\n' );
		f.tob = lines.pop();	// the last line is not printed
		if( lines.length ) console.log( lines.join( '\n' ) );
	}
	f.panic = function panic( msg ){	// print given message and system info
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
	f.emit = function emit( charCode ){// emit a char to terminal output buffer
		if( charCode == 13 )
			f.printLn();
		else
			f.print( String.fromCharCode( charCode ) );
	}
	f.compileOffset = function compileOffset( n ){// append n to parm list of colon type forth word
		if( f.ram[f.tracing] )
			f.traceInfo( 'compile ' + f.last.parm.length + ' offset ' + f.dotR( n ) );
		f.compile( n );
	}
	f.compileNumber = function compileNumber( n ){// compile n to colon parm list
		if( f.ram[f.tracing] )
			f.traceInfo('compile ' + f.last.parm.length + ' doLit ' + f.dotR( n ) );
		f.compile( f.dict.doLit ), f.compile( n );
	}
	f.numberToStack = function numberToStack( n ){// push n to data stack
		if( f.ram[f.tracing] )
			f.traceInfo( 'push number ' + f.dotR( n ) + ' to data stack', 1 );
		f.dStk.push(n);
	}
	f.executeWord = function executeWord( w ){// execute given word w
		if( f.ram[f.tracing] ){
			f.traceInfo( 'execute '+(f.head ? ( ( f.head.ip - 1 ) + ' ' ) : '' ) + ' W'+w.id+' ' + w.name, 1 );
		}
		f.word=w, w.code();
	}
	f.compileWord = function compileWord( w ){// compile a word into colon parm-list
		if( f.ram[f.tracing] )
			f.traceInfo('compile '+f.last.parm.length+' word '+w.name);
		f.compile( w );
	}
	f.doCon = function doCon(){		// constant word handler
		f.dStk.push(f.word.parm);
	}
	f.doVar = function doVar(){		// variable word handler
		f.dStk.push(f.word.parm);
	}
	f.doVal = function doVal(){		// value word handler
		f.dStk.push(f.word.parm);
	}
	f.doCol = function doCol(){		// colon word handler
		var w = f.word; f.rStk.push( f.head ), w.ip = 0, f.head = w, f.callingLevel++;
		while( f.head )
			f.executeWord( f.head.parm[f.head.ip++] );
	}
	f.doRet = function doRet(){		// return from calling colon word
		f.head = f.rStk.pop(), f.callingLevel--;
	}
	f.noop = function noop(){		// no operation
	}
	f.branch = function branch(){		// branch to relative ip addr in the cell pointed by ip
		f.head.ip += f.head.parm[f.head.ip];
	}
	f.zBranch = function zBranch( n ){		// branch to relative ip addr if TOS is 0 or undefined
		if( n ) f.head.ip++;
		else f.head.ip += f.head.parm[f.head.ip];
	}
	f.doFor = function doFor( n ){	// push the loop counter for-next to return stack
		f.rStk.push( n );
	}
	f.doNext = function doNext(){		// dec counter and loop back to relative ip addr if counter is 0
		var r = f.rStk, t = r.length - 1, counter = -- r[t];
		if( counter < 0 ) f.head.ip++, r.pop();
		else f.head.ip += f.head.parm[f.head.ip];
	}
	f.compile = function compile( w ){	// compile a word into colon word-list
		f.last.parm.push( w );
	}
	function adjustName( name ){
		return name.replace( /[.+*?|{}()\\[\]$^]/g, function(c){ return '\\'+c; } );
	}
	f.createWord = function createWord( name, code, tag, value ){ // 
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
	f.addWord = function addWord( w ){ // add given forth word into dictionary
		f.dict[w.name] = w;
		w.src = f.tib.substring(f.last.srcBgn,f.ram[f.toIn]).trim();
		w.srcEnd = f.last.srcBgn + w.src.length;
		w.iInp = f.nInp - 1;
	}
	f.getToken = function getToken( delimiter ) { // parse next token from tib by given delimiter
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
	f.getTokenx = function getTokenx( delimiter0, delimiter1 ) { // parse next token from tib between two delimiters
		delimiter0 = delimiter0.replace( /[()]/g, (c)=>('\\'+c) );
		delimiter1 = delimiter1.replace( /[()]/g, (c)=>('\\'+c) );
		var t = f.tib.substr( f.ram[f.toIn] );
		var regexp = RegExp('^\\s*'+delimiter0+'(\\s.+?\\s)'+delimiter1+'(\\s|$)');
		var m = t.match( regexp );
		if( ! m ) return undefined;
		f.ram[f.toIn] += m[0].length;
		if( m[2] && m[2]=='\n' )
			f.ram[f.toIn] --;
		return m[1].trim();
	}
	f.toString = function toString( number, base ){
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
	f.dotR = function dotR( n, width, leadingChr, base ){
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
	f.d9 = function d9( n ){
		return f.dotR( n, 9, ' ', 10 );
	}
	f.d04 = function d04( n ){
		return f.dotR( n, 4, '0', 10 );
	}
	f.traceInfo = function traceInfo( msg, indent ) {
		const D = f.dStk, dt = D.length-1, dT = D[dt], dN = D[dt-1],
			  R = f.rStk, rt = R.length-1, rT = R[rt], rN = R[rt-1];
		var t = 'tib:' + f.d04( f.ram[f.toIn] ) +
				' D ' + D.length + ' ['+f.d9( dN ) + ',' + f.d9( dT ) + ']' +
				' R ' + R.length + ' ['+f.d9( rN ) + ',' + f.d9( rT ) + '] ';
		if( indent ) for(var i=0; i < f.callingLevel; i++) t+='| ';
		f.printLn( t + msg );
	}
	f.isNotADigit = function isNotADigit( asciiCode, base ){
		if( asciiCode < 0x30 ) return true;
		if( asciiCode >= 0x61 && asciiCode <= 0x7a ) asciiCode ^= 0x20;
		var i = asciiCode - ( asciiCode <= 0x39 ? 0x30 : ( 0x41 - 10 ) );
		return i < 0 || i >= base;
	}
	f.isNotANumber = function isNotANumber ( n ) {
		if( f.ram[f.base] == 10 ) return isNaN( n );
		if( typeof(n) == "number" ) return false;
		if( typeof(n) != "string" ) return true;
		for ( var i=0; i<n.length; i++ ) if( f.isNotADigit( n.charCodeAt( i ), f.ram[f.base] ) ) return true;
		return false;
	}
	f.analizeArgs = function( args ){
		var a = args.split( /\s*--\s*/ ); // split input/output 
		var ai = a[0].split( /\s+/ ); // input args 
		var ao = a[1] ? a[1].split( /\s+/ ) : a[1]; // output args 
		var vi = {}; // input var names 
		var vo = {}; // output var names 
		var pt = []; // parse value from f.tib 
		var pd = []; // pop value from f.dStk 
		var ni; 
		ai.forEach( function(ni){ 
			m = ni.match( /^((.*?)<)?([a-zA-Z][a-zA-Z0-9]*)(>(.*?))?$/ ); 
			if( ! m ) return; 
			vi[m[3]]=true; 
			if( m[2] && m[5] ) 
				pt.push( m[3] + "=f.getTokenx('" + m[2] + "','" + m[5] + "')" ); 
			else if( m[5] ){ 
				var m5 = m[5].replace('\\','\\\\'); 
				pt.push( m[3] + "=f.getToken('" + m5 + "')" ); } 
			else if( m[4] ) 
				pt.push( m[3] + "=f.getToken()" ); 
			else 
				pd.push( ni + "=f.dStk.pop()" ); 
		}); 
		var s; while( s = pd.pop() ) pt.push( s ); 
		if( ao ){ 
			ao.forEach( no => { 
				m = no.match(/^(i:)?([a-zA-Z][a-zA-Z0-9]*)$/); 
				if( m ) { 
					if ( ! vi[m[2]] ) 
						vo[m[2]] = true; 
				} 
			} ); 
		} 
		Object.keys(vo).forEach( no => pt.push(no) ); 
		return {pt:pt,ao:ao};
	}
	f.getArgs = function( pt ){ // all input args values and output names
		return "\t\tvar " + pt.join() + ";\n";
	}
	f.setArgs = function( ao ){ // all output args values
		return "\t\t" + ao.map( function(no){
			var s = '', m = no.match(/^(i:)?(.+)$/); // interpretive mode only
			if( m[1] )
				s += "if(!f.compiling)";
			s += "f.dStk.push(" + m[2] + ")";
			return s;
		}).join( ";" ) + "\n";
	}
	f.code = function code(){
		var name = f.getToken(), args = f.getTokenx( '(', ')' ), js = f.getToken( 'end-code' );
		if( js==undefined ) 
			f.panic( 'end-code not given' ); 
		var w = f.createWord( name );
		var a, code = "_ = function(){\n"; 
		if( args ){ 
			code += "\t\t// ( " + args + " )\n";
			a = f.analizeArgs( args );
		} 
		if( a && a.pt.length ) code += f.getArgs( a.pt ); // get all input values and output names
		if( js.length )
			code += ('\t\t'+js).split(/\r?\n/).map(l=>'\t'+l).filter(l=>l.trim().length).join('\n') + "\n";
		if( a && a.ao ) code += f.setArgs( a.ao ); // set all output values
		code += "\t}"; 
		try { 
			var _; eval( code );
			w.code = _, f.addWord( w ); 
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
	f.toData = function toData( token ) {
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
	f.eval = function eval(tib) { // evaluate given script in tib
		tib = tib || f.defaultScript;
		f.inps.push(tib);
		f.printLn("inp "+(f.nInp++)+" > `"+tib+"`");
		f.tib = tib || "", f.ram[f.toIn] = 0, f.rStk=[], f.compiling = f.errorMessage = false;
		var token;
		while( f.token = token = f.getToken() ){
			var w, n;
			if( f.word = w = f.dict[f.token] ){
				if( w.immediate || ! f.compiling ){		// 1. execute word
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
	f.printLn( "javascript oneWordVm 20181220 samsuanchen@gmail.com" );
	return f;
} // OneWordVM
const f = new OneWordVM();