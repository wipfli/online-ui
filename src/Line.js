import { useState, useEffect } from 'react'

const buildName = name => 'Line_' + name

const Line = ({
    map,
    name,
    points,
    color,
    opacity,
    dashed,
    lineWidth,
    visible,
    behindMarker,
    onClick
}) => {
    const [ready, setReady] = useState(false)

    useEffect(() => {
        if (!map) {
            return
        }
        map.on('load', () => {
            map.addSource(buildName(name), {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': points
                    }
                }
            })

            const dashProperty = dashed ? { 'line-dasharray': [1, 3] } : {}

            map.addLayer({
                'id': buildName(name),
                'source': buildName(name),
                'type': 'line',
                'layout': {
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': color,
                    'line-width': lineWidth ? lineWidth : 3,
                    'line-opacity': opacity,
                    ...dashProperty
                }
            })

            if (onClick) {
                map.on('click', buildName(name), e => {
                    onClick([e.lngLat.lng, e.lngLat.lat])
                })
            }

            const markerLayer = 'Marker_' + behindMarker
            if (map.getLayer(markerLayer)) {
                map.moveLayer(buildName(name), markerLayer)
            }

            setReady(true)
        })
    }, [map])

    useEffect(() => {
        if (!ready) {
            return
        }
        map.getSource(buildName(name)).setData({
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'LineString',
                'coordinates': points
            }
        })
    }, [
        points.length,
        points.slice(-1)[0][0],
        points.slice(-1)[0][1],
        ready
    ])

    useEffect(() => {
        if (!ready) {
            return
        }
        map.setLayoutProperty(
            buildName(name),
            'visibility',
            visible ? 'visible' : 'none'
        )
    }, [visible, ready])

    return null
}

export default Line