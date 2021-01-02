import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'

import './Side.css'

const Side = ({
    title,
    viewportWidth,
    viewportHeight,
    handleClose,
    children
}) => {
    return (
        <div>
            <div
                style={{
                    position: 'absolute',
                    width: (viewportWidth > 355 ? 350 : (viewportWidth - 5)),
                    height: viewportHeight,
                    overflowY: 'auto',
                    boxShadow: '5px 0 10px #AAAAAA',
                    paddingRight: 5,
                    backgroundColor: 'white'
                }}
            >
                <Box display="flex" justifyContent="space-between">
                    <Box p={1}>
                        <Typography variant="h4" gutterBottom>
                            {title}
                        </Typography>
                    </Box>
                    <Box>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    
                </Box>
                {children}
            </div>
        </div>
    )
}

export default Side