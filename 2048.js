var boardSize = 4 ;
var score = 0 ;
var bestScore = 0;

var board = {
};

var tileKey = function (col,row){
	return "tile" + col + "-" + row;
};

var createBoard = function(){
	var $board = $("#board");
	for(var row = 0; row < boardSize; row++){
		var $row = $("<div></div>").addClass("row");
		for(var col = 0; col < boardSize; col++){
			var $tile = $("<div></div>").addClass("tile");
			$tile.attr("id",tileKey(col,row));
			$row.append($tile);
		}
		$board.append($row);
	}
};


var getrow = function (row){
	var nums = [];
	for(var col = 0 ; col<boardSize;col++){
		var key = tileKey(col,row);
		var val = board[key];
		if(val){
			nums.push(val);
		}
	}
	return nums;
}

var getcol = function (col){
	var nums = [];
	for(var row = 0 ; row<boardSize;row++){
		var key = tileKey(col,row);
		var val = board[key];
		if(val){
			nums.push(val);
		}
	}
	return nums;
}

var setrow = function (newnums, row){
	for(var col = 0 ; col<boardSize;col++){
		var key = tileKey(col,row);
		board[key] = newnums[col];
	}
}

var setcol = function (newnums, col){
	for(var row = 0 ; row<boardSize;row++){
		var key = tileKey(col,row);
		board[key] = newnums[row];
	}
}

var combine = function (numbers){
	var newNumbers = [];
	// combine
		while(numbers.length>0){
			if(numbers[0] === numbers[1]){
				// add them together
				var sum = numbers[0] + numbers[1]
				updateScore(sum);
				// push sum onto newNumbers
				newNumbers.push(sum);
				// remove both numbers from numbers
				numbers.shift();
				numbers.shift();
			} else {
				// push first number onto newNumbers
				newNumbers.push(numbers[0]);
				//remove the first item from numbers array
				numbers.shift();
			}
		}
		// padd with zeros
		while(newNumbers.length<boardSize){
		newNumbers.push(undefined);
	}
	return newNumbers;
};



var refreshBoard = function(){
	for(var row = 0; row < boardSize; row++){
		for(var col = 0; col < boardSize; col++){
			var key = tileKey(col,row);
			var val = board[key];
			var $tile = $("#" + key);
			$tile.removeClass().addClass("tile").text("");
			$tile.text(val).addClass("tile-" + val);
		}
	}
	updateScore();
};

var combineBack = function (nums){
	return combine(nums.reverse()).reverse();
};

var moveLeft = function (){
	for(var n = 0;n<boardSize;n++){
		var old = getrow(n);
		var newnum = combine(old);
		setrow(newnum,n);
	}
	refreshBoard();
};

var moveUp = function (){
	for(var n = 0;n<boardSize;n++){
		var old = getcol(n);
		var newnum = combine(old);
		setcol(newnum,n);
	}
};

var moveRight = function (){
	for(var n = 0;n<boardSize;n++){
		var old = getrow(n);
		var newnum = combineBack(old);
		setrow(newnum,n);
	}
};

var moveDown = function (){
	for(var n = 0;n<boardSize;n++){
		var old = getcol(n);
		var newnum = combineBack(old);
		setcol(newnum,n);
	}
};

var getEmpty = function(){
	var empty = [];
	for(var row = 0; row < boardSize; row++){
		for(var col = 0; col < boardSize; col++){
			var key = tileKey(col,row);
			if( board[key] === undefined)
				empty.push(key);
		}
	}
	return empty;
};

var addTile = function(){
	var empty = getEmpty();
	var tile = Math.floor(Math.random() * empty.length);
	var index = empty[tile];
	var twoorfour = Math.random() > 0.9 ? 4 : 2;
	
	board[index] = twoorfour;
};

var hasChanged = function (oldBoard){
	for(var row = 0; row < boardSize; row++){
		for(var col = 0; col < boardSize; col++){
			var key = tileKey(col,row);
			if(board[key] !== oldBoard[key]){
				return true;
			}
		}
	}
	return false;
};

var possibleCombination = function (){
	for(var row = 0; row < boardSize; row++){
		for(var col = 0; col < boardSize; col++){
			var keyAt = tileKey(col,row);
			var keyRight = tileKey(col+1,row);
			var keyDown = tileKey(col,row+1);
			if(board[keyAt]===board[keyRight] || board[keyAt]===board[keyDown]){
				return true;
			}
		}
	}
	return false;
};

var gameOver = function (){
	var empty = getEmpty();
	//var f = ["tile1-1"];
	//var e = [];
	if(empty.length>0){
		return false;
	}
	else if(possibleCombination()){
		//console.log("possible combination");
		return false
	}
	return true;
};

var saveData = function () {
	localStorage.setItem("score", score);
	localStorage.setItem("bestsScore", bestScore);
	localStorage.setItem("board", JSON.stringify(board));
};

var updateScore = function (increment){
	// cool animation?
	if (increment){
		score+=increment;
	}
	if(score>bestScore){
		bestScore = score;
	}
	saveData();
	$("#score").text(score);
	$("#bestScore").text(bestScore);
};

var newGame = function (){
	board = {};
	score = 0;
	addTile();
	addTile();		
	refreshBoard();
	saveData();
	$("#game-over").remove();
};

var loadSavedData = function(){
	var savedScore = localStorage.getItem("score");
	if(savedScore){
		score = parseInt(savedScore,10);
	}
	var savedBestScore = localStorage.getItem("bestScore")
	console.log(savedBestScore);
	if(savedBestScore){
		bestScore = savedBestScore;
	}
	var b = localStorage.getItem("board");
	if(b){
		board = JSON.parse(b);
	} else {
		newGame();
	}
};

var gameOverMessage = function (){
	//alert("Game Over!");
	$("<div></div>").appendTo("#board")
					.attr("id","game-over")
					.text("Game Over!")
					.hide()
					.fadeIn();
};

var keyPressed = function (dir){
	var oldBoard = $.extend({},board);
	if(dir =="left"){
		moveLeft();
	}else if (dir =="up"){
		moveUp();
	}else if (dir =="right"){
		moveRight();
	}else if (dir =="down"){
		moveDown();
	}

	if(hasChanged(oldBoard)) {
		addTile();
		refreshBoard();
		saveData();
		if (gameOver()) {
			gameOverMessage();
		}
	}
};

$(document).ready(function(){
	createBoard();
	//newGame();
	loadSavedData();
	refreshBoard();
	
	$("#newGame").click(function(){
		newGame();
	})

	$(document).keydown(function (e){
		//console.log("Pushed key. "+ e.which);
		switch(e.which){
			case 37://left
			case 65://a
			case 100: //4
				keyPressed("left");
				//console.log("left");
				break;
			case 38://up
			case 87://w
			case 104://8
				keyPressed("up");
				//console.log("up");
				break;
			case 39://right
			case 68://d
			case 102://6
				keyPressed("right");
				//console.log("right");
				break;
			case 40://down
			case 83://s
			case 98://2
				keyPressed("down");
				//console.log("down");
				break;
		}
	});
});


