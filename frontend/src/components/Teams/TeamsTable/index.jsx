import React, { useState } from 'react';
import {
    Box,
    Checkbox,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
    Tooltip,
    Typography,
    Menu,
    MenuItem
} from '@mui/material';
import { Delete as DeleteIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';

// Toolbar that appears when items are selected
const TableToolbar = ({ numSelected }) => (
    <Toolbar
        sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            bgcolor: 'primary.darker',
            color: 'common.white',
            borderRadius: 1,
            ...(numSelected <= 0 && {
                display: 'none',
            }),
        }}
    >
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
            {numSelected} Teams selected
        </Typography>
        <Tooltip title="Delete">
            <IconButton>
                <DeleteIcon sx={{ color: 'common.white' }} />
            </IconButton>
        </Tooltip>
    </Toolbar>
);

const TeamsTable = ({ teams, selected, onSelectAll, onSelectOne }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentItemId, setCurrentItemId] = useState(null);

    const handleMenuClick = (event, id) => {
        setAnchorEl(event.currentTarget);
        setCurrentItemId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setCurrentItemId(null);
    };

    return (
        <Paper sx={{ width: '100%', mb: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
            <TableToolbar numSelected={selected.length} />
            {/* The "Select All" bar is custom to match the screenshot */}
            <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}>
                <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < teams.length}
                    checked={teams.length > 0 && selected.length === teams.length}
                    onChange={onSelectAll}
                    inputProps={{ 'aria-label': 'select all teams' }}
                />
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Select all</Typography>
            </Box>
            <TableContainer>
                <Table sx={{ minWidth: 750 }}>
                    <TableHead>
                        <TableRow>
                            {/* Empty cell for checkbox padding */}
                            <TableCell padding="checkbox" /> 
                            <TableCell>Name</TableCell>
                            <TableCell>Team members</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Edit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {teams.map((row) => {
                            const isItemSelected = selected.indexOf(row.id) !== -1;
                            return (
                                <TableRow
                                    hover
                                    onClick={(event) => onSelectOne(event, row.id)}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.id}
                                    selected={isItemSelected}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={isItemSelected}
                                            inputProps={{ 'aria-labelledby': `team-table-checkbox-${row.id}` }}
                                        />
                                    </TableCell>
                                    <TableCell component="th" id={`team-table-checkbox-${row.id}`} scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell>{row.teamMembers}</TableCell>
                                    <TableCell>
                                        {new Date(row.created).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric', year: 'numeric'
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            aria-label="edit team"
                                            onClick={(event) => {
                                                event.stopPropagation(); // Prevent row selection
                                                handleMenuClick(event, row.id);
                                            }}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Menu for Edit Actions */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleMenuClose}>Edit Name</MenuItem>
                <MenuItem onClick={handleMenuClose}>Manage Members</MenuItem>
                <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>Delete Team</MenuItem>
            </Menu>
        </Paper>
    );
};

export default TeamsTable;