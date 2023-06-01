
//canvas 
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

//del av ormen class
//denna class representerar en ensam del av ormens kropp den har x och y kordinaters om visar vart ormen är
class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

//spelets variabler
//These variables store various game parameters and state information.
//speed: Kontrollerar spelets hastighet.
//tileCount and tileSize: Definierar antalet och storleken på brickor på spelbrädet.
//headX and headY: Lagrar den aktuella positionen för ormens huvud.
//snakeParts: En array för att lagra ormens kroppsdelar.
//tailLength: Håller koll på ormens längd.
//appleX and appleY:  Lagrar positionen för äpplet som ormen behöver äta.
//inputsXVelocity and inputsYVelocity: Lagrar användarens inmatning för ormens rörelseriktning.
//xVelocity and yVelocity: Representerar ormens nuvarande hastighet.
//score: Håller koll på spelarens poäng.
//gulpSound: Ett ljudobjekt för att spela upp en ljudeffekt.
let speed = 7;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;

let headX = 10;
let headY = 10;
const snakeParts = [];
let tailLength = 2;

let appleX = 5;
let appleY = 5;

let inputsXVelocity = 0;
let inputsYVelocity = 0;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;

const gulpSound = new Audio("gulp.mp3");

//spel loop
//detta är spelets huvud loop
//Den uppdaterar spelets tillstånd, rensar skärmen och ritar om spel elementen (orm, äpple och poäng) upprepade gånger med en specifik bildhastighet som definieras av variabeln "speed".

function drawGame() {
  xVelocity = inputsXVelocity;
  yVelocity = inputsYVelocity;

  changeSnakePosition();
  let result = isGameOver();
  if (result) {
    return;
  }

  clearScreen();

  checkAppleCollision();
  drawApple();
  drawSnake();

  drawScore();

  if (score > 5) {
    speed = 9;
  }
  if (score > 10) {
    speed = 11;
  }

  setTimeout(drawGame, 1000 / speed);
}

//game over kontroll
//Denna funktion kontrollerar om spelet är över genom att kolla om ormen träffar väggarna eller sig själv. Om spelet är över visas ett meddelande "Game Over!" på skärmen.
function isGameOver() {
  let gameOver = false;

  if (yVelocity === 0 && xVelocity === 0) {
    return false;
  }

  //väggar
  if (headX < 0) {
    gameOver = true;
  } else if (headX === tileCount) {
    gameOver = true;
  } else if (headY < 0) {
    gameOver = true;
  } else if (headY === tileCount) {
    gameOver = true;
  }

  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    }
  }

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "50px Verdana";

    if (gameOver) {
      ctx.fillStyle = "white";
      ctx.font = "50px Verdana";

      var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop("0", " magenta");
      gradient.addColorStop("0.5", "blue");
      gradient.addColorStop("1.0", "red");
      
      ctx.fillStyle = gradient;

      ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
    }

    ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
  }

  return gameOver;
}

//"design" funktioner
//drawScore(): Ritar spelarens poäng på skärmen.
//clearScreen(): Rensar hela skärmen genom att rita en svart rektangel över den.
//drawSnake(): Ritar ormens kroppsdelar på skärmen baserat på deras positioner som är lagrade i arrayen snakeParts. Ormens huvud ritas också separat.
//changeSnakePosition(): Uppdaterar positionen för ormens huvud baserat på dess hastighet.
//drawApple(): Ritar äpplet på duken på den angivna positionen.
//checkAppleCollision():  Kontrollerar om ormens äter ett äpple. Om ormen äter ett äpple uppdateras äpplets position, ormens svanslängd och poängen ökar.


function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "10px Verdana";
  ctx.fillText("Score " + score, canvas.width - 50, 10);
}

function clearScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = "green";
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  snakeParts.push(new SnakePart(headX, headY)); 
  while (snakeParts.length > tailLength) {
    snakeParts.shift(); 
  }

  ctx.fillStyle = "orange";
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function changeSnakePosition() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}

function drawApple() {
  ctx.fillStyle = "red";
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function checkAppleCollision() {
  if (appleX === headX && appleY == headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;
    gulpSound.play();
  }
}
// användar input
//Dessa rader lägger till en händelselyssnare på hela HTML-dokumentets kropp för att fånga tangentbordsinmatning. Funktionen keyDown hanterar piltangenterna (upp, ner, vänster, höger) och W, S, A, D-tangenterna för att ändra ormens riktning.
//tanken är även att den ska förhindra att ormen omedelbart vänder riktning.
document.body.addEventListener("keydown", keyDown);

function keyDown(event) {
  //upp
  if (event.keyCode == 38 || event.keyCode == 87) {
    //87 är w
    if (inputsYVelocity == 1) return;
    inputsYVelocity = -1;
    inputsXVelocity = 0;
  }

  //down
  if (event.keyCode == 40 || event.keyCode == 83) {
    // 83 är s
    if (inputsYVelocity == -1) return;
    inputsYVelocity = 1;
    inputsXVelocity = 0;
  }

  //left
  if (event.keyCode == 37 || event.keyCode == 65) {
    // 65 är a
    if (inputsXVelocity == 1) return;
    inputsYVelocity = 0;
    inputsXVelocity = -1;
  }

  //right
  if (event.keyCode == 39 || event.keyCode == 68) {
    //68 är d
    if (inputsXVelocity == -1) return;
    inputsYVelocity = 0;
    inputsXVelocity = 1;
  }
}
//spelet startar
//Denna rad startar spelet genom att anropa funktionen drawGame, som startar spel loopen och börjar skapa spel ementen på skärmen.
//denna rad kod skapar spelmiljön, definierar spellogiken, hanterar användarinput och uppdaterar kontinuerligt spelets tillstånd för att skapa ett spelbart Snakespel.
drawGame();