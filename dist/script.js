const restart = document.getElementById("restart");
const buttons = {};
let playerTurn = true;
let playerScore = 0, computerScore = 0, tieScore = 0;

restart.addEventListener("click", function() {
    restartBoard();
    restart.classList.add("restartClicked");
    setTimeout(() => {
        restart.classList.remove("restartClicked");
    }, 300);
})

// Player move
function playerMove() {
    for(let i = 1; i <= 9; i++) {
        buttons[i] = document.getElementById(i.toString());

        buttons[i].onclick = function () {
            if(!playerTurn || buttons[i].children.length > 0) return; // Prevent overwriting

            const buttonImg = document.createElement("img");
            buttonImg.src = "images/cross.png";
            buttonImg.alt = "cross";
            buttonImg.width = 80;

            buttons[i].classList.add("cross");
            buttons[i].appendChild(buttonImg);
            const result = check();

            if(!result) {
                playerTurn = false;
                setTimeout(() => {
                    computerMove();
                }, 300);
            }
        };
    }
}

// Computer move
function computerMove() {
    // 1 Win if possible
    for(let i = 1; i <= 9; i++) {
        if(buttons[i].children.length === 0) {
            buttons[i].classList.add("circle");
            if(isWinning("circle")) {
                placeCircle(i);
                return;
            }
            buttons[i].classList.remove("circle");
        }
    }
    // 2 Defend
    for(let i = 1; i <= 9; i++) {
        if(buttons[i].children.length === 0) {
            buttons[i].classList.add("cross");
            if(isWinning("cross")) {
                buttons[i].classList.remove("cross");
                placeCircle(i);
                return;
            }
            buttons[i].classList.remove("cross");
        }
    }
    // 3 Take center
    if(buttons[5].children.length === 0) {
        placeCircle(5);
        return;
    }
    // 4 Take a corner
    const corners = [1, 3, 7, 9];
    for(const i of corners) {
        if(buttons[i].children.length === 0) {
            placeCircle(i);
            return;
        }
    }
    // 5 Fill empty space
    const sides = [2, 4, 6, 8];
    for(const i of sides) {
        if(buttons[i].children.length === 0) {
            placeCircle(i);
            return;
        }
    }
}

function isWinning(symbol) {
    const winCombos = [
        [1, 2, 3], // Top row
        [4, 5, 6], // Middle row
        [7, 8, 9], // Bottom row
        [1, 4, 7], // Left column
        [2, 5, 8], // Middle column
        [3, 6, 9], // Right column
        [1, 5, 9], // Diagonal
        [3, 5, 7] // Diagonal
    ];
    return winCombos.some(([a, b, c]) =>
        buttons[a].classList.contains(symbol) &&
        buttons[b].classList.contains(symbol) &&
        buttons[c].classList.contains(symbol)
    );
}

function placeCircle(i) {
    const buttonImg = document.createElement("img");
    buttonImg.src = "images/circle.png";
    buttonImg.alt = "circle";
    buttonImg.width = 80;

    buttons[i].classList.add("circle");
    buttons[i].appendChild(buttonImg);

    const result = check();
    if(!result) playerTurn = true;
}

function check() {
    const winCombos = [
        [1, 2, 3], // Top row
        [4, 5, 6], // Middle row
        [7, 8, 9], // Bottom row
        [1, 4, 7], // Left column
        [2, 5, 8], // Middle column
        [3, 6, 9], // Right column
        [1, 5, 9], // Diagonal
        [3, 5, 7] // Diagonal
    ];
    for(const combo of winCombos) {
        const [a, b, c] = combo;
        if(
            buttons[a].classList.contains("cross") &&
            buttons[b].classList.contains("cross") &&
            buttons[c].classList.contains("cross")
        ) {
            setTimeout(() => {
                alert("Player wins!");
                playerScore++;
                updateScore();
                endGame();
            }, 200);
            return "Player";
        }
        if(
            buttons[a].classList.contains("circle") &&
            buttons[b].classList.contains("circle") &&
            buttons[c].classList.contains("circle")
        ) {
            setTimeout(() => {
                alert("Computer wins!");
                computerScore++;
                updateScore();
                endGame();
            }, 200);
            return "Computer";
        }
    }

    const tie = Object.values(buttons).every(btn => btn.children.length > 0);
    if(tie) {
        setTimeout(() => {
            alert("It's a tie!");
            tieScore++;
            updateScore();
            endGame();
        }, 200);
        return "Tie";
    }
    return null;
}

function endGame() {
    for(let i = 1; i <= 9; i++) {
        buttons[i].onclick = null;
    }
}

function restartBoard() {
    for(let i = 1; i <= 9; i++) {
        buttons[i].innerHTML = "";
        buttons[i].classList.remove("cross", "circle");
    }
    playerTurn = true;
    playerMove();
}

function updateScore() {
    document.getElementById("score").innerText = 
        `Player: ${playerScore} | Computer: ${computerScore} | Tie: ${tieScore}`;
}

playerMove();