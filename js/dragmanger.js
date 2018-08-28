class DragManager {
    
    constructor(dragObject) {
        let self = this;
        this.dragObject = {};
        this.dragObject.elem = dragObject;
        this.dragObject.elem.onmousedown = function(e) {self.onMouseDown(e)};
    }

    onMouseDown(e) {
        let self = this;

        if (e.which != 1) return;

        this.dragObject.downX = e.pageX;
        this.dragObject.downY = e.pageY;
        
        document.onmouseup = function(e) {self.onMouseUp(e)};
        document.onmousemove = function(e) {self.onMouseMove(e)};

        if (this.dragObject.avatar) {
            this.dragObject.avatar.style.zIndex = 9999;
        }

        return false;
    }

    onMouseMove(e) {

        if (!this.dragObject.elem) return;

        if (!this.dragObject.avatar) {

            let moveX = e.pageX - this.dragObject.downX;
            let moveY = e.pageY - this.dragObject.downY;

            if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {
                return;
            }

            this.dragObject.avatar = this.createAvatar(e);
            if (!this.dragObject.avatar) {
                this.dragObject = {};
                return;
            }

            let coords = DragManager.getCoordinates(this.dragObject.avatar);
            this.dragObject.shiftX = this.dragObject.downX - coords.left;
            this.dragObject.shiftY = this.dragObject.downY - coords.top;

            this.startDrag();
        }

        this.dragObject.avatar.style.left = e.pageX - this.dragObject.shiftX + 'px';
        this.dragObject.avatar.style.top = e.pageY - this.dragObject.shiftY + 'px';

        let dropElem = this.findDroppable(e);

        if (dropElem != this.dragObject.currentHoveredElement) {

            if (this.dragObject.currentHoveredElement != null) {
                this.dragObject.currentHoveredElement.classList.remove('hovered');
            }
            this.dragObject.currentHoveredElement = dropElem;
            
            if (dropElem != null) {
                if (dropElem.classList.contains('droppable')) {
                    this.dragObject.currentHoveredElement = dropElem;
                    dropElem.classList.add('hovered');
                }
            }
            
        }

        return false;
    }

    onMouseUp(e) {

        document.onmousemove = null;
        document.onmouseup = null;

        if (this.dragObject.avatar) {
            this.finishDrag(e);
        }
    }

    finishDrag(e) {
        var dropElem = this.findDroppable(e);
        if (!dropElem) {
            DragManager.onDragCancel(this.dragObject);
        } else {
            DragManager.onDragEnd(this.dragObject, dropElem);
        }
    }

    createAvatar(e) {

        let avatar = this.dragObject.elem;
        let old = {
            parent: avatar.parentNode,
            position: avatar.position || '',
            left: avatar.left || '',
            top: avatar.top || '',
            zIndex: avatar.zIndex || ''
        };

        avatar.rollback = function () {
            old.parent.appendChild(avatar);
            avatar.style.position = old.position;
            avatar.style.left = old.left;
            avatar.style.top = old.top;
            avatar.style.zIndex = old.zIndex
        };

        return avatar;
    }

    startDrag() {
        var avatar = this.dragObject.avatar;

        document.body.appendChild(avatar);
        avatar.style.zIndex = 9999;
        avatar.style.position = 'absolute';
    }

    findDroppable(event) {

        this.dragObject.avatar.hidden = true;

        var elem = document.elementFromPoint(event.clientX, event.clientY);

        this.dragObject.avatar.hidden = false;

        if (elem == null) {
            return null;
        }

        return elem.closest('.droppable');
    }

    static onDragEnd(dragObject, dropElem) { };

    static onDragCancel(dragObject) {};

    static getCoordinates(elem) {

        let box = elem.getBoundingClientRect();

        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };
    }
}
