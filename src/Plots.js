import { useState, useEffect } from 'react'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import Side from './Side'

const highlight = timestamp => {
    Highcharts.charts.forEach(chart => {
        if (chart && chart.series[0] && chart.series[0].points) {
            chart.series[0].points.forEach(point => {
                if (point.x === timestamp) {
                    point.onMouseOver()
                }
            })
        }
    })
}

const handleHover = e => {
    Highcharts.charts.forEach(chart => {
        if (chart) {
            const event = chart.pointer.normalize(e)
            const point = chart.series[0].searchPoint(event, true)
            if (point) {
                point.highlight(e)
            }
        }
    })
}

Highcharts.Point.prototype.highlight = function (event) {
    event = this.series.chart.pointer.normalize(event)
    this.onMouseOver()
}

Highcharts.Pointer.prototype.reset = () => undefined

function syncExtremes(e) {
    const thisChart = this.chart
    if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
        Highcharts.charts.forEach(chart => {
            if (chart && chart !== thisChart) {
                if (chart.xAxis[0].setExtremes) { // It is null while updating
                    chart.xAxis[0].setExtremes(
                        e.min,
                        e.max,
                        undefined,
                        false,
                        { trigger: 'syncExtremes' }
                    )
                }
            }
        })
    }
}

const getOptions = (
    data,
    title,
    valueSuffix,
    valueDecimals,
    color,
    callbackHover,
    utcOffset
) => {
    return {
        credits: false,
        chart: {
            zoomType: 'x',
            marginLeft: 50,
            height: 250,
            width: null,
            spacingTop: 20,
            spacingBottom: 20
        },
        title: {
            text: title,
            align: 'left',
            margin: 0,
            x: 50
        },
        xAxis: {
            type: 'datetime',
            events: {
                setExtremes: syncExtremes
            }
        },
        yAxis: {
            gridLineWidth: null,
            lineWidth: 1,
            tickWidth: 1,
            title: null
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                marker: {
                    radius: 0
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        tooltip: {
            positioner: function () {
                return {
                    x: this.chart.chartWidth - this.label.width - 5,
                    y: 10
                };
            },
            formatter: function () {
                callbackHover(this.x)
                return this.y.toFixed(valueDecimals) + valueSuffix
            },
            borderWidth: 0,
            backgroundColor: 'none',
            pointFormat: '{point.y}',
            headerFormat: '',
            shadow: false,
            style: {
                fontSize: '18px'
            }
        },
        series: [{
            type: 'area',
            data: data,
            color: color,
            fillOpacity: 0.1
        }],
        time: {
            timezoneOffset: -utcOffset
        }
    }
}

const toMilliseconds = timestamp => 1000.0 * timestamp
const fromMilliseconds = timestamp => timestamp / 1000.0

const Plots = ({
    handleClose,
    viewportHeight,
    viewportWidth,
    data,
    styles,
    index,
    callbackIndex,
    utcOffset
}) => {

    const zippedData = Object.assign({}, ...styles.map(x => {
        return ({
            [x.id]: data.time.map((time, i) => [toMilliseconds(time), x.scaling * data[x.id][i]])
        })
    }))

    const [myIndex, setMyIndex] = useState(index)
    const [myMaxIndex, setMyMaxIndex] = useState(data.altitude.length - 1)

    const [timestamp, setTimestamp] = useState(null)

    const [optionsCounter, setOptionsCounter] = useState(0)

    const [options, setOptions] = useState(
        styles.map(style => {
            return getOptions(
                zippedData[style.id],
                style.title,
                style.valueSuffix,
                style.valueDecimals,
                style.color,
                setTimestamp,
                utcOffset
            )
        })
    )

    useEffect(() => {
        const tmpIndex = data.time.indexOf(fromMilliseconds(timestamp))
        if (tmpIndex > -1 && tmpIndex !== myIndex) {
            callbackIndex(tmpIndex)
            setMyIndex(tmpIndex)
        }
    }, [timestamp])

    useEffect(() => {
        if (myIndex !== index) {
            setMyIndex(index)
            highlight(toMilliseconds(data.time[index]))
        }
    }, [index])

    useEffect(() => {
        if (index === data.altitude.length - 1 || myIndex === myMaxIndex) {
            setOptions(styles.map(style => ({
                series: {
                    data: zippedData[style.id]
                }
            })))
            setOptionsCounter(optionsCounter => optionsCounter + 1)
            setMyMaxIndex(data.altitude.length - 1)
            callbackIndex(data.altitude.length - 1)
        }
    }, [data])

    useEffect(() => {
        highlight(toMilliseconds(data.time[index]))
    }, [optionsCounter])

    return (
        <Side
            title="Plots"
            viewportWidth={viewportWidth}
            viewportHeight={viewportHeight}
            handleClose={handleClose}
        >
            <div
                onMouseMove={handleHover}
                onTouchMove={handleHover}
                onTouchStart={handleHover}
            >
                {
                    options.map((option, i) => {
                        return <HighchartsReact
                            highcharts={Highcharts}
                            options={option}
                            key={i}
                        />
                    })
                }
            </div>
        </Side>
    )
}

export default Plots