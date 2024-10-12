import api from "./api.js";
import {getBgmId, save} from "./bgm.js";

const cheerio = await import('cheerio');

let mikanHost = 'https://mikanani.me'
let res = await fetch(mikanHost + '/Home/BangumiCoverFlowByDayOfWeek?year=2024&seasonStr=春')
let html = await res.text()
let mikan = []
const $ = cheerio.load(html);
for (let a of Array.from($('a'))) {
    let href = a.attribs['href']
    if (!href instanceof String) {
        continue
    }
    if (!href) {
        continue
    }
    let regex = /^\/Home\/Bangumi\/\d+$/
    if (!href.match(regex)) {
        continue
    }
    if (mikan.includes(href)) {
        continue
    }
    mikan.push(href)
    let bgmId = await getBgmId(mikanHost + href)
    await sleep(1000)
    try {
        await save(bgmId)
    } catch (err) {
        console.log(err)
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

res = await api.get(`https://api.bgm.tv/v0/subjects/475354`)
