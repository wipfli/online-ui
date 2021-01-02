import { useEffect } from 'react'

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

    const data = {
        'type': 'Feature',
        'properties': {},
        'geometry': {
            'type': 'LineString',
            'coordinates': points
        }
    }

    useEffect(() => {
        if (map) {
            map.on('load', () => {
                map.addSource(buildName(name), {
                    'type': 'geojson',
                    'data': data
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
            })
        }
    }, [map])

    useEffect(() => {
        if (map && map.getSource(buildName(name))) {
            map.getSource(buildName(name)).setData(data)
        }
    }, [data])

    useEffect(() => {
        if (map && map.getSource(buildName(name))) {
            map.setLayoutProperty(
                buildName(name),
                'visibility',
                visible ? 'visible' : 'none'
            )
        }
    }, [visible])

    return null
}

export default Line