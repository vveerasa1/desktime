import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  Typography,
  Tooltip,
  Pagination,
} from '@mui/material';
import styles from './index.module.css';
import InboxIcon from '@mui/icons-material/Inbox';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';

// Mock data (static for demonstration, will be replaced by props)
const staticData = [
  {
    name: 'Harish R',
    team: 'Team Digital',
    time: '16:48 - 17:47',
    date: 'July 1, 2025',
    splits: 4,
    duration: '28m 35s',
    type: 'Productive',
    description: 'discussion with subiksha',
  },
  {
    name: 'Harish R',
    team: 'Team Digital',
    time: '16:20 - 16:40',
    date: 'July 1, 2025',
    splits: 1,
    duration: '19m 56s',
    type: 'Productive',
    description: 'Discussion with hr and rohit',
  },
  {
    name: 'Gokul S',
    team: 'Team Digital',
    time: '15:32 - 15:36',
    date: 'July 1, 2025',
    splits: 1,
    duration: '4m 6s',
    type: 'Productive',
    description: 'discussion with vipin sir',
  },
  {
    name: 'Harish R',
    team: 'Team Digital',
    time: '16:48 - 17:47',
    date: 'July 1, 2025',
    splits: 4,
    duration: '28m 35s',
    type: 'Productive',
    description: 'discussion with subiksha',
  },
  {
    name: 'Harish R',
    team: 'Team Digital',
    time: '16:20 - 16:40',
    date: 'July 1, 2025',
    splits: 1,
    duration: '19m 56s',
    type: 'Productive',
    description: 'Discussion with hr and rohit',
  },
  {
    name: 'Gokul S',
    team: 'Team Digital',
    time: '15:32 - 15:36',
    date: 'July 1, 2025',
    splits: 1,
    duration: '4m 6s',
    type: 'Productive',
    description: 'discussion with vipin sir',
  },
  {
    name: 'Harish R',
    team: 'Team Digital',
    time: '16:48 - 17:47',
    date: 'July 1, 2025',
    splits: 4,
    duration: '28m 35s',
    type: 'Productive',
    description: 'discussion with subiksha',
  },
  {
    name: 'Harish R',
    team: 'Team Digital',
    time: '16:20 - 16:40',
    date: 'July 1, 2025',
    splits: 1,
    duration: '19m 56s',
    type: 'Productive',
    description: 'Discussion with hr and rohit',
  },
  {
    name: 'Gokul S',
    team: 'Team Digital',
    time: '15:32 - 15:36',
    date: 'July 1, 2025',
    splits: 1,
    duration: '4m 6s',
    type: 'Productive',
    description: 'discussion with vipin sir',
  },
];


const OfflineTimesTable = ({ offlineData }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const data = offlineData || staticData;
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      const allIds = paginatedData.map((row) => row._id);
      setSelectedRows(allIds);
    }
  };
  
  const handleSelectRow = (id) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(id)) {
        return prevSelectedRows.filter((rowId) => rowId !== id);
      } else {
        return [...prevSelectedRows, id];
      }
    });
  };

  // Helper function to format duration from seconds to "Xm Ys"
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Helper function to format date from ISO string
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper function to format time
// Helper function to format time
const formatTime = (timeString) => {
  // Add a check to handle undefined or null time strings
  if (!timeString) {
    return 'N/A';
  }
  const [datePart, timePart, ampm] = timeString.split(' ');
  const [hours, minutes] = timePart.split(':');
  return `${hours}:${minutes} ${ampm}`;
};

  return (
    <Box className={styles.container}>
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table size="small" sx={{ tableLayout: 'fixed', minWidth: 650, border: 'none' }}>
          <TableHead className={styles.tableHead}>
            <TableRow className={`${styles.mainRow} ${styles.stickyHeader}`}>
              <TableCell colSpan={5}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography
                    className={styles.selectall}
                    fontWeight={600}
                    color="white"
                    ml={1}
                    onClick={handleSelectAll}
                  >
                    {selectedRows.length === paginatedData.length ? 'Deselect all' : 'Select all'}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell colSpan={2}>
                <Box display="flex" justifyContent="end" alignItems="center">
                  <Typography
                    className={styles.selectall}
                    fontWeight={600}
                    color={selectedRows.length > 0 ? "white" : "gray"}
                    fontSize={'12px'}
                    ml={1}
                  >
                    {selectedRows.length} selected
                  </Typography>
                  <Typography
                    className={styles.selectall}
                    fontWeight={600}
                    fontSize={'12px'}
                    color={selectedRows.length > 0 ? "white" : "gray"}
                    ml={1}
                  >
                    Approve
                  </Typography>
                  <Typography
                    className={styles.selectall}
                    fontWeight={600}
                    fontSize={'12px'}
                    color={selectedRows.length > 0 ? "white" : "gray"}
                    ml={1}
                  >
                    Decline
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div style={{ marginLeft: '10px' }}>Name</div>
              </TableCell>
              <TableCell>
                <div className={styles.primaryHeading}>Time Registered</div>
              </TableCell>
              <TableCell>
                <div className={styles.primaryHeading}>Splits</div>
              </TableCell>
              <TableCell>
                <div className={styles.primaryHeading}>Duration</div>
              </TableCell>
              <TableCell>
                <div className={styles.primaryHeading}>Type</div>
              </TableCell>
              <TableCell>
                <div className={styles.primaryHeading}>Description</div>
              </TableCell>
              <TableCell>
                <div className={styles.primaryHeading}>Approve/Decline</div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={styles.scrollableTableBody} sx={{  overflow: 'auto' }}>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <TableRow key={row._id} className={`${styles.tableRow}`}>
                  <TableCell>
                    <Box sx={{ display: 'flex', justifyContent: 'start', width: '120px' }}>
                      <Checkbox
                        color="primary"
                        checked={selectedRows.includes(row._id)}
                        onChange={() => handleSelectRow(row._id)}
                      />
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: 'underline',
                            textUnderlineOffset: '2px !important',
                            cursor: 'pointer',
                            whiteSpace:"nowrap",
                            fontSize:"13px"
                          }}
                          fontWeight={600}
                        >
                          {row.userId?.username || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {row.userId?.team?.name || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell className={`${styles.rowcell} ${styles.textAlign}`}>
                    <Typography sx={{whiteSpace:"nowrap",
                            fontSize:"13px"

                    }}>
                      {`${formatTime(row.startTime)} - ${formatTime(row.endTime)}`}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {formatDate(row.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell className={`${styles.rowcell}`}>1</TableCell>
                  <TableCell className={`${styles.rowcell}`}>{formatDuration(row.durationInSeconds)}</TableCell>
                  <TableCell className={`${styles.rowcell}`}>
                    <Box className={styles.productive}>{row.productivity}</Box>
                  </TableCell>
                  <TableCell className={`${styles.rowcell} ${styles.textAlign}`}>{row.description}</TableCell>
                  <TableCell className={`${styles.rowcell}`}>
                    <Box className={styles.lastcell}>
                      <Tooltip title="Approve">
                        <Button className={styles.approveBtn} size="small">
                          <CheckCircleOutlineIcon fontSize="small" color="success" />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Decline">
                        <Button className={styles.declineBtn} size="small" color="error">
                          <CancelIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8}>
                  <Box className={styles.noDataContainer}>
                    <InboxIcon className={styles.noDataIcon} />
                    <Typography variant="h6" className={styles.noDataText}>
                      No Data Found
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" my={2} className={styles.paginationWrapper}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          color="primary"
          classes={{ ul: styles.paginationUl, root: styles.paginationRoot }}
          sx={{
            '& .MuiPaginationItem-root': {
              minWidth: 32,
              height: 32,
              fontWeight: 500,
              borderRadius: 1,
              margin: '0 4px',
            },
            '& .MuiPaginationItem-root.Mui-selected': {
              backgroundColor: '#001F5B',
              color: '#fff',
              borderColor: '#001F5B',
            },
            '& .MuiPaginationItem-root:hover': {
              backgroundColor: '#f4f4f4',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default OfflineTimesTable;