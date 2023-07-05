var char = document.getElementsByClassName('char')
var center = document.getElementsByClassName('center')
var shop_area = document.getElementsByClassName('shop-area')
var shop_items = document.getElementsByClassName('shop-items')
var sc = document.getElementsByClassName('sc')
var shop_open = document.getElementById("shop-btn")
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
var isJumping = false;
var game_data
var isRightArrowPressed = false;
var isLeftArrowPressed = false;
var selected_character

var game_characters = [{
    "id":0,
    "name":"Blaze",
    "description":"Blaze is a fierce and agile warrior with a fiery spirit. Clad in lightweight armor and armed \
    with a blazing sword, Blaze is known for their lightning-fast strikes and unrivaled combat skills. With a \
    determined demeanor and a burning desire for justice, Blaze fights tirelessly to protect the innocent and \
    vanquish evil.",
    "cost":0,
    "img-idle":"char1.gif",
    "img-jump":"char1-jump.png"
},
{
    "id":1,
    "name":"Luna",
    "description":" Luna is a mystical sorceress with an enchanting presence. Adorned in flowing robes and \
    adorned with celestial symbols, she possesses an innate connection to the elements. Luna wields powerful \
    magic, harnessing the energy of the moon and stars to cast spells of healing and protection. Wise and \
    compassionate, she uses her powers to restore balance and harmony in the world.",
    "cost":2000,
    "img-idle":"char2.gif",
    "img-jump":"char2-jump.png"
}]

getorcreateGameData()
init()
var im = document.getElementById("im")

start.onclick = function () {
    startAction()
};

restart.onclick = function () {
    restartAction()
};

shop_open.onclick = function () {
    char[0].style.display = "none"
    start_div[0].style.display = "none"
    shop_area[0].style.display = "block"
    renderShopChar()
};

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
    char[0].style.marginLeft = "0px"
    pos = 0
}

function jump() {
    let number = 15;
    let increment = true;

    const interval = setInterval(function () {
        if (increment) {
            number += 2;
            im.src = `../images/${selected_character["img-jump"]}`
            if (number >= 140) {
                increment = false;
            }
        } else {
            number -= 2;
            if (number <= 15) {
                isJumping = false;
                clearInterval(interval);
                im.src = `../images/${selected_character["img-idle"]}`
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
        } else {
            if (Math.random() < 0.8) {
                spawnCoin();
            }
        }
        counter++
        score += 40
        coin_div.innerText = game_data.data.coins + coins_count
        score_div.innerText = score
        sc[0].innerText = "SCORE:"
    }, 500);
}

function spawnCoin() {
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
    coin.src = "../images/coin2.gif"
    center[0].appendChild(coin)
    var ml = 0
    var s3 = setInterval(() => {
        ml += 2
        coin.style.marginRight = ml + 'px'
        detectCollision(char[0], coin, true)
        if (ml > window.innerWidth) {
            coin.remove()
        }
    }, 10)
    coins.push(s3)
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
        e_fly = Math.random() < 0.5 ? 4 : 6;
        elemDiv.src = `../images/e${e_fly}.gif`
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
    ${height == 46 || height == 50 ? "margin-bottom:7px;" : null}
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

function detectCollision(div1, div2, _coin = false) {
    var rect1 = div1.getBoundingClientRect();
    var rect2 = div2.getBoundingClientRect();
    if (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    ) {
        if (_coin) {
            div2.remove()
            coins_count++
        }
        else {
            game_over.style.display = "block"
            stopGame()
        }

    }
}

function stopGame() {
    isRestart = true
    saveCoinGameData()
    setHighScore()
    clearInterval(s1)
    clearInterval(s2)
    for (let i of inter) {
        clearInterval(i)
    }
    for (let j of coins) {
        clearInterval(j)
    }
}

function getorcreateGameData() {
    game_data = JSON.parse(localStorage.getItem("jump_and_catch"))
    if (!game_data) {
        game_data = localStorage.setItem("jump_and_catch", JSON.stringify(
            {
                "data": {
                    "coins": 0,
                    "space_pressed": 0,
                    "high_score":0,
                    "selected_character_id":0,
                    "bought_characters_id":[]
                }
            }));
    }
}

function saveCoinGameData(){
    game_data.data.coins += coins_count
    localStorage.setItem("jump_and_catch", JSON.stringify(game_data))
}

function setHighScore(){
    if(score > game_data.data.high_score){
        game_data.data.high_score = score
        localStorage.setItem("jump_and_catch", JSON.stringify(game_data))
    }
}

function renderShopChar(){
    for(let i of game_characters){
        const ch_div = document.createElement("div");
        ch_div.onclick = function () {
            setCurrentCharacter(i.id)
            init()
        }
        const cost_div = document.createElement("button");
        cost_div.style.cssText = `height:30px;width:140px;border:5px solid black;position:absolute;bottom:0;
        font-size:17px;background:none;`
        cost_div.innerText = "cost: "+i.cost
        ch_div.style.cssText = `height:180px;width:47%;position:relative;`
        const ch_img = document.createElement("img");
        ch_img.src = `../images/${i["img-idle"]}`
        ch_img.classList.add("shop-item");
        const fr_img = document.createElement("img");
        fr_img.src = '../images/hover-frame.png'
        fr_img.style.cssText = `position:absolute;height:150px;width:150px;`
        
        if(selected_character.id == i.id){
            ch_div.appendChild(fr_img)
            cost_div.innerText = "selected"
        }
        ch_div.appendChild(cost_div)
        ch_div.appendChild(ch_img)
        shop_items[0].appendChild(ch_div)
    }
}

function init(){
    coin_div.innerText = game_data.data.coins
    score_div.innerText = game_data.data.high_score
    sc[0].innerText = "HIGH SCORE:"
    selected_character = game_characters.filter((i)=> i.id == game_data.data.selected_character_id)[0]
    const char_image = document.createElement("img");
    char_image.src = `../images/${selected_character["img-idle"]}`
    char_image.setAttribute("id", "im");
    char[0].appendChild(char_image)
}

function setCurrentCharacter(id){
    game_data.data.selected_character_id = id
    localStorage.setItem("jump_and_catch", JSON.stringify(game_data))
}