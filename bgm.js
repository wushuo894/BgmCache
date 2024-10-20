const cheerio = await import('cheerio');

export let getBgmId = async (url) => {
    let res = await fetch(url)
    let html = await res.text();
    const $ = cheerio.load(html);
    for (let a of Array.from($('a'))) {
        let href = a.attribs['href']
        if (!href instanceof String) {
            continue
        }
        if (!href) {
            continue
        }
        let regex = /^https:\/\/bgm.tv\/subject\/(\d+)(\/)?$/
        if (!href.match(regex)) {
            continue
        }
        return href.match(regex)[1]
    }
    return ''
}

export let save = async (bgmId) => {
    if (!bgmId) {
        return
    }
    const fs = await import('fs')
    let path = `bgm/${bgmId.substring(0, 1)}/${bgmId}.json`
    if (fs.existsSync(path)) {
        return
    }
    await sleep(1000)
    console.log('https://api.bgm.tv/subject/' + bgmId);
    let headers = {}
    let token = process.env.TOKEN
    if (token) {
        headers['Authorization'] = 'Bearer ' + token
    }
    let res = await fetch('https://api.bgm.tv/v0/subjects/' + bgmId,{headers})
    if (res.status !== 200) {
        return
    }

    let text = await res.text()

    if (!fs.existsSync('bgm')) {
        fs.mkdir('bgm', (err) => {
            if (err) {
                console.error('mkdir:', err);
            }
        })
    }
    fs.writeFile(path, text, (err) => {
        if (err) {
            console.error('Error saving the file:', err);
            return
        }
        console.log(`${path} saved`)
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default {getBgmId, save}
