let solved = 0;
localStorage.setItem("solved?",JSON.stringify(solved));
//add timer features variables

const navEntries = performance.getEntriesByType("navigation");
if (navEntries.length && navEntries[0].type === "reload") {
    genNewGame();
    console.log("Page was reloaded");
    let solved = Number(JSON.parse(localStorage.getItem("solved")));
    showSolved(solved);
} else {
    console.log("first");
    genNewGame();
    let solved = 0;
    localStorage.setItem("solved?",JSON.stringify(solved));
    showSolved(solved);
}

function showSolved(solved = 0){
    console.log(solved);
    document.querySelector('.js-solved').innerText = 'You Have Solved: '+ solved + '  puzzles!';
}

function unUsedInBox(grid, rowStart, colStart, num) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[rowStart + i][colStart + j] === num) {
                return false;
            }
        }
    }
    return true;
}

function fillBox(grid, row, col) {
    let num;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            do {
                num = Math.floor(Math.random() * 9) + 1;
            } while (!unUsedInBox(grid, row, col, num));
            grid[row + i][col + j] = num;
        }
    }
}
function unUsedInRow(grid, i, num) {
    for (let j = 0; j < 9; j++) {
        if (grid[i][j] === num) {
            return false;
        }
    }
    return true;
}

function unUsedInCol(grid, j, num) {
    for (let i = 0; i < 9; i++) {
        if (grid[i][j] === num) {
            return false;
        }
    }
    return true;
}
function checkIfSafe(grid, i, j, num) {
    return unUsedInRow(grid, i, num) && unUsedInCol(grid, j, num) &&
           unUsedInBox(grid, i - (i % 3), j - (j % 3), num);
}
function fillDiagonal(grid) {
    for (let i = 0; i < 9; i += 3) {
        
        fillBox(grid, i, i);
    }
}

function fillRemaining(grid, i, j) {
    if (i === 9) {
        return true;
    }
    if (j === 9) {
        return fillRemaining(grid, i + 1, 0);
    }
    if (grid[i][j] !== 0) {
        return fillRemaining(grid, i, j + 1);
    }
    for (let num = 1; num <= 9; num++) {
        if (checkIfSafe(grid, i, j, num)) {
            grid[i][j] = num;
            if (fillRemaining(grid, i, j + 1)) {
                return true;
            }
            grid[i][j] = 0;
        }
    }
    return false;
}


function removeKDigits(grid, k) {
    while (k > 0) {
        let cellId = Math.floor(Math.random() * 81);
        let i = Math.floor(cellId / 9);
        let j = cellId % 9;
        if (grid[i][j] !== 0) {
            grid[i][j] = 0;
            k--;
        }
    }
    return grid;
}

function sudokuGenerator() {
    let grid = new Array(9).fill(0).map(() => new Array(9).fill(0));
    fillDiagonal(grid);
    fillRemaining(grid, 0, 0);
    return grid;
}

function makeCopy(arr){
    let grid = new Array(9).fill(0).map(() => new Array(9).fill(0));
    for(i=0;i<9;i++){
        for(j=0;j<9;j++) grid[i][j] = arr[i][j];
    }
    return grid;
}


function genNewGame(){
    solution = sudokuGenerator();
    game = makeCopy(solution);
    game = removeKDigits(game, 40);
    for(i=0;i<9;i++){
        for(j=0;j<9;j++){
            if(game[i][j]){
                document.querySelector(`#_${i} #__${j}`).innerText = game[i][j];
                document.querySelector(`#_${i} #__${j}`).classList.remove('empty-cell');
                document.querySelector(`#_${i} #__${j}`).classList.add('filled-cell');
            }
            else{
                document.querySelector(`#_${i} #__${j}`).classList.add('empty-cell');
                document.querySelector(`#_${i} #__${j}`).innerHTML = `<input type=\"text\" class = "answer" id = "_${i}__${j}" autocomplete = "off">`;
            }
        }
    }
    console.table(solution);
}

function clearGame() {
    if(confirm("Are you sure you want to clear your inputs?")){
        const inputs = document.querySelectorAll("input");
        inputs.forEach(input => {
            input.value = "";
        });
}

}


