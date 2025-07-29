const popup = document.getElementById('popup')
let arrowsUpdateInterval;

function showPopup(content) {
    popup.innerHTML = `<div class="popup-content">${content}</div>`
    arrowsUpdateInterval = setInterval(() => {
        const arrows = document.querySelectorAll('.arrow')
        for (let arrow of arrows){
            arrow.innerHTML = '>'.repeat((((arrow.innerHTML.length+4) % 16)/4)||1)
        }
    }, 300)
    popup.classList.add('active')
}

function closePopup() {
    popup.classList.remove('active')
    popup.innerHTML = '';
    clearInterval(arrowsUpdateInterval)
    arrowsUpdateInterval = ''
}