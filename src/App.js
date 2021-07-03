import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import axios from 'axios'

import timespace from '@mapbox/timespace'

import IconButton from '@material-ui/core/IconButton'
import ShowChartIcon from '@material-ui/icons/ShowChart'
import ListIcon from '@material-ui/icons/List'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import Snackbar from '@material-ui/core/Snackbar'
import Box from '@material-ui/core/Box'
import Tooltip from '@material-ui/core/Tooltip'

import Plots from './Plots'
import Chips from './Chips'
import Map from './Map'
import MapTrace from './MapTrace'
import Stations from './Stations'
import ListFlights from './ListFlights'

const dataUrl = 'https://api.ballometer.io/'

const getInitialData = (
    setData,
    setIndex,
    setLoading,
    informUser,
    username,
    flightId
) => {

    const flightIdQuery = flightId ? `&flightId=${flightId}` : ''
    const url = `${dataUrl}read/points?username=${username}${flightIdQuery}`

    axios.get(url)
        .then(res => {
            const dataIn = res.data

            if (dataIn.time.length === 0) {
                setLoading(false)
                informUser('The flight you are looking for was not found.')
                return
            }

            const removeNulls = (values, alternative) => {

                const result = values.map((value, index) => {
                    if (value) {
                        return value
                    }
                    else {
                        const next = values.slice(index).find(v => v)
                        if (next) {
                            return next
                        }
                        else {
                            const previous = values.slice(0, index).reverse().find(v => v)
                            if (previous) {
                                return previous
                            }
                            else {
                                return null
                            }
                        }
                    }
                })

                if (result.every(e => e === null)) {
                    return result.map(_ => alternative)
                }
                else {
                    return result
                }
            }

            setData({
                altitude: removeNulls(dataIn.altitude, 0.0),
                speed: removeNulls(dataIn.speed, 0.0),
                heading: removeNulls(dataIn.heading, 0.0),
                climb: removeNulls(dataIn.climb, 0.0),
                time: dataIn.time,
                longitude: removeNulls(dataIn.longitude, 8.55301),
                latitude: removeNulls(dataIn.latitude, 47.35257),
            })
            setIndex(dataIn.time.length - 1)
            setLoading(false)
        })
        .catch(err => {
            setLoading(false)
            informUser('The flight you are looking for was not found.')
            console.log(err)
        })
}

const getNow = (setNow, username) => {
    const url = `${dataUrl}read/now?username=${username}`
    axios.get(url)
        .then(res => {
            setNow(res.data)
        })
        .catch(err => {
            console.log(err)
        })
}

