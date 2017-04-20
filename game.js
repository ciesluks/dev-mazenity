// Source code: http://www.emanueleferonato.com/2015/07/03/pure-javascript-a-maze-solving-with-a-bit-of-magic-thanks-to-phaser/

var game;
var maze = [];
var mazeWidth = 31;
var mazeHeight = 31;
var tileSize = 20;
var mazeGraphics;

window.onload = function() {
	game = new Phaser.Game(620, 620, Phaser.CANVAS, "gameContainer",
	{ create: create });
}

var playGame = function(game){};

function create(){
		game.stage.backgroundColor = "#00897B";

    mazeGraphics = game.add.graphics(0, 0);
    var moves = [];
    for(var i = 0; i < mazeHeight; i ++){
         maze[i] = [];
         for(var j = 0; j < mazeWidth; j ++){
              maze[i][j] = 1;
         }
    }
    var posX = 1;
    var posY = 1;
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
    drawMaze(posX, posY);
		drawGoal(29,29);
		var easystar = new EasyStar.js();
    easystar.setGrid(maze);
    easystar.setAcceptableTiles([0]);
    easystar.findPath(1, 1, 29, 29, drawPath);
    easystar.calculate();
}

function drawPath(path){
     var i = 0;
     game.time.events.loop(Phaser.Timer.SECOND/25, function(){
          if(i < path.length){
               mazeGraphics.beginFill(0xFFFFFF);
               mazeGraphics.drawRect(path[i].x * tileSize + 8, path[i].y * tileSize + 8, tileSize - 16, tileSize - 16);
               i++;
               mazeGraphics.endFill();
          }
     })
}

function drawGoal(posX, posY){
     mazeGraphics.beginFill(0x004D40);
     mazeGraphics.drawRect(posX * tileSize + 5, posY * tileSize + 5, tileSize - 10, tileSize - 10);
     mazeGraphics.endFill();
}

function drawMaze(posX, posY){
     mazeGraphics.clear();
     mazeGraphics.beginFill(0xFAFAFA);
     for(i = 0; i < mazeHeight; i ++){
          for(j = 0; j < mazeWidth; j ++){
               if(maze[i][j] == 1){
                    mazeGraphics.drawRect(j * tileSize, i * tileSize, tileSize, tileSize);
               }
          }
     }
     mazeGraphics.endFill();
}
