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