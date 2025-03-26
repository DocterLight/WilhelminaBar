document.addEventListener('DOMContentLoaded', () => {
    const ledenUl = document.getElementById('ledenUl');
    const totaalSpan = document.getElementById('totaalSpan');
    const adminButton = document.getElementById('adminButton');
    const ledenLijstSection = document.getElementById('ledenLijst');
    const drankjesLijstSection = document.getElementById('drankjesLijst');
    const drankjesUl = document.getElementById('drankjesUl');
    const currentMemberNameSpan = document.getElementById('currentMemberName');
    const backToLedenButton = document.getElementById('backToLeden');
    const confirmOrderButton = document.getElementById('confirmOrder');
    const drankjesDetails = document.getElementById('drankjesDetails');

    // ✅ Modal-elementen
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmPaymentButton = document.getElementById('confirmPayment');
    const closeModalButton = document.getElementById('closeModal');

    function loadLedenList() {
        const leden = JSON.parse(localStorage.getItem('leden')) || [];
        leden.sort((a, b) => a.name.localeCompare(b.name));

        let totaal = 0;
        const fragment = document.createDocumentFragment();

        leden.forEach(member => {
            if (member.name) {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span style="font-weight: bold;">${member.name}</span>
                    <span>€${parseFloat(member.totalAmount || 0).toFixed(2)}</span>
                `;
                li.addEventListener('click', () => showDrankjesLijst(member.name));
                fragment.appendChild(li);
                totaal += parseFloat(member.totalAmount || 0);
            }
        });

        ledenUl.innerHTML = '';
        ledenUl.appendChild(fragment);
        totaalSpan.textContent = totaal.toFixed(2);
    }

    function loadDrankjesList() {
        const drankjes = JSON.parse(localStorage.getItem('drankjes')) || [];
        const fragment = document.createDocumentFragment();

        drankjes.forEach(drink => {
            if (drink.name) {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${drink.name} - €${parseFloat(drink.amount).toFixed(2)}
                    <button>Voeg Toe</button>
                `;

                const button = li.querySelector('button');
                button.addEventListener('click', () => addDrinkToBill(drink.name, drink.amount));

                fragment.appendChild(li);
            }
        });

        drankjesUl.innerHTML = '';
        drankjesUl.appendChild(fragment);
    }

    function showDrankjesLijst(memberName) {
        currentMemberNameSpan.textContent = memberName;
        ledenLijstSection.style.display = 'none';
        drankjesLijstSection.style.display = 'block';
        loadDrankjesList();
        loadDrankjesDetails(memberName);
    }

    function loadDrankjesDetails(memberName) {
        drankjesDetails.innerHTML = '';
        const leden = JSON.parse(localStorage.getItem('leden')) || [];
        const member = leden.find(m => m.name === memberName);

        if (!member || !member.drinks || member.drinks.length === 0) {
            drankjesDetails.innerHTML = '<li>Geen drankjes besteld</li>';
            return;
        }

        const drinkDetails = {};

        member.drinks.forEach(drink => {
            if (!drinkDetails[drink.name]) {
                drinkDetails[drink.name] = { count: 0, totalAmount: 0 };
            }
            drinkDetails[drink.name].count += 1;
            drinkDetails[drink.name].totalAmount += drink.amount;
        });

        const fragment = document.createDocumentFragment();

        Object.entries(drinkDetails).forEach(([drinkName, drink]) => {
            const li = document.createElement('li');
            li.innerHTML = `${drinkName}: ${drink.count} x €${drink.totalAmount.toFixed(2)}`;
            fragment.appendChild(li);
        });

        drankjesDetails.appendChild(fragment);
    }

    window.addDrinkToBill = function(drinkName, drinkAmount) {
        let leden = JSON.parse(localStorage.getItem('leden')) || [];
        let memberIndex = leden.findIndex(m => m.name === currentMemberNameSpan.textContent);

        if (memberIndex !== -1) {
            let member = leden[memberIndex];

            member.totalAmount = (member.totalAmount || 0) + drinkAmount;
            if (!member.drinks) {
                member.drinks = [];
            }
            member.drinks.push({ name: drinkName, amount: drinkAmount });

            leden[memberIndex] = member;
            localStorage.setItem('leden', JSON.stringify(leden));

            sessionStorage.setItem('lastSelectedMember', currentMemberNameSpan.textContent);
            location.reload();
        }
    };

// ✅ Toon de bevestigingsmodal met fade-in effect
confirmOrderButton.addEventListener('click', () => {
    confirmationModal.classList.add('show');
});

// ✅ Verwerk de betaling na bevestiging en sluit met fade-out effect
confirmPaymentButton.addEventListener('click', () => {
    const leden = JSON.parse(localStorage.getItem('leden')) || [];
    const member = leden.find(m => m.name === currentMemberNameSpan.textContent);

    if (member) {
        member.totalAmount = 0;
        member.drinks = [];
        localStorage.setItem('leden', JSON.stringify(leden));
    }

    confirmationModal.classList.add('hide');
    setTimeout(() => {
        confirmationModal.classList.remove('show', 'hide');
        location.reload();
    }, 300);
});

// ✅ Sluit de modal zonder te betalen met fade-out effect
closeModalButton.addEventListener('click', () => {
    confirmationModal.classList.add('hide');
    setTimeout(() => {
        confirmationModal.classList.remove('show', 'hide');
    }, 300);
});


    function showLedenLijst() {
        ledenLijstSection.style.display = 'block';
        drankjesLijstSection.style.display = 'none';
    }

    const lastSelectedMember = sessionStorage.getItem('lastSelectedMember');
    if (lastSelectedMember) {
        showDrankjesLijst(lastSelectedMember);
        sessionStorage.removeItem('lastSelectedMember');
    }

    backToLedenButton.addEventListener('click', showLedenLijst);
    adminButton.addEventListener('click', () => {
        window.location.href = 'admin.html';
    });

    loadLedenList();
});
