const el = require('electron');
const {ipcRenderer} = el;
// const Vue = require('./vue')
const {getFromFile, getFromWeb, saveToFile, sort} = require('./scripts/utils');

// getFromFile().then((teamsFromJSON) => {
//     if (teamsFromJSON.length) {
//         teams = teamsFromJSON;
//     } else {
//         ipcRenderer.send('addTeamsModal')
//     }
// });
(async function() {
    let teams = await getFromFile();
    let message;
    if (teams.length) {
        message = 'Команды успешно загружены с файла!';
    } else {
        message = 'Файл с данными команд пуст либо его не существует! Введите информацию о командах вручную, либо загрузите с сервера!';
    }

    const table = new Vue({
        el: '#main',
        data: {
            message: message,
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
            initManual: () => ipcRenderer.send('addTeamsModal'),
            openOverview: () => ipcRenderer.send('overviewModal'),
            teamsRequest: async () => {
                const response = await getFromWeb();
                if (response) {
                    table.teams = response;
                } else {
                    table.message = 'При загрузке с сервера произошла ошибка, проверьте подключение к интернету! Заполните информацию о командах вручную!';
                }
            },
            editTour: (index) => {
                table.tourNumbers[index].isEdit = true;
                table.teams = table.teams.map(team => {
                    team.tours[index] = {value: team.tours[index].value, isEdit: true};
                    return team;
                });
            },
            submitTour: async (index) => {
                table.tourNumbers[index].isEdit = false;
                table.teams = table.teams.map(team => {
                    team.tours[index] = {value: team.tours[index].value, isEdit: false};
                    return team;
                });
                const newTeams = JSON.parse(JSON.stringify(table.teams));
                table.teams = sort(newTeams);
                await saveToFile(table.teams);
            },
            deleteTable: () => {
                if(confirm('Вы действительно хотите очистить список?\n Это необратимое действие!')){
                    table.teams = [];
                    table.message = 'Файл с данными команд пуст либо его не существует! Введите информацию о командах вручную, либо загрузите с сервера!';
                }
            }
        }
    });

    ipcRenderer.on('onDataFromModal', async (e, data) => {
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
        await saveToFile(table.teams);
    });
})();






