import React, { useState } from "react";
import styles from '../../pages/TeamMembers/index.module.css'
import { Box, Button, Stack, Typography, IconButton } from "@mui/material";
import CustomSearchInput from "../../components/CustomSearchInput";
import FilterListIcon from "@mui/icons-material/FilterList";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { Link } from 'react-router-dom'

import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar
} from '@mui/material';

const rows = [
    { name: 'Aakash C', dept: 'Edumpus - QA' },
    { name: 'Aarif', dept: 'IT' },
    { name: 'Akash Poovan', dept: 'IT Pentabay' },
    { name: 'Avinesh', dept: 'IT Pentabay' },
];

const columns = [
    'Name', 'Status', 'Productive time', 'Offline time', 'DeskTime',
    'Arrived at', 'Left at', 'At work', 'Active app', 'Active project'
];

const TeamMembers = () => {
    const [activeTab, setActiveTab] = useState('tab1');
    return (
        <Box sx={{ width: '100%' }}>
            <Stack spacing={3}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        mb: 2,
                    }}
                >
                    {/* Left-aligned Title */}
                    <Typography className={styles.pageHeading} variant="h1">
                        Team Members
                    </Typography>
                    {/* Right-aligned controls */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <CustomSearchInput />

                        <IconButton size="small">
                            <FilterListIcon fontSize="medium" />
                        </IconButton>

                        <Button
                            variant="contained"
                            sx={{ textTransform: "none", whiteSpace: "nowrap", px: 1, backgroundColor: "#1564bf", width: '100%' }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <GroupAddIcon />
                                Add Team Members
                            </Box>

                        </Button>
                    </Box>

                    {/* tabs */}
                    <Box className={styles.tabsContainer}>
                        <Box className={styles.tabButtons}>
                            <Button variant="" onClick={() => setActiveTab('tab1')} className={`${styles.tabButton} ${activeTab === 'tab1' ? styles.active : ''}`}>
                                <Typography variant="h4" className={styles.tabHeadingTexts}>
                                    Employees
                                </Typography>
                                <Typography variant="h4" className={styles.tabHeadingCount}>
                                    34
                                </Typography>
                            </Button>
                            <Button variant="" onClick={() => setActiveTab('tab2')} className={`${styles.tabButton} ${activeTab === 'tab2' ? styles.active : ''}`}>
                                <Typography variant="h4" className={styles.tabHeadingTexts}>
                                    Working
                                </Typography>
                                <Typography variant="h4" className={styles.tabHeadingCount}>
                                    0
                                </Typography>
                            </Button>
                            <Button variant="" onClick={() => setActiveTab('tab3')} className={`${styles.tabButton} ${activeTab === 'tab3' ? styles.active : ''}`}>
                                <Typography variant="h4" className={styles.tabHeadingTexts}>
                                    Slacking
                                </Typography>
                                <Typography variant="h4" className={styles.tabHeadingCount}>
                                    0
                                </Typography>
                            </Button>
                            <Button variant="" onClick={() => setActiveTab('tab4')} className={`${styles.tabButton} ${activeTab === 'tab4' ? styles.active : ''}`}>
                                <Typography variant="h4" className={styles.tabHeadingTexts}>
                                    Absent
                                </Typography>
                                <Typography variant="h4" className={styles.tabHeadingCount}>
                                    34
                                </Typography>
                            </Button>
                            <Button variant="" onClick={() => setActiveTab('tab5')} className={`${styles.tabButton} ${activeTab === 'tab5' ? styles.active : ''}`}>
                                <Typography variant="h4" className={styles.tabHeadingTexts}>
                                    Late
                                </Typography>
                                <Typography variant="h4" className={styles.tabHeadingCount}>
                                    0
                                </Typography>
                            </Button>
                        </Box>

                        <Box className={styles.tabContent}>
                            {activeTab === 'tab1' &&
                                <TableContainer className={styles.tabContentWrapper} component={Paper}>
                                    <Table className={styles.teamTable}>
                                        <TableHead className={styles.tHead}>
                                            <TableRow className={styles.tHeadRow}>
                                                {columns.map((col, index) => (
                                                    <TableCell className={styles.tHeadSell} key={index}>
                                                        {col}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.map((row, idx) => (
                                                <TableRow key={idx} className={styles.tBodyRow} 
                                                sx={{ backgroundColor: idx % 2 === 0 ? '#f4f4f4' : '#ffffff' }}>
                                                    <TableCell className={styles.tBodyCell}>
                                                        <Box className={styles.tPersonInfo}>
                                                            <Avatar className={styles.tPersonAvatar}>
                                                                {row.name.charAt(0)}
                                                            </Avatar>
                                                            <Box>
                                                                <Link className={styles.tPersonName} to="/">{row.name}</Link>
                                                                <Typography className={styles.tPersonDept}>{row.dept}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    {/* Empty cells to match "-" look */}
                                                    {[...Array(columns.length - 1)].map((_, i) => (
                                                        <TableCell className={styles.tBodyCell} key={i}>-</TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            }
                            {activeTab === 'tab2' &&
                                <Box className={styles.tabContentWrapper}>
                                    <Box className={styles.noMenbersBox}>
                                        <Typography variant="h3">
                                            No team members are currently working
                                        </Typography>
                                        <Typography variant="body2">
                                            To see all team members, clear the filters and switch to the Employees tab.
                                        </Typography>
                                    </Box>
                                </Box>
                            }
                            {activeTab === 'tab3' &&
                                <Box className={styles.tabContentWrapper}>
                                    <Box className={styles.noMenbersBox}>
                                        <Typography variant="h3">
                                            No team members are currently working
                                        </Typography>
                                        <Typography variant="body2">
                                            To see all team members, clear the filters and switch to the Employees tab.
                                        </Typography>
                                    </Box>
                                </Box>
                            }
                            {activeTab === 'tab4' &&
                                <Box className={styles.tabContentWrapper}>
                                    <Box className={styles.noMenbersBox}>
                                        <Typography variant="h3">
                                            No team members are currently working
                                        </Typography>
                                        <Typography variant="body2">
                                            To see all team members, clear the filters and switch to the Employees tab.
                                        </Typography>
                                    </Box>
                                </Box>
                            }
                            {activeTab === 'tab5' &&
                                <Box className={styles.tabContentWrapper}>
                                    <Box className={styles.noMenbersBox}>
                                        <Typography variant="h3">
                                            No team members are currently working
                                        </Typography>
                                        <Typography variant="body2">
                                            To see all team members, clear the filters and switch to the Employees tab.
                                        </Typography>
                                    </Box>
                                </Box>
                            }
                        </Box>
                    </Box>
                </Box>
            </Stack>
        </Box>
    );
};

export default TeamMembers;