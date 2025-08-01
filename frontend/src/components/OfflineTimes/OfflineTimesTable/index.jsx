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
  Pagination,
} from '@mui/material';
import styles from './index.module.css';
import InboxIcon from '@mui/icons-material/Inbox';

const data = [
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

const OfflineTimesTable = () => {
  const [selectedRows, setSelectedRows] = useState([]);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const totalPages = 10 || Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      // Deselect all
      setSelectedRows([]);
    } else {
      // Select all rows currently on the page
      const allIndexes = paginatedData.map((_, index) => index);
      setSelectedRows(allIndexes);
    }
  };
  const allRowIds = paginatedData.map((row) => row.id);
  return (
    <Box className={styles.container}>

      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>

          <TableHead className={styles.tableHead}>
            {/* <TableRow className={styles.mainRow}>
              <TableCell padding="checkbox" colSpan={7} sx={{ backgroundColor: '#2c3e50', color: 'white' }}>
                <strong style={{ marginLeft: 6 }}>Select all</strong>
              </TableCell>
              <TableCell  sx={{ backgroundColor: '#2c3e50', color: 'white' }}>
                <div className={styles.secondaryHeading}>0 selected</div>
                <div className={styles.secondaryHeading}>Approve</div>
                <div className={styles.secondaryHeading}>Decline</div>
              </TableCell>
            </TableRow> */}
            <TableRow className={styles.mainRow}>
              <TableCell colSpan={8}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  {/* <Typography className={styles.selectall} fontWeight={600} color="white" ml={1}>
                    Select all
                  </Typography> */}
                  <Typography
                    className={styles.selectall}
                    fontWeight={600}
                    color="white"
                    ml={1}
                    onClick={handleSelectAll}
                  >
                    {selectedRows.length === paginatedData.length ? 'Deselect all' : 'Select all'}
                  </Typography>

                  <Box display="flex" gap={2} alignItems="center">
                    <Typography className={styles.secondaryHeading}
                      sx={{
                        color: selectedRows.length > 0 ? 'white !important' : '#ccc',
                      }}> {selectedRows.length} selected</Typography>
                    <Typography className={styles.secondaryHeading} sx={{
                      color: selectedRows.length > 0 ? 'white !important' : '#ccc',
                    }}>Approve</Typography>
                    <Typography className={styles.secondaryHeading} sx={{
                      color: selectedRows.length > 0 ? 'white !important' : '#ccc',
                    }}>Decline</Typography>
                  </Box>
                </Box>
              </TableCell>
            </TableRow>

            <TableRow>
              {/* <TableCell padding="checkbox">
                <Checkbox color="primary" />
              </TableCell> */}
              <TableCell>
                <div className={styles.primaryHeading}>Name</div>
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
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow key={index} className={styles.tableRow}>
                  <TableCell >
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'start',
                      // paddingRight:'16px',
                      width: '120px'
                    }} >
                      <Checkbox
                        color="primary"
                        checked={paginatedData.length > 0 && selectedRows.length === paginatedData.length}
                        indeterminate={selectedRows.length > 0 && selectedRows.length < paginatedData.length}
                        onChange={handleSelectAll}
                      />
                      <Box

                      >
                        <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
                        <Typography variant="caption" color="textSecondary">{row.team}</Typography>

                      </Box>
                    </Box>

                  </TableCell>
                  <TableCell>
                    <Typography>{row.time}</Typography>
                    <Typography variant="caption" color="textSecondary">{row.date}</Typography>
                  </TableCell>
                  <TableCell>{row.splits}</TableCell>
                  <TableCell>{row.duration}</TableCell>
                  <TableCell>
                    <Box className={styles.productive}>{row.type}</Box>
                  </TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>
                    <Button className={styles.approveBtn} size="small">✓</Button>
                    <Button className={styles.declineBtn} size="small">✕</Button>
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
          classes={{
            ul: styles.paginationUl,
            root: styles.paginationRoot,
          }}
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
