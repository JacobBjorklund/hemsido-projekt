function currentTime() {
    let date = new Date();
    let hh = date.getHours();
    let mm = date.getMinutes();
    let ss = date.getSeconds();

    hh = (hh < 10) ? "0" + hh : hh;
    mm = (mm < 10) ? "0" + mm : mm;
    ss = (ss < 10) ? "0" + ss : ss;


    let time = hh + ':' + mm + ':' + ss;

    document.getElementById("tid").innerText = time;
    var t = setTimeout(function () { currentTime() }, 1000);

}

currentTime();

function local() {
    let local = localStorage.getItem('bookmarks')
    let parsedLocal = JSON.parse(local) || []

    for (let i = 0; i < parsedLocal.length; i++) {
        const li = document.createElement('li')

        li.innerHTML = `
                <a href="${parsedLocal[i].url}" class="icon">
                    <img class="iconify" src="${parsedLocal[i].image}">
                </a>
                <a class="autist" href="">
                    <h3>${parsedLocal[i].title.substring(0, 10)}</h3>
                </a>
            `

        li.classList.add('box')

        document.getElementById('divside').appendChild(li)
    }
}

local()

// add modal 
function handleSave(e) {
    e.preventDefault() // don't reload the page on sumbit

    let local = localStorage.getItem('bookmarks')
    let parsedLocal = JSON.parse(local)
    let storage = parsedLocal || []

    const url = document.getElementById('link').value

    try {
        fetch('https://cors.eu.org/' + url)
            .then(result =>
                result.text())
            .then(text => {
                const parser = new DOMParser();
                const htmlDocument = parser.parseFromString(text, "text/html");
                let title = htmlDocument.documentElement.querySelectorAll('meta[property="og:title"]')[0]?.content || null
                let image = htmlDocument.documentElement.querySelectorAll('meta[property="og:image"]')[0]?.content || null

                // if no title
                if (!title) {
                    const { hostname } = new URL(url)
                    title = hostname.replace('www.', '').split('.')[0] // Todo: remove www.
                }

                // If no image
                if (!image) {
                    image = "img/Bildfan.png"
                }

                // Save to local storage
                storage.push({
                    url,
                    image,
                    title
                })

                localStorage.setItem('bookmarks', JSON.stringify(storage))

                // Create elements
                const li = document.createElement('li')
                li.innerHTML = `
                <a href="${url}" class="icon">
                    <img class="iconify" src="${image}">
                </a>
                <a class="autist" href="">
                    <h3>${title.substring(0, 10)}</h3>
                </a>
            `

                li.classList.add('box')

                document.getElementById('divside').appendChild(li)

                // Clearar input
                document.getElementById('link').value = ''

            })
    } catch (error) {
        console.log('sitt ner');
    }
}

document.getElementById('save-form').addEventListener('submit', handleSave)