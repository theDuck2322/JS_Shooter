const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = innerWidth;
const height = innerHeight;
canvas.width = width;
canvas.height = height;

let speed = 4;

// initializing classes

class Text {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Player {
    constructor(px, py, width, height) {
        this.px = px;
        this.py = py;
        this.width = width;
        this.height = height;
        this.rotation = 0; // Initialize rotation to 0
        this.sprite = new Image();
        this.sprite.src = 'Resources/rocket.png';
    }
}

// making objects

let player = new Player((width / 2) - 50, (height / 2) - 80, 50, 80);

let scoreText = new Text(1300, 50);
let score = 0;

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "bold 18px Arial";
    ctx.fillText(`Score: ${score}`, scoreText.x, scoreText.y);
}

function getScore() {
    // Implement score logic if needed
}

function clear() {
    ctx.fillStyle = "#000061";
    ctx.fillRect(0, 0, width, height);
}

function drawPlayer() {
    ctx.save(); // Save the current context state
    ctx.translate(player.px + player.width / 2, player.py + player.height / 2); // Translate to the center of the player
    ctx.rotate(player.rotation); // Rotate
    ctx.drawImage(player.sprite, -player.width / 2, -player.height / 2, player.width, player.height); // Draw the rotated player
    ctx.restore(); // Restore the saved context state
}

function movePlayer() {
    window.addEventListener("keydown", function (event) {
        if (event.defaultPrevented) {
            return; // Do nothing if the event was already processed
        }

        switch (event.key) {
            case "s":
                player.py += speed;
                break;
            case "w":
                player.py -= speed;
                break;
            case "a":
                player.px -= speed;
                break;
            case "d":
                player.px += speed;
                break;
            case "ArrowLeft": // Rotate counter-clockwise on left arrow key press
                player.rotation -= 0.1;
                break;
            case "ArrowRight": // Rotate clockwise on right arrow key press
                player.rotation += 0.1;
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }

        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
    }, true);
}

function draw() {
    clear();
    drawPlayer();
    drawScore();
}

function start() {
    score = 0;
    requestAnimationFrame(update);
}

function update() {
    draw();
    getScore();
    movePlayer();
    requestAnimationFrame(update);
}

start();
