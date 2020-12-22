export interface WeatherInfo {
    city: string;
    coords: CityCoords;
    temp: number;
    wind: Wind;
}

export interface WeatherInfoFull extends WeatherInfo {
    pressure: number;
    humidity: number;
    weather: Weather[];
}

export interface Weather {
    main: string;
    description: string;
    icon: string;
}

export interface Wind {
    speed: number;
    deg: number;
}

export interface CityCoords {
    lon: number;
    lat: number;
}