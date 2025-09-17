let board;
let boardWidth = 360;
let boardHeight = 640;
let context;
let birdImg;

let birdWidth = 34
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

let pipesArr = [];
let pipewidth = 64;
let pipeheight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeimg, bottomPipimg;

let pipevelocity = -2;
let velocityY = 0;
let gravity = 0.4

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");
    
    birdImg = new Image();
    birdImg.src = './asserts/flappybird.png'
    birdImg.onload = () => {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeimg = new Image();
    bottomPipimg = new Image();
    topPipeimg.src = './asserts/toppipe.png'
    bottomPipimg.src = './asserts/bottompipe.png'

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveBird);
}

function update() {
    requestAnimationFrame(update); 
    context.clearRect(0, 0, boardWidth, boardHeight);
    
    if (gameOver) {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
        context.fillStyle = "White";
        context.font = "45px sans-serif"
        context.fillText(score, 5, 45);
        context.fillText("Game over!", 50, 100);
        return; 
    }
    
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    if (bird.y + bird.height >= boardHeight || bird.y < 0) {
        gameOver = true;
    }

    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    for (let i = 0; i < pipesArr.length; i++) {
        let pipe = pipesArr[i];
        pipe.x += pipevelocity;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 1;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }
    
    while (pipesArr.length > 0 && pipesArr[0].x < -pipewidth) {
        pipesArr.shift();
    }

    context.fillStyle = "White";
    context.font = "45px sans-serif"
    context.fillText(score, 5, 45);
}

function placePipes() {
    if (gameOver) return;

    let randomPipeY = pipeY - pipeheight / 4 - Math.random() * (pipeheight / 2);

    let topPipe = {
        img: topPipeimg,
        x: pipeX,
        y: randomPipeY,
        width: pipewidth,
        height: pipeheight,
        passed: false
    }

    let bottomPipe = {
        img: bottomPipimg,
        x: pipeX,
        y: randomPipeY + pipeheight + boardHeight / 4 - 20,
        width: pipewidth,
        height: pipeheight,
        passed: true
    }
    pipesArr.push(topPipe);
    pipesArr.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == 'Space' || e.code == 'ArrowUp' || e.code == 'KeyW') {
        velocityY = -6;

        if (gameOver) {
            bird.y = birdY;
            pipesArr = [];
            score = 0;
            velocityY = 0; 
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}