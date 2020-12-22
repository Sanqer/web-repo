import React from "react";
import {SimpleMap} from "./SimpleMap";
import {WeatherOverlay} from "./WeatherOverlay";
import {Container} from "react-bootstrap";
import {SearchBar} from "./SearchBar";
import {WeatherInfo} from "../interfaces";

export const WeatherMap: React.FC<{info: WeatherInfo}> = (props) => (
    <Container>
        <SimpleMap lon={props.info.coords.lon} lat={props.info.coords.lat}/>
        <WeatherOverlay city={props.info.city} temp={props.info.temp} wind={props.info.wind} coords={props.info.coords}/>
    </Container>
);



