//tic tac toe board
const Gameboard = (function(){
    let board = [
        ["","",""],
        ["","",""],
        ["","",""]
    ];

    //funtion to render the board
    const render = () =>{
        console.log(board.map(row => row.join("|")).join("\n---------\n"));
    };
    // function to check for a winner
    const checkWinner = () => {
        // check rows, columns, and diagonals for a winner
        const lines = [
             ...board, // Rows
            [board[0][0], board[1][0], board[2][0]], // column 1
            [board[0][1], board[1][1], board[2][1]], // column 2
            [board[0][2], board[1][2], board[2][2]], // column 3
            [board[0][0], board[1][1], board[2][2]], // diagonal 1
            [board[0][2], board[1][1], board[2][0]]  // diagonal 2
        ];

        for (let line of lines) {
            if (line[0] && line[0] === line[1] && line[1] === line[2]) {
                return line[0]; // return the winner ('X' or 'O')
         }
        }

        // check for tie (no empty spots left)
        if (board.flat().every(cell => cell !== "")) {
            return "Tie";
        }

        return null; // no winner yet
    };

    return { render, makeMove, checkWinner };
})();

//stores name and symbol
const Player = (name, marker) => {
    return { name, marker };
};

//game controller
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
            Gameboard.render();
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

///gameplay
const player1 = Player("Player 1", "X");
const player2 = Player("Player 2", "O");

GameController.startGame(player1, player2);

// simulate some moves
GameController.makeMove(0, 0); // player 1's move
GameController.makeMove(1, 1); // player 2's move
GameController.makeMove(0, 1); // player 1's move
GameController.makeMove(1, 0); // player 2's move
GameController.makeMove(0, 2); // player 1 wins

//game display
const DisplayController = (function() {
    const boardElement = document.querySelector(".board");
    const gameResultElement = document.querySelector(".game-result");

    const renderBoard = () => {
        boardElement.innerHTML = "";
        Gameboard.board.forEach((row, rowIndex) => {
            const rowElement = document.createElement("div");
            rowElement.classList.add("row");
            row.forEach((cell, colIndex) => {
                const cellElement = document.createElement("button");
                cellElement.classList.add("cell");
                cellElement.textContent = cell;
                cellElement.addEventListener("click", () => {
                    GameController.makeMove(rowIndex, colIndex);
                });
                rowElement.appendChild(cellElement);
            });
            boardElement.appendChild(rowElement);
        });
    };

    const showResult = (message) => {
        gameResultElement.textContent = message;
    };

    const clearResult = () => {
        gameResultElement.textContent = "";
    };

    document.querySelector(".reset-btn").addEventListener("click", () => {
        document.querySelector(".player-names").style.display = "block"; // Show name inputs again
        document.querySelector(".start-btn").style.display = "block"; // Show the Start Game button
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

        document.querySelector(".player-names").style.display = "none"; // Hide name inputs
        document.querySelector(".start-btn").style.display = "none"; // Hide Start button

        GameController.startGame(player1Name, player2Name);
    });

    return { renderBoard, showResult, clearResult };
})();
