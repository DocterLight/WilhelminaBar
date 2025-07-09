document.addEventListener('DOMContentLoaded', () => {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
              console.log('Service Worker geregistreerd met scope:', registration.scope);
            })
            .catch(error => {
              console.log('Service Worker registratie mislukt:', error);
            });
        });
      }
    
    const ledenUl = document.getElementById('ledenUl');
    const totaalSpan = document.getElementById('totaalSpan');
    const adminButton = document.getElementById('adminButton');
    const statisticsButton = document.getElementById('statisticsButton');
    const ledenLijstSection = document.getElementById('ledenLijst');
    const drankjesLijstSection = document.getElementById('drankjesLijst');
    const drankjesUl = document.getElementById('drankjesUl');
    const currentMemberNameSpan = document.getElementById('currentMemberName');
    const backToLedenButton = document.getElementById('backToLeden');
    const confirmOrderButton = document.getElementById('confirmOrder');
    const drankjesDetails = document.getElementById('drankjesDetails');
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmation1Modal = document.getElementById('confirmation1Modal')
    const confirmPaymentButton = document.getElementById('confirmPayment');
    const closeModalButton = document.getElementById('closeModal');
        
    function showNotification(message) {
    const popup = document.createElement("div");
    popup.textContent = message;
    popup.style.position = "fixed";
    popup.style.bottom = "20px";
    popup.style.right = "20px";
    popup.style.backgroundColor = "#4CAF50";
    popup.style.color = "white";
    popup.style.padding = "12px 20px";
    popup.style.borderRadius = "12px";
    popup.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
    popup.style.zIndex = 9999;
    popup.style.fontSize = "16px";
    popup.style.transition = "opacity 0.5s";
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.opacity = "0";
        setTimeout(() => popup.remove(), 500);
    }, 2000);
}
    
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
        displayTotalAmount(memberName);
    }

    function loadDrankjesDetails(memberName) {
        drankjesDetails.innerHTML = '';
        const leden = JSON.parse(localStorage.getItem('leden')) || [];
        const member = leden.find(m => m.name === memberName);

        if (!member || !member.drinks || member.drinks.length === 0) {
            drankjesDetails.innerHTML = '<li>U heeft momenteel niks open staan!</li>';
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

    function displayTotalAmount(memberName) {
        const leden = JSON.parse(localStorage.getItem('leden')) || [];
        const member = leden.find(m => m.name === memberName);

        let totalAmount = 0;
        if (member && member.drinks) {
            totalAmount = member.drinks.reduce((sum, drink) => sum + drink.amount, 0);
        }

        const totalAmountElement = document.getElementById('totalAmount');
        if (totalAmountElement) {
            totalAmountElement.textContent = `Totaal Bedrag: €${totalAmount.toFixed(2)}`;
        }
    }

    function updateHistoricalStats(memberName, drinkName, drinkAmount) {
        let historicalStats = JSON.parse(localStorage.getItem('historicalStats')) || {
            totalSpent: 0,
            memberStats: {},
            drinkStats: {}
        };

        // Update member stats
        if (!historicalStats.memberStats[memberName]) {
            historicalStats.memberStats[memberName] = {
                totalSpent: 0
            };
        }
        historicalStats.memberStats[memberName].totalSpent += drinkAmount;

        // Update total spent
        historicalStats.totalSpent += drinkAmount;

        // Update drink stats
        historicalStats.drinkStats[drinkName] = 
            (historicalStats.drinkStats[drinkName] || 0) + 1;

        localStorage.setItem('historicalStats', JSON.stringify(historicalStats));
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

        updateHistoricalStats(member.name, drinkName, drinkAmount);

        // ✅ Hier is de notificatie:
        showNotification(`+1 ${drinkName} toegevoegd aan rekening van ${member.name}`);

        sessionStorage.setItem('lastSelectedMember', currentMemberNameSpan.textContent);

        // Kleine delay voor effect
        setTimeout(() => {
            location.reload();
        }, 500);
    }
};


    confirmOrderButton.addEventListener('click', () => {
        confirmationModal.classList.add('show');
    });

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

    statisticsButton.addEventListener('click', () => {
        window.location.href = 'statistics.html';
    });

    loadLedenList();
});
