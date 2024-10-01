import like from "../svg/like-svgrepo-com.svg"
import chat from "../svg/chat-svgrepo-com.svg"
import link from "../svg/link-svgrepo-com.svg"
import checked from "../svg/selection-box-on-svgrepo-com.svg"

export default class NotTrello {
    constructor() {
        this.addAnotherCardBtn = document.querySelector('.list-footer-text')
        this.anotherCardBlock = document.querySelector('.add-new-card-block')
        this.clicked = '';
        this.currentBlock = '';
    }

    init() {
        this.addAnotherCard()
        this.dragTask()
        this.deleteTask()
        this.saveDataToLocalStorage = this.saveDataToLocalStorage.bind(this)
        window.addEventListener('unload', this.saveDataToLocalStorage)
        this.loadDataToLocalStorage = this.loadDataToLocalStorage.bind(this)
        document.addEventListener('DOMContentLoaded', this.loadDataToLocalStorage)
    }

    addAnotherCard() {
        document.querySelector('.tasks-list').addEventListener('click', (ev) => {
            if (ev.target.className == 'list-footer-text') {
                ev.target.insertAdjacentHTML('afterend', `
                    <div class="add-new-card-block">
                        <span class="new-card-error-text not-active">Пустое поле</span>
                        <input type="text" placeholder="Enter a title for this card..." class="new-card-text"></input>
                        <div class="new-card-options">
                            <button class="add-new-card-btn">Add card</button>
                            <div class="cancel-new-card-btn">X</div>
                        </div>
                    </div>
                `)
                ev.target.classList.add('not-active')
                ev.target.nextElementSibling.querySelector('.add-new-card-btn').addEventListener('click', (e) => {
                    if (e.target.closest('div.add-new-card-block').querySelector('input').value == '') {
                        e.target.closest('div.add-new-card-block').querySelector('.new-card-error-text').classList.remove('not-active')
                        return
                    } else if (!e.target.closest('div.add-new-card-block').querySelector('.new-card-error-text').classList.contains('not-active')) {
                        e.target.closest('div.add-new-card-block').querySelector('.new-card-error-text').classList.add('not-active')
                    }
                    if (ev.target.closest('div').previousElementSibling.querySelector('.empty-list')) {
                        ev.target.closest('div').previousElementSibling.querySelector('.empty-list').remove()
                    }
                    ev.target.closest('div').previousElementSibling.insertAdjacentHTML('beforeend', `
                        <div class="task">
                        <p class="task-text">${e.target.closest('div.add-new-card-block').querySelector('input').value}</p>
                        <div class="delete-btn">&times;</div>
                        <div class="task-tools">
                            <div class="task-tool">
                                <img src="${like}" class="task-tool-img">
                                <span class="task-tool-text">1</span>
                            </div>
                            <div class="task-tool">
                                <img src="${chat}" class="task-tool-img">
                                <span class="task-tool-text">1</span>
                            </div>
                            <div class="task-tool">
                                <img src="${link}" class="task-tool-img">
                                <span class="task-tool-text">1</span>
                            </div>
                            <div class="task-tool">
                                <img src="${checked}" class="task-tool-img">
                                <span class="task-tool-text">1</span>
                            </div>
                        </div>
                        `)
                        ev.target.classList.remove('not-active')
                        ev.target.nextElementSibling.remove()
                })
                ev.target.nextElementSibling.querySelector('.cancel-new-card-btn').addEventListener('click', () => {
                    ev.target.classList.remove('not-active')
                    ev.target.nextElementSibling.remove()
                })
            }
        })        
    };

