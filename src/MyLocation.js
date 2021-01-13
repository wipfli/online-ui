import { useEffect, useState } from 'react'

import MyLocationIcon from '@material-ui/icons/MyLocation'

import usePosition from './usePosition'
import HtmlMarker from './HtmlMarker'

const MyLocation = ({
    map,
    locateMeCounter
}) => {
    const position = usePosition()
    const [myLocateMeCounter, setMyLocateMeCounter] = useState(0)

    const latitude = position.latitude ? position.latitude : 0.0
    const longitude = position.longitude ? position.longitude : 0.0

    useEffect(() => {
        if (map && position.longitude && myLocateMeCounter < locateMeCounter) {
            map.setCenter([longitude, latitude])
            map.setZoom(16)
            setMyLocateMeCounter(c => c + 1)
        }
    }, [locateMeCounter, map, position.longitude])

    return (
        <HtmlMarker 
            map={map}
            longitude={longitude}
            latitude={latitude}
        >
            <MyLocationIcon style={{ color: '#ac1a65' }}/>
        </HtmlMarker>
    )
}

export default MyLocation
