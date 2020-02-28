const el = require('electron');
const {ipcRenderer} = el;
// const Vue = require('./vue')
const {getFromFile, getFromWeb, saveToFile} = require('./scripts/utils');

const initBtns = new Vue({
    el: '#init-btns',
    data: {
        initManual: () => {
            console.log('here');
            ipcRenderer.send('addTeamsModal');
        }
    }
});

const table = new Vue({
    el: '#table-score',
    data: {
        teams: []
    }
});

ipcRenderer.on('onDataFromModal', (e, data) => {
    data.forEach(team => {
        table.teams.push({
            name: team,
            tours: {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
            },
            sum: 0
        });
    });
    console.log(data);
});
