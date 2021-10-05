function drawNum() {
    var idxI = getRandomInt(0, size)
    var idxJ = getRandomInt(0, size)
    var currCell = gBoard[idxI][idxJ]
    return currCell
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
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