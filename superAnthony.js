// superAnthony.js @ https://github.com/samsuanchen/superAnthony3
function drawAnthony(time){
	drawBackground();
	setOrigin([0, 2, -30]);
	var t = (1 - Math.cos(time)) / 2;
	var act = iFile.value, b = actions[act];
	var m = act.match(/(\D+)(\d+)$/), e = b;
	if( m ){
		e = actions[m[1]+( parseInt(m[2]) + 1 )] || b;
	}
	var a = "iValAng15", vBgn = b[a], vEnd = e[a];
	rotateY(vBgn+(vEnd-vBgn)*t); // 轉舞台
	
	mvMatrixPush(); // 上半身
	a = "iValAng0", vBgn = b[a], vEnd = e[a];;
	rotateY(vBgn+(vEnd-vBgn)*t); /*00*/
	cube.draw(.5); // 腰
	translate([0,1.6,0]);
	cube.draw([1.8,1.8,1.2]); // 胸
	translate([0,2.8,0]);
	cube.draw(.9); // 頭
	
	mvMatrixPush(); // 右上肢
	
	translate([2.4,-1.4,0]);
	a = "iValAng5", vBgn = b[a], vEnd = e[a];;
	rotateX(vBgn+(vEnd-vBgn)*t); /*05*/
	cube.draw(.5); // 右肩
	
	translate([1.2,0,0]);
	a = "iValAng6", vBgn = b[a], vEnd = e[a];;
	rotateZ(vBgn+(vEnd-vBgn)*t); /*06*/
	cube.draw(.5); // 右臂
	translate([0,-1.4,0]);
	cube.draw(.7);
	
	translate([0,-1.4,0]);
	a = "iValAng7", vBgn = b[a], vEnd = e[a];;
	rotateX(vBgn+(vEnd-vBgn)*t); /*07*/
	cube.draw(.5); // 右肘
	translate([0,-1.4,0]);
	cube.draw(.7);
	
	mvMatrixPop(); // 左上肢
	
	translate([-2.4,-1.4,0]);
	a = "iValAng12", vBgn = b[a], vEnd = e[a];;
	rotateX(vBgn+(vEnd-vBgn)*t); /*12*/
	cube.draw(.5); // 左肩
	
	translate([-1.2,0,0]);
	a = "iValAng13", vBgn = b[a], vEnd = e[a];;
	rotateZ(vBgn+(vEnd-vBgn)*t); /*13*/
	cube.draw(.5); // 左臂
	translate([0,-1.4,0]);
	cube.draw(.7);
	
	translate([0,-1.4,0]);
	a = "iValAng14", vBgn = b[a], vEnd = e[a];;
	rotateX(vBgn+(vEnd-vBgn)*t); /*14*/
	cube.draw(.5); // 左肘
	translate([0,-1.4,0]);
	cube.draw(.7);
	
	mvMatrixPop(); // 下半身
	
	translate([-.5,-1.8,0]);
	cube.draw(1); // 股
	translate([1,0,0]);
	cube.draw(1); // 股
	
	mvMatrixPush(); // 右下肢
	
	translate([1.7,0,0]);
	a = "iValAng4", vBgn = b[a], vEnd = e[a];;
	rotateZ(vBgn+(vEnd-vBgn)*t); /*4*/
	cube.draw(.5); // 右跨
	
	translate([0,-.8,0]);
	a = "iValAng3", vBgn = b[a], vEnd = e[a];;
	rotateX(vBgn+(vEnd-vBgn)*t); /*03*/
	cube.draw(.5); // 右腿
	translate([0,-1.4,0]);
	cube.draw(.7);

	translate([0,-1.4,0]);
	a = "iValAng2", vBgn = b[a], vEnd = e[a];;
	rotateX(vBgn+(vEnd-vBgn)*t); /*2*/
	cube.draw(.5); // 右腳
	translate([0,-1.4,0]);
	cube.draw(.7);

	translate([0,-1.4,0]);
	a = "iValAng1", vBgn = b[a], vEnd = e[a];;
	rotateZ(vBgn+(vEnd-vBgn)*t); /*1*/
	cube.draw(.5); // 右裸
	translate([0,-.4,0]);
	cube.draw([1.2,.2,1.2]);
	
	mvMatrixPop(); // 左下肢
	
	translate([-2.7,0,0]);
	a = "iValAng11", vBgn = b[a], vEnd = e[a];;
	rotateZ(vBgn+(vEnd-vBgn)*t); /*11*/
	cube.draw(.5); // 左跨
	
	translate([0,-.8,0]);
	a = "iValAng10", vBgn = b[a], vEnd = e[a];;
	rotateX(vBgn+(vEnd-vBgn)*t); /*10*/
	cube.draw(.5); // 左腿
	translate([0,-1.4,0]);
	cube.draw(.7);
	
	translate([0,-1.4,0]);
	a = "iValAng9", vBgn = b[a], vEnd = e[a];;
	rotateX(vBgn+(vEnd-vBgn)*t); /*9*/
	cube.draw(.5); // 左腳
	translate([0,-1.4,0]);
	cube.draw(.7);	
	translate([0,-1.4,0]);
	a = "iValAng8", vBgn = b[a], vEnd = e[a];;
	rotateZ(vBgn+(vEnd-vBgn)*t); /*8*/
	cube.draw(.5); // 左裸
	translate([0,-.4,0]);
	cube.draw([1.2,.2,1.2]);
}
var lastTime = 0;
var delayTime = 0;
var n1, n2;
function drawScene() {
	if( bAuto.innerHTML == "自動" )
		return;
	if( n1 && ( ! actions[n1] ) )
		return;
	var time = new Date().getTime() / 1000;
	var d = parseInt( iDirect.value );
	const PI = Math.PI / parseInt( iSpeed.value );
//	if( d < 0 )
//		console.log('d < 0');
	if( ! delayTime ){
		delayTime = time;
		if ( ! n1 ){
			var m = iFile.value.match(/(\D+)(\d+)/);
			var n = m[1], i = parseInt( m[2] ) + d;
			n1 = n + i;
		}
		if( ! actions[n1] ) return;
	} // else console.log( 'delayTime', delayTime );
	time -= delayTime;
	if( time > PI ){
		if( d < 0 )
			console.log('d < 0');
		time -= PI;
		delayTime += PI;
		iFile.value = n1;
		var m = n1.match(/(\D+)(\d+)/);
		var n = m[1], i = parseInt( m[2] ) + d;
		if( i<0 )
			console.log('i<0');
		n2 = n+i;
		if( actions[n2] )
			iIndex.value = i;
		else
			iDirect.value = - d;
	}
	console.log('名',iFile.value,'向',iDirect.value,'時',time,delayTime);
	time *= parseInt(iSpeed.value);
	drawAnthony(time);
}
function animate(){
	requestAnimFrame(animate); // the function requestAnimFrame is in webgl-utils.js
	drawScene()
}