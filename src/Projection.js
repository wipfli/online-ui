import Line from './Line'
import Marker from './Marker'

// lonLatStart: array 2 elements, angles in degrees
// bearing: number, angle in degrees
// distance: number, meters
// returns lonLatEnd, array 2 elements, angles in degrees
function endBearingDistance(lonLatStart, bearing, distance) {
    var d = distance // m
    var brng = bearing * Math.PI / 180.0 // rad
    var φ1 = lonLatStart[1] * Math.PI / 180.0 // rad
    var λ1 = lonLatStart[0] * Math.PI / 180.0 // rad
    var R = 6371000 // m

    var latEnd = Math.asin(Math.sin(φ1) * Math.cos(d / R) +
        Math.cos(φ1) * Math.sin(d / R) * Math.cos(brng))
    var lonEnd = λ1 + Math.atan2(Math.sin(brng) * Math.sin(d / R) * Math.cos(φ1),
        Math.cos(d / R) - Math.sin(φ1) * Math.sin(latEnd))

    return [lonEnd * 180.0 / Math.PI, latEnd * 180.0 / Math.PI]
}

const buildName = name => 'Projection_' + name

const Projection = ({ 
    map,
    name,
    point,
    speed,
    heading,
    visible,
    color
}) => {
    const times = [15, 30, 60, 120]
    const labels = [
        '15 minutes',
        '30 minutes',
        '1 hour',
        '2 hours'
    ]
    const points = times.map(value => {
        return endBearingDistance(point, heading, speed * value * 60)
    })

    return (
        <div>
            <Line
                map={map}
                name={buildName(name)}
                points={[point, ...points, endBearingDistance(points[points.length - 1], heading, 50e3)]}
                color={color}
                opacity={1.0}
                dashed={true}
                visible={visible}
                behindMarker={name}
            />

            {
                points.map((value, index) => {
                    return <Marker
                        map={map}
                        name={buildName(name) + times[index].toString() + 'min'}
                        longitude={value[0]}
                        latitude={value[1]}
                        visible={visible}
                        imagePath="/point-small.png"
                        clickText={'Location in ' + labels[index]}
                        key={index}
                    />
                })
            }
        </div>
    )
}

export default Projection