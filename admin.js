document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.getElementById('backButton');
    const addMemberForm = document.getElementById('addMemberForm');
    const memberNameInput = document.getElementById('memberName');
    const addDrinkForm = document.getElementById('addDrinkForm');
    const drinkNameInput = document.getElementById('drinkName');
    const drinkAmountInput = document.getElementById('drinkAmount');
    const ledenToRemove = document.getElementById('ledenToRemove');
    const drankjesToRemove = document.getElementById('drankjesToRemove');

    const pincodePopup = document.getElementById('pincodePopup');
    const popupPincodeInput = document.getElementById('popupPincodeInput');
    const confirmPopupButton = document.getElementById('confirmPopupButton');
    const cancelPopupButton = document.getElementById('cancelPopupButton');
    const notificationPopup = document.getElementById('notificationPopup');
    const notificationMessage = document.getElementById('notificationMessage');
    
    const CORRECT_PINCODE = '1932';
    let currentType, currentName;

    // Functie om de notificatie pop-up te tonen
    function showNotification(message) {
        notificationMessage.textContent = message;
        notificationPopup.classList.add('visible');
        setTimeout(() => {
            notificationPopup.classList.remove('visible');
        }, 3000); // De popup verdwijnt na 3 seconden
    }

    backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    addMemberForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const memberName = memberNameInput.value.trim();
        if (memberName) {
            const leden = JSON.parse(localStorage.getItem('leden')) || [];
            leden.push({ name: memberName, amount: 0 });
            localStorage.setItem('leden', JSON.stringify(leden));
            memberNameInput.value = '';
            loadLedenToRemove();
            showNotification('Je hebt een nieuw Lid toegevoegd!');
        } else {
            showNotification('Voer een geldige naam in.');
        }
    });

    addDrinkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const drinkName = drinkNameInput.value.trim();
        const drinkAmount = parseFloat(drinkAmountInput.value.trim());

        if (drinkName && !isNaN(drinkAmount) && drinkAmount >= 0) {
            const drankjes = JSON.parse(localStorage.getItem('drankjes')) || [];
            drankjes.push({ name: drinkName, amount: drinkAmount });
            localStorage.setItem('drankjes', JSON.stringify(drankjes));
            drinkNameInput.value = '';
            drinkAmountInput.value = '';
            loadDrankjesToRemove();
            showNotification('Je hebt een nieuw consumerende item toegevoegd!');
        } else {
            showNotification('Voer een geldige naam en bedrag in.');
        }
    });

    window.promptForPincode = function(type, name) {
        currentType = type;
        currentName = name;
        pincodePopup.classList.add('visible');
        popupPincodeInput.value = '';
        popupPincodeInput.focus();
    };

    confirmPopupButton.addEventListener('click', () => {
        if (popupPincodeInput.value.trim() === CORRECT_PINCODE) {
            if (currentType === 'lid') removeLid(currentName);
            else if (currentType === 'drankje') removeDrink(currentName);
            pincodePopup.classList.remove('visible');
            showNotification(' Je hebt dit succesvol verwijderd! ');
        } else {
            showNotification('Onjuiste pincode. Probeer het opnieuw.');
            popupPincodeInput.value = '';
        }
    });

    cancelPopupButton.addEventListener('click', () => {
        pincodePopup.classList.remove('visible');
    });

    function removeLid(name) {
        let leden = JSON.parse(localStorage.getItem('leden')) || [];
        leden = leden.filter(member => member.name !== name);
        localStorage.setItem('leden', JSON.stringify(leden));
        loadLedenToRemove();
    }

    function removeDrink(name) {
        let drankjes = JSON.parse(localStorage.getItem('drankjes')) || [];
        drankjes = drankjes.filter(drink => drink.name !== name);
        localStorage.setItem('drankjes', JSON.stringify(drankjes));
        loadDrankjesToRemove();
    }

    function loadLedenToRemove() {
        ledenToRemove.innerHTML = '';
        const leden = JSON.parse(localStorage.getItem('leden')) || [];
        leden.forEach(member => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${member.name}
                <button onclick="promptForPincode('lid', '${member.name}')">Verwijder</button>
            `;
            ledenToRemove.appendChild(li);
        });
    }

    function loadDrankjesToRemove() {
        drankjesToRemove.innerHTML = '';
        const drankjes = JSON.parse(localStorage.getItem('drankjes')) || [];
        drankjes.forEach((drink, index) => {
            const li = document.createElement('li');
            li.setAttribute('draggable', 'true');
            li.setAttribute('data-index', index);
            li.innerHTML = `
                ${drink.name} - €${parseFloat(drink.amount).toFixed(2)}
                <button onclick="promptForPincode('drankje', '${drink.name}')">Verwijder</button>
            `;
            drankjesToRemove.appendChild(li);

            // Voeg drag & drop functionaliteit toe
            li.addEventListener('dragstart', dragStart);
            li.addEventListener('dragover', dragOver);
            li.addEventListener('drop', dropItem);
        });
    }

    function dragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.dataset.index);
    }

    function dragOver(event) {
        event.preventDefault(); // Dit voorkomt dat de browser de drop standaard afwijst
    }

    function dropItem(event) {
        event.preventDefault();
        const draggedIndex = event.dataTransfer.getData('text/plain');
        const targetIndex = event.target.dataset.index;

        if (draggedIndex !== targetIndex) {
            const drankjes = JSON.parse(localStorage.getItem('drankjes')) || [];
            const draggedItem = drankjes[draggedIndex];
            drankjes.splice(draggedIndex, 1);
            drankjes.splice(targetIndex, 0, draggedItem);
            localStorage.setItem('drankjes', JSON.stringify(drankjes));
            loadDrankjesToRemove();
        }
    }

    loadLedenToRemove();
    loadDrankjesToRemove();
});
