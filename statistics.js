document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.getElementById('backButton');
    const resetAllButton = document.getElementById('resetAllButton');
    const totalMembersSpan = document.getElementById('totalMembers');
    const totalSpentAmountSpan = document.getElementById('totalSpentAmount');
    const mostPopularDrinkSpan = document.getElementById('mostPopularDrink');
    const topMembersList = document.getElementById('topMemberslist');
    const drinkSalesList = document.getElementById('drinkSalesList');

    // Terug naar ledenlijst
    backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Reset alleen statistieken
    resetAllButton.addEventListener('click', () => {
        // Toon bevestigingsvenster
        const isConfirmed = confirm('Weet je zeker dat je alle statistieken wilt resetten? Dit kan NIET ongedaan worden gemaakt!');
        
        if (isConfirmed) {
            // Reset alleen de historische statistieken
            localStorage.setItem('historicalStats', JSON.stringify({
                totalSpent: 0,
                memberStats: {},
                drinkStats: {}
            }));

            // Reset de weergegeven statistieken
            totalMembersSpan.textContent = '0';
            totalSpentAmountSpan.textContent = '0.00';
            mostPopularDrinkSpan.textContent = 'Nog geen gegevens';
            topMembersList.innerHTML = '';
            drinkSalesList.innerHTML = '';

            // Herbereken statistieken na reset
            calculateStatistics();

            // Optionele melding
            alert('Alle statistieken zijn gereset.');
        }
    });

    // Verzamel statistieken
    function calculateStatistics() {
        const leden = JSON.parse(localStorage.getItem('leden')) || [];
        
        // Haal historische statistieken op of initialiseer
        let historicalStats = JSON.parse(localStorage.getItem('historicalStats')) || {
            totalSpent: 0,
            memberStats: {},
            drinkStats: {}
        };

        // Totaal aantal leden
        totalMembersSpan.textContent = leden.length;

        // Totaal besteed bedrag (historisch)
        totalSpentAmountSpan.textContent = historicalStats.totalSpent.toFixed(2);

        // Top spenders (historisch)
        const sortedMembers = Object.entries(historicalStats.memberStats)
            .sort((a, b) => b[1].totalSpent - a[1].totalSpent)
            .slice(0, 5);

        topMembersList.innerHTML = sortedMembers.map(([name, stats]) => 
    `<li>${name}: €${stats.totalSpent.toFixed(2)}</li>`
).join('');


        // Meest populaire drankje
        const sortedDrinks = Object.entries(historicalStats.drinkStats || {})
            .sort((a, b) => b[1] - a[1]);

        if (sortedDrinks.length > 0) {
            mostPopularDrinkSpan.textContent = sortedDrinks[0][0];
        }

        // Volledige lijst van drankjes verkopen
        drinkSalesList.innerHTML = sortedDrinks.map(([drink, count]) => 
            `<li>${drink}: ${count} verkocht</li>`
        ).join('');
    }

    calculateStatistics();
});
