const el = require('electron');
const {ipcRenderer} = el;
// const Vue = require('./vue')
const {getFromFile, getFromWeb, saveToFile} = require('./scripts/utils');

const initBtns = new Vue({
    el: '#init-btns',
    data: {
        initManual: () => ipcRenderer.send('addTeamsModal')
    }
});

const table = new Vue({
    el: '#table-score',
    data: {
        teams: [],
        tourNumbers: {
            1: {value: 1, isEdit: false},
            2: {value: 2, isEdit: false},
            3: {value: 3, isEdit: false},
            4: {value: 4, isEdit: false},
            5: {value: 5, isEdit: false},
            6: {value: 6, isEdit: false},
            7: {value: 7, isEdit: false},
            8: {value: 8, isEdit: false},
        },
        editTour: (index) => {
            table.tourNumbers[index].isEdit = true;
            table.teams = table.teams.map(team => {
                team.tours[index] = {value: team.tours[index].value, isEdit: true};
                return team;
            });
        },
        submitTour: (index) => {
            table.tourNumbers[index].isEdit = false;
            table.teams = table.teams.map(team => {
                team.tours[index] = {value: team.tours[index].value, isEdit: false};
                return team;
            });
        }
    }
});


ipcRenderer.on('onDataFromModal', (e, data) => {
    data.forEach(team => {
        table.teams.push({
            name: team,
            tours: {
                1: {value: 0, isEdit: false},
                2: {value: 0, isEdit: false},
                3: {value: 0, isEdit: false},
                4: {value: 0, isEdit: false},
                5: {value: 0, isEdit: false},
                6: {value: 0, isEdit: false},
                7: {value: 0, isEdit: false},
                8: {value: 0, isEdit: false},
            },
            sum: 0
        });
    });
});


