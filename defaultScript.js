f.defaultScript = `
 code code ( <name> (<args>) <js>end-code -- ) // note!! in string doubleBackSlashs means one backSlash
	if( js==undefined ) 
		f.panic( 'end-code not given' ); 
	var w = f.createWord( name ); 
    var code = "", a; 
	if( args ){ 
		code += "// ( " + args + " )\\n";
		a = f.analizeArgs( args );
	} 
	var code = "_fun_ = function(){\\n"; 
	if( a && a.pt.length ) code += f.getArgs( a.pt ); // get all input values and output names
	if( js.length ) code += "\\t" + js + "\\n";
	if( a && a.ao ) code += f.setArgs( a.ao ); // set all output values
	code += "\\t}"; 
	try { 
		var _fun_; eval( code );
		w.code = _fun_, f.addWord( w ); 
	} catch ( err ) { 
		f.printLn( 'eval("' + code + '")' ); 
		f.panic( err ) 
	} 
	end-code
 code constant ( n <name> -- ) f.addWord( f.createWord( name, f.doCon, "parm", n ) ); end-code 
 code variable ( <name> -- ) f.addWord( f.createWord( name, f.doVar, "parm", f.ram.length ) );
	f.ram.push( 0 ); end-code 
 code value ( n <name> -- ) f.addWord( f.createWord( name, f.doVal, "parm", n ) ); end-code 
 code immediate ( -- ) f.last.immediate = true; end-code 
 code compile-only ( -- ) f.last.compileOnly = true; end-code 
 code : ( <name> -- ) f.createWord( name, f.doCol, "parm", [] ), f.compiling = true; end-code 
 code ; ( -- ) f.compileWord( f.dict.doRet ), f.addWord( f.last ), f.compiling = false;
	end-code immediate compile-only 
 code doLit ( -- n ) n=f.head.parm[f.head.ip++]; end-code compile-only 
 code doStr ( -- str ) str=f.head.parm[f.head.ip++]; end-code compile-only 
 code doRet ( -- ) f.doRet(); end-code compile-only 
 code exit ( -- ) f.doRet(); end-code compile-only 
 code ?exit ( flag -- ) if( flag ) f.doRet(); end-code compile-only 
 code doFor ( n -- ) f.doFor( n ); end-code compile-only 
 code doNext ( -- ) f.doNext(); end-code compile-only 
 code doIf ( n -- ) f.zBranch( n ); end-code compile-only 
 code doElse ( -- ) f.branch(); end-code compile-only 
 code doThen ( -- ) end-code compile-only 
 code doBegin ( -- ) end-code compile-only 
 code doAgain ( -- ) f.branch(); end-code compile-only 
 code doUntil ( n -- ) f.zBranch( n ); end-code compile-only 
 code doWhile ( n -- ) f.zBranch( n ); end-code compile-only 
 code doRepeat ( -- ) f.branch(); end-code compile-only 
 code ( ( <str>) -- ) end-code immediate 
 code \\ ( <str>\\n -- ) end-code immediate \\ ignore string until end of line
 code cr ( -- ) f.printLn(); end-code 
 code space ( -- ) f.emit( 0x20 ); end-code 
 code spaces ( n -- ) for( var i=0; i<n; i++ ) f.emit( 0x20 ); end-code 
 code emit ( charCode -- ) f.emit( charCode ); end-code 
 code type ( obj -- ) f.print( obj ); end-code 
 code .( ( <str>) -- ) f.print( str ); end-code 
 code . ( n -- ) f.print( f.toString( n ) + " " ); end-code 
 code .r ( n width -- ) f.print( f.dotR( n, width, " " ) ); end-code 
 code .0r ( n width -- ) f.print( f.dotR( n, width, "0" ) ); end-code 
 code + ( a b -- a+b ) end-code 
 code - ( a b -- a-b ) end-code 
 code * ( a b -- a*b ) end-code 
 code / ( a b -- a/b ) end-code 
 code mod ( a b -- a%b ) end-code 
 code ** ( a b -- a**b ) end-code 
 code drop ( n -- ) end-code 
 code nip ( a b -- b ) end-code 
 code dup ( n -- n n ) end-code 
 code over ( a b -- a b a ) end-code 
 code pick // ( ni .. n1 n0 i -- ni .. n1 n0 ni ) 
	var d = f.dStk, t = d.length - 1, i = d[t]; d[t] = d[t-1-i]; 
	end-code 
 code swap ( a b -- b a ) end-code 
 code rot ( a b c -- b c a ) end-code 
 code -rot ( a b c -- c a b ) end-code 
 code roll // ( ni .. n1 n0 i -- .. n1 n0 ni )
	var d = f.dStk, t = d.length - 2, i = d.pop(), ni = d[t-i];
	while( i ){ d[t-i] = d[t-i+1]; i--; } d[t] = ni;
	end-code 
 code base ( -- addr ) addr = f.base; end-code 
 code >in ( -- addr ) addr = f.toIn; end-code 
 code tracing ( -- flag ) flag = f.tracing; end-code 
 code @ ( addr -- value ) value = f.ram[addr]; end-code 
 code ! ( value addr -- ) f.ram[addr] = value; end-code 
 code ] ( -- ) f.compiling = true; end-code 
 code [ ( -- ) f.compiling = false; end-code 
 code token ( <token> -- str ) str = token; end-code 
 code , ( n -- ) f.compileOffset( n ); end-code 
 code word, ( w -- ) f.compileWord( w ); end-code 
 code compile ( -- ) f.compileWord( f.head.parm[f.head.ip++] ); end-code 
 code literal ( n -- ) f.compileNumber( n ); end-code immediate 
 code execute ( w -- ) f.executeWord( w ); end-code 
 code find ( str -- w ) w=f.dict( str ); end-code 
 code ' ( <name> -- w ) w=f.dict[name]; if( ! w ) panic( 'unDef ' + f.token ); end-code 
 code words ( -- )
	f.printLn(
		Object.keys( f.dict )
		.sort( (a,b) => f.dict[a].id-f.dict[b].id )
		.map( name => "W" + f.dict[name].id + " " + name )
		.join( " " )
	);
	end-code 
 code (see) ( w -- ) 
	var inp = f.inps[w.iInp], src;
	if(w.srcBgn)
		src = inp.substring( w.srcBgn, w.srcEnd );
	else
		src = w.src;
	var definedBy = w.definedBy, n; 
	if( definedBy == 'alias' ){ 
		var L = Object.keys( f.dict ).sort( function( a, b ){ 
			return f.dict[a].id - f.dict[b].id; 
	}).slice( 0, w.id ); 
	for( var i = L.length - 1; i >= 0; i -- ){ 
		n = f.dict[L[i]]; 
		if( n.code == w.code ) break; 
	} 
	if( i >= 0 ) src = "' " + n.name + " " + src; 
	} else if( definedBy == 'constant' || definedBy == 'value' ){  
		var m = w.code.toString().match( /function\\(\\)\\{f\\.dStk\\.push\\((.+)\\);\\}/ );
		src = ( m ? m[1] : JSON.stringify(w.parm) )+ " " + src; 
	} 
	if( w.immediate ) src += " immediate"; 
	if( w.compileOnly ) src += " compile-only"; 
	f.printLn( 'W' + w.id + ' ' + src ); 
	end-code 
 code seeAll ( -- )
	for( name in f.dict ){ f.dStk.push( f.dict[name] ),f.dict["(see)"].code(); }
	end-code 
 code alias ( w <name> -- )
	var n = f.createWord( name, w.code );
	if( w.parm ) n.parm = w.parm;
	f.addWord( n );
	end-code 
 code > ( a b -- a>b ) end-code
 code < ( a b -- a<b ) end-code
 code >= ( a b -- a>=b ) end-code
 code <= ( a b -- a<=b ) end-code
 code = ( a b -- a=b ) end-code
 code <> ( a b -- a!=b ) end-code
 code 1+ ( n -- n+1 ) end-code
 code 1- ( n -- n-1 ) end-code
 code 2+ ( n -- n+2 ) end-code
 code 2- ( n -- n-2 ) end-code
 code 2dup ( a b -- a b a b ) end-code
 code 2drop ( a b -- ) end-code
 code 3drop ( a b c -- ) end-code
 code 2over ( a b c d -- a b c d a b ) end-code
 code depth ( -- n ) n=f.dStk.length; end-code
 code r@ ( -- n ) n=f.rStk[f.rStk.length-1]; end-code
 ' r@ alias i
 code r> ( -- n ) n=f.rStk.pop(); end-code
 code >r ( n -- ) f.rStk.push(n); end-code
 code here ( -- n ) n=f.last.parm.length; end-code 
 code compileTo ( n a -- ) f.last.parm[a]=n; end-code 
 code bl ( -- 32 ) end-code 
 code quote ( -- 34 ) end-code 
 code word ( delimiter -- str ) str = f.getToken( delimiter ); end-code
 code (to) ( n w -- ) if( w.definedBy != 'value' )f.panic( 'cannot set value to ' + w.name ); w.parm = n; end-code
 code (+to) ( n w -- ) if( w.definedBy != 'value' )f.panic( 'cannot add value to ' + w.name ); w.parm += n; end-code
 code compiling ( -- flag ) flag = f.compiling; end-code 
 code ." ( <str>" -- ) f.compile( f.dict.doStr ); f.compile( str ); f.compile( f.dict.type ); end-code immediate 
 code $" ( <str>" -- i:str )
	if( f.compiling ) f.compile( f.dict.doStr ), f.compile( str );
	end-code immediate 
	
 : see ( <name> -- ) ' (see) ; 
 : ? ( addr -- ) @ . ; 
 : on ( addr -- ) 1 swap ! ; 
 : off ( addr -- ) 0 swap ! ; 
 : (trace) ( w -- ) tracing on execute tracing off ; 
 : trace ( <word> -- ) ' (trace) ; 
 : hex ( -- ) 16 base ! ;
 : decimal ( -- ) 10 base ! ; 
 : h. ( number -- ) base @ swap hex . base ! ; 
 : h.r ( number n -- ) base @ -rot hex .r base ! ; 
 : h.0r ( number n -- ) base @ -rot hex .0r base ! ; 
 : forward, ( a -- ) here over - swap compileTo ; 
 : backward, ( a -- ) here - , ; 
 : for ( -- a ) compile doFor here ; immediate 
 : next ( a -- ) compile doNext backward, ; immediate 
 : if ( -- a ) compile doIf here 0 , ; immediate 
 : else ( a -- b ) compile doElse here 0 , swap forward, ; immediate 
 : then ( a -- ) compile doThen forward, ; immediate 
 : begin ( -- a ) compile doBegin here ; immediate 
 : again ( a -- ) compile doAgain backward, ; immediate 
 : until ( a -- ) compile doUntil backward, ; immediate 
 : while ( a -- a b ) compile doWhile here 0 , ; immediate 
 : repeat ( a b -- ) compile doRepeat swap backward, forward, ; immediate 
 : t9 ( n -- ) 8 for dup 9 i - * 3 .r next drop cr ; 
 : t99 ( -- ) 1 begin dup 10 < while dup t9 1+ repeat drop ; 
 : [compile] ( <name> -- ) ' , ; immediate 
 : to ( n <name> -- ) ' compiling if [compile] literal compile (to) else (to) then ; immediate 
 : +to ( n <name> -- ) ' compiling if [compile] literal compile (+to) else (+to) then ; immediate 
 : .s depth if depth 1- for r@ pick . next else ." empty " then cr ;
 
 code (seeWord) ( w -- )
	f.dStk.push( w ),f.dict['(see)'].code();
	f.printLn('f.dict["'+w.name+'"]: ');
	f.printLn('\\t{id:'+w.id);
	f.printLn('\\t,name:"'+w.name+'"');
	if(w.immediate)f.printLn('\\t,immediate:'+w.immediate);
	if(w.compileOnly)f.printLn('\\t,compileOnly:'+w.compileOnly);
	f.printLn('\\t,definedBy:"'+w.definedBy+'"');
	f.printLn('\\t,iInp:'+w.iInp);
	f.printLn('\\t,srcBgn:'+w.srcBgn);
	f.printLn('\\t,srcEnd:'+w.srcEnd);
	f.printLn('\\t,code:'+w.code);
	if( w.parm ){
		if( Array.isArray( w.parm ) && typeof( w.parm[0] ) == 'object' && w.parm[0].id ){
			f.printLn( '\\t,parm:' );
			f.printLn( '\\t\\t{'+w.parm.map(( w, i ) => {
				var t = typeof( w ) == 'object' ? ( 'W' + w.id + ' ' + w.name ) : w;
				return i + ':' + t; 
			}).join( '\\n\\t\\t,' ) );
			f.printLn('\\t\\t,length:'+w.parm.length+'\\n\\t\\t}');
		} else {
			f.printLn( '\\t,parm:' + JSON.stringify( w.parm ) );
		}
	}
	f.printLn('}');
	if( w.definedBy == 'variable' )
		f.printLn( 'f.ram[' + w.parm + ']:' + JSON.stringify( f.ram[w.parm] ) );
	end-code
 code seeAllWords ( -- )
	for( name in f.dict ){ f.dStk.push( f.dict[name] ), f.dict["(seeWord)"].code(); }
	end-code 
 : seeWord ( <name> -- ) ' (seeWord) ;
 .( enter "words" should print the following: ) cr 
 words
 .( input "hex 1Ff 1+ decimal ." should print the following "512" ) cr 
 hex 1Ff 1+ decimal . cr 
 .( enter "0x1234 8 h.0r" should print the following "00001234" ) cr 
 0x1234 8 h.0r cr 
 .( enter "t99" should print the following: ) cr
 t99 
`