const App = () => {

    const { username, flightId } = useParams()

    const [viewportHeight, setViewportHeight] = useState(window.innerHeight)
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth)

    const [data, setData] = useState({
        altitude: [0],
        speed: [0],
        heading: [0],
        climb: [0],
        time: [Date.now() * 1e-3],
        longitude: [8.55301],
        latitude: [47.35257],
    })

    const points = data.longitude.map((value, index) => {
        return [value, data.latitude[index]]
    })

    const [now, setNow] = useState(null)

    const [index, setIndex] = useState(0)

    const [displayPlots, setDisplayPlots] = useState(false)
    const [displayListFlights, setDisplayListFlights] = useState(false)

    const [nowIntervalId, setNowIntervalId] = useState(null)

    const [loading, setLoading] = useState(true)

    const [displaySnackbar, setDisplaySnackbar] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')

    const [map, setMap] = useState(null)

    const handleSnackbarClose = () => setDisplaySnackbar(false)

    const informUser = message => {
        setSnackbarMessage(message)
        setDisplaySnackbar(true)
    }

    const fuzzy = timespace.getFuzzyLocalTimeFromPoint(
        data.time[index] * 1000, [data.longitude[index], data.latitude[index]])
    const utcOffset = fuzzy ? fuzzy.utcOffset() : 0.0

    useEffect(() => {
        const handleResize = () => {
            setViewportHeight(window.innerHeight)
            setViewportWidth(document.getElementById('root').clientWidth)
        }
        window.addEventListener('resize', handleResize)
        handleResize()
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        getInitialData(setData, setIndex, setLoading, informUser, username, flightId)
    }, [])

    useEffect(() => {
        if (flightId) {
            return
        }
        const interval = setInterval(() => {
            getNow(setNow, username)
        }, 1000)
        setNowIntervalId(interval)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (!now) {
            return
        }

        const secondsSince = unixtime => {
            return (new Date() - new Date(unixtime / 1e-3)) * 1e-3
        }

        if (nowIntervalId && (secondsSince(now.time) > 3600)) {
            // Last time someone wrote to the server was more 
            // than 1 hour ago. Let\'s assume the flight is over.
            clearInterval(nowIntervalId)
            return
        }

        const replaceNull = (field, data, now) => {
            return now[field] ? now[field] : data[field].slice(-1)[0]
        }

        const lengthBefore = data.time.length

        setData({
            altitude: [...data.altitude, replaceNull('altitude', data, now)],
            speed: [...data.speed, replaceNull('speed', data, now)],
            heading: [...data.heading, replaceNull('heading', data, now)],
            climb: [...data.climb, replaceNull('climb', data, now)],
            time: [...data.time, now.time],
            longitude: [...data.longitude, replaceNull('longitude', data, now)],
            latitude: [...data.latitude, replaceNull('latitude', data, now)]
        })

        if (index === lengthBefore - 1) {
            setIndex(index => index + 1)
        }
    }, [now])

    useEffect(() => {
        if (!loading) {
            map.fitBounds([
                [data.longitude[0], data.latitude[0]],
                [data.longitude.slice(-1).pop(), data.latitude.slice(-1).pop()]
            ],  {
                padding: 50,
                maxZoom: 14,
            })
        }
    }, [loading])

    return (
        <div>
            <Map
                viewportWidth={viewportWidth}
                viewportHeight={viewportHeight}
                centerLongitude={data.longitude[index]}
                centerLatitude={data.latitude[index]}
                shareMap={setMap}
                trackBalloon={() => {
                    setIndex(data.time.length - 1)
                    map.setCenter([
                        data.longitude.slice(-1).pop(), 
                        data.latitude.slice(-1).pop()
                    ])
                }}
            />

            <MapTrace
                map={map}
                name="balloon"
                points={points}
                speed={data.speed}
                heading={data.heading}
                index={index}
                callbackIndex={setIndex}
                color="#3498db"
                historyVisible={true}
                imagePath="/balloon.png"
                loading={loading}
            />


            <Stations map={map} />

            <Chips
                speed={data.speed[index]}
                heading={data.heading[index]}
                altitude={data.altitude[index]}
                climb={data.climb[index]}
                time={data.time[index]}
                utcOffset={utcOffset}
            />

            <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                padding: 10
            }}>
                <Box display="flex" flexDirection="column" alignItems="flex-start">
                    <Box display="flex">
                        <Tooltip title="Plots" placement="right">
                            <IconButton onClick={() => {
                                setDisplayPlots(true)
                            }}>
                                <ShowChartIcon />
                            </IconButton>
                        </Tooltip>
                        {displayPlots && <CircularProgress size={50} m={1} />}
                    </Box>
                    <Tooltip title="List Flights" placement="right">
                        <IconButton onClick={() => setDisplayListFlights(true)}>
                            <ListIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </div>

            {displayPlots &&
                <Plots
                    handleClose={() => setDisplayPlots(false)}
                    viewportHeight={viewportHeight}
                    viewportWidth={viewportWidth}
                    data={data}
                    styles={[
                        {
                            id: 'altitude',
                            title: 'Altitude (m)',
                            valueSuffix: ' m',
                            valueDecimals: 0,
                            color: '#1250b0',
                            scaling: 1.0
                        },
                        {
                            id: 'speed',
                            title: 'Speed (km/h)',
                            valueSuffix: ' km/h',
                            valueDecimals: 1,
                            color: '#a352cc',
                            scaling: 3.6
                        },
                        {
                            id: 'heading',
                            title: 'Heading (°)',
                            valueSuffix: '°',
                            valueDecimals: 0,
                            color: '#19730e',
                            scaling: 1.0
                        },
                        {
                            id: 'climb',
                            title: 'Climb (m/s)',
                            valueSuffix: ' m/s',
                            valueDecimals: 1,
                            color: '#f2cc0c',
                            scaling: 1.0
                        }
                    ]}
                    index={index}
                    callbackIndex={setIndex}
                    utcOffset={utcOffset}
                />
            }

            {displayListFlights &&
                <ListFlights
                    handleClose={() => setDisplayListFlights(false)}
                    viewportHeight={viewportHeight}
                    viewportWidth={viewportWidth}
                    dataUrl={dataUrl}
                />
            }

            <Snackbar
                open={displaySnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            />

            <Backdrop open={loading} style={{
                zIndex: 1000,
                color: '#fff'
            }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    )
}

export default App

