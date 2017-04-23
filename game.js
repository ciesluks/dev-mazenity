// Source code: http://www.emanueleferonato.com/2015/07/03/pure-javascript-a-maze-solving-with-a-bit-of-magic-thanks-to-phaser/
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

var game;
var maze = [];
var tileSize = 20;
var mazeGraphics;
var playerPosX;
var playerPosY;

var leftKeyIsDown = false;
var rightKeyIsDown = false;
var upKeyIsDown = false;
var downKeyIsDown = false;
var spaceKeyIsDown = false;

window.onload = function() {
		game = new Phaser.Game(620, 620, Phaser.CANVAS, "gameContainer",
		{ create: create, update: update });
}

function create(){
		game.stage.backgroundColor = "#1E88E5";

    mazeGraphics = game.add.graphics(0, 0);
		playerGraphics = game.add.graphics(0, 0);

		playerPosX = 15;
		playerPosY = 15;
    generateMaze(32,32);
}

function update(){
		if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
        if (leftKeyIsDown == false){
    				while (maze[playerPosY][playerPosX - 1] == 0){
    						playerPosX -= 1;
    						drawPlayer();
                if (maze[playerPosY - 1][playerPosX] == 0 || maze[playerPosY + 1][playerPosX] == 0){
                    break;
                }
    				}
        }
        leftKeyIsDown = true;
		}
    else{
        leftKeyIsDown = false;
    }
		if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
        if (rightKeyIsDown == false){
    				while (maze[playerPosY][playerPosX + 1] == 0){
    						playerPosX += 1;
    						drawPlayer();
                if (maze[playerPosY - 1][playerPosX] == 0 || maze[playerPosY + 1][playerPosX] == 0){
                    break;
                }
    				}
        }
        rightKeyIsDown = true;
		}
    else{
        rightKeyIsDown = false;
    }
		if (game.input.keyboard.isDown(Phaser.Keyboard.UP)){
        if (upKeyIsDown == false){
    				while (maze[playerPosY - 1][playerPosX] == 0){
    						playerPosY -= 1;
    						drawPlayer();
                if (maze[playerPosY][playerPosX - 1] == 0 || maze[playerPosY][playerPosX + 1] == 0){
                    break;
                }
    				}
        }
        upKeyIsDown = true;
		}
    else{
        upKeyIsDown = false;
    }
		if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
        if (downKeyIsDown == false){
      			while (maze[playerPosY + 1][playerPosX] == 0){
      					playerPosY += 1;
      					drawPlayer();
                if (maze[playerPosY][playerPosX - 1] == 0 || maze[playerPosY][playerPosX + 1] == 0){
                    break;
                }
      			}
        }
        downKeyIsDown = true;
		}
    else{
        downKeyIsDown = false;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        if (spaceKeyIsDown == false){
            if (playerPosX == 1 && playerPosY == 1 || playerPosX == 1 && playerPosY == 29
                || playerPosX == 29 && playerPosY == 1 || playerPosX == 29 && playerPosY == 29){
                  generateMaze(32,32);
            }
        }
        spaceKeyIsDown = true;
    }
    else{
      spaceKeyIsDown = false;
    }
}

function generateMaze(mazeWidth, mazeHeight){
    createMaze(mazeWidth,mazeHeight);
    drawGoal();
    drawPlayer();
}

