import React, { useEffect, useState } from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    Point
} from "react-simple-maps";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import moment from "moment";

interface Markers {
    markerOffset: number;
    name: string;
    coordinates: Point;
}

const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const Map = () => {

    let markers: Markers[] = [];
    const [points, setPoints] = useState(markers);

    //get current date
    let current: string = moment().format("DD-MM-YYYY");
    let future:string = moment().add(3, "months").format("DD-MM-YYYY");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://ll.thespacedevs.com/2.2.0/?offset=10`);

                console.log(response);

                // console.log(response.data.results);
                // markers = response.data.results.map((l: any) => {
                //     return {
                //         markerOffset: 15,
                //         name: l.name,
                //         coordinates: [
                //             l.location.pads[0].longitude,
                //             l.location.pads[0].latitude,
                //         ],
                //     };
                // });
                // setPoints(markers);
            } catch (error) {
                console.log(`Error getting events data: ${error}`);
            }
        };
        fetchData();
    }, []);

    // @ts-ignore
    return (
        <ComposableMap projection="geoAzimuthalEqualArea" projectionConfig={{ rotate: [58, 20, 0], scale: 400 }} >

            <Geographies geography={geoUrl}>
                {({ geographies }) =>
                    geographies.map((geo) => (
                        <Geography key={geo.rsmKey} geography={geo} />
                    ))
                }
            </Geographies>

            {points ? (
                points.map(({ name, coordinates, markerOffset }) => (
                    <Marker key={name} coordinates={coordinates}>
                        <circle r={10} fill="#F00" stroke="#fff" strokeWidth={2} />
                        <text
                            textAnchor="middle"
                            y={markerOffset}
                            style={{ fontFamily: "system-ui", fill: "#5D5A6D" }}
                        >
                            {name}
                        </text>
                    </Marker>
                ))
            ) : (
                <Spinner animation="border" />
            )}
    </ComposableMap>
);
};

export default Map;
