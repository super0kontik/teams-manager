const el = require('electron');
const {ipcRenderer} = el;
// const Vue = require('./vue')
const {getFromFile, getFromWeb, saveToFile} = require('./scripts/utils');

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
        teams = teams.map(team => {
            return {
                ...team,
                tours: {
                    1: {value: team.tours['1'], isEdit: false},
                    2: {value: team.tours['2'], isEdit: false},
                    3: {value: team.tours['3'], isEdit: false},
                    4: {value: team.tours['4'], isEdit: false},
                    5: {value: team.tours['5'], isEdit: false},
                    6: {value: team.tours['6'], isEdit: false},
                    7: {value: team.tours['7'], isEdit: false},
                    8: {value: team.tours['8'], isEdit: false}
                }
            };
        });
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
            teamsRequest: async () => {
                const response = await getFromWeb();
                if (response) {
                    table.teams = response.map(team => {
                        return {
                            ...team,
                            tours: {
                                1: {value: team.tours['1'], isEdit: false},
                                2: {value: team.tours['2'], isEdit: false},
                                3: {value: team.tours['3'], isEdit: false},
                                4: {value: team.tours['4'], isEdit: false},
                                5: {value: team.tours['5'], isEdit: false},
                                6: {value: team.tours['6'], isEdit: false},
                                7: {value: team.tours['7'], isEdit: false},
                                8: {value: team.tours['8'], isEdit: false}
                            }
                        };
                    });
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

                const convertedTeams = table.teams.map(team => {
                    return {
                        ...team,
                        tours: {
                            1: team.tours['1'].value,
                            2: team.tours['2'].value,
                            3: team.tours['3'].value,
                            4: team.tours['4'].value,
                            5: team.tours['5'].value,
                            6: team.tours['6'].value,
                            7: team.tours['7'].value,
                            8: team.tours['8'].value
                        }
                    };
                });
                await saveToFile(convertedTeams);
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
})();






