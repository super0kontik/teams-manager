const el = require('electron');
const {ipcRenderer} = el;
// const Vue = require('./vue')
const {getFromFile} = require('./scripts/utils');


(async function() {
    let teams = await getFromFile();
    let message;

    const table = new Vue({
        el: '#overview',
        data: {
            message: message,
            counter: 1,
            teams: teams,
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
            increment: () => ++table.counter
        }
    });
})();