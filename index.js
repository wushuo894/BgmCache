import api from "./api.js";
import {getBgmId, save} from "./bgm.js";

const cheerio = await import('cheerio');

let mikanHost = 'https://mikanani.me'
let res = await fetch(mikanHost)
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
    await sleep(1000)
    let bgmId = await getBgmId(mikanHost + href)
    await save(bgmId)

    // 测试
    break
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

res = await api.get(`https://api.bgm.tv/v0/subjects/475354`)
