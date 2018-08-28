window.onload = function () {

    let slotsBlock = document.getElementsByClassName('slots')[0];
    let cardsBlock = document.getElementsByClassName('cards')[0];
    let notification = document.getElementById('multiple_of_three');
    let cardsInSlots = [];
    let cards = new Cards(slotsBlock, cardsBlock);
    cards.createSlots();
    cards.createCards();

    DragManager.onDragEnd = function (dragObject, dropElem) { 

        if (dragObject.currentHoveredElement != null) {
            dragObject.currentHoveredElement.classList.remove('hovered');

            let coords = getCoordinates(dragObject.currentHoveredElement);
            dragObject.avatar.style.left = coords.left - 10 + 'px';
            dragObject.avatar.style.top = coords.top - 10 + 'px';

            cardsInSlots.push(dragObject.elem);
            if (cardsInSlots.length === 6) {
                showNotification();
            } else {
                hideNotification()
            }
        }
    };

    DragManager.onDragCancel = function (dragObject) { 
        dragObject.avatar.rollback() 
        dragObject.avatar = null;
        
        let index = cardsInSlots.indexOf(dragObject.elem);
        if (index > -1) {
            cardsInSlots.splice(index, 1);
            hideNotification()
        }
    };

    function showNotification() {
        let Sum = 0;
        
        for (let i = 0; i < cardsInSlots.length; ++i) {
            Sum += parseInt(cardsInSlots[i].innerText);
        }
        
        if (Sum % 3 === 0) {
            notification.style.opacity = 1;
        }
    }

    function hideNotification() {
        notification.style.opacity = 0;
    }

    function getCoordinates(elem) {

        let box = elem.getBoundingClientRect();

        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };
    }
}