function checkSol(){
    let check= 1;
    for(i=0;i<9;i++){
        for(j=0;j<9;j++){
            if(!game[i][j] && solution[i][j] !== parseInt(document.querySelector(`#_${i}__${j}`).value)){
                check = 0;
                break;
            }
        }
    }
    if(!check){
        alert('Try Again!');
        showSolved();
    }
    // if(false){
    //     alert('Try Again!');
    //     showSolved();
   // }
    else{
        solved = Number(JSON.parse(localStorage.getItem("solved")));
        // console.log(solved);
        solved++;
        // console.log(solved);
        localStorage.setItem('solved',JSON.stringify(solved));
        showSolved(solved);
        alert('Successful!');
        genNewGame();
    }
}

function reset_score(){
    solved = 0;
    localStorage.setItem('solved',JSON.stringify(solved));
    showSolved(solved);
    alert('Score Reset!');
    // start();
}

function hint(){
    for(i=0;i<9;i++){
        for(j=0;j<9;j++){
            if(game[i][j] === 0 && game[i][j] !== null && document.querySelector(`#_${i}__${j}`).value !== solution[i][j]){
                // document.querySelector(`#_${i} #__${j}`).classList.add('hint-cell');
                game[i][j] = null;
                document.querySelector(`#_${i}__${j}`).value = solution[i][j];
                return;
            }
        }
    }
}


// function timeToString(time) {
//     let diffInHrs = time / 3600000;
//     let hh = Math.floor(diffInHrs);
  
//     let diffInMin = (diffInHrs - hh) * 60;
//     let mm = Math.floor(diffInMin);
  
//     let diffInSec = (diffInMin - mm) * 60;
//     let ss = Math.floor(diffInSec);
  
//     let diffInMs = (diffInSec - ss) * 100;
//     let ms = Math.floor(diffInMs);
  
//     let formattedMM = mm.toString().padStart(2, "0");
//     let formattedSS = ss.toString().padStart(2, "0");
//     let formattedMS = ms.toString().padStart(2, "0");
  
//     return `${formattedMM}:${formattedSS}:${formattedMS}`;
//   }
  
//   // Declare variables to use in our functions below
  
//   let startTime;
//   let elapsedTime = 0;
//   let timerInterval;
  
//   // Create function to modify innerHTML
  
//   function print(txt) {
//     document.getElementById("display").innerHTML = txt;
//   }
  
//   // Create "start", "pause" and "reset" functions
  
//   function start() {
//     startTime = Date.now() - elapsedTime;
//     timerInterval = setInterval(function printTime() {
//       elapsedTime = Date.now() - startTime;
//       print(timeToString(elapsedTime));
//     }, 10);
//     showButton("PAUSE");
//   }
  
//   function pause() {
//     clearInterval(timerInterval);
//     showButton("PLAY");
//   }
  
//   function reset() {
//     clearInterval(timerInterval);
//     print("00:00:00");
//     elapsedTime = 0;
//     showButton("PLAY");
//   }
  
//   // Create function to display buttons

//   let startButton = document.getElementById('start');
//   let stopButton = document.getElementById('stop');
//   let resetButton = document.getElementById('reset');
  
//   let hour = 0;
//   let minute = 0;
//   let second = 0;
//   let count = 0;

//   startButton.addEventListener('click', function () {
//       timer = true;
//       stopWatch();
//   });
//   stopButton.addEventListener('click', function () {
//       timer = false;
//   });
//   resetButton.addEventListener('click', function () {
//       timer = false;
//       hour = 0;
//       minute = 0;
//       second = 0;
//       count = 0;
//       document.getElementById('hour').innerHTML = "00";
//       document.getElementById('minute').innerHTML = "00";
//       document.getElementById('second').innerHTML = "00";
//       document.getElementById('count').innerHTML = "00";
//   });
//   function stopWatch() {
//       if (timer) {
//           count++;
//           if (count == 100) {
//               second++;
//               count = 0;
//           }
//           if (second == 60) {
//               minute++;
//               second = 0;
//           }
//           if (minute == 60) {
//               hour++;
//               minute = 0;
//               second = 0;
//           }
//           let hourString = hour;
//           let minuteString = minute;
//           let secondString = second;
//           let countString = count;
//           if (hour < 10) {
//               hourString = "0" + hourString;
//           }
//           if (minute < 10) {
//               minuteString = "0" + minuteString;
//           }
//           if (second < 10) {
//               secondString = "0" + secondString;
//           }

//           if (count < 10) {
//               countString = "0" + countString;
//           }
//           document.getElementById('hour').innerHTML = hourString;
//           document.getElementById('minute').innerHTML = minuteString;
//           document.getElementById('second').innerHTML = secondString;
//           document.getElementById('count').innerHTML = countString;
//           setTimeout(stopWatch, 10);
//       }
//   }