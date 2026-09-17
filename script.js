//Переменная которая получает кнопку перехода на следующий уровень
let nextLevelButton = document.getElementById("nextLevelButton")

//Переменная которая получает кнопку Старт / Пауза из HTML
let startStopButton = document.getElementById("startStopButton")

// Получаем из HTML элемент который показывает номер текущего уровня
let levelElement = document.getElementById("level")

// Находим HTML-элемент, где показываем блайнды
let currentBlinds = document.getElementById("currentBlinds")

// Находим HTML-элемент, где показываем время
let timeElement = document.getElementById("time")

// Находим HTML-элемент, где показываем блайнды следующего уровня
let nextBlinds = document.getElementById("nextBlinds")

let addLevelButton = document.getElementById("addLevelButton")

// Находим кнопку сохранения настроек и сохраняем ее в переменную
let saveSettingsButton = document.getElementById("saveSettings")
let settingsButton = document.getElementById("settingsButton")
let mainScreen = document.getElementById("mainScreen")
let settingsScreen = document.getElementById("settingsScreen")
let backButton = document.getElementById("backButton")

backButton.addEventListener("click", function () {
    settingsScreen.style.display = "none";
    mainScreen.style.display = "block";
})

settingsButton.addEventListener("click", function () {
    mainScreen.style.display = "none";
    settingsScreen.style.display = "block";
})

//Переменная хранит массив структуры всего турнира
let levels = [

    {
    level: 1,
    smallBlind: 25,
    bigBlind: 50,
    duration: 10
    },

    {
    level: 2,
    smallBlind: 50,
    bigBlind: 100,
    duration: 10
    },

    {
    level: 3,
    smallBlind: 75,
    bigBlind: 150,
    duration: 10
    }    

    ];

// Получаем сохранённые уровни из localStorage
let savedLevels = sessionStorage.getItem("levels");

// Преобразуем JSON-строку обратно в массив объектов
let parsedLevels = JSON.parse(savedLevels);

// Если в localStorage есть сохранённые уровни, заменяем ими стандартный массив levels
if (savedLevels) {
    levels = parsedLevels;
}

let currentLevel = 0; //Индекс текущего уровня

let savedCurrentLevel = sessionStorage.getItem("currentLevel");
let parsedCurrentLevel = JSON.parse(savedCurrentLevel);

if (savedCurrentLevel) {
    currentLevel = parsedCurrentLevel;
}

let timeLeft = levels[currentLevel].duration * 60; //Получаем длительность уровня, переводим минуты в секунды

let timer;


//Переход на следующий уровень
function nextLevel() {
    //Проверяем не на последнем ли мы элементе массива
    if (currentLevel < levels.length - 1) {
        currentLevel++; //Увеличение индекса
        timeLeft = levels[currentLevel].duration * 60; //После перехода уровня снова переводит минуты в секунды
        sessionStorage.setItem("currentLevel", JSON.stringify(currentLevel));
    }
}

