import React from "react";
import {WeatherInfo} from "../interfaces";

export const WeatherOverlay: React.FC<WeatherInfo> = (info: WeatherInfo) => (
    <div className={"mapOverlay"} style={{maxWidth: 650}}>
        temp = {info.temp}
    </div>
);