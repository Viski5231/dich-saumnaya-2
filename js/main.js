new Vue({
    el: '#app',
    data() {
        return {
            columns: [
                { title: 'Столбец 1', cards: [] },
                { title: 'Столбец 2', cards: [] },
                { title: 'Столбец 3', cards: [] }
            ],
            nextCardId: 1
        };
    },
    created() {
        this.loadCards();
    },
    methods: {
        loadCards() {
            const savedData = JSON.parse(localStorage.getItem('cards'));
            if (savedData) {
                this.columns = savedData.columns;
                this.nextCardId = savedData.nextCardId;
            }
        },
        saveCards() {
            localStorage.setItem('cards', JSON.stringify({ columns: this.columns, nextCardId: this.nextCardId }));
        },
        canAddCard(column) {
            if (column.title === 'Столбец 1' && column.cards.length >= 3) return false;
            if (column.title === 'Столбец 2' && column.cards.length >= 5) return false;
            return true;
        },
        addCard(columnIndex) {
            const newCard = {
                id: this.nextCardId++,
                title: `Карточка ${this.nextCardId}`,
                items: [
                    { text: 'Пункт 1', completed: false },
                    { text: 'Пункт 2', completed: false },
                    { text: 'Пункт 3', completed: false }
                ],
                completedDate: null
            };
            this.columns[columnIndex].cards.push(newCard);
            this.saveCards();
        },
        removeCard(cardId) {
            for (let column of this.columns) {
                const index = column.cards.findIndex(card => card.id === cardId);
                if (index !== -1) {
                    column.cards.splice(index, 1);
                    this.saveCards();
                    break;
                }
            }
        },
        updateCard(card) {
            const completedItems = card.items.filter(item => item.completed).length;
            const totalItems = card.items.length;

            if (totalItems > 0) {
                const completionRate = completedItems / totalItems;

                if (completionRate > 0.5 && this.columns[0].cards.includes(card)) {
                    this.moveCard(card, 1); // Move to column 2
                } else if (completionRate === 1 && this.columns[1].cards.includes(card)) {
                    this.moveCard(card, 2); // Move to column 3
                    card.completedDate = new Date().toLocaleString(); // Set completion date
                }
            }
            this.saveCards();
        },
        moveCard(card, targetColumnIndex) {
            for (let column of this.columns) {
                const index = column.cards.findIndex(c => c.id === card.id);
                if (index !== -1) {
                    column.cards.splice(index, 1); // Remove from current column
                    this.columns[targetColumnIndex].cards.push(card); // Add to target column
                    break;
                }
            }
        }
    }
});