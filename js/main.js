
const MINE = '💥'
const EMPTY = ' '
var gBoard

function init() {
    gBoard = buildBoard(4)
    renderBoard(gBoard)
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
                isMarked: true
            }
            board[i][j] = cell;

        }
    }
    // board[1][1].isMine = true
    // board[2][2].isMine = true
    return board;
}


function renderBoard(board) {
    // console.table(board);
    getRamdorMines(4, 2)
    var strHtml = '';

    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var countMine = countMineAround(board, i, j)
            board[i][j].minesAroundCount = countMine
            var cell = EMPTY
            var tdId = `cell-${i}-${j}`;
            // if (cell.isShown) {
            //     if (cell.minesAroundCount === 0) {
            //         cell = EMPTY
            //     }
            //     else if (cell.isMine === true) {
            //         cell = MINE
            //     } else {
            //         cell = countMine
            //     }
            // } else {
            //     cell = EMPTY
            // }
            strHtml += `<td id="${tdId}" data-i="${i}" data-j="${j}" onclick="cellClicked(this)"> ${cell} </td>`;
        }
        strHtml += '</tr>'
    }
    // console.log('strHtml', strHtml)
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;

}

function countMineAround(mat, rowIdx, colIdx) {
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
    console.log(cellCoord)
    var piece = gBoard[cellCoord.i][cellCoord.j];
    console.log(piece)
    if (piece.minesAroundCount && piece.isMine === false) {
        piece.isShown = true
        renderCell(cellCoord.i, cellCoord.j, piece.minesAroundCount)

    } else if (piece.isMine === true) {
        piece.isShown = true
        renderCell(cellCoord.i, cellCoord.j, MINE)

    } else if (piece.minesAroundCount === 0) {
        console.log('hi')
        openNeighborsAround(gBoard, cellCoord.i, cellCoord.j)
    }




    // if the target is marked - move the piece!
    // if (elCell.classList.contains('mark')) {
    //     movePiece(gSelectedElCell, elCell);

    //     return;
    // }



    // elCell.classList.add('selected');
    // gSelectedElCell = elCell;

    // console.log('elCell.id: ', elCell.id);

}

// Gets a string such as:  'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
    var parts = strCellId.split('-')
    var coord = { i: +parts[1], j: +parts[2] };
    return coord;
}

function renderCell(i, j, value) {
    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
    // console.log('elCell', elCell);
    elCell.innerText = value;
}


function getRamdorMines(size, count) {
    for (var i = 0; i < count; i++) {
        var idxI = getRandomInt(0, size)
        var idxJ = getRandomInt(0, size)
        var currCell = gBoard[idxI][idxJ]
        currCell.isMine = true
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
            if (cell.minesAroundCount) {
                renderCell(i, j, cell.minesAroundCount)
            } else {
                renderCell(i, j, EMPTY)
            }
        }
    }
}

function incrementSeconds() {
    var elTime = document.querySelector('.time');
    gSeconds++;
    elTime.innerText = gSeconds;
}

function resetTimer(){
    var elTime = document.querySelector('.time');

    gSeconds = 0
    elTime.innerText = gSeconds;
}