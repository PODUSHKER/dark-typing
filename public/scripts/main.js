document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const textDisplay = document.getElementById('textDisplay');
    const typingInput = document.getElementById('typingInput');
    const speedStat = document.getElementById('speedStat');
    const errorStat = document.getElementById('errorStat');
    const timeStat = document.getElementById('timeStat');
    const reloadBtn = document.getElementById('reloadBtn');
    const languageSelect = document.getElementById('languageSelect');
    const resultsPopup = document.getElementById('resultsPopup');
    const closePopup = document.getElementById('closePopup');
    const saveResultBtn = document.getElementById('saveResultBtn');
    const resultSpeed = document.getElementById('resultSpeed');
    const resultAccuracy = document.getElementById('resultAccuracy');
    const resultTime = document.getElementById('resultTime');
    const resultErrors = document.getElementById('resultErrors');
    const leaderboardTable = document.getElementById('leaderboardTable').querySelector('tbody');
    const chatContainer = document.getElementById('chatContainer');
    const typingContainer = document.querySelector('.typing-container');

    // Typing test variables
    let currentText = '';
    let startTime = null;
    let timerInterval = null;
    let mistakes = 0;
    let isTyping = false;
    let currentPosition = 0;
    let cursorInterval = null;

    // Initialize the app
    init();

    function init() {
        loadText();
        setupEventListeners();
        updateLeaderboard();
        focusTypingInput();
        chatContainer.scrollTop = chatContainer.scrollHeight
        document.querySelector('.typing-container').addEventListener('click', focusTypingInput);
        textDisplay.addEventListener('click', focusTypingInput);
    }

    function focusTypingInput(e) {
        if (e && e.target.closest('.typing-container')) return;

        typingInput.focus();
        typingContainer.classList.add('focused');
        typingInputListener = typingInput.addEventListener('input', handleTyping);

    }

    function blurTypingInput() {

        if (!typingContainer.contains(document.activeElement)) {
            typingInput.blur();
            typingContainer.classList.remove('focused');
        }
    }


    function loadText() {

        const language = languageSelect.value;
        const texts = textDatabase[language];
        currentText = texts[Math.floor(Math.random() * texts.length)];
        renderText();
    }

    function renderText() {

        textDisplay.innerHTML = '';

        const typedSpan = document.createElement('span');
        typedSpan.className = 'typed';
        typedSpan.textContent = currentText.substring(0, currentPosition);

        const currentSpan = document.createElement('span');
        currentSpan.className = 'current';
        currentSpan.textContent = currentText.substring(currentPosition, currentPosition + 1);

        const untypedSpan = document.createElement('span');
        untypedSpan.className = 'untyped';
        untypedSpan.textContent = currentText.substring(currentPosition + 1);

        textDisplay.appendChild(typedSpan);
        textDisplay.appendChild(currentSpan);
        textDisplay.appendChild(untypedSpan);

        positionCursor();
    }

    function positionCursor() {
        const cursor = document.querySelector('.terminal-cursor');
        if (!cursor) return;

        const currentChar = document.querySelector('.current');
        if (!currentChar) return;

        const charRect = currentChar.getBoundingClientRect();
        const displayRect = textDisplay.getBoundingClientRect();

        cursor.style.left = `${charRect.left - displayRect.left}px`;
        cursor.style.top = `${charRect.top - displayRect.top}px`;
        cursor.style.width = `${charRect.width}px`;
        cursor.style.height = `${charRect.height}px`;
    }

    function setupEventListeners() {

        document.addEventListener('click', function (e) {
            if(!(e.target.closest('.typing-container'))){
                blurTypingInput()
            }
            else{
                focusTypingInput()
            }
        });

        typingContainer.addEventListener('mousedown', function (e) {
            e.preventDefault(); // Предотвращаем возможные конфликты
            focusTypingInput(e);
        });
        // Typing input events

        // Reload button
        reloadBtn.addEventListener('click', resetTest);

        // Language selector
        languageSelect.addEventListener('change', function () {
            resetTest();
            loadText();
            focusTypingInput();
        });

        // Results popup
        closePopup.addEventListener('click', function () {
            resultsPopup.classList.remove('active');
        });

        if (saveResultBtn) {
            saveResultBtn.addEventListener('click', saveResult);
        }

        // Navigation links
        // document.querySelectorAll('.nav-link').forEach(link => {
        //     link.addEventListener('click', function (e) {
        //         e.preventDefault();
        //         document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        //         this.classList.add('active');
        //         // Here you would typically load different pages
        //         // For this demo, we'll just show an alert
        //         alert(`Navigating to ${this.dataset.page}`);
        //     });
        // });

        // Window resize - reposition cursor
        window.addEventListener('resize', positionCursor);
    }

    function startTypingTest() {

        if (!isTyping && currentPosition === 0) {
            isTyping = true;
            startTime = new Date();
            mistakes = 0;
            timerInterval = setInterval(updateTimer, 1000);
            document.querySelector('.typing-container').classList.add('focused');
        }
    }
    function stopTypingTest() {


        if (isTyping && currentPosition < currentText.length) {
            clearInterval(timerInterval);
            isTyping = false;
        }
    }

    function handleTyping(e) {

        if (!isTyping) {
            startTypingTest();
        };

        const inputChar = e.data || '';
        const expectedChar = currentText[currentPosition];

        if (inputChar === expectedChar) {
            // Correct character
            currentPosition++;

            // Check if test is complete
            if (currentPosition >= currentText.length) {
                completeTest();
            }
        } else {
            // Incorrect character
            mistakes++;
            errorStat.textContent = mistakes;

            // Add error class temporarily
            const currentSpan = document.querySelector('.current');
            currentSpan.classList.add('mistake');
            setTimeout(() => currentSpan.classList.remove('mistake'), 300);
        }

        // Update speed (characters per minute)
        const timeElapsed = Math.round((new Date() - startTime) / 1000); // in seconds
        const speed = Math.round((currentPosition / timeElapsed) * 60);

        speedStat.textContent = speed;

        renderText();
    }

    function updateTimer() {

        const seconds = Math.floor((new Date() - startTime) / 1000);
        timeStat.textContent = seconds;
    }

    function completeTest() {

        clearInterval(timerInterval);
        clearInterval(cursorInterval);
        isTyping = false;

        const timeElapsed = (new Date() - startTime) / 1000; // in seconds
        const speed = Math.round((currentText.length / timeElapsed) * 60);
        const accuracy = (((currentText.length - mistakes) / currentText.length) * 100).toFixed(1);

        // Show results
        resultSpeed.textContent = speed;
        resultAccuracy.textContent = accuracy;
        resultTime.textContent = Math.round(timeElapsed);
        resultErrors.textContent = mistakes;

        resultsPopup.classList.add('active');
    }

    function resetTest() {

        clearInterval(timerInterval);
        clearInterval(cursorInterval);

        typingInput.value = '';
        currentPosition = 0;
        mistakes = 0;
        isTyping = false;
        startTime = null;

        speedStat.textContent = '0';
        errorStat.textContent = '0';
        timeStat.textContent = '0';

        loadText();
    }

    socket.on('showNewRecord', (data) => {
        const { username, speed } = data;
        addChatMessage('BOT', `New high score set by ${username}: ${speed} CPM!`)
    })

    async function saveResult() {
        const language = languageSelect.value;
        const speed = parseInt(resultSpeed.textContent);
        const mistakes = parseInt(resultErrors.textContent);
        const time = parseInt(resultTime.textContent);
        const accuracy = parseFloat(resultAccuracy.textContent);

        try {
            const response = await (await fetch('/api/saveResult', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    speed,
                    language,
                    mistakes,
                    time,
                    accuracy
                })
            })).json();

            if (response.success) {
                if (response.topData) {
                    const { username, speed } = response.topData;
                    addChatMessage('BOT', `New high score set by ${username}: ${speed} CPM!`)
                    socket.emit('showNewRecord', response.topData)
                }
                // Обновляем статистику пользователя без перезагрузки
                updateUserStats(response.updatedStats);

                // Обновляем таблицу лидерборда
                updateLeaderboard();

                // Закрываем попап
                resultsPopup.classList.remove('active');
            }
        } catch (error) {
            console.error('Error saving result:', error);
        }
    }

    function updateUserStats(updatedStats) {
        const speedElement = document.querySelector('.user-stat:nth-child(1) .stat-value');
        const accuracyElement = document.querySelector('.user-stat:nth-child(2) .stat-value');

        // Получаем текущие значения
        const currentSpeed = parseFloat(speedElement.textContent) || 0;
        const currentAccuracy = parseFloat(accuracyElement.textContent) || 0;

        // Добавляем классы анимации в зависимости от изменения значений
        if (updatedStats.averageSpeed > currentSpeed) {
            speedElement.classList.add('stat-updated');
        } else if (updatedStats.averageSpeed < currentSpeed) {
            speedElement.classList.add('stat-decreased');
        }

        if (updatedStats.averageAccuracy > currentAccuracy) {
            accuracyElement.classList.add('stat-updated');
        } else if (updatedStats.averageAccuracy < currentAccuracy) {
            accuracyElement.classList.add('stat-decreased');
        }

        // Добавляем эффект обновления
        speedElement.classList.add('stat-value-updating');
        accuracyElement.classList.add('stat-value-updating');

        // Устанавливаем новые значения
        speedElement.textContent = updatedStats.averageSpeed.toFixed(0);
        accuracyElement.textContent = updatedStats.averageAccuracy.toFixed(1);

        // Удаляем классы анимации после завершения
        setTimeout(() => {
            speedElement.classList.remove('stat-updated', 'stat-decreased', 'stat-value-updating');
            accuracyElement.classList.remove('stat-updated', 'stat-decreased', 'stat-value-updating');
        }, 1000);
    }

    socket.on('updateLeaderboard', (results) => {
        leaderboardTable.innerHTML = '';

        // Add rows
        results.forEach(result => {
            const row = document.createElement('tr');

            const rankCell = document.createElement('td');
            rankCell.textContent = result.rank;

            const userCell = document.createElement('td');
            userCell.textContent = result.username;

            const speedCell = document.createElement('td');
            speedCell.textContent = result.speed;

            const langCell = document.createElement('td');
            langCell.textContent = result.language.toUpperCase();

            const dateCell = document.createElement('td');
            dateCell.textContent = result.date

            row.appendChild(rankCell);
            row.appendChild(userCell);
            row.appendChild(speedCell);
            row.appendChild(langCell);
            row.appendChild(dateCell);

            leaderboardTable.appendChild(row);
        });
    })

    async function updateLeaderboard() {
        // Get results from localStorage

        const response = await (await fetch('/api/getResults', {
            method: 'POST'
        })).json()
        let results = response?.results || [];


        // Clear current leaderboard
        leaderboardTable.innerHTML = '';

        // Add rows
        results.forEach(result => {
            const row = document.createElement('tr');

            const rankCell = document.createElement('td');
            rankCell.textContent = result.rank;

            const userCell = document.createElement('td');
            userCell.textContent = result.username;

            const speedCell = document.createElement('td');
            speedCell.textContent = result.speed;

            const langCell = document.createElement('td');
            langCell.textContent = result.language.toUpperCase();

            const dateCell = document.createElement('td');
            dateCell.textContent = result.date

            row.appendChild(rankCell);
            row.appendChild(userCell);
            row.appendChild(speedCell);
            row.appendChild(langCell);
            row.appendChild(dateCell);

            leaderboardTable.appendChild(row);
        });

        socket.emit('updateLeaderboard', results);
    }

});