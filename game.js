window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

var game;
var mazes = [];
var tileSize = 24;
var mazeWidth = 25;
var mazeHeight = 25;
var players = [];

window.onload = function() {
		game = new Phaser.Game(1224, 600, Phaser.CANVAS, "gameContainer",
		{ preload: preload, create: create, update: update });
}

function preload(){
    game.load.image('maze_wall', 'assets/images/road_grass.png');
    game.load.image('maze_cross', 'assets/images/road_cross.png');
    game.load.image('maze_horizontal_left', 'assets/images/road_horizontal_left.png');
    game.load.image('maze_horizontal_right', 'assets/images/road_horizontal_right.png');
    game.load.image('maze_horizontal', 'assets/images/road_horizontal.png');
    game.load.image('maze_threeway_down', 'assets/images/road_threeway_down.png');
    game.load.image('maze_threeway_up', 'assets/images/road_threeway_up.png');
    game.load.image('maze_threeway_left', 'assets/images/road_threeway_left.png');
    game.load.image('maze_threeway_right', 'assets/images/road_threeway_right.png');
    game.load.image('maze_vertical', 'assets/images/road_vertical.png');
    game.load.image('maze_vertical_up', 'assets/images/road_vertical_up.png');
    game.load.image('maze_vertical_down', 'assets/images/road_vertical_down.png');
    game.load.image('maze_twoway_left_down', 'assets/images/road_twoway_left_down.png');
    game.load.image('maze_twoway_left_up', 'assets/images/road_twoway_left_up.png');
    game.load.image('maze_twoway_right_down', 'assets/images/road_twoway_right_down.png');
    game.load.image('maze_twoway_right_up', 'assets/images/road_twoway_right_up.png');
    game.load.image('ufo_green', 'assets/images/ufo_green.png');
}

function create(){
		game.stage.backgroundColor = "#404040";

    createMaze();

    players[0] = new player(
        Phaser.Keyboard.A,
        Phaser.Keyboard.D,
        Phaser.Keyboard.W,
        Phaser.Keyboard.S,
        0
    );
    players[1] = new player(
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN,
        624
    );
    newGame();
    //game.time.events.add(Phaser.Timer.SECOND * 20, restartGame, this);
}

function update(){
    for(i = 0; i < players.length; i ++){
		    movePlayer(players[i]);
        checkForGoal(players[i]);
    }
}

function player(left, right, up, down, mazeStartPosX) {
    this.posX = 1;
    this.posY = 1;
    this.leftKey = left;
    this.rightKey = right;
    this.upKey = up;
    this.downKey = down;
    this.leftKeyIsDown = false;
    this.rightKeyIsDown = false;
    this.upKeyIsDown = false;
    this.downKeyIsDown = false;
    this.currentMazeNumber = 0;
    this.currentMaze = new maze(mazeStartPosX,0,mazes[this.currentMazeNumber],23,23);
    this.score = 0;
    this.sprite = game.add.sprite(this.currentMaze.posX + (this.posX * tileSize), this.currentMaze.posY + (this.posY * tileSize), 'ufo_green')
}

function maze(x, y, grid, goalPosX, goalPosY) {
    this.posX = x;
    this.posY = y;
    this.grid = grid;
    this.goalPosX = goalPosX;
    this.goalPosY = goalPosY;
    this.graphics = game.add.graphics(0, 0);
    this.walls = game.add.group();
}

