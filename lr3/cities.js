const ID_PREFIX = "MapPhotoId_";
const cities = [
    {
        "id": 571476,
        "name": "Bryansk",
        "state": "",
        "country": "RU",
        "coord": {
            "lon": 34.380562,
            "lat": 53.287498
        }
    },
    {
        "id": 524894,
        "name": "Moscow",
        "state": "",
        "country": "RU",
        "coord": {
            "lon": 37.606667,
            "lat": 55.761665
        }
    },
    {
        "id": 536203,
        "name": "Saint Petersburg",
        "state": "",
        "country": "RU",
        "coord": {
            "lon": 30.25,
            "lat": 59.916668
        }
    },
    {
        "id": 2643743,
        "name": "London",
        "state": "",
        "country": "GB",
        "coord": {
            "lon": -0.12574,
            "lat": 51.50853
        }
    },
];

function MapPhoto(binaryBlob, updateTime) {
    this.binaryBlob = binaryBlob;
    this.updateTime = updateTime;
}

function getStorageId(id) {
    return ID_PREFIX + id;
}

function isMapPhotoId(storageId) {
    return storageId.startsWith(ID_PREFIX);
}

function getCityById(id) {
    return cities.find(item => item.id === id);
}