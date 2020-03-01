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
                        1:{value:0}, 2:{value:0}, 3:{value:0}, 4:{value:0}, 5:{value:0}, 6:{value:0}, 7:{value:0}, 8:{value:0}
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
            return false;
        }
    },

    sort: arr => {
        let table = [...arr];
        const bubbleSort = (array)=>{
            // array = [...origArray];
            let sorted = false;
            let counter = 0;

            while(!sorted){
                sorted = true;
                for(let i =0; i < array.length -1 -counter; i++){
                    if((array[i].sum > array[i+1].sum) 
                    || (array[i].sum == array[i+1].sum && array[i].weighted > array[i+1].weighted)){
                        [array[i],array[i+1]] = [array[i+1],array[i]];
                        sorted = false;
                    }
                    // else 
                    // if(array[i].sum === array[i+1].sum){
                    //     for(let j = 8; j > 0; j--){
                    //         // console.log(array[i].tours[j].value, array[i+1].tours[j].value, array[i].tours[j].value < array[i+1].tours[j].value);
                    //         if(array[i].tours[j].value > array[i+1].tours[j].value){
                    //             // console.log(array);
                    //             // console.log(array[i].tours[j].value, array[i+1].tours[j].value, array[i].tours[j].value < array[i+1].tours[j].value);
                    //             [array[i],array[i+1]] = [array[i+1],array[i]];
                    //             console.log('replace');
                    //             sorted = false;
                    //             break;
                    //         }
                    //     }
                    // }
                }
                counter++;
            }
            return array;
        }
        const weighted = table.map(item => {
                let sum = 0;
                let weighted = 0
                for(let i = 1; i < 9; i++){
                    weighted += +item.tours[i].value * (i*i*i*i*i);
                    sum += +item.tours[i].value
                }
                item.sum = sum;
                item.weighted = weighted;
                return item;
        })
        bubbleSort(weighted)
        // console.log(weighted, table);
        return weighted.reverse()
        
        // return bubbleSort(table.map(item => {
        //     let sum = 0;
        //     for(let i = 1; i < 9; i++){
        //         sum += +item.tours[i].value * i;
        //     }
        //     item.sum = sum;
        //     return item;
        // })).reverse().map(i=> {
        //     console.log(i.sum);
        //     i.sum = table.find(j=> i.name === j.name).sum;
        //     console.log(table.find(j=> i.name === j.name).sum);
            
        //     return i;
        // })

        // .map(item => {
        //     let sum = Number(item.sum);
        //     for(let i = 1; i < 9; i++){
        //         sum = sum - (Number(item.tours[i].value) * i) + Number(item.tours[i].value);
        //     }
        //     item.sum = sum;
        //     return item;
        // }).
    }
};