function createMaze(mazeWidth, mazeHeight){
		var moves = [];
		for(var i = 0; i < mazeHeight; i ++){
				maze[i] = [];
				for(var j = 0; j < mazeWidth; j ++){
						maze[i][j] = 1;
				}
		}
		var posX = 15;
		var posY = 15;
		maze[posX][posY] = 0;
		moves.push(posY + posY * mazeWidth);
		while(moves.length){
				var possibleDirections = "";
				if(posX+2 > 0 && posX + 2 < mazeHeight - 1 && maze[posX + 2][posY] == 1){
						possibleDirections += "S";
				}
				if(posX-2 > 0 && posX - 2 < mazeHeight - 1 && maze[posX - 2][posY] == 1){
						possibleDirections += "N";
				}
				if(posY-2 > 0 && posY - 2 < mazeWidth - 1 && maze[posX][posY - 2] == 1){
						possibleDirections += "W";
				}
				if(posY+2 > 0 && posY + 2 < mazeWidth - 1 && maze[posX][posY + 2] == 1){
						possibleDirections += "E";
				}
				if(possibleDirections){
						var move = game.rnd.between(0, possibleDirections.length - 1);
						switch (possibleDirections[move]){
								 case "N":
											maze[posX - 2][posY] = 0;
											maze[posX - 1][posY] = 0;
											posX -= 2;
											break;
								 case "S":
											maze[posX + 2][posY] = 0;
											maze[posX + 1][posY] = 0;
											posX += 2;
											break;
								 case "W":
											maze[posX][posY - 2] = 0;
											maze[posX][posY - 1] = 0;
											posY -= 2;
											break;
								 case "E":
											maze[posX][posY + 2]=0;
											maze[posX][posY + 1]=0;
											posY += 2;
											break;
						}
						moves.push(posY + posX * mazeWidth);
				}
				else{
						var back = moves.pop();
						posX = Math.floor(back / mazeWidth);
						posY = back % mazeWidth;
				}
		}
		drawMaze(mazeWidth, mazeHeight);
}

function drawPlayer(){
		playerGraphics.clear();
		playerGraphics.beginFill(0xFFFFFF);
    playerGraphics.drawCircle(playerPosX * tileSize + 10, playerPosY * tileSize + 10, tileSize - 10);
		playerGraphics.endFill();
		drawPlayerPath();
}

function drawPlayerPath(){
	mazeGraphics.beginFill(0xFFFFFF);
	mazeGraphics.drawCircle(playerPosX * tileSize + 10, playerPosY * tileSize + 10, tileSize - 16);
	mazeGraphics.endFill();
}

function drawGoal(){
		mazeGraphics.beginFill(0xFFFFFF);
		mazeGraphics.drawCircle(1 * tileSize + 10, 1 * tileSize + 10, tileSize - 7);
    mazeGraphics.drawCircle(1 * tileSize + 10, 29 * tileSize + 10, tileSize - 7);
    mazeGraphics.drawCircle(29 * tileSize + 10, 1 * tileSize + 10, tileSize - 7);
    mazeGraphics.drawCircle(29 * tileSize + 10, 29 * tileSize + 10, tileSize - 7);
		mazeGraphics.endFill();
    mazeGraphics.beginFill(0x1E88E5);
		mazeGraphics.drawCircle(1 * tileSize + 10, 1 * tileSize + 10, tileSize - 11);
    mazeGraphics.drawCircle(1 * tileSize + 10, 29 * tileSize + 10, tileSize - 11);
    mazeGraphics.drawCircle(29 * tileSize + 10, 1 * tileSize + 10, tileSize - 11);
    mazeGraphics.drawCircle(29 * tileSize + 10, 29 * tileSize + 10, tileSize - 11);
		mazeGraphics.endFill();
}

function drawMaze(mazeWidth, mazeHeight){
		mazeGraphics.clear();
    //drawBackground(mazeWidth, mazeHeight);
		mazeGraphics.beginFill(0x212121);
		for(i = 0; i < mazeHeight; i ++){
		    for(j = 0; j < mazeWidth; j ++){
		         if(maze[i][j] == 1){
		             mazeGraphics.drawRect(j * tileSize, i * tileSize, tileSize, tileSize);
		         }
		    }
		}
		mazeGraphics.endFill();
}

function drawBackground(mazeWidth, mazeHeight){
    mazeGraphics.beginFill(0x0D47A1);
    for(i = 0; i < mazeHeight; i ++){
        for(j = 0; j < mazeWidth; j ++){
             if(maze[i][j] == 1){
                 mazeGraphics.drawRect(j * tileSize - 2, i * tileSize - 2, tileSize + 4, tileSize + 4);
             }
        }
    }
    mazeGraphics.endFill();
}
