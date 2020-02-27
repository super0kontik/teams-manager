const el = require('electron');
const {ipcRenderer} = el;
// const Vue = require('./vue')
const {getFromFile, getFromWeb, saveToFile} = require('./scripts/utils');

new Vue({
    el: '#app',
    data: {
        teams: []
    }
});