const el = require('electron');
const {ipcRenderer} = el;

const addBtn = document.getElementById('add-btn');
const formContent = document.getElementById('form-content');

const form = document.querySelector('form');
form.addEventListener('submit', submit);

async function submit(e){
    e.preventDefault();
    const window = el.remote.getCurrentWindow();
    const teams = Array.from(document.getElementsByTagName('input')).map(inp => inp.value);
    await ipcRenderer.send('onModalClose', teams);
    window.close();
}

const addInput = () => {
    const input = document.createElement('label');
    input.innerHTML = `Название команды
        <input type="text" autofocus>`;
    formContent.appendChild(input);
};

addBtn.addEventListener('click', () => {
    addInput();
});