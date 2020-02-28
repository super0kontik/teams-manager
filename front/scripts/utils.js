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
    },

    sort: arr => {
        let table = [...arr];
        const bubbleSort = (array)=>{
            let sorted = false;

            let counter =0;

            while(!sorted){
                sorted = true;
                for(let i =0; i < array.length -1 -counter; i++){
                    if(array[i].sum > array[i+1].sum){
                        helper(i,i+1,array);
                        sorted = false;
                    }else if(array[i].sum === array[i+1].sum){
                        for(let j = 8; j > 0; j--){
                            if(array[i].tours[j] > array[i+1].tours[j]){
                                helper(i,i+1,array);
                                sorted = false;
                                break;
                            }
                        }
                    }
                }
                counter++;
            }
            return array;
        }

        function helper(i,j, array){
            return [array[i],array[j]] = [array[j],array[i]]
        }
        return bubbleSort(table.map(item => {
            let sum = 0;
            for(let i = 1; i < 9; i++){
                sum += item.tours[i]
            }
            item.sum = sum;
            return item;
        })).reverse()
    }
};
