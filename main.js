var canvas = document.getElementById('canvas');
var width = canvas.width;
var height = canvas.height;
var context = canvas.getContext('2d');

function drawCircle(center, radius){
	context.beginPath();
	context.arc(center[0],center[1],radius,0,2*Math.PI);
	context.closePath();
	context.fillStyle = 'black';
	context.fill();
}

function drawHexUnit(center, radius, covered){
	if (covered){
		context.beginPath();
		context.moveTo(center[0], center[1]-radius);
		context.lineTo(center[0]-radius*Math.sqrt(3)/2, center[1]-radius/2);
		context.lineTo(center[0]-radius*Math.sqrt(3)/2, center[1]+radius/2);
		context.lineTo(center[0], center[1]+radius);
		context.lineTo(center[0]+radius*Math.sqrt(3)/2, center[1]+radius/2);
		context.lineTo(center[0]+radius*Math.sqrt(3)/2, center[1]-radius/2);
		context.closePath();
		context.fillStyle = 'black';
		context.fill();
	}
	else{
		drawCircle(center, radius/5);
		context.beginPath();
		context.moveTo(center[0], center[1]-radius);
		context.lineTo(center[0]-radius*Math.sqrt(3)/2, center[1]-radius/2);
		context.lineTo(center[0]-radius*Math.sqrt(3)/2, center[1]+radius/2);
		context.lineTo(center[0], center[1]+radius);
		context.lineTo(center[0]+radius*Math.sqrt(3)/2, center[1]+radius/2);
		context.lineTo(center[0]+radius*Math.sqrt(3)/2, center[1]-radius/2);
		context.closePath();
		context.strokeStyle = 'black';
		context.stroke();
	}
}

function hexToCoord(hexPos){
	var x = hexPos[0]/2-hexPos[1]/2;
	var y = hexPos[2]*Math.sqrt(3)/2;
	x = (x+5)*50;
	y = (5-y)*50;
	return [x,y];
}

function coordToHex(coord){
	var squarePos = [coord[0]/50-5, 5-coord[1]/50];
	var x = squarePos[0]-squarePos[1]/Math.sqrt(3);
	var y = -squarePos[0]-squarePos[1]/Math.sqrt(3);
	var z = squarePos[1]*2/Math.sqrt(3);
	return [x,y,z];
}

function distance(hex1, hex2){
	return Math.max(Math.abs(hex1[0]-hex2[0]),Math.abs(hex1[1]-hex2[1]),Math.abs(hex1[2]-hex2[2]))
}

function drawBoard(board){
	for (var key in board){
		var hexPos = JSON.parse(key);
		var coord = hexToCoord(hexPos);
		drawHexUnit(coord,50/Math.sqrt(3),board[key]);
	}
}

function clear(){
	context.fillStyle = '#f1f1f1';
	context.fillRect(0,0,width,height);
}

var board = {};

canvas.addEventListener("click", getClickPosition, false);
function getClickPosition(e) {
    var parentPosition = getPosition(e.currentTarget);
    var x = e.clientX - parentPosition.x;
    var y = e.clientY - parentPosition.y;
    clickEvent(x, y);
}
function getPosition(el) {
    var xPos = 0;
    var yPos = 0;
    while (el) {
        if (el.tagName == "BODY") {
            var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
            var yScroll = el.scrollTop || document.documentElement.scrollTop;
            xPos += (el.offsetLeft - xScroll + el.clientLeft);
            yPos += (el.offsetTop - yScroll + el.clientTop);
        }
        else {
            xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
            yPos += (el.offsetTop - el.scrollTop + el.clientTop);
        }
        el = el.offsetParent;
    }
    return {
        x: xPos,
        y: yPos
    };
}

function clickEvent(x, y){
	console.log(x,y);
	var hex = coordToHex([x,y]);
	var range = [[],[],[]];
	for (var i=0; i<=2; i++){
		if (Math.ceil(hex[i])>=-4 && Math.ceil(hex[i])<=4){
			range[i].push(Math.ceil(hex[i]));
		}
		if (Math.floor(hex[i])>=-4 && Math.floor(hex[i])<=4){
			range[i].push(Math.floor(hex[i]));
		}
	}
	var possibleUnits = [];
	for (var a of range[0]){
		for (var b of range[1]){
			for (var c of range[2]){
				if (a+b+c===0){
					possibleUnits.push([a,b,c]);
				}
			}
		}
	}
	var minDistance = 2/3;
	var target = null;
	for (var i=0; i<possibleUnits.length; i++){
		var unit = possibleUnits[i];
		if (distance(unit,hex) < minDistance){
			target = unit;
			minDistance = distance(unit,hex);
		}
	}
	if (target!==null){
		if (board[JSON.stringify(target)]){
			board[JSON.stringify(target)] = false;
		}
		else{
			board[JSON.stringify(target)] = true;
		}
		clear();
		drawBoard(board);
	}
}

function start(){
	clear();
	for (var x=-4;x<=4;x++){
		for (var y=-4;y<=4;y++){
			if (-x-y>=-4 && -x-y<=4){
				board[JSON.stringify([x,y,-x-y])] = false;
			}
		}
	}
	drawBoard(board);
}