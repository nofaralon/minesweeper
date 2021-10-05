'use strict';

document.addEventListener("contextmenu", function (e) {
    e.preventDefault()

})
const MINE = '💥'
const EMPTY = ' '
const FLAG = '🚩'

var gBoard
var gSeconds = 0
var glives = 3
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gLevel = {
    SIZE: 4,
    MINES: 2
};
var gIntrevalTimer = null
var gCountClicks = 0
var gIntrevalVictory

function init() {
    gBoard = buildBoard(4)
    renderBoard(gBoard)
    gGame.isOn = true
    glives = 3
    gIntrevalVictory = setInterval(checkVictory,10)

}




function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: 4,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell;

        }
    }

    return board;
}

function renderBoard(board) {
    // console.table(board);
    getRamdorIdxMines(gLevel.SIZE, gLevel.MINES)
    var strHtml = '';

    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var countMine = setMinesNegsCount(board, i, j)
            board[i][j].minesAroundCount = countMine
            var cell = EMPTY
            var tdId = `cell-${i}-${j}`;

            strHtml += `<td class="cell" id="${tdId}" oncontextmenu="cellMarked(this)"  data-i="${i}" data-j="${j}" onclick="cellClicked(this)"> ${cell} </td>`;
        }
        strHtml += '</tr>'
    }
    // console.log('strHtml', strHtml)
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;

}

function getRamdorIdxMines(size, count) {
    for (var i = 0; i < count; i++) {
        var idxI = getRandomInt(0, size)
        var idxJ = getRandomInt(0, size)
        var currCell = gBoard[idxI][idxJ]
        currCell.isMine = true
    }
}

function setLevel(size, minesCount) {
    gLevel.SIZE = size
    gLevel.MINES = minesCount
    gBoard = buildBoard(size)
    renderBoard(gBoard)
}

function setMinesNegsCount(mat, rowIdx, colIdx) {
    var countMine = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = mat[i][j].isMine;
            if (cell === true) countMine++
        }
    }
    return countMine
}

function cellClicked(elCell) {

    var cellCoord = getCellCoord(elCell.id);
    var piece = gBoard[cellCoord.i][cellCoord.j];

    expandShown(piece, cellCoord)
    gCountClicks++
    console.log(gCountClicks)

    if (gCountClicks === 1) {
        document.getElementById("table").addEventListener("click", function () {
            gIntrevalTimer = setInterval(incrementSeconds, 1000);
        })

    }


}

function expandShown(piece, cellCoord) {

    var elCell = document.querySelector(`[data-i="${cellCoord.i}"][data-j="${cellCoord.j}"]`);

    if (gGame.isOn === false) return

    if (piece.isShown) return

    if (piece.isMarked) return;

    if (piece.minesAroundCount && piece.isMine === false) {
        piece.isShown = true
        renderCell(cellCoord.i, cellCoord.j, piece.minesAroundCount)
        elCell.classList.add('shown')
        gGame.shownCount++

    } else if (piece.isMine === true) {
        piece.isShown = true
        renderCell(cellCoord.i, cellCoord.j, MINE)
        elCell.classList.add('shown')
        glives--
        gGame.shownCount++
        openMineMsg('.boom')
        updateSpan()
        checkGameOver()

    } else if (piece.minesAroundCount === 0) {
        piece.isShown = true
        gGame.shownCount++
        openNeighborsAround(gBoard, cellCoord.i, cellCoord.j)
        elCell.classList.add('shown')
    }
}

function openNeighborsAround(mat, rowIdx, colIdx) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = mat[i][j]
            cell.isShown = true;
            gGame.shownCount++
            var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
            elCell.classList.add('shown')
            if (cell.minesAroundCount) {
                renderCell(i, j, cell.minesAroundCount)
            } else {
                renderCell(i, j, EMPTY)
            }
        }
    }
}

function cellMarked(elCell) {

    var cellCoord = getCellCoord(elCell.id);
    var piece = gBoard[cellCoord.i][cellCoord.j];

    if (piece.isShown === true) return

    if (piece.isMarked === true) {
        piece.isMarked = false
        renderCell(cellCoord.i, cellCoord.j, EMPTY)
    } else {
        piece.isMarked = true
        renderCell(cellCoord.i, cellCoord.j, FLAG)
        if (piece.isMine && piece.isMarked) {
            gGame.markedCount++
        }
        console.log(gGame.markedCount)
    }

    gCountClicks++
    // console.log(gCountClicks)

    if (gCountClicks === 1) {
        document.getElementById("table").addEventListener("contextmenu", function () {
            gIntrevalTimer = setInterval(incrementSeconds, 1000);
        })
    }

}

function updateSpan() {
    var elSpan = document.querySelector('.lives');
    elSpan.innerText = `Number of Lives: ${glives}`
}

function checkVictory() {
    if (gGame.markedCount+gGame.shownCount === gLevel.SIZE * gLevel.SIZE){
        var elBtn = document.querySelector('.smile')
        elBtn.innerText = '😁'
        var elDiv = document.querySelector('.victory')
        elDiv.style.display = 'block';
        gGame.isOn = false
        clearInterval(gIntrevalVictory)
    }
}

function checkGameOver() {
    if (glives === 0) {
        var elBtn = document.querySelector('.smile')
        elBtn.innerText = '😪'
        var elDiv = document.querySelector('.modal')
        elDiv.style.display = 'block';
        gGame.isOn = false
        clearInterval(gIntrevalTimer)
    }
    return
}


function restartGame() {
    console.log('hi again')
    gLevel.SIZE = 4
    gLevel.MINES = 2
    init()
    var elBtn = document.querySelector('.smile')
    elBtn.innerText = '😊'
    var elDiv = document.querySelector('.modal')
    elDiv.style.display = 'none';
    gGame.isOn = true
    resetTimer()
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
}

function updeteGameOver(str) {
    var elH2 = document.querySelector('.modal h2 span')
    elH2.innerText = str
}

function openGameOver() {

    var elDiv = document.querySelector('.modal h2 span');
    elDiv.style.display = 'inline-block';
    setTimeout(closeModal, 10000, '.modal h2 span');
}

function openMineMsg(selector) {

    var elDiv = document.querySelector(selector);
    elDiv.style.display = 'block';
    setTimeout(closeModal, 1000, selector);
}

function closeModal(selector) {

    var elDiv = document.querySelector(selector);
    elDiv.style.display = 'none';
    // Todo: hide the modal
}

function incrementSeconds() {
    var elTime = document.querySelector('.time');
    gSeconds++;
    gGame.secsPassed = gSeconds
    elTime.innerText = gSeconds
}

function resetTimer() {
    var elTime = document.querySelector('.time');

    gSeconds = 0
    elTime.innerText = gSeconds;
}

