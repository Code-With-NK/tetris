const grid = document.querySelector('.grid')
let squares = Array.from(document.querySelectorAll('.grid div'));

const score = document.getElementById('score')
const startButton = document.getElementById('start-button')
const leftButton = document.getElementById('left')
const rightButton = document.getElementById('right')
const downButton = document.getElementById('down')
const rotateButton = document.getElementById('rotate')

let count = 0
let width = 10;

/*
for (i = 0; i < 200; i++) {
    squares[i].textContent = count
    count++
}
*/

const lShape = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 1]
];

const zShape = [
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1]
];

const tShape = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
];

const oShape = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
];

const iShape = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
];

const theShapes = [lShape, zShape, oShape, tShape, iShape]

let currentPosition = 4
let currentRotation = 0

let random = Math.floor(Math.random() * theShapes.length)
let currentShape = theShapes[random][currentRotation]

function draw(){
    currentShape.forEach((index) => {
        squares[currentPosition + index].style.background = "red"
    });
}

function erase() {
    currentShape.forEach((index) => {
        squares[currentPosition + index].style.background = ""
    });
}

function moveDown(){
    erase()
    currentPosition += width
    draw()
    stop()
}

draw()
var timer = setInterval(moveDown, 1000)

function stop(){
    if(currentShape.some(index => squares[currentPosition + index + width].classList.contains('freeze'))){
        currentShape.forEach(index => squares[currentPosition + index].classList.add('freeze'))
        
        random = Math.floor(Math.random() * theShapes.length)
        currentRotation = 0
        currentShape = theShapes[random][currentRotation]
        currentPosition = 4
        
        draw()
        gameOver()
        addScore()
    }
}

window.currentPosition = currentPosition

function moveLeft() {
    erase()
    
    let leftBlockage = currentShape.some(index => (currentPosition + index) % width === 0)
    let blockage = currentShape.some(index => squares[currentPosition + index - 1].classList.contains('freeze'))
    
    if(!leftBlockage && !blockage){
        currentPosition--
    }
    
    draw()
}

function moveRight() {
    erase()

    let leftBlockage = currentShape.some(index => (currentPosition + index) % width === width - 1)
    let blockage = currentShape.some(index => squares[currentPosition + index + 1].classList.contains('freeze'))

    if (!leftBlockage && !blockage) {
        currentPosition++
    }

    draw()
}

function rotate(){
    erase()
    currentRotation++
    if(currentRotation === 4){
        currentRotation = 0
    }
    
    currentShape = theShapes[random][currentRotation]
    
    draw()
}

function pause(){
    if(timer){
        clearInterval(timer)
        timer = null
        startButton.innerText = "Resume"
    } else {
        draw()
        timer = setInterval(moveDown, 1000)
        startButton.innerText = "Pause"
    }
}

startButton.addEventListener("click", pause)
leftButton.addEventListener("click", moveLeft)
rightButton.addEventListener("click", moveRight)
downButton.addEventListener("click", moveDown)
rotateButton.addEventListener("click", rotate)

function gameOver(){
    if(currentShape.some(index => squares[currentPosition + index].classList.contains('freeze'))){
        score.innerText = "Game Over :]"
        clearInterval(timer)
    }
}

function addScore(){
    for(let i = 0; i < 199; i += width){
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
        
        if(row.every(index => squares[index].classList.contains('freeze'))){
            count += 10
            score.textContent = `Score: ${count}`
            
            row.forEach(index => {
                squares[index].classList.remove('freeze')
                squares[index].style.background = ''
            })
            
            const squaresRemoves = squares.splice(i, width)
            squares = squaresRemoves.concat(squares)
            squares.forEach(square => grid.appendChild(square))
        }
    }
}