//Запуск таймера
function startTimer() {
    //Выполнять код через определенный промежуток времени 1000=1 секунда
    timer = setInterval(() => {
        timeLeft--; //Уменьшение времени каждую секунду на 1 секунду
        showTime(); //Обновление отображение времени на странице
        //Проверка закончилось ли время текущего уровня
        if (timeLeft <= 0) {
            //Проверка на последний уровень
            if (levels.length - 1 === currentLevel) {
                //Если да,останавливаем таймер и очищаем переменную
                clearInterval(timer);
                timer = undefined;
            } else {
                //Если это не последний уровень
                clearInterval(timer); //Останавливаем текущий интервал
                //ждём одну секунду, нужно чтобы показать 00:00 
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

//Показываем блайнды следущего уровня
function showNextBlinds() {
    //Проверяем на последний уровень
    if ( currentLevel < levels.length - 1) {
        nextBlinds.textContent = `${levels[currentLevel + 1].smallBlind} / ${levels[currentLevel + 1].bigBlind}`
    } else {
        nextBlinds.textContent = `- / -`
    }
}

//вывод информации о текущем уровне
function showCurrentLevel() {
    levelElement.textContent = `Текущий уровень: ${levels[currentLevel].level}` //Берём номер уровня из объекта и записываем его в HTML
    currentBlinds.textContent = `${levels[currentLevel].smallBlind} /  ${levels[currentLevel].bigBlind}`
}

//При нажатии на кнопку выполнить функцию
nextLevelButton.addEventListener("click", function(){
    nextLevel();
    showCurrentLevel();
    showTime();
    showNextBlinds();
})

startStopButton.addEventListener("click", function(){
    let startButtonText = "Старт";
    let stopButtonText = "Пауза";
    
    //Проверяем, есть ли сейчас запущенный таймер
    //Если timer содержит значение → таймер запущен
    if (timer) {
        startStopButton.textContent = startButtonText;
        clearInterval(timer);
        timer = undefined;
}   else {
    startStopButton.textContent = stopButtonText; 
    startTimer();
    }
})



//Отображение времени
function showTime() {
    let minutes = Math.floor(timeLeft / 60); //Получаем количество полных минут
    let seconds = timeLeft % 60 ; //Получаем оставшиеся секунды
    let minutesText = String(minutes).padStart(2, "0"); // Превращаем числа в строки из двух знаков добавляем 0, если нужно
    let secondsText = String(seconds).padStart(2, "0");
    let timeText = `Время ${minutesText}:${secondsText}`; //Объединяем все в одну строку
    timeElement.textContent = timeText; //Показ текста на странице
}

//Первоначальное отображение на странице
showTime();
showCurrentLevel();
showNextBlinds();
startStopButton.textContent = "Старт";

//настройка уровней
function showLevels() {
    
    let levelRows = document.querySelectorAll('.level-row') //Находим все уже существующие строки настроек
    
    //Проходим по всем старым строкам и удаляем их из HTML
    levelRows.forEach(function (row) {
    row.remove();
    })

    //Создаём строки заново, проходим по данным, а не по HTML
    levels.forEach(function(level, index) {
        //Создаём элементы в памяти JavaScript
        let levelNumber = document.createElement("div");
        let row = document.createElement("div");

        
        let inputSB = document.createElement("input");
        let inputBB = document.createElement("input");
        let inputTime = document.createElement("input");
        let deleteButton = document.createElement("button");

        //Говорим браузеру, что это числовые поля
        inputSB.type = "number";
        inputBB.type = "number";
        inputTime.type = "number";

        //Заполняем текст
        levelNumber.textContent = `Уровень: ${level.level}`;
        deleteButton.textContent = "Удалить";

        //Берём данные из levels и вставляем их в поля
        inputSB.value = level.smallBlind;
        inputBB.value = level.bigBlind;
        inputTime.value = level.duration;

        //Задаём структуру строки формата: Уровень 1 | [25] | [50] | [10] | [Удалить]
        row.append(levelNumber);
        row.append(inputSB);
        row.append(inputBB);
        row.append(inputTime);
        row.append(deleteButton);

        row.classList.add("level-row"); //Добавляем классу строки имя

        settingsScreen.append(row); //созданная строка появляется на странице

        //Удаление уровня
        deleteButton.addEventListener("click", function () {
            //Удаляем один объект из массива начиная с текущего index
            levels.splice(index, 1);
            //Перенумеровываем оставшиеся уровни
            levels.forEach(function (level, index) {
            level.level = index + 1;
            })
            sessionStorage.setItem("levels", JSON.stringify(levels));
            showLevels(); //Заново строим HTML настроек
        })
    });
}

//Добавление уровня
addLevelButton.addEventListener("click", function () {
    //Берем элемент массива
    levels.push( {
    smallBlind: 100,
    bigBlind: 200,
    duration: 10
    });
    //Делаем перенумерацию и обновляем
    levels.forEach(function (level, index) {
            level.level = index + 1;
        })
    showLevels();
    sessionStorage.setItem("levels", JSON.stringify(levels));
})

showLevels(); //Вызываем функцию один раз, чтобы настройки появились на странице при загрузке

saveSettingsButton.addEventListener("click", function () {
    let levelRows = document.querySelectorAll('.level-row') //Получаем актуальные строки, которые сейчас находятся на странице

    //Проходим по каждой строке
    levelRows.forEach(function (row, index) {
        
        let inputs = row.querySelectorAll("input"); //Находим все input внутри текущей строки
        levels[index].smallBlind = parseInt(inputs[0].value, 10); //Возьми SB из текущей строки и преврати его из строки в число, затем запиши это число в smallBlind текущего уровня
        levels[index].bigBlind = parseInt(inputs[1].value, 10);
        levels[index].duration = parseInt(inputs[2].value, 10);
    }) 
    clearInterval(timer);
    timer = undefined;
    timeLeft = levels[currentLevel].duration * 60;
    showTime();
    showCurrentLevel();
    showNextBlinds();
    sessionStorage.setItem("levels", JSON.stringify(levels));
})

