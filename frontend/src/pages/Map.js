import React from 'react'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import { useState, useEffect } from 'react';
import "../components/css/map.css";
import { Room, Star } from '@material-ui/icons'
import axios from 'axios';
// import { format } from "timeago.js";

function Map() {

    const [viewPort, setViewPort] = useState({
        latitude: 28.60236,
        longitude: -81.20008,
        // width: '100vw',
        // height: '100vh',
        width: window.innerWidth,
        height: window.innerHeight,
        zoom: 14
    });

    return (
        <div className="map">
            <ReactMapGL

                // The following three lines of code displays the map along with the appropriate styling.
                mapboxApiAccessToken={"pk.eyJ1IjoiZWxyNDI0IiwiYSI6ImNrcXM5cGdvZTFtbjUybnFsZTF1N2c5bmkifQ.1e0zeu37TrBHe_TiqmjNVw"}
                mapStyle="mapbox://styles/elr424/ckqsacra23gy117r0j9otwx4x"
                {...viewPort}
                
                // Enables the user to move around on the map. Only temporary.
                onViewportChange={(newView) => setViewPort(newView)}
                // onDblClick = {handleAddClick}
            >
                <Marker
                    latitude={28.601471307589883}
                    longitude={-81.20064452290535}
                    offsetLeft={-viewPort.zoom*1.5}
                    offsetTop={-viewPort.zoom*3}
                >
                    <Room
                        style={{
                            fontSize: viewPort.zoom * 3,
                            color: "red",
                            cursor: "pointer"
                        }}
                    />
                </Marker>
            </ReactMapGL>
        </div>

    )
}

export default Map;