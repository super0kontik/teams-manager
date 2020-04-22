const el = require('electron');
const {ipcRenderer} = el;

module.exports = {
    getFromFile: () => new Promise(resolve => {
        ipcRenderer.send('retrieve');
        ipcRenderer.on('data', (e, obj) => {
            resolve(obj)
        })
    }),

    saveToFile: obj => new Promise(resolve => {
        ipcRenderer.send('store', obj);
        ipcRenderer.on('save', (e, res) => resolve(res))
    }),

    getFromWeb: async () => {
        const proccessResponse = games => {
            const timest = new Date().valueOf() - (1000 * 60 * 60 * 16);
            const game = games.find(item => new Date(item.date).valueOf() > timest);
            return {
                teams: game.teams.filter(i => i.type === 'main').map(i => {
                    return {
                        name: i.title,
                        tours: {
                            1: {value: 0},
                            2: {value: 0},
                            3: {value: 0},
                            4: {value: 0},
                            5: {value: 0},
                            6: {value: 0},
                            7: {value: 0},
                            8: {value: 0}
                        },
                        sum: 0
                    }
                }),
                gameId: game._id
            }
        };

        const response = await fetch('http://kinoigra.net.ua/api/games');
        const data = await response.json();
        if (data.length) {
            return proccessResponse(data);
        } else if (response.ok && !data.length) {
            alert('Ближайших игр не найдено!')
            return false;
        } else {
            alert("Ошибка HTTP: " + response.status);
            return false;
        }
    },

    sort: arr => {
        let table = [...arr];
        const bubbleSort = (array) => {
            let sorted = false;
            let counter = 0;

            while (!sorted) {
                sorted = true;
                for (let
                         i = 0;
                     i < array.length - 1 - counter;
                     i++
                ) {
                    if ((array[i].sum > array[i + 1].sum)
                        || (array[i].sum == array[i + 1].sum && array[i].weighted > array[i + 1].weighted)) {
                        [array[i], array[i + 1]] = [array[i + 1], array[i]];
                        sorted = false;
                    }
                }
                counter++;
            }
            return array;
        }
        const weighted = table.map(item => {
            let sum = 0;
            let weighted = 0
            for (let i = 1; i < 9; i++) {
                weighted += +item.tours[i].value * Math.pow(i, 8);
                sum += +item.tours[i].value
            }
            item.sum = sum;
            item.weighted = weighted;
            return item;
        });
        bubbleSort(weighted);
        return weighted.reverse();
    }
};
