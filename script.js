const koleso = document.getElementById("koleso");
const znak = document.getElementById("znak");
const scoreElement = document.getElementById("score");
const gameOverElement = document.getElementById("gameOver");
const restartBtn = document.getElementById("restartBtn");
const finalScoreElement = document.getElementById("finalScore");

let score = 0;
let gameRunning = true;
let gameLoop;

// Обработчик нажатий клавиш
document.addEventListener("keydown", function(event) {
    if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault();
        if (gameRunning) {
            jump();
        } else {
            restartGame();
        }
    }
});

// Обработчик клика мыши
document.addEventListener("click", function() {
    if (gameRunning) {
        jump();
    } else {
        restartGame();
    }
});

// Функция прыжка
function jump() {
    if (!koleso.classList.contains("jump")) {
        koleso.classList.add("jump");
        setTimeout(function() {
            koleso.classList.remove("jump");
        }, 500);
    }
}

// Функция увеличения счета
function updateScore() {
    if (gameRunning) {
        score += 1;
        scoreElement.textContent = "Счет: " + score;
        
        // Увеличиваем скорость игры каждые 100 очков
        if (score % 100 === 0) {
            increaseSpeed();
        }
    }
}

// Функция увеличения скорости
function increaseSpeed() {
    const currentDuration = parseFloat(getComputedStyle(znak).animationDuration);
    if (currentDuration > 0.5) {
        znak.style.animationDuration = (currentDuration - 0.1) + "s";
    }
}

// Функция окончания игры
function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    znak.style.animationPlayState = "paused";
    
    // Отображаем финальный счет
    finalScoreElement.textContent = score;
    gameOverElement.style.display = "block";
    
    // Сохраняем лучший результат
    const bestScore = localStorage.getItem("bestScore") || 0;
    if (score > bestScore) {
        localStorage.setItem("bestScore", score);
        document.getElementById("bestScore").textContent = "Лучший результат: " + score;
    } else {
        document.getElementById("bestScore").textContent = "Лучший результат: " + bestScore;
    }
}

// Функция перезапуска игры
function restartGame() {
    score = 0;
    gameRunning = true;
    scoreElement.textContent = "Счет: 0";
    gameOverElement.style.display = "none";
    znak.style.animationDuration = "1s";
    znak.style.animationPlayState = "running";
    koleso.classList.remove("jump");
    
    // Перезапускаем игровой цикл
    startGame();
}

// Главный игровой цикл
function startGame() {
    gameLoop = setInterval(function() {
        if (!gameRunning) return;
        
        // Получаем позиции элементов
        const kolesoTop = parseInt(window.getComputedStyle(koleso).getPropertyValue("top"));
        const znakleft = parseInt(window.getComputedStyle(znak).getPropertyValue("left"));
        
        // Проверка коллизии
        if (znakleft < 70 && znakleft > 0 && kolesoTop >= 130) {
            gameOver();
            return;
        }
        
        // Увеличиваем счет, когда препятствие проходит мимо
        if (znakleft === 0) {
            updateScore();
        }
    }, 10);
}

// Обработчик кнопки рестарта
restartBtn.addEventListener("click", restartGame);

// Загружаем лучший результат при запуске
window.addEventListener("load", function() {
    const bestScore = localStorage.getItem("bestScore") || 0;
    document.getElementById("bestScore").textContent = "Лучший результат: " + bestScore;
    startGame();
});