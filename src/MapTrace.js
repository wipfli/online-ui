import { useEffect, useState } from 'react'

import Line from './Line'
import Marker from './Marker'
import Projection from './Projection'

const buildName = name => 'MapTrace_' + name

const findClosest = (points, point) => {
    const distances = points.map(value => {
        return (value[0] - point[0]) ** 2 + (value[1] - point[1]) ** 2
    })
    return distances.indexOf(Math.min(...distances))
}

const MapTrace = ({
    map,
    name,
    points,
    speed,
    heading,
    index,
    callbackIndex,
    color,
    historyVisible,
    imagePath,
    loading
}) => {

    const [dragPoint, setDragPoint] = useState(points[index])

    useEffect(() => {
        callbackIndex(findClosest(points, dragPoint))
    }, [dragPoint])
    
    return (
        <div>
            <Line
                map={map}
                name={'history_wideclickline_' + buildName(name)}
                points={points}
                color={color}
                opacity={0.0}
                dashed={false}
                lineWidth={32}
                visible={!loading && historyVisible}
                behindMarker={buildName(name)}
                onClick={setDragPoint}
            />
            <Line
                map={map}
                name={'history_under_' + buildName(name)}
                points={points}
                color={color}
                opacity={0.5}
                dashed={false}
                visible={!loading && historyVisible}
                behindMarker={buildName(name)}
            />
            <Line
                map={map}
                name={'history_over_' + buildName(name)}
                points={points.slice(0, index + 1)}
                color={color}
                opacity={1.0}
                dashed={false}
                visible={!loading && historyVisible}
                behindMarker={buildName(name)}
            />
            <Marker
                map={map}
                name={buildName(name)}
                longitude={points[index][0]}
                latitude={points[index][1]}
                onDrag={setDragPoint}
                visible={!loading}
                imagePath={imagePath}
            />
            <Projection 
                map={map}
                name={buildName(name)}
                point={points[index]}
                speed={speed[index]}
                heading={heading[index]}
                visible={!loading && (index === points.length - 1)}
                color={color}
            />
        </div>
    )
}

export default MapTrace