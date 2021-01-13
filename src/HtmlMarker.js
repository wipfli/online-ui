import { useState, useRef, useEffect } from 'react'

import mapboxgl from 'mapbox-gl'

const HtmlMarker = ({
    map,
    longitude,
    latitude,
    children
}) => {

    const ref = useRef(null)
    const [marker, setMarker] = useState(null)

    useEffect(() => {
        if (map) {
            const marker = new mapboxgl.Marker({
                element: ref.current
            })
                .setLngLat([longitude, latitude])
                .addTo(map)
            setMarker(marker)
        }
    }, [map])

    useEffect(() => {
        if (marker) {
            marker.setLngLat([longitude, latitude])
        }
    }, [longitude, latitude])

    return (
        <div ref={ref}>
            { children }
        </div>
    )
}

export default HtmlMarker