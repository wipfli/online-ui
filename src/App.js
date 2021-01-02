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
import ListFlights from './ListFlights'

const tileserverUrl = 'https://ballometer.io/tiles/'

const dataUrl = ''

const getInitialData = (
    setData, 
    setIndex, 
    setLoading, 
    informUser, 
    username, 
    flightId
) => {

    const url = dataUrl + '/api/read/points?username=' + username 
        + (flightId ? '&flightId=' + flightId : '')


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
    axios.get(dataUrl + '/api/read/now?username=' + username)
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
    const [now, setNow] = useState(null)

    const [index, setIndex] = useState(0)

    const [displayPlots, setDisplayPlots] = useState(false)
    const [displayListFlights, setDisplayListFlights] = useState(false)

    const [nowIntervalId, setNowIntervalId] = useState(null)

    const [loading, setLoading] = useState(true)

    const [gpsFix, setGpsFix] = useState(false)

    const [displaySnackbar, setDisplaySnackbar] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')

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
            setViewportWidth(window.innerWidth)
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

        if (!now.recording && nowIntervalId) {
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

        if (now.longitude) {
            setGpsFix(true)
        }

        if (index === lengthBefore - 1) {
            setIndex(index => index + 1)
        }
    }, [now])

    return (
        <div>
            <Map
                viewportWidth={viewportWidth}
                viewportHeight={viewportHeight}
                tileserverUrl={tileserverUrl}
                data={data}
                index={index}
                callbackIndex={setIndex}
                loading={loading}
                gpsFix={gpsFix}
            />

            <Chips
                speed={data.speed[index]}
                heading={data.heading[index]}
                altitude={data.altitude[index]}
                climb={data.climb[index]}
                time={data.time[index]}
                utcOffset={utcOffset}
            />

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

            {!displayPlots && !displayListFlights && <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                padding: 10
            }}>
                <Box display="flex" flexDirection="column">
                    <Tooltip title="Plots" placement="right">
                        <IconButton onClick={() => setDisplayPlots(true)}>
                            <ShowChartIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="List Flights" placement="right">
                        <IconButton onClick={() => setDisplayListFlights(true)}>
                            <ListIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </div>}

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

