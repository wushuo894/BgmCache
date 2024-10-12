import api from "./api.js";


(async () => {
    let res = await api.get(`https://api.bgm.tv/v0/subjects/475354`)
    console.log(res);
})()
