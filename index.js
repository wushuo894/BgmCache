import bgm from "./bgm.js";

const cheerio = await import('cheerio');

let mikanHost = 'https://mikanani.me'
// mikanHost + '/Home/BangumiCoverFlowByDayOfWeek?year=2023&seasonStr=秋'
let res = await fetch(mikanHost)
let html = await res.text()
let mikan = []
const $ = cheerio.load(html);
let aList = Array.from($('a'))

let urls = aList.map(a =>
    a.attribs['href']
)
    .filter(href => href)
    .filter(href => href.match(/^\/Home\/Bangumi\/\d+$/))
    .map(href => mikanHost + href)
    .reduce((acc, item) => {
        if (!acc.includes(item)) {
            acc.push(item);
        }
        return acc;
    }, []);

let i = 0
for (let url of urls) {
    console.log(`${i++} / ${urls.length}`)
    let bgmId = await bgm.getBgmId(url)
    try {
        let bangumiId = url.match(/\d+/g)[0]
        let bgmInfo = await bgm.save(bgmId)
        if (bgmInfo === undefined) {
            continue
        }
        await bgm.saveScore(bangumiId, bgmInfo)
    } catch (err) {
        console.log(err)
    }
}
