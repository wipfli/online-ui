import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

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

    const { username } = useParams()

    const [flights, setFlights] = useState([])

    useEffect(() => {
        axios.get(dataUrl + '/api/read/listFlights?username=' + username)
            .then(res => {
                setFlights(res.data.sort((a, b) => {
                    return Number(a.flight_id) > Number(b.flight_id) ? -1 : 1
                }))
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
                    {flights.map((flight, index) => {
                        return (
                            <ListItemLink key={index} href={'/' + username + '/' + flight.flight_id}>
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