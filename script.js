let nextLevelButton = document.getElementById("nextLevelButton")
let startStopButton = document.getElementById("startStopButton")
let levelElement = document.getElementById("level")
let smallBlind = document.getElementById("SB")
let bigBlind = document.getElementById("BB")
let timeElement = document.getElementById("time")
let smallBlindElement = document.getElementById("smallBlind")
let bigBlindElement = document.getElementById("bigBlind")
let countdownElement = document.getElementById("countdown")
let saveSettingsButton = document.getElementById("saveSettings")

let levels = [

    {
    level: 1,
    smallBlind: 25,
    bigBlind: 50,
    duration: 0.1
    },

    {
    level: 2,
    smallBlind: 50,
    bigBlind: 100,
    duration: 0.1
    },

    {
    level: 3,
    smallBlind: 75,
    bigBlind: 150,
    duration: 0.1
    }    

    ];

let smallBlindValue = parseInt(smallBlindElement.value, 10)
let bigBlindValue = parseInt(bigBlindElement.value, 10)
let counter = parseInt(countdownElement.value, 10)

saveSettingsButton.addEventListener("click", function(){
    console.log("Настройки сохранены");
    let smallBlindValue = parseInt(smallBlindElement.value, 10)
    let bigBlindValue = parseInt(bigBlindElement.value, 10)
    let counter = parseInt(countdownElement.value, 10)
    levels[0].smallBlind = smallBlindValue;
    levels[0].bigBlind = bigBlindValue;
    levels[0].duration = counter;
    timeLeft = levels[currentLevel].duration * 60;
    showCurrentLevel();
    showTime();
})

/*console.log(typeof smallBlindElement.value);
console.log(typeof );*/
    
let currentLevel = 0;
let timeLeft = levels[currentLevel].duration * 60;
let timer;

function nextLevel() {
    if (currentLevel < levels.length - 1) {
        currentLevel++;
        timeLeft = levels[currentLevel].duration * 60;
    }
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        showTime();
  
        if (timeLeft <= 0) {
            if (levels.length - 1 === currentLevel) {
                clearInterval(timer);
                timer = undefined;
            } else {
                clearInterval(timer);
                setTimeout(() => {
                nextLevel();
                showCurrentLevel();
                showTime();
                startTimer();
                }, 1000);
            }   
        }
    }, 1000);
}

function showCurrentLevel() {
    levelElement.textContent = `Текущий уровень: ${levels[currentLevel].level}`
    smallBlind.textContent = `SB: ${levels[currentLevel].smallBlind}`
    bigBlind.textContent = `BB:  ${levels[currentLevel].bigBlind}`
}

nextLevelButton.addEventListener("click", function(){
    nextLevel();
    showCurrentLevel();
    showTime();
})

startStopButton.addEventListener("click", function(){
    let startButtonText = "Старт";
    let stopButtonText = "Пауза";
        
    if (timer) {
        startStopButton.textContent = startButtonText;
        clearInterval(timer);
        timer = undefined;
}   else {
    startStopButton.textContent = stopButtonText; 
    startTimer();
    }
})

function showTime(){
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60 ;
    let minutesText = String(minutes).padStart(2, "0");
    let secondsText = String(seconds).padStart(2, "0");
    let timeText = `Время ${minutesText}:${secondsText}`;
    timeElement.textContent = timeText;
}

showTime();
showCurrentLevel();
startStopButton.textContent = "Старт";

levels.forEach(function(level) {
     let row = document.createElement("div");
     let input = document.createElement("input");
     row.textContent = `Уровень: ${level.level} SB:${level.smallBlind} BB:${level.bigBlind} Время:${level.duration}`
     document.body.append(row);
     row.append(input);
});
