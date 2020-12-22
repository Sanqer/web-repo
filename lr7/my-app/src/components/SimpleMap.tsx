import React from "react";
import {CityCoords} from "../interfaces";

interface IState {
    imgUrl?: string
}

export class SimpleMap extends React.Component<CityCoords, IState> {

    constructor(props: CityCoords) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        await this.getMap();
    }

    async getMap(): Promise<void> {
        let url = `https://static-maps.yandex.ru/1.x/?ll=${this.props.lon},${this.props.lat}` +
            `&size=650,450&z=11&l=map`;

        let result = await fetch(url, {method: "GET"});
        if (result.ok) {
            let blob = await result.blob();
            this.setState({imgUrl: URL.createObjectURL(blob)});
        }
    }

    render() {
        return (
            <div className={"mapContainer"}>
                {this.state.imgUrl && <img src={this.state.imgUrl} alt={"map"}/>}
            </div>
        )
    }
}