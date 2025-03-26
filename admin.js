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

    const CORRECT_PINCODE = '1234';
    let currentType, currentName;

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

            alert('Lid toegevoegd!');
            memberNameInput.value = '';
            loadLedenToRemove();
        } else {
            alert('Voer een geldige naam in.');
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

            alert('Drankje toegevoegd!');
            drinkNameInput.value = '';
            drinkAmountInput.value = '';
            loadDrankjesToRemove();
        } else {
            alert('Voer een geldige naam en bedrag in.');
        }
    });

    window.promptForPincode = function(type, name) {
        currentType = type;
        currentName = name;
        pincodePopup.style.display = 'block';
        popupPincodeInput.value = '';
        popupPincodeInput.focus();
    };

    confirmPopupButton.addEventListener('click', () => {
        if (popupPincodeInput.value.trim() === CORRECT_PINCODE) {
            if (currentType === 'lid') removeLid(currentName);
            else if (currentType === 'drankje') removeDrink(currentName);
            pincodePopup.style.display = 'none';
        } else {
            alert('Onjuiste pincode. Probeer het opnieuw.');
            popupPincodeInput.value = '';
        }
    });

    cancelPopupButton.addEventListener('click', () => {
        pincodePopup.style.display = 'none';
    });

    function removeLid(name) {
        let leden = JSON.parse(localStorage.getItem('leden')) || [];
        leden = leden.filter(member => member.name !== name);
        localStorage.setItem('leden', JSON.stringify(leden));
        loadLedenToRemove();
        alert('Lid verwijderd!');
    }

    function removeDrink(name) {
        let drankjes = JSON.parse(localStorage.getItem('drankjes')) || [];
        drankjes = drankjes.filter(drink => drink.name !== name);
        localStorage.setItem('drankjes', JSON.stringify(drankjes));
        loadDrankjesToRemove();
        alert('Item verwijderd!');
    }

    function loadLedenToRemove() {
        ledenToRemove.innerHTML = '';
        const leden = JSON.parse(localStorage.getItem('leden')) || [];
        leden.forEach(member => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${member.name} - €${parseFloat(member.amount).toFixed(2)}
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
            li.innerHTML = `
                ${drink.name} - €${parseFloat(drink.amount).toFixed(2)}
                <button onclick="promptForPincode('drankje', '${drink.name}')">Verwijder</button>
            `;
            li.draggable = true;
            li.dataset.index = index;

            li.addEventListener('dragstart', handleDragStart);
            li.addEventListener('dragover', handleDragOver);
            li.addEventListener('drop', handleDrop);
            li.addEventListener('dragend', handleDragEnd);

            drankjesToRemove.appendChild(li);
        });
    }

    function handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.index);
        e.target.classList.add('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        const listItems = [...drankjesToRemove.children];
        const afterElement = listItems.find(item => e.clientY < item.getBoundingClientRect().bottom);
        if (afterElement) {
            drankjesToRemove.insertBefore(draggingItem, afterElement);
        } else {
            drankjesToRemove.appendChild(draggingItem);
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        const oldIndex = e.dataTransfer.getData('text/plain');
        const newIndex = [...drankjesToRemove.children].indexOf(document.querySelector('.dragging'));

        let drankjes = JSON.parse(localStorage.getItem('drankjes')) || [];
        const [movedItem] = drankjes.splice(oldIndex, 1);
        drankjes.splice(newIndex, 0, movedItem);

        localStorage.setItem('drankjes', JSON.stringify(drankjes));
        loadDrankjesToRemove();
    }

    function handleDragEnd() {
        document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    }

    loadLedenToRemove();
    loadDrankjesToRemove();
});
