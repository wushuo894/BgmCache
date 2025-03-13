import api from "./api.js";
import bgm from "./bgm.js";

const cheerio = await import('cheerio');

let mikanHost = 'https://mikanani.me'
// mikanHost + '/Home/BangumiCoverFlowByDayOfWeek?year=2023&seasonStr=秋'
let res = await fetch(mikanHost)
let html = await res.text()
let mikan = []
const $ = cheerio.load(html);
let aList = Array.from($('a'))
let i = 0
for (let a of aList) {
    console.log(`${i++} / ${aList.length}`)

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
    let bgmId = await bgm.getBgmId(mikanHost + href)
    try {
        let bangumiId = href.match(/\d+/g)[0]
        let bgmInfo = await bgm.save(bgmId)
        if (bgmInfo === undefined) {
            continue
        }
        await bgm.saveScore(bangumiId, bgmInfo)
    } catch (err) {
        console.log(err)
    }
}

res = await api.get(`https://api.bgm.tv/v0/subjects/475354`)
