const koleso = document.getElementById("koleso");
const znak = document.getElementById("znak");
const scoreElement = document.getElementById("score");
const gameOverElement = document.getElementById("gameOver");
const restartBtn = document.getElementById("restartBtn");
const finalScoreElement = document.getElementById("finalScore");

let score = 0;
let gameRunning = true;
let gameLoop;
let lastObstaclePosition = 650; // Начальная позиция препятствия
let obstaclesPassed = 0; // Счетчик пройденных препятствий

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
document.addEventListener("click", function(event) {
    event.preventDefault();
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
        
        // Добавляем эффект отскока
        koleso.style.transform = "scale(1.1)";
        setTimeout(function() {
            koleso.style.transform = "scale(1)";
        }, 100);
        
        setTimeout(function() {
            koleso.classList.remove("jump");
        }, 500);
    }
}

// Функция увеличения счета
function updateScore() {
    if (gameRunning) {
        score += 10; // Увеличиваем на 10 очков за каждое препятствие
        scoreElement.textContent = "Счет: " + score;
        
        // Увеличиваем скорость игры каждые 50 очков
        if (score % 50 === 0 && score > 0) {
            increaseSpeed();
        }
        
        // Добавляем визуальный эффект при получении очков
        scoreElement.style.transform = "scale(1.2)";
        scoreElement.style.color = "#4CAF50";
        setTimeout(function() {
            scoreElement.style.transform = "scale(1)";
            scoreElement.style.color = "white";
        }, 200);
    }
}

// Функция увеличения скорости
function increaseSpeed() {
    const currentDuration = parseFloat(getComputedStyle(znak).animationDuration) || 1;
    if (currentDuration > 0.3) {
        const newDuration = Math.max(0.3, currentDuration - 0.1);
        znak.style.animationDuration = newDuration + "s";
        
        // Показываем уведомление об увеличении скорости
        showSpeedBoost();
    }
}

// Функция показа уведомления о ускорении
function showSpeedBoost() {
    const speedBoost = document.createElement("div");
    speedBoost.textContent = "УСКОРЕНИЕ!"; 
    speedBoost.style.position = "fixed";
    speedBoost.style.top = "50%";
    speedBoost.style.left = "50%";
    speedBoost.style.transform = "translate(-50%, -50%)";
    speedBoost.style.color = "#FF6B6B";
    speedBoost.style.fontSize = "24px";
    speedBoost.style.fontWeight = "bold";
    speedBoost.style.zIndex = "1000";
    speedBoost.style.textShadow = "2px 2px 4px rgba(0,0,0,0.7)";
    speedBoost.style.animation = "fadeInOut 1.5s ease-in-out";
    
    document.body.appendChild(speedBoost);
    
    setTimeout(function() {
        document.body.removeChild(speedBoost);
    }, 1500);
}

// Функция окончания игры
function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    znak.style.animationPlayState = "paused";
    
    // Отображаем финальный счет
    finalScoreElement.textContent = score;
    gameOverElement.style.display = "block";
    
    // Добавляем эффект тряски при проигрыше
    document.querySelector('.game').style.animation = "shake 0.5s ease-in-out";
    
    // Сохраняем лучший результат
    const bestScore = localStorage.getItem("bestScore") || 0;
    if (score > bestScore) {
        localStorage.setItem("bestScore", score);
        document.getElementById("bestScore").textContent = "Лучший результат: " + score;
        
        // Показываем поздравление с новым рекордом
        const newRecord = document.createElement("div");
        newRecord.innerHTML = "🏆 НОВЫЙ РЕКОРД! 🏆";
        newRecord.style.color = "#FFD700";
        newRecord.style.fontSize = "18px";
        newRecord.style.fontWeight = "bold";
        newRecord.style.marginTop = "10px";
        newRecord.style.textShadow = "0 0 10px rgba(255,215,0,0.8)";
        gameOverElement.appendChild(newRecord);
    } else {
        document.getElementById("bestScore").textContent = "Лучший результат: " + bestScore;
    }
}

// Функция перезапуска игры
function restartGame() {
    score = 0;
    obstaclesPassed = 0;
    gameRunning = true;
    lastObstaclePosition = 650;
    
    scoreElement.textContent = "Счет: 0";
    gameOverElement.style.display = "none";
    
    // Убираем эффект тряски
    document.querySelector('.game').style.animation = "";
    
    // Сбрасываем скорость анимации
    znak.style.animationDuration = "1s";
    znak.style.animationPlayState = "running";
    koleso.classList.remove("jump");
    
    // Убираем сообщение о новом рекорде если было
    const newRecord = gameOverElement.querySelector('div:last-child');
    if (newRecord && newRecord.innerHTML.includes('НОВЫЙ РЕКОРД')) {
        gameOverElement.removeChild(newRecord);
    }
    
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
        
        // Проверка коллизии с улучшенными границами
        if (znakleft < 60 && znakleft > 10 && kolesoTop >= 120) {
            gameOver();
            return;
        }
        
        // Улучшенная логика подсчета очков
        // Проверяем, прошло ли препятствие мимо игрока
        if (znakleft < 40 && lastObstaclePosition >= 40) {
            updateScore();
            obstaclesPassed++;
        }
        
        // Обновляем последнюю позицию препятствия
        lastObstaclePosition = znakleft;
        
    }, 16); // ~60 FPS для более плавной игры
}

// Обработчик кнопки рестарта
restartBtn.addEventListener("click", function(event) {
    event.preventDefault();
    restartGame();
});

// Добавляем CSS анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    #score {
        transition: all 0.2s ease;
    }
`;
document.head.appendChild(style);

// Загружаем лучший результат при запуске
window.addEventListener("load", function() {
    const bestScore = localStorage.getItem("bestScore") || 0;
    document.getElementById("bestScore").textContent = "Лучший результат: " + bestScore;
    
    // Показываем стартовое сообщение
    setTimeout(function() {
        if (gameRunning && score === 0) {
            const startMsg = document.createElement("div");
            startMsg.innerHTML = "Нажмите ПРОБЕЛ или кликните для прыжка!";
            startMsg.style.position = "absolute";
            startMsg.style.top = "20px";
            startMsg.style.left = "50%";
            startMsg.style.transform = "translateX(-50%)";
            startMsg.style.color = "white";
            startMsg.style.fontSize = "16px";
            startMsg.style.textShadow = "2px 2px 4px rgba(0,0,0,0.7)";
            startMsg.style.zIndex = "100";
            document.querySelector('.game').appendChild(startMsg);
            
            setTimeout(function() {
                if (startMsg.parentNode) {
                    startMsg.parentNode.removeChild(startMsg);
                }
            }, 3000);
        }
    }, 1000);
    
    startGame();
});