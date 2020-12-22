import React from "react";
import {SearchBar} from "./SearchBar";
import {WeatherMap} from "./WeatherMap";
import DetailedInfoFragment from "./DetailedInfoFragment";
import {SimpleModal} from "./SimpleModal";
import {Weather, WeatherInfoFull} from "../interfaces";

interface PageTemplateState {
    enabledErrorModal: boolean,
    weatherInfo?: WeatherInfoFull
}

export default class PageTemplate extends React.Component<{}, PageTemplateState> {
    private apiKey = '2b06c7f81904b87a4fa55c7d23a7a7db';

    constructor(props: {}) {
        super(props);
        this.state = {
            enabledErrorModal: false
        };
    }

    onSearchClick = async (text: string) => {
        console.log('in onSearchClick: search text = ' + text);

        let url = `https://api.openweathermap.org/data/2.5/find?q=${text}&appid=${this.apiKey}&units=metric&lang=ru`;
        let result = await fetch(url, {method: "GET"});
        if (result.ok) {
            let json = await result.json();
            this.parseWeatherJson(json);
        } else {
            console.error(`Cannot load weather of city = ${text}`);
        }
    }

    parseWeatherJson = (json: any) => {
        if (json.count > 0) {
            let info = json.list[0];
            let weather: Weather[] = [];
            if (info.hasOwnProperty('weather')) {
                for (let w of info.weather) {
                    weather.push({
                        main: w.main,
                        description: w.description,
                        icon: w.icon
                    });
                }
            }

            let weatherInfo: WeatherInfoFull = {
                city: info.name,
                coords: {lon: info.coord.lon, lat: info.coord.lat},
                temp: info.main.temp,
                wind: {speed: info.wind.speed, deg: info.wind.deg},
                pressure: info.main.pressure,
                humidity: info.main.humidity,
                weather
            };
            this.setState({weatherInfo});
        } else {
            this.setState({enabledErrorModal: true});
        }
    }

    render() {

        return (
            <React.Fragment>
                <SearchBar onFindClick={this.onSearchClick}/>
                {this.state.weatherInfo && <WeatherMap info={this.state.weatherInfo}/>}
                {this.state.weatherInfo && <DetailedInfoFragment info={this.state.weatherInfo}/>}
                <SimpleModal text={"Введенный город не найден!"} enabled={this.state.enabledErrorModal}/>
            </React.Fragment>
        )
    }
}