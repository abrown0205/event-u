import React from 'react';
import { Dialog, DialogActions, DialogTitle, DialogContent, Typography, makeStyles } from '@material-ui/core';
import './css/confirmdelete.css';

const useStyles = makeStyles(theme => ({
    dialog: {
        padding: theme.spacing(2),
        position: 'absolute',
        top: theme.spacing(5)
    },
    dialogContent: {
        textAlign: 'center'
    },
    dialogAction: {
        justifyContent: 'center'
    }
}))

function ConfirmDialog(props) {
    
    const { confirmDialog, setConfirmDialog } = props;
    const classes = useStyles()

    return (
        <Dialog
            open={confirmDialog.isOpen}
            classes={{ paper: classes.dialog }}
        >
            <DialogTitle>

            </DialogTitle>
            <DialogContent>
                <Typography variant="h6">
                    {confirmDialog.title}
                </Typography>
                <Typography variant="subtitle2">
                    {confirmDialog.subtitle}
                </Typography>
            </DialogContent>
            <DialogActions>
                <button 
                    className="dialog-btn" 
                    id="cancel-btn" 
                    onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                    >
                        Cancel
                    </button>
                <button 
                    className="dialog-btn" 
                    id="ok-btn"
                    onClick = {confirmDialog.onConfirm}
                    >
                        Ok
                    </button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDialog;