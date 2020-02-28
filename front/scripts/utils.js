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
        ipcRenderer.on('save', (e,res) => resolve(res))
    }),

    getFromWeb: async () => {
        const proccessResponse = games =>{
            const timest = new Date().valueOf();
            const game = games.find(item => new Date(item.date).valueOf() > timest);
            return game.teams.filter(i => i.type === 'main').map(i => {
                return {
                    name: i.title,
                    tours: {
                        1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0
                    },
                    sum:0
                }
            })
        };

        let response = await fetch('http://kinoigra.net.ua/api/games');
        if (response.ok) {
            return proccessResponse(await response.json());
        } else {
            alert("Ошибка HTTP: " + response.status);
        }
    }
};
