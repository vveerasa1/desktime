import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography,
    Box
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const AddTeamModal = ({ open, handleClose }) => {
    const [teamName, setTeamName] = React.useState('');

    const handleCreate = () => {
        // Add your team creation logic here
        console.log('Creating team:', teamName);
        handleClose(); // Close modal after creation
    };

    // The "Create" button is disabled if there's no team name
    const isCreateDisabled = teamName.trim() === '';

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 2, // Rounded corners for the dialog
                },
            }}
        >
            {/* Custom Title Bar */}
            <DialogTitle
                sx={{
                    bgcolor: '#4caf50', // A standard green color
                    color: 'common.white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.5,
                    px: 2,
                }}
            >
                <Typography variant="h6" component="div" fontWeight="bold">
                    Add new team
                </Typography>
                <IconButton onClick={handleClose} sx={{ color: 'common.white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {/* Content */}
            <DialogContent sx={{ pt: '20px !important', pb: 1 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    Type team name
                </Typography>
                <TextField
                    autoFocus
                    margin="dense"
                    id="team-name"
                    fullWidth
                    variant="outlined"
                    placeholder="Team"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                />
            </DialogContent>

            {/* Actions */}
            <DialogActions sx={{ p: 2 }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    sx={{
                        textTransform: 'none',
                        borderColor: 'grey.400',
                        color: 'text.primary',
                        mr: 1,
                    }}
                >
                    Close
                </Button>
                <Button
                    onClick={handleCreate}
                    variant="contained"
                    disabled={isCreateDisabled}
                    sx={{
                        textTransform: 'none',
                        // Style for the disabled state to match the image
                        '&.Mui-disabled': {
                            backgroundColor: 'grey.300',
                            color: 'grey.500',
                        },
                    }}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddTeamModal;
