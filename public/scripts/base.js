const chatContainer = document.getElementById('chatContainer');
const chatInput = document.getElementById('chatInput');
const socket = io();


function addChatMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'BOT' ? 'system-message' : 'chat-message';

    // Создаем контейнер для содержимого сообщения
    const contentDiv = document.createElement('div');
    contentDiv.className = 'chat-message-content';
    contentDiv.textContent = `${sender}: ${message}`;

    // Создаем элемент времени
    const timeDiv = document.createElement('div');
    timeDiv.className = 'chat-message-time';

    // Форматируем время (например: "23:59:42")
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeDiv.textContent = `${hours}:${minutes}`;

    // Добавляем элементы в сообщение
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timeDiv);

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

document.addEventListener("DOMContentLoaded", function () {
    const typingContainer = null;

    init();
    function init() {
        setupEventListeners();
        chatContainer.scrollTop = chatContainer.scrollHeight
        document.querySelectorAll('.nav-link').forEach(link => {
            const pathname = new URL(link.href).pathname
            
            if (link.classList.contains('active')){
                link.classList.remove('active');
            }
            if (new URL(location.href).pathname == pathname){
                link.classList.add('active');
            }
        });
    }

    function setupEventListeners() {
        sendChatBtn.addEventListener('click', sendChatMessage);
        chatInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });

        chatInput.addEventListener('focus', function () {
            blurTypingInput();
        });

        chatInput.addEventListener('focus', function () {
            if (typingContainer) {
                typingContainer.classList.remove('focused');
                typingInput.removeEventListener('input', typingInputListener);
            }
        });
    }

    socket.on('showMessage', async (data) => {
        addChatMessage(data.username, data.message);
    })

    function blurTypingInput() {

        if (typingContainer) {
            if (!typingContainer.contains(document.activeElement)) {
                typingInput.blur();
                typingContainer.classList.remove('focused');
            }
        }
    }

    async function sendChatMessage() {
        const message = chatInput.value.trim();
        if (message) {

            const response = await (await fetch('/api/sendMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message
                })
            })).json();

            addChatMessage(response.username, message)
            
            socket.emit('showMessage', { username: response.username, message });

            chatInput.value = '';

        }
    }


})
