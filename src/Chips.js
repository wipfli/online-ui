import React from 'react'

import moment from 'moment'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

const Chips = ({speed, heading, altitude, climb, time, utcOffset}) => {
    return (
        <div style={{
            position: 'absolute',
            right: 10,
            bottom: 10,
            pointerEvents: 'none'
        }}>
            <Box 
                flexDirection="row" 
                display="flex" 
                flexWrap="wrap-reverse" 
                justifyContent="flex-end" 
                alignContent="center"
            >
                <Box p={1}>
                    <Paper>
                        <Box textAlign="center" mx={1} pt={0.5} style={{minWidth: '9ch'}}>
                            {(3.6 * speed).toFixed(1)} km/h
                        </Box>
                        <Box textAlign="center" mx={1}>
                            <Typography variant="overline">SPEED</Typography>
                        </Box>
                    </Paper>
                </Box>
                <Box p={1}>
                    <Paper>
                        <Box textAlign="center" mx={1} pt={0.5}>
                            {heading.toFixed(0)}°
                        </Box>
                        <Box textAlign="center" mx={1}>
                            <Typography variant="overline">HEADING</Typography>
                        </Box>
                    </Paper>
                </Box>
                <Box p={1}>
                    <Paper>
                        <Box textAlign="center" mx={1} pt={0.5}>
                            {altitude.toFixed(0)} m
                        </Box>
                        <Box textAlign="center" mx={1}>
                            <Typography variant="overline">ALTITUDE</Typography>
                        </Box>
                    </Paper>
                </Box>
                <Box p={1}>
                    <Paper>
                        <Box textAlign="center" mx={1} pt={0.5} style={{minWidth: '7ch'}}>
                            {climb.toFixed(1)} m/s
                        </Box>
                        <Box textAlign="center" mx={1}>
                            <Typography variant="overline">CLIMB</Typography>
                        </Box>
                    </Paper>
                </Box>
                <Box p={1}>
                    <Paper>
                        <Box textAlign="center" mx={1} pt={0.5} style={{minWidth: '7ch'}}>
                            {moment(time * 1000).utcOffset(utcOffset).format('HH:mm')}
                        </Box>
                        <Box textAlign="center" mx={1}>
                            <Typography variant="overline">TIME</Typography>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </div>
    )
}

export default Chips