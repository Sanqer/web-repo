import React from "react";
import {Weather} from "../interfaces";

export class DetailsBlock extends React.Component<Weather> {
    render() {
        let imgSrc = 'http://openweathermap.org/img/wn/' + this.props.icon + '@2x.png';

        return (
            <React.Fragment>
                <img src={imgSrc} alt="weather icon"/>
                <div>{this.props.description}</div>
            </React.Fragment>
        );
    }
}