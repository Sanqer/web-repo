const REFRESH_PERIOD = 1;
const DELETE_THRESHOLD = 24 * 60;
let mapDiv = document.querySelector(".mapPlace");
let buttonsDiv = document.querySelector(".buttons");

function init() {
    for (let city of cities) {
        let button = document.createElement("button");
        button.addEventListener("click", clickListener);
        button.dataset.cityId = city.id;
        button.innerText = city.name;
        buttonsDiv.appendChild(button);
    }

    deleteOldMaps();
}

function deleteOldMaps() {
    let keys = Object.keys(localStorage);
    for (let key of keys) {
        if (isMapPhotoId(key)) {
            let mapPhoto = JSON.parse(localStorage.getItem(key));
            if (isOld(mapPhoto.updateTime, DELETE_THRESHOLD)) {
                localStorage.removeItem(key);
            }
        }
    }
}

async function clickListener(e) {
    let cityId = Number(e.target.dataset.cityId);
    console.log("Clicked on city with id = " + cityId);
    let blob = await getMap(cityId);

    let img = document.createElement("img");
    img.src = URL.createObjectURL(blob);
    mapDiv.removeChild(mapDiv.firstChild);
    mapDiv.appendChild(img);
}

async function getMap(cityId) {
    let photoId = getStorageId(cityId);
    let photoInfo = localStorage.getItem(photoId);
    if (photoInfo === null) {
        return await getNewMapBlob(cityId);
    } else {
        let mapPhoto = JSON.parse(photoInfo);
        let lastUpdated = mapPhoto.updateTime;
        if (isOld(lastUpdated, REFRESH_PERIOD)) {
            return await getNewMapBlob(cityId);
        } else {
            return binaryToBlob(mapPhoto.binaryBlob);
        }
    }
}

async function getNewMapBlob(cityId) {
    let photoId = getStorageId(cityId);
    let blob = await getNewMap(cityId);
    await tryAddToStorage(photoId, blob);
    return blob;
}

async function tryAddToStorage(photoId, blob) {
    try {
        let mapPhoto = new MapPhoto(await blobToBinary(blob), Date.now());
        localStorage.setItem(photoId, JSON.stringify(mapPhoto));
    } catch (e) {
        console.warn("Local storage is full! Cannot cash photos");
    }
}

async function getNewMap(cityId) {
    let city = getCityById(cityId);
    if (city === undefined) {
        console.log("No such city with id = " + cityId);
        return;
    }

    let temp = await getCityTemp(city);
    temp = Math.max(Math.round(temp), 0);

    let url = `https://static-maps.yandex.ru/1.x/?ll=${city.coord.lon},${city.coord.lat}` +
        `&size=650,450&z=11&l=map` +
        `&pt=${city.coord.lon},${city.coord.lat},pmwtm${temp}`;

    let result = await fetch(url, {method: "GET"});
    if (result.ok) {
        return await result.blob();
    } else {
        console.error(`Cannot load map for ${city.name}`);
    }
}

async function getCityTemp(city) {
    let cityId = city.id;
    let apiKey = "";
    let url = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}&units=metric`;
    let result = await fetch(url, {method: "GET"});
    if (result.ok) {
        let json = await result.json();
        return json.main.temp;
    } else {
        console.error(`Cannot load weather of city with id = ${cityId} and name = ${city.name}`);
    }
}

function blobToBinary(blob) {
    return new Promise((resolve, reject) => {
        let fr = new FileReader();
        fr.onload = () => {
            resolve(fr.result);
        }
        fr.onerror = reject;
        fr.readAsBinaryString(blob);
    });
}

function binaryToBlob(binaryBlob) {
    let len = binaryBlob.length;
    let array = new Uint8Array(binaryBlob.length);
    for (let i = 0; i < len; ++i) {
        array[i] = binaryBlob.charCodeAt(i);
    }
    return new Blob([array]);
}

function isOld(lastTime, differMinutes) {
    return ((Date.now() - lastTime) / 1000 / 60) > differMinutes;
}

init();