    dragTask() {
        document.querySelector('.tasks-list').addEventListener(`mousedown`, (evt) => {
            if (evt.target.closest('.task')) {
                if (evt.target.classList.contains('delete-btn')) {
                    return
                }
                const current = evt.target.closest('.task')
                let cloneCurr = current.cloneNode(true)
                cloneCurr.ondragstart = function() {
                    return false;
                };

                let shiftX = evt.clientX - current.getBoundingClientRect().left;
                let shiftY = evt.clientY - current.getBoundingClientRect().top;

                cloneCurr.style.position = "absolute";
                cloneCurr.style.zIndex = 1000;
                document.body.append(cloneCurr)
                moveAt(evt.pageX, evt.pageY);

                function moveAt(pageX, pageY) {
                cloneCurr.style.left = pageX - shiftX + 'px';
                cloneCurr.style.top = pageY - shiftY + 'px';
                }

                function onMouseMove(event) {
                    event.preventDefault()
                    document.body.style.cursor = 'grabbing'
                    moveAt(event.pageX, event.pageY);
                    if ([...document.querySelectorAll('.list-body')].find(elem => elem.querySelectorAll('.task').length == 0)) {
                        document.querySelectorAll('.list-body').forEach(elem => {
                            if (elem.querySelectorAll('.task').length == 0 && !elem.querySelector('.empty-list')) {
                                elem.insertAdjacentHTML('afterbegin', `
                                    <div class="empty-list">
                                        <span>No task...</span>
                                    </div>
                                    `)
                            }
                        })
                    }
                    cloneCurr.hidden = true
                    const allList = document.elementFromPoint(event.clientX, event.clientY).closest('div.list-body')
                    if (allList != null) {
                        let currentt = document.elementFromPoint(event.clientX, event.clientY).closest('div');
                        if (currentt.classList.contains(`task`) || currentt.classList.contains(`empty-list`)) {
                            current.style.opacity = 0.1;
                            current.style.backgroundColor = '#000000';
                            const isMoveable = cloneCurr !== currentt && (currentt.classList.contains(`task`) || currentt.classList.contains(`empty-list`));
                            if (!isMoveable) {
                                return;
                            }
                            if (allList.querySelector('.empty-list')) {
                                allList.querySelector('.empty-list').remove()
                                allList.append(current)
                                return
                            } else {
                                allList.insertBefore(current, currentt);
                            }
                        }

                    }
                    cloneCurr.hidden = false
                }

                document.addEventListener('mousemove', onMouseMove);

                cloneCurr.onmouseup = function() {
                    current.style.opacity = '';
                        current.style.backgroundColor = '';
                    document.removeEventListener('mousemove', onMouseMove);
                    cloneCurr.onmouseup = null;
                    cloneCurr.remove()
                    document.body.style.cursor = ''
                };
            }

        })
};

    deleteTask() {
        const deleteFunc = (ev) => {
            const listBody = ev.target.parentNode.closest('div.list-body')
            ev.target.closest('div.task').remove()
            if (!listBody.querySelectorAll('.task').length) {
                listBody.insertAdjacentHTML('afterbegin', `
                    <div class="empty-list">
                        <span>No task...</span>
                    </div>
                    `)
            }
        }
        document.querySelector('.tasks-list').addEventListener(`mouseover`, (e) => {
            const task = e.target.closest('div.task')
            if (task) {
                if (!task.querySelector('.delete-btn').classList.contains('active')) {
                    task.querySelector('.delete-btn').classList.add('active')
                    task.querySelector('.delete-btn').addEventListener('click', deleteFunc)
                }
            }
        })
        document.querySelector('.tasks-list').addEventListener(`mouseout`, (e) => {
            const task = e.target.closest('div.task')
            if (task) {
                if (task.querySelector('.delete-btn').classList.contains('active')) {
                    task.querySelector('.delete-btn').classList.remove('active')
                    task.querySelector('.delete-btn').removeEventListener('click', deleteFunc)
                }
            }
        })
    };

    saveDataToLocalStorage() {
        const allTasks = document.querySelectorAll('.task-list')
        const result = {}
        for (const value of allTasks) {
            result[value.querySelector('h2').textContent] = []
            value.querySelectorAll('.task').forEach(elem => result[value.querySelector('h2').textContent].push(elem.querySelector('p').textContent))
        }
        localStorage.setItem('Info', JSON.stringify(result))
    }

    loadDataToLocalStorage() {
        if (localStorage.getItem('Info') == null) {
            document.querySelectorAll('.list-body').forEach(elem => {
                elem.insertAdjacentHTML('beforeend', `
                    <div class="empty-list">
                        <span>No task...</span>
                    </div>
                    `)
            })
        }
        const allTasks = document.querySelectorAll('.task-list')
        const data = JSON.parse(localStorage.getItem('Info'))
        localStorage.removeItem('Info')
        for (const key in data) {
            const task = [...allTasks].find(elem => elem.querySelector('h2').textContent == key)
            if (!data[key].length) {
                task.querySelector('.list-body').insertAdjacentHTML('beforeend', `
                        <div class="empty-list">
                            <span>No task...</span>
                        </div>
                        `)
                continue
            }
            data[key].forEach(elem => {
                task.querySelector('.list-body').insertAdjacentHTML('beforeend', `
                    <div class="task">
                            <p class="task-text">${elem}</p>
                            <div class="delete-btn">&times;</div>
                                <div class="task-tools">
                                    <div class="task-tool">
                                    <img src="${like}" class="task-tool-img">
                                    <span class="task-tool-text">1</span>
                                </div>
                                <div class="task-tool">
                                    <img src="${chat}" class="task-tool-img">
                                    <span class="task-tool-text">1</span>
                                </div>
                                <div class="task-tool">
                                    <img src="${link}" class="task-tool-img">
                                    <span class="task-tool-text">1</span>
                                </div>
                                <div class="task-tool">
                                    <img src="${checked}" class="task-tool-img">
                                    <span class="task-tool-text">1</span>
                                </div>
                            </div>
                    `)
            })
        }
    }
}
