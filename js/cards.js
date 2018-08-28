class Cards {

    constructor(slotsBlock, cardsBlock) {
        this.slotsBlock = slotsBlock;
        this.cardsBlock = cardsBlock;
        this.cards = [];
    }

    createSlots() {
        for (let i = 0; i < 6; ++i) {
            let slot = document.createElement('div');
            slot.className = 'slots__item droppable';
            slot.innerHTML = '<span class=\'slots__number\'>+</span>';

            this.slotsBlock.appendChild(slot);
        }
    }

    createCards() {
        for (let i = 0; i < 24; ++i) {
            let card = document.createElement('div');
            card.className = 'cards__item draggable';
            card.innerHTML = '<span class=\'cards__number\'>' + Cards.getRandomInt(10, 99) + '</span>';

            this.cardsBlock.appendChild(card);
            new DragManager(card);
        }
    }

    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}