import React, { useState } from "react";
import styles from '../../pages/TeamMembers/index.module.css'
import { Box, Button, Stack, Typography, IconButton } from "@mui/material";
import CustomSearchInput from "../../components/CustomSearchInput";
import FilterListIcon from "@mui/icons-material/FilterList";
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const TeamMembers = () => {
    const [activeTab, setActiveTab] = useState('tab1');
    return (
        <Box sx={{ p: 2, margin: "auto" }}>
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
                    <Typography variant="h5" component="h1" fontWeight="bold">
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
                            <Button variant="" onClick={() => setActiveTab('tab1')} className={activeTab === 'tab1' ? 'active' : ''}>
                                <Typography variant="h4" className={styles.tabHeadingTexts}>
                                    Employees
                                </Typography>
                                <Typography variant="h4" className={styles.tabHeadingCount}>
                                    34
                                </Typography>
                            </Button>
                            <Button variant="" onClick={() => setActiveTab('tab2')} className={activeTab === 'tab2' ? 'active' : ''}>
                                <Typography variant="h4" className={styles.tabHeadingTexts}>
                                    Working
                                </Typography>
                                <Typography variant="h4" className={styles.tabHeadingCount}>
                                    0
                                </Typography>
                            </Button>
                            <Button variant="" onClick={() => setActiveTab('tab3')} className={activeTab === 'tab3' ? 'active' : ''}>
                                <Typography variant="h4" className={styles.tabHeadingTexts}>
                                    Slacking
                                </Typography>
                                <Typography variant="h4" className={styles.tabHeadingCount}>
                                    0
                                </Typography>
                            </Button>
                            <Button variant="" onClick={() => setActiveTab('tab3')} className={activeTab === 'tab3' ? 'active' : ''}>
                                <Typography variant="h4" className={styles.tabHeadingTexts}>
                                    Absent
                                </Typography>
                                <Typography variant="h4" className={styles.tabHeadingCount}>
                                    34
                                </Typography>
                            </Button>
                            <Button variant="" onClick={() => setActiveTab('tab3')} className={activeTab === 'tab3' ? 'active' : ''}>
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
                                <Box>Content for Tab 1</Box>
                            }
                            {activeTab === 'tab2' && 
                                <Box>Content for Tab 2</Box>
                            }
                            {activeTab === 'tab3' && 
                                <Box>Content for Tab 3</Box>
                            }
                        </Box>
                    </Box>
                </Box>
            </Stack>
        </Box>
    );
};

export default TeamMembers;