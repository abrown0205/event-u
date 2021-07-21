import React from 'react';
import { Snackbar, makeStyles } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
    root: {
        top: theme.spacing(9)
    }
}))


function Notification(props) {
    const { notify, setNotify } = props;
    const classes = useStyles();

    const  handleClose = (event, reason) => {
        setNotify({
            ...notify,
            isOpen: false
        })
    }

    return (
        <Snackbar
            className={classes.root}

            // Only display of isOpen is set to true
            open={notify.isOpen}

            // Notification will be displayed for 3s
            autoHideDuration={3000}

            // Changes the position where the notification is displayed
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}

            // Displays an option for closing the notification
            onClose={handleClose}
        >
            <Alert
                // The severity level will determine the color of the notification that appears 
                severity={notify.type}

                // Displays option to close the alert
                onClose={handleClose}
            >
                {/* Displays the message in the alert box */}
                {notify.message}
            </Alert>
        </Snackbar>
    )



}

export default Notification;