document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.getElementById('backButton');
    const addMemberForm = document.getElementById('addMemberForm');
    const memberNameInput = document.getElementById('memberName');
    const addDrinkForm = document.getElementById('addDrinkForm');
    const drinkNameInput = document.getElementById('drinkName');
    const drinkAmountInput = document.getElementById('drinkAmount');
    const ledenToRemove = document.getElementById('ledenToRemove');
    const drankjesToRemove = document.getElementById('drankjesToRemove');
    const pincodeContainer = document.getElementById('pincodeContainer');
    const pincodeInput = document.getElementById('pincodeInput');
    const confirmRemovalButton = document.getElementById('confirmRemovalButton');

    const CORRECT_PINCODE = '1234'; // Stel hier je gewenste pincode in

    // Ga terug naar de ledenlijst pagina
    backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Voeg een nieuw lid toe
    addMemberForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Voorkom het standaardformulier gedrag

        const memberName = memberNameInput.value.trim();

        if (memberName) {
            const leden = JSON.parse(localStorage.getItem('leden')) || [];
            leden.push({ name: memberName, amount: 0 }); // Voeg het lid toe met standaard bedrag 0
            localStorage.setItem('leden', JSON.stringify(leden));

            alert('Lid toegevoegd!');
            memberNameInput.value = '';
            memberNameInput.focus();
            loadLedenToRemove(); // Herlaad de lijst van leden om de nieuwe te tonen
        } else {
            alert('Voer een geldige naam in.');
        }
    });

    // Voeg een nieuw drankje toe
    addDrinkForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Voorkom het standaardformulier gedrag

        const drinkName = drinkNameInput.value.trim();
        const drinkAmount = parseFloat(drinkAmountInput.value.trim());

        if (drinkName && !isNaN(drinkAmount) && drinkAmount >= 0) {
            const drankjes = JSON.parse(localStorage.getItem('drankjes')) || [];
            drankjes.push({ name: drinkName, amount: drinkAmount });
            localStorage.setItem('drankjes', JSON.stringify(drankjes));

            alert('Drankje toegevoegd!');
            drinkNameInput.value = '';
            drinkAmountInput.value = '';
            drinkNameInput.focus();
            loadDrankjesToRemove(); // Herlaad de lijst van drankjes om de nieuwe te tonen
        } else {
            alert('Voer een geldige naam en bedrag in.');
        }
    });

    // Toon het pincode invoerveld en bevestigingsknop
    window.promptForPincode = function(type, name) {
        pincodeContainer.style.display = 'block'; // Toon het pincode invoerveld

        confirmRemovalButton.onclick = () => {
            const enteredPincode = pincodeInput.value.trim();
            if (enteredPincode === CORRECT_PINCODE) {
                if (type === 'lid') {
                    removeLid(name); // Verwijder het lid als de pincode correct is
                } else if (type === 'drankje') {
                    removeDrink(name); // Verwijder het drankje als de pincode correct is
                }
                pincodeContainer.style.display = 'none'; // Verberg het pincode invoerveld
                pincodeInput.value = ''; // Maak het invoerveld leeg
            } else {
                alert('Onjuiste pincode. Probeer het opnieuw.');
            }
        };
    };

    // Verwijder een lid
    function removeLid(name) {
        let leden = JSON.parse(localStorage.getItem('leden')) || [];
        leden = leden.filter(member => member.name !== name);
        localStorage.setItem('leden', JSON.stringify(leden));
        loadLedenToRemove(); // Herlaad de lijst van leden na verwijdering
        alert('Lid verwijderd!');
    }

    // Verwijder een drankje
    function removeDrink(name) {
        let drankjes = JSON.parse(localStorage.getItem('drankjes')) || [];
        drankjes = drankjes.filter(drink => drink.name !== name);
        localStorage.setItem('drankjes', JSON.stringify(drankjes));
        loadDrankjesToRemove(); // Herlaad de lijst van drankjes na verwijdering
        alert('Item verwijderd!');
    }

    // Laad ledenlijst voor verwijdering
    function loadLedenToRemove() {
        ledenToRemove.innerHTML = ''; // Maak de lijst leeg
        const leden = JSON.parse(localStorage.getItem('leden')) || [];
        leden.forEach(member => {
            if (member.name && member.amount !== undefined && member.amount !== null) {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${member.name} - €${parseFloat(member.amount).toFixed(2)}
                    <button onclick="promptForPincode('lid', '${member.name}')">Verwijder</button>
                `;
                ledenToRemove.appendChild(li);
            }
        });
    }

    // Laad drankjeslijst voor verwijdering
    function loadDrankjesToRemove() {
        drankjesToRemove.innerHTML = ''; // Maak de lijst leeg
        const drankjes = JSON.parse(localStorage.getItem('drankjes')) || [];
        drankjes.forEach(drink => {
            if (drink.name && drink.amount !== undefined && drink.amount !== null) {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${drink.name} - €${parseFloat(drink.amount).toFixed(2)}
                    <button onclick="promptForPincode('drankje', '${drink.name}')">Verwijder</button>
                `;
                drankjesToRemove.appendChild(li);
            }
        });
    }

    // Initialiseer de lijsten voor verwijdering
    loadLedenToRemove();
    loadDrankjesToRemove();
});