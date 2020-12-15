import React from "react";
import {SimpleMap} from "./SimpleMap";
import {WeatherOverlay} from "./WeatherOverlay";
import {Container} from "react-bootstrap";

export const WeatherMap: React.FC = () => {
    return (
        <Container>
            <SimpleMap lon={10} lat={10}/>
            <WeatherOverlay temp={35}/>
        </Container>
    )
};



