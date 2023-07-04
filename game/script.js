
var char = document.getElementsByClassName('char')
var center = document.getElementsByClassName('center')
var im = document.getElementById("im")
var score_div = document.getElementById('score-text')
var abstacleHeights = [50, 46, 70, 100]
var score = 0
var coins_count = 0
var game_over = document.getElementById("game-over")
var inter = []
var coins = []
var s1
var s2
var isRestart = false
var start = document.getElementById("start")
var coin_div = document.getElementById("coin_count")
var start_div = document.getElementsByClassName("start")
var restart = document.getElementById("restart")
var created_obstacles = []
var created_coins = []
var pos = 0
let isJumping = false;

start.onclick = function () {
    startAction()
};

restart.onclick = function () {
    restartAction()
};

var isRightArrowPressed = false;
var isLeftArrowPressed = false;

document.addEventListener('keydown', function (event) {
    if (event.key == " " ||
        event.code == "Space" ||
        event.keyCode == 32
    ) {
        event.preventDefault();
        if (!isJumping) {
            jump();
            isJumping = true;
        }
    }
    if (event.code == "Enter") {
        if (isRestart) {
            restartAction()
        }
        else {
            startAction()
        }
    }
    if (event.key === 'ArrowRight') {
        isRightArrowPressed = true;
        moveRight()
    } else if (event.key === 'ArrowLeft') {
        isLeftArrowPressed = true;
        moveLeft()
    }
});

document.addEventListener('keyup', function (event) {
    if (event.key === 'ArrowRight') {
        isRightArrowPressed = false;
    } else if (event.key === 'ArrowLeft') {
        isLeftArrowPressed = false;
    }
});

setInterval(function () {
    if (isRightArrowPressed) {
        moveRight()
    }

    if (isLeftArrowPressed) {
        moveLeft()
    }
}, 10);


const changePos = pos => char[0].style.marginLeft = pos + "px";

function moveRight() {
    if (!(pos >= 900)) {
        pos += 4
        changePos(pos)
    }
}

function moveLeft() {
    if (!pos <= 0) {
        pos -= 4
        changePos(pos)
    }
}

function startAction() {
    startGame()
    start_div[0].style.display = "none"
}

function restartAction() {
    startGame()
    game_over.style.display = "none"
    for (let i of created_obstacles) {
        i.remove()
    }
    for (let i of created_coins) {
        i.remove()
    }
    score = 0
    coins_count = 0
    score_div.innerText = 0
    inter = []
    coins = []
}

function jump() {
    let number = 15;
    let increment = true;

    const interval = setInterval(function () {
        if (increment) {
            number += 2;
            im.src = "../images/jump.png"
            if (number >= 140) {
                increment = false;
            }
        } else {
            number -= 2;
            if (number <= 15) {
                isJumping = false;
                clearInterval(interval);
                im.src = "../images/m.gif"
            }
        }
        char[0].style.bottom = number + "px"
    }, 5);
}

function startGame() {
    let counter = 0;
    s1 = setInterval(() => {
        if (counter % 4 === 0) {
            h = Math.floor(Math.random() * 4)
            height = abstacleHeights[h]
            createEnemy(height)
        }else{
            if (Math.random() < 0.8) {
                spawnCoin();
            }
        }
        counter++
        score += 40
        coin_div.innerText = coins_count
        score_div.innerText = score
    }, 500);
}

function spawnCoin(){
    var coin = document.createElement('img');
    var coin_pos = Math.random() < 0.5 ? 3 : 140;
    coin.style.cssText = `
    right:0;
    position:absolute;
    width:40px;
    height:40px;
    object-fit:cover;
    bottom:${coin_pos}px;
    `
    coin.src = "../images/coin.gif"
    center[0].appendChild(coin)
    var ml = 0
    var s3 = setInterval(() => {
        ml += 2
        coin.style.marginRight = ml + 'px'
        detectCollision(char[0], coin,true)
        if (ml > window.innerWidth) {
            coin.remove()
        }
    }, 10)
    coins.push(s3)
    console.log(coins_count);
    created_coins.push(coin)
}

function createEnemy(height) {
    var elemDiv = document.createElement('img');
    if (height == 70) {
        elemDiv.src = `../images/e2.gif`
    }
    if (height == 50) {
        e_num = Math.random() < 0.5 ? 3 : 5;
        elemDiv.src = `../images/e${e_num}.gif`
    }
    if (height == 46) {
        elemDiv.src = `../images/e1.gif`
    }
    if (height == 100) {
        elemDiv.src = `../images/e4.gif`
        elemDiv.classList.add("enemyBird");
    }
    elemDiv.style.cssText = `
    right:0;
    position:absolute;
    width:47px;
    object-fit:cover;
    height:${height != 100 ? height : 44}px;
    z-index:100;
    ${height == 100 ? "bottom:100px;" : "bottom:0;"}
    ${height == 46 || height == 50 ? "margin-bottom:7px;" :null}
    `;
    center[0].appendChild(elemDiv);
    var ml = 0
    var s2 = setInterval(() => {
        ml += 2
        elemDiv.style.marginRight = ml + 'px'
        detectCollision(char[0], elemDiv)
        if (ml > window.innerWidth) {
            elemDiv.remove()
        }
        keys = {}
    }, 10)
    created_obstacles.push(elemDiv)
    inter.push(s2)
}

function detectCollision(div1, div2,_coin=false) {
    var rect1 = div1.getBoundingClientRect();
    var rect2 = div2.getBoundingClientRect();
    if (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    ) {
        console.log('Collision detected!');
        if(_coin){
            div2.remove()
            coins_count++
        }
        else{
            game_over.style.display = "block"
            stopGame()
        }
        
    }
}

function stopGame() {
    isRestart = true
    clearInterval(s1)
    clearInterval(s2)
    for (let i of inter) {
        clearInterval(i)
    }
    for (let j of coins) {
        clearInterval(j)
    }
}

