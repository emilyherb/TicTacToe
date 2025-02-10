const Gameboard = (function() {
    let board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];

    const render = () => {
        console.log(board.map(row => row.join("|")).join("\n---------\n"));
    };

    const makeMove = (row, col, marker) => {
        if (board[row][col] === "") {
            board[row][col] = marker;
            return true;
        }
        return false;
    };

    const checkWinner = () => {
        const lines = [
            ...board, 
            [board[0][0], board[1][0], board[2][0]], 
            [board[0][1], board[1][1], board[2][1]], 
            [board[0][2], board[1][2], board[2][2]], 
            [board[0][0], board[1][1], board[2][2]], 
            [board[0][2], board[1][1], board[2][0]]  
        ];

        for (let line of lines) {
            if (line[0] && line[0] === line[1] && line[1] === line[2]) {
                return line[0]; 
            }
        }

        if (board.flat().every(cell => cell !== "")) {
            return "Tie";
        }

        return null; 
    };

    return { render, makeMove, checkWinner, board };
})();

const Player = (name, marker) => {
    return { name, marker };
};

const GameController = (function() {
    let currentPlayer;
    let gameOver = false;
    let player1, player2;

    const startGame = (name1, name2) => {
        player1 = Player(name1, "X");
        player2 = Player(name2, "O");
        currentPlayer = player1;
        gameOver = false;

        Gameboard.board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];

        DisplayController.renderBoard();
        DisplayController.clearResult();
        document.querySelector(".game-result").textContent = `${currentPlayer.name}'s turn`;
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer.marker === 'X' ? player2 : player1;
    };

    const makeMove = (row, col) => {
        if (gameOver) return;

        if (Gameboard.makeMove(row, col, currentPlayer.marker)) {
            DisplayController.renderBoard(); 
            const winner = Gameboard.checkWinner();
            if (winner) {
                gameOver = true;
                if (winner === "Tie") {
                    DisplayController.showResult("It's a tie!");
                } else {
                    DisplayController.showResult(`${currentPlayer.name} wins!`);
                }
            } else {
                switchPlayer();
                document.querySelector(".game-result").textContent = `${currentPlayer.name}'s turn`;
            }
        }
    };

    return { startGame, makeMove };
})();

const DisplayController = (function() {
    const boardElement = document.querySelector(".board");
    const gameResultElement = document.querySelector(".game-result");

    const renderBoard = () => {
        boardElement.innerHTML = "";  
        Gameboard.board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellElement = document.createElement("button");
                cellElement.classList.add("cell");
                cellElement.textContent = cell || "";  // Display "X" or "O" or empty
                
                cellElement.addEventListener("click", () => {
                    if (!gameOver && cell === "") {
                        GameController.makeMove(rowIndex, colIndex);
                    }
                });

                boardElement.appendChild(cellElement);
            });
        });
    };

    const showResult = (message) => {
        gameResultElement.textContent = message;
    };

    const clearResult = () => {
        gameResultElement.textContent = "";
    };

    document.querySelector(".reset-btn").addEventListener("click", () => {
        document.querySelector(".player-names").style.display = "block";
        document.querySelector(".start-btn").style.display = "block"; 
        gameResultElement.textContent = "";
        boardElement.innerHTML = "";
    });

    document.querySelector(".start-btn").addEventListener("click", () => {
        const player1Name = document.querySelector("#player1-name").value;
        const player2Name = document.querySelector("#player2-name").value;

        if (!player1Name || !player2Name) {
            alert("Please enter names for both players!");
            return;
        }

        document.querySelector(".player-names").style.display = "none"; 
        document.querySelector(".start-btn").style.display = "none"; 

        GameController.startGame(player1Name, player2Name);
    });

    return { renderBoard, showResult, clearResult };
})();