function movePlayer(player){
    var maze = player.currentMaze.grid;
    if (game.input.keyboard.isDown(player.leftKey)){
        if (player.leftKeyIsDown == false){
            while (maze[player.posY][player.posX - 1] == 0){
                player.posX -= 1;
                drawPlayer(player);
                if (maze[player.posY - 1][player.posX] == 0 || maze[player.posY + 1][player.posX] == 0){
                    break;
                }
            }
        }
        player.leftKeyIsDown = true;
    }
    else{
        player.leftKeyIsDown = false;
    }
    if (game.input.keyboard.isDown(player.rightKey)){
        if (player.rightKeyIsDown == false){
            while (maze[player.posY][player.posX + 1] == 0){
                player.posX += 1;
                drawPlayer(player);
                if (maze[player.posY - 1][player.posX] == 0 || maze[player.posY + 1][player.posX] == 0){
                    break;
                }
            }
        }
        player.rightKeyIsDown = true;
    }
    else{
        player.rightKeyIsDown = false;
    }
    if (game.input.keyboard.isDown(player.upKey)){
        if (player.upKeyIsDown == false){
            while (maze[player.posY - 1][player.posX] == 0){
                player.posY -= 1;
                drawPlayer(player);
                if (maze[player.posY][player.posX - 1] == 0 || maze[player.posY][player.posX + 1] == 0){
                    break;
                }
            }
        }
        player.upKeyIsDown = true;
    }
    else{
        player.upKeyIsDown = false;
    }
    if (game.input.keyboard.isDown(player.downKey)){
        if (player.downKeyIsDown == false){
            while (maze[player.posY + 1][player.posX] == 0){
                player.posY += 1;
                drawPlayer(player);
                if (maze[player.posY][player.posX - 1] == 0 || maze[player.posY][player.posX + 1] == 0){
                    break;
                }
            }
        }
        player.downKeyIsDown = true;
    }
    else{
        player.downKeyIsDown = false;
    }
}

function checkForGoal(player) {
    if (player.posX == player.currentMaze.goalPosX && player.posY == player.currentMaze.goalPosY){
          createMaze();
          player.score = player.score + 1;
          player.posX = 1;
          player.posY = 1;
          player.currentMazeNumber = player.currentMazeNumber + 1;
          player.currentMaze.grid = mazes[player.currentMazeNumber];

          drawMaze(player);
          drawGoal(player);
          drawPlayer(player);
    }
}

function newGame(){
    for(var i = 0; i < players.length; i ++){
        drawMaze(players[i]);
        drawGoal(players[i]);
        drawPlayer(players[i]);
    }
}

function restartGame(){
    game.state.restart();
}

function createMaze(){
    var maze = [];
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
    mazes.push(maze);
}

function drawPlayer(player){
    player.sprite.x = player.currentMaze.posX + (player.posX * tileSize);
    player.sprite.y = player.currentMaze.posY + (player.posY * tileSize)
		drawPlayerPath(player);
}

function drawPlayerPath(player){
  	player.currentMaze.graphics.beginFill(0xFFFFFF);
  	player.currentMaze.graphics.drawCircle(player.currentMaze.posX + (player.posX * tileSize + 10), player.currentMaze.posY + (player.posY * tileSize + 10), tileSize - 16);
  	player.currentMaze.graphics.endFill();
}

function drawGoal(player){
		player.currentMaze.graphics.beginFill(0xFFFFFF);
		player.currentMaze.graphics.drawCircle(player.currentMaze.posX + (player.currentMaze.goalPosX * tileSize + 10), player.currentMaze.posY + (player.currentMaze.goalPosY * tileSize + 10), tileSize - 7);
		player.currentMaze.graphics.endFill();
    player.currentMaze.graphics.beginFill(0x1E88E5);
		player.currentMaze.graphics.drawCircle(player.currentMaze.posX + (player.currentMaze.goalPosX * tileSize + 10), player.currentMaze.posY + (player.currentMaze.goalPosY * tileSize + 10), tileSize - 11);
		player.currentMaze.graphics.endFill();
}

function drawMaze(player){
    player.currentMaze.graphics.clear();
    player.currentMaze.walls.removeAll();
    var grid = player.currentMaze.grid;
		for(i = 0; i < mazeHeight; i ++){
		    for(j = 0; j < mazeWidth; j ++){
		         if(grid[i][j] == 1){
                 player.currentMaze.walls.create(player.currentMaze.posX + (j * tileSize), player.currentMaze.posY + (i * tileSize), 'maze_wall');
		         }
             else if(grid[i][j] == 0){
                 if(grid[i][j-1] == 0 && grid[i][j+1] == 0 && grid[i+1][j] == 0 && grid[i-1][j] == 0){
                    player.currentMaze.walls.create(player.currentMaze.posX + (j * tileSize), player.currentMaze.posY + (i * tileSize), 'maze_cross');
                 }
                 else if(grid[i][j+1] == 0 && grid[i+1][j] == 0 && grid[i-1][j] == 0){
                    player.currentMaze.walls.create(player.currentMaze.posX + (j * tileSize), player.currentMaze.posY + (i * tileSize), 'maze_threeway_right');
                 }
                 else if(grid[i][j-1] == 0 && grid[i+1][j] == 0 && grid[i-1][j] == 0){
                    player.currentMaze.walls.create(player.currentMaze.posX + (j * tileSize), player.currentMaze.posY + (i * tileSize), 'maze_threeway_left');
                 }
                 else if(grid[i][j-1] == 0 && grid[i][j+1] == 0 && grid[i-1][j] == 0){
                    player.currentMaze.walls.create(player.currentMaze.posX + (j * tileSize), player.currentMaze.posY + (i * tileSize), 'maze_threeway_up');
                 }
                 else if(grid[i][j-1] == 0 && grid[i][j+1] == 0 && grid[i+1][j] == 0){
                    player.currentMaze.walls.create(player.currentMaze.posX + (j * tileSize), player.currentMaze.posY + (i * tileSize), 'maze_threeway_down');
                 }
                 else if(grid[i-1][j] == 0 && grid[i][j-1] == 0){
                    player.currentMaze.walls.create(player.currentMaze.posX + (j * tileSize), player.currentMaze.posY + (i * tileSize), 'maze_twoway_left_up');
                 }
                 else if(grid[i+1][j] == 0 && grid[i][j-1] == 0){
                    player.currentMaze.walls.create(player.currentMaze.posX + (j * tileSize), player.currentMaze.posY + (i * tileSize), 'maze_twoway_left_down');
                 }
                 else if(grid[i-1][j] == 0 && grid[i][j+1] == 0){
                    player.currentMaze.walls.create(player.currentMaze.posX + (j * tileSize), player.currentMaze.posY + (i * tileSize), 'maze_twoway_right_up');
                 }
                 else if(grid[i+1][j] == 0 && grid[i][j+1] == 0){
                    player.currentMaze.walls.create(player.currentMaze.posX + (j * tileSize), player.currentMaze.posY + (i * tileSize), 'maze_twoway_right_down');
                 }
                 else if(grid[i][j-1] == 0 && grid[i][j+1] == 0){
                    player.currentMaze.walls.create(player.currentMaze.posX + (j * tileSize), player.currentMaze.posY + (i * tileSize), 'maze_horizontal');
                 }
                 else if(grid[i-1][j] == 0 && grid[i+1][j] == 0){
                    player.currentMaze.walls.create(player.currentMaze.posX + (j * tileSize), player.currentMaze.posY + (i * tileSize), 'maze_vertical');
                 }
                 else if(grid[i-1][j] == 0){
                    player.currentMaze.walls.create(player.currentMaze.posX + (j * tileSize), player.currentMaze.posY + (i * tileSize), 'maze_vertical_down');
                 }
                 else if(grid[i+1][j] == 0){
                    player.currentMaze.walls.create(player.currentMaze.posX + (j * tileSize), player.currentMaze.posY + (i * tileSize), 'maze_vertical_up');
                 }
                 else if(grid[i][j+1] == 0){
                    player.currentMaze.walls.create(player.currentMaze.posX + (j * tileSize), player.currentMaze.posY + (i * tileSize), 'maze_horizontal_left');
                 }
                 else if(grid[i][j-1] == 0){
                    player.currentMaze.walls.create(player.currentMaze.posX + (j * tileSize), player.currentMaze.posY + (i * tileSize), 'maze_horizontal_right');
                 }
		         }
		    }
		}
}
