// eventHandlers.js @ https://github.com/samsuanchen/superAnthony3
function backup(){ // in js console, paste the output to inport more actions
	actionButtons=document.getElementsByClassName('action');
	out=['in js console, paste the following to inport more actions'];
	for(i=0;i<actionButtons.length;i++){
		key="anthony4_"+actionButtons[i].innerHTML.trim();
		out.push('localStorage.setItem("'+key+'",'
					+JSON.stringify(localStorage.getItem(key))
					 .replace(/^"|"$/g,"'")
					 .replace(/\\"/g,'"')
					 .replace(/"([0-9-]+)"/g,'$1')
					+")");
	}
	console.log(out.join('\n'));
}
function save(key){
	key = key || iFile.value;
	var inputs = document.getElementsByClassName("number");
	var json={};for(i=0;i<inputs.length;i++){e=inputs[i];json[e.id]=e.value};
	localStorage.setItem("anthony4_"+key, JSON.stringify(json));
	preloadState();
}
function load(key){
	if( ! key ) key = iFile.value;
	else if( iFile.value != key ) iFile.value = key
	key = key || iFile.value;
	var json = JSON.parse(localStorage.getItem("anthony4_"+key));
	for(var id in json){
		eval(id+'.value='+json[id]);
	};
	var m = key.match(/\d+$/);
	if(m) iIndex.value = m[0];
	drawAnthony(0);
}
function onScriptPasted(){
	setTimeout( function(){ // 兩個以上 (含兩個) 空白, 第一個自動替換為換行
		f.eval(input.value.replace(/ ( +)/g,function(_,m){return "\n"+m;}));
		input.value = "";
	}, 0)
}
function onScriptKeyUp(){
	if(event.key == "Enter") onEvalClick();
}
function onEvalClick(){
	f.eval(input.value);
	input.value = "";
}
function toAuto(){
	if(bAuto.innerHTML == "自動") bAuto.innerHTML = "暫停";
	else						  bAuto.innerHTML = "自動";
}
function incVal(){
	var incElement = event.path[0], m = incElement.id.match(/(Ang\d+)$/);
	if( !m ) return;
	var valElement = document.getElementById('iVal' + m[0]);
	valElement.value = parseInt(valElement.value) + parseInt(iDelta.value);
	drawAnthony(0);
}
function decVal(){
	var incElement = event.path[0], m = incElement.id.match(/(Ang\d+)$/);
	if( !m ) return;
	var valElement = document.getElementById('iVal' + m[0]);
	valElement.value = parseInt(valElement.value) - parseInt(iDelta.value);
	drawAnthony(0);
}
function toChangeVal(){
	if(bAuto.innerHTML != "自動") return;
	var curElement = event.path[0], m = curElement.id.match(/Ang\d+$/);
	if( !m ) return;
	drawAnthony(0);
}
function toKeyinVal(){
	if(event.key == "Enter") toChangeVal();
}
function toPrev(){
	var m=iFile.value.match(/(\D+)(\d*)$/);
	if( ! m ) return;
	var i=m[2]?parseInt(m[2]):0;
	if( i == 0 ) return;
	i--;
	var action=m[1]+i;
	var json = actions[action];
	for(var a in json){
		eval(a+'.value='+json[a]);
	};
	iFile.value = action;
	iIndex.value = i;
	drawAnthony(0);
}
function toNext(){
	var m=iFile.value.match(/(\D+)(\d*)$/);
	if( ! m ) return;
	var i = m[2] ? parseInt(m[2]) : 0;
	i++;
	var action=m[1]+i;
	var json = actions[action];
	if( ! json ) return;
	for(var a in json){
		eval(a+'.value='+json[a]);
	};
	iFile.value = action;
	iIndex.value = i;
	drawAnthony(0);
}