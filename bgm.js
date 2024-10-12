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
    console.log('https://api.bgm.tv/subject/' + bgmId);
    let res = await fetch('https://api.bgm.tv/v0/subjects/' + bgmId)
    if (res.status !== 200) {
        return
    }

    let text = await res.text()

    const fs = await import('fs')
    if (!fs.existsSync('bgm')) {
        fs.mkdir('bgm', (err) => {
            if (err) {
                console.error('mkdir:', err);
            }
        })
    }
    let path = `bgm/${bgmId}.json`
    if (fs.existsSync(path)) {
        // fs.rmSync(path)
        return
    }
    fs.writeFile(path, text, (err) => {
        if (err) {
            console.error('Error saving the file:', err);
            return
        }
        console.log(`${path} saved`)
    });
}

export default {getBgmId, save}
