import { useState, useRef, useEffect } from 'react'

import mapboxgl from 'mapbox-gl'

const HtmlMarker = ({
    map,
    longitude,
    latitude
}) => {
    const point = [longitude, latitude]

    const ref = useRef(null)

    const [marker, setMarker] = useState(null)

    useEffect(() => {
        if (map) {
            const marker = new mapboxgl.Marker({
                element: ref.current
            })
                .setLngLat(point)
                .addTo(map)
            setMarker(marker)
        }
    }, [map])

    return (
        <div ref={ref}>
            <svg height="8" width="8">
                <circle cx="4" cy="4" r="4" fill="#3498db" />
            </svg>
        </div>
    )
}

export default HtmlMarker