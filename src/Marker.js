import { useState, useEffect } from 'react'

import Snackbar from '@material-ui/core/Snackbar'

const buildName = name => 'Marker_' + name

const Marker = ({
    map,
    name,
    longitude,
    latitude,
    onDrag,
    visible,
    imagePath,
    clickText
}) => {
    const [displaySnackbar, setDisplaySnackbar] = useState(false)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        if (map) {
            map.loadImage(imagePath, (err, image) => {
                if (err || !image) {
                    return
                }

                map.addImage(buildName(name), image)

                map.addSource(buildName(name), {
                    'type': 'geojson',
                    'data': {
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [longitude, latitude]
                        },
                        'type': 'Feature'
                    }
                })

                map.addLayer({
                    'id': buildName(name),
                    'type': 'symbol',
                    'source': buildName(name),
                    'layout': {
                        'icon-image': buildName(name),
                        'icon-size': 1.0,
                        'icon-allow-overlap': true
                    }
                })
                if (onDrag) {
                    const canvas = map.getCanvasContainer()

                    const onMove = e => {
                        const coords = e.lngLat
                        canvas.style.cursor = 'grabbing'
                        onDrag([coords.lng, coords.lat])
                    }

                    const onUp = e => {
                        canvas.style.cursor = ''
                        map.off('mousemove', onMove);
                        map.off('touchmove', onMove);
                    }

                    map.on('mouseenter', buildName(name), () => {
                        canvas.style.cursor = 'move'
                    })

                    map.on('mouseleave', buildName(name), () => {
                        canvas.style.cursor = ''
                    })

                    map.on('mousedown', buildName(name), e => {
                        e.preventDefault()
                        canvas.style.cursor = 'grab'
                        map.on('mousemove', onMove)
                        map.once('mouseup', onUp)
                    })

                    map.on('touchstart', buildName(name), e => {
                        if (e.points.length !== 1) return
                        e.preventDefault()
                        map.on('touchmove', onMove)
                        map.once('touchend', onUp)
                    })
                }
                map.moveLayer(buildName(name))

                if (clickText) {
                    map.on('click', buildName(name), () => {
                        setDisplaySnackbar(true)
                    })
                }

                setReady(true)
            })
        }
    }, [map])

    useEffect(() => {
        if (!ready) {
            return
        }
        map.getSource(buildName(name)).setData({
            'geometry': {
                'type': 'Point',
                'coordinates': [longitude, latitude]
            },
            'type': 'Feature'
        })
    }, [longitude, latitude, ready])

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

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setDisplaySnackbar(false)
    }

    const result = clickText ? <Snackbar
        open={displaySnackbar}
        autoHideDuration={1500}
        onClose={handleClose}
        message={clickText}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
    /> : null

    return result
}

export default Marker