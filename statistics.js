document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.getElementById('backButton');
    const totalMembersSpan = document.getElementById('totalMembers');
    const totalSpentAmountSpan = document.getElementById('totalSpentAmount');
    const mostPopularDrinkSpan = document.getElementById('mostPopularDrink');
    const topMembersList = document.getElementById('topMemberslist');
    const drinkSalesList = document.getElementById('drinkSalesList');

    // Terug naar ledenlijst
    backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Verzamel statistieken
    function calculateStatistics() {
        const leden = JSON.parse(localStorage.getItem('leden')) || [];
        const drankjes = JSON.parse(localStorage.getItem('drankjes')) || [];

        // Totaal aantal leden
        totalMembersSpan.textContent = leden.length;

        // Totaal besteed bedrag
        const totalSpent = leden.reduce((total, member) => 
            total + (member.totalAmount || 0), 0);
        totalSpentAmountSpan.textContent = totalSpent.toFixed(2);

        // Top leden naar bestedingen
        const sortedMembers = [...leden]
            .sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0))
            .slice(0, 5);

        topMembersList.innerHTML = sortedMembers.map(member => 
            `<li>${member.name}: €${(member.totalAmount || 0).toFixed(2)}</li>`
        ).join('');

        // Drankje verkopen
        const drinkSales = {};
        leden.forEach(member => {
            if (member.drinks) {
                member.drinks.forEach(drink => {
                    drinkSales[drink.name] = (drinkSales[drink.name] || 0) + 1;
                });
            }
        });

        const sortedDrinks = Object.entries(drinkSales)
            .sort((a, b) => b[1] - a[1]);

        // Meest populaire drankje
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
