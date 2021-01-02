import { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'

import Skeleton from '@material-ui/lab/Skeleton'
import Box from '@material-ui/core/Box'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import Side from './Side'

const ListItemLink = props => {
    return <ListItem button component="a" {...props} />
}

const ListFlights = ({
    handleClose,
    viewportHeight,
    viewportWidth,
    dataUrl
}) => {

    const [flights, setFlights] = useState([])

    useEffect(() => {
        axios.get(dataUrl + '/store/listFlights')
            .then(res => {
                setFlights(res.data)
            })
            .catch(err => {
                console.log('ListFlights error')
                console.log(err)
            })
    }, [])

    return (
        <Side
            title="List Flights"
            viewportWidth={viewportWidth}
            viewportHeight={viewportHeight}
            handleClose={handleClose}
        >
            <Box p={1}>
                {flights.length === 0 && <div>
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                </div>}
                <List component="nav">
                    {flights.reverse().map((flight, index) => {
                        return (
                            <ListItemLink key={index} href={'?flightId=' + flight.flight_id}>
                                <ListItemText>
                                    {moment(flight.start * 1000).format('D.M.YYYY') +
                                    ', flight ' + flight.flight_id}
                                </ListItemText>
                            </ListItemLink>
                        )
                    })}
                </List>
            </Box>
        </Side>
    )
}

export default ListFlights