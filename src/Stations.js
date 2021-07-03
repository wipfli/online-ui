import { useState, useEffect } from 'react'
import axios from 'axios'

const getStation = (feature, time) => {
    return new Promise((resolve, reject) => {
        const id = feature.properties.id
        axios.get(`https://api.ballometer.io/weather/station?id=${id}&time=${time}`)
            .then(res => {
                resolve({
                    id: id,
                    name: feature.properties.name,
                    temperature: res.data.temperature ? res.data.temperature.toFixed(0) : '--', // deg C
                    windDirection: res.data.windDirection ? res.data.windDirection : 0.0, // deg
                    windSpeed: res.data.windSpeed ? res.data.windSpeed.toFixed(0) : '-', // km/h
                    gustSpeed: res.data.gustSpeed ? res.data.gustSpeed.toFixed(0) : '-',  // km/h
                    latitude: Number(feature.properties.latitude),
                    longitude: Number(feature.properties.longitude),
                })
            })
            .catch(err => {
                reject(err)
            })
    })
}

const buildName = id => 'Station_' + id

const buildGeojson = ({
    name,
    temperature,
    windDirection,
    windSpeed,
    gustSpeed,
    latitude,
    longitude
}) => {
    return {
        type: 'Feature',
        properties: {
            name: name,
            temperature: temperature,
            windDirection: windDirection,
            windSpeed: windSpeed,
            gustSpeed: gustSpeed,
        },
        geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
        }
    }
}


const Stations = ({ map }) => {

    const time = Date.now() * 1e-3

    const [renderedFeatures, setRenderedFeatures] = useState([])
    const [loadedIds, setLoadedIds] = useState([])

    useEffect(() => {
        if (map) {
            const handleFeatures = () => {
                const features = map.queryRenderedFeatures({
                    layers: ['stations']
                })
                setRenderedFeatures(features)
            }
            map.on('move', handleFeatures)
            map.on('zoom', handleFeatures)
            setInterval(handleFeatures, 1000)
        }
    }, [map])

    useEffect(() => {
        const newIds = []
        renderedFeatures.forEach(feature => {
            const id = feature.properties.id
            if (!loadedIds.includes(id)) {
                getStation(feature, time).then(data => {
                    map.addSource(buildName(id), {
                        type: 'geojson',
                        data: buildGeojson(data)
                    })
                    map.addLayer({
                        id: buildName(id),
                        type: 'symbol',
                        source: buildName(id),
                        layout: {
                            "symbol-placement": "point",
                            "icon-image": "arrow_blue",
                            "icon-rotate": ["get", "windDirection"],
                            "text-field": "{windSpeed} | {gustSpeed} km/h\n{name} {temperature} \u00b0C",
                            "text-font": [
                                "Noto Sans Regular"
                            ],
                            "text-size": 14,
                            "text-justify": "center",
                            "text-anchor": "top",
                            "text-offset": [
                                0.0,
                                1.0
                            ]
                        },
                        paint: {
                            "text-color": "#8e44ad",
                            "text-halo-blur": 0.5,
                            "text-halo-width": 1,
                            "text-halo-color": "rgba(255, 255, 255, 1)",
                            "text-opacity": 1.0,
                            "icon-opacity": 1.0
                        },
                        minzoom: 9
                    })
                    console.log(data)
                })

                newIds.push(id)
            }
        })
        if (newIds.length > 0) {
            setLoadedIds([...loadedIds, ...newIds])
        }
    }, [renderedFeatures])

    return null
}

export default Stations
