import React from "react";
import {DetailsBlock} from "./DetailsBlock";
import {WeatherInfoFull} from "../interfaces";
import {Container} from "react-bootstrap";

export default class DetailedInfoFragment extends React.Component<{info: WeatherInfoFull}> {

    render() {
        let children: React.ReactChild[] = [];
        for (let w of this.props.info.weather) {
            children.push(<DetailsBlock main={w.main} description={w.description} icon={w.icon}/>);
        }

        return (
            <Container>
                <div>Температура: {this.props.info.temp}</div>
                <div>Давление: {this.props.info.pressure}</div>
                <div>Влажность: {this.props.info.humidity}</div>
                <div>Ветер: {this.props.info.wind.speed}</div>
                <div>
                    {children}
                </div>
            </Container>
        )
    }
}