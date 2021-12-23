import React, {useEffect, useState} from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    ZoomableGroup,
    Point
} from "react-simple-maps";
import axios from "axios";
import {Spinner} from "react-bootstrap";
import {config} from "../config";
import {launchParams} from '../utils/typesConfig'

interface Markers {
    markerOffset: number;
    name: string;
    coordinates: Point;
}

const Map = () => {

    let markers: Markers[] = [];
    const [points, setPoints] = useState(markers);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${config.launchApi}/upcoming/`);

                console.log(response.data.results);
                markers = response.data.results.map((l: launchParams) => {
                    return {
                        markerOffset: 15,
                        name: l.name,
                        coordinates: [
                            l.pad.longitude,
                            l.pad.latitude,
                        ],
                    };
                });
                setPoints(markers);
            } catch (error) {
                console.log(`Error getting events data: ${error}`);
            }
        };
        fetchData();
    }, []);

    // @ts-ignore
    return (
        <ComposableMap projection="geoAzimuthalEqualArea" projectionConfig={{rotate: [58, 20, 0], scale: 400}}>
            <ZoomableGroup zoom={1}>
                <Geographies geography={config.geoUrl}>
                    {({geographies}) =>
                        geographies.map((geo) => (
                            <Geography key={geo.rsmKey} geography={geo}/>
                        ))
                    }
                </Geographies>

                {points ? (
                    points.map(({name, coordinates, markerOffset}) => (
                        <Marker key={name} coordinates={coordinates}>
                            <circle r={10} fill="#F00" stroke="#fff" strokeWidth={2}/>
                            <text
                                textAnchor="middle"
                                y={markerOffset}
                                style={{fontFamily: "system-ui", fill: "#5D5A6D"}}
                            >
                                {name}
                            </text>
                        </Marker>
                    ))
                ) : (
                    <Spinner animation="border"/>
                )}
            </ZoomableGroup>
        </ComposableMap>
    );
};

export default Map;
