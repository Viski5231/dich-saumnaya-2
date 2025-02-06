//Vue.js:
// JavaScript-фреймворк для создания пользовательских интерфейсов. Он позволяет разработчикам создавать реактивные приложения, которые автоматически обновляют интерфейс при изменении данных.
// Компоненты:
// Переиспользуемые части интерфейса, которые могут содержать как логику, так и шаблоны. В нашем коде мы используем компоненты для создания карточек и столбцов.
// Реактивность:
// Способ, которым Vue отслеживает изменения в данных и автоматически обновляет интерфейс. Например, когда пользователь отмечает пункт списка, Vue автоматически обновляет состояние карточки.
// Local Storage:
// Веб-API, который позволяет сохранять данные в браузере. В нашем приложении мы используем Local Storage для сохранения состояния карточек, чтобы данные не терялись при перезагрузке страницы.
// Данные (data):
// Объект, содержащий состояние компонента. В нашем приложении данные включают информацию о столбцах, карточках, их заголовках, пунктах списка и метках.
// Методы (methods):
// Функции, которые могут быть вызваны в компоненте. В нашем коде методы используются для добавления, удаления и обновления карточек, а также для сохранения данных в Local Storage.
// Свойства (props):
// Способ передачи данных от родительского компонента к дочернему. В нашем коде мы не использовали props, но это важная концепция в Vue.
// События (events):
// Механизм, позволяющий компонентам взаимодействовать друг с другом. В нашем коде мы используем события для обновления состояния карточек при изменении пунктов списка.
// Циклы (v-for):
// Директива Vue, позволяющая перебрать массив и создать элементы на основе его значений. Мы используем v-for для отображения карточек и пунктов списка.
// Условные операторы (v-if, v-show):
// Директивы, которые позволяют условно отображать элементы в зависимости от состояния данных. Например, мы используем v-if для отображения сообщения о завершении карточки.
//уи


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
                color: '#f9f9 f9', // Цвет по умолчанию
                items: [
                    { text: 'Пункт 1', completed: false },
                    { text: 'Пункт 2', completed: false },
                    { text: 'Пункт 3', completed: false }
                ],
                completedDate: null,
                tags: [], // Массив для хранения меток
                tag: '' // Временное поле для ввода метки
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
                    this.moveCard(card, 1); // Перемещение во второй столбец
                } else if (completionRate === 1 && this.columns[1].cards.includes(card)) {
                    this.moveCard(card, 2); // Перемещение в третий столбец
                    card.completedDate = new Date().toLocaleString(); // Установка даты завершения
                }
            }
            this.saveCards();
        },
        moveCard(card, targetColumnIndex) {
            for (let column of this.columns) {
                const index = column.cards.findIndex(c => c.id === card.id);
                if (index !== -1) {
                    column.cards.splice(index, 1); // Удаление из текущего столбца
                    this.columns[targetColumnIndex].cards.push(card); // Добавление в целевой столбец
                    break;
                }
            }
        },
        addTag(card) {
            if (card.tag.trim() !== '') {
                card.tags.push(card.tag.trim());
                card.tag = ''; // Очистка поля ввода метки
                this.saveCards();
            }
        }
    }
});
