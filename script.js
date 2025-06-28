document.addEventListener('DOMContentLoaded', () => {
    // --- หน้า index.html ---
    const howToPlayButton = document.querySelector('.how-to-play-btn');
    if (howToPlayButton && window.location.pathname.includes('index.html')) {
        window.showHowToPlay = function () {
            alert('วิธีการเล่น:\n1. เลือกโหมด "ตะลุยด่าน" เพื่อทดสอบความรู้\n2. ตอบคำถามกลุ่มดาวให้ถูกต้องเพื่อเก็บคะแนน!\n3. ถ้าตอบผิดหรือนับถอยหลังหมด จะเสียชีวิต 1 ดวง');
        };
    }

    // --- หน้า exercise.html ---
    const gameContainer = document.getElementById('game-active-screen');
    if (gameContainer) {
        const quizData = [
            {
                image_url: 'images/ursa1.png',
                question: 'นี่คือกลุ่มดาวอะไร?',
                choices: ['กลุ่มดาวหมีใหญ่', 'กลุ่มดาวแมงป่อง', 'กลุ่มดาวหญิงสาว'],
                correct_answer: 'กลุ่มดาวหมีใหญ่'
            },
            {
                image_url: 'images/ursa2.png',
                question: 'กลุ่มดาวที่มีดาวเหนืออยู่คือกลุ่มดาวใด?',
                choices: ['กลุ่มดาวหมีเล็ก', 'กลุ่มดาวค้างคาว', 'กลุ่มดาวสิงโต'],
                correct_answer: 'กลุ่มดาวหมีเล็ก'
            },
            {
                image_url: 'images/orion.png',
                question: 'กลุ่มดาวที่มีดาวสามดวงเรียงกันเด่นชัดคือกลุ่มดาวใด?',
                choices: ['กลุ่มดาวหมีใหญ่', 'กลุ่มดาวนายพราน', 'กลุ่มดาวสุนัขใหญ่'],
                correct_answer: 'กลุ่มดาวนายพราน'
            }
        ];

        let score = 0, lives = 5, streak = 0, currentQuestionIndex = 0;
        let shuffledQuestions = [];
        let timer = 10, timerInterval;

        const scoreText = document.getElementById('score-text');
        const streakText = document.getElementById('streak-text');
        const livesText = document.getElementById('lives-text');
        const constellationImg = document.getElementById('constellation-img');
        const answerButtons = document.querySelectorAll('.answer-btn');
        const gameOverScreen = document.getElementById('game-over-screen');
        const finalScoreText = document.getElementById('final-score');
        const correctSound = document.getElementById('correct-sound');
        const incorrectSound = document.getElementById('incorrect-sound');
        const highScoreText = document.getElementById('high-score-text');
        const timerText = document.getElementById('timer-text');

        function startGame() {
            score = 0; lives = 5; streak = 0;
            shuffledQuestions = quizData.sort(() => Math.random() - 0.5);
            currentQuestionIndex = 0;
            gameContainer.style.display = 'flex';
            gameOverScreen.style.display = 'none';
            updateUI();
            loadQuestion();
        }

        function loadQuestion() {
            if (currentQuestionIndex >= shuffledQuestions.length) {
                gameOver();
                return;
            }

            const currentQuestion = shuffledQuestions[currentQuestionIndex];
            constellationImg.src = currentQuestion.image_url;
            const choices = [...currentQuestion.choices].sort(() => Math.random() - 0.5);

            answerButtons.forEach((button, index) => {
                button.innerText = choices[index];
                button.className = 'answer-btn';
                button.disabled = false;
                button.onclick = () => {
                    clearInterval(timerInterval);
                    selectAnswer(button);
                };
            });

            startTimer(() => selectAnswer(null));
        }

        function selectAnswer(selectedButton) {
            const currentQuestion = shuffledQuestions[currentQuestionIndex];
            const correctAnswer = currentQuestion.correct_answer;

            answerButtons.forEach(button => button.disabled = true);

            if (selectedButton) {
                const selectedAnswer = selectedButton.innerText;
                if (selectedAnswer === correctAnswer) {
                    score += 10;
                    streak++;
                    selectedButton.classList.add('correct');
                    if (correctSound) correctSound.play();
                } else {
                    lives--;
                    streak = 0;
                    selectedButton.classList.add('incorrect');
                    if (incorrectSound) incorrectSound.play();
                }
            } else {
                lives--;
                streak = 0;
                if (incorrectSound) incorrectSound.play();
            }

            // Highlight correct answer
            answerButtons.forEach(button => {
                if (button.innerText === correctAnswer) {
                    button.classList.add('correct');
                }
            });

            updateUI();

            if (lives <= 0) {
                setTimeout(gameOver, 1500);
            } else {
                currentQuestionIndex++;
                setTimeout(loadQuestion, 1500);
            }
        }

        function updateUI() {
            scoreText.innerText = score;
            streakText.innerText = streak;
            livesText.innerHTML = '';
            for (let i = 0; i < 5; i++) {
                livesText.innerHTML += i < lives ? '❤️' : '🖤';
            }
        }

        function startTimer(callback) {
            clearInterval(timerInterval);
            timer = 10;
            timerText.textContent = timer;
            timerInterval = setInterval(() => {
                timer--;
                timerText.textContent = timer;
                if (timer <= 0) {
                    clearInterval(timerInterval);
                    callback && callback();
                }
            }, 1000);
        }

        function gameOver() {
            clearInterval(timerInterval);
            gameContainer.style.display = 'none';
            gameOverScreen.style.display = 'flex';
            finalScoreText.innerText = score;

            const currentHighScore = localStorage.getItem('moodaoHighScore') || 0;
            if (score > currentHighScore) {
                localStorage.setItem('moodaoHighScore', score);
                highScoreText.innerText = score;
            } else {
                highScoreText.innerText = currentHighScore;
            }

            const history = JSON.parse(localStorage.getItem('moodaoScoreHistory') || '[]');
            history.push(score);
            localStorage.setItem('moodaoScoreHistory', JSON.stringify(history));
        }

        startGame();
    }

    // --- Service Worker สำหรับ PWA ---
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js');
    }
});
