import React from "react";
import styles from "./index.module.css";
import {
  Paper,
  Table,
  TableContainer,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Box,
  Avatar,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
Link
const AbsentMembers = ({ inactiveUsers, columns, role, formatTime }) => {
    return (
    <>
      {inactiveUsers && inactiveUsers.length > 0 ? (
        <Box className={styles.tabContent}>
          <TableContainer
            className={styles.tabContentWrapper}
            component={Paper}
          >
            <Table className={styles.teamTable}>
              <TableHead className={styles.tHead}>
                <TableRow className={styles.tHeadRow}>
                  {columns.map((col, index) => (
                    <TableCell className={styles.tHeadSell} key={index}>
                       <Box sx={{textAlign: col ==="Name" ? "left" :"center"}}>
                                       {col}
                     
                                       </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {console.log(inactiveUsers, "INSIEDEE")}
                {inactiveUsers.map((row, idx) => (
                  <TableRow
                    key={idx}
                    className={styles.tBodyRow}
                    sx={{
                      backgroundColor: idx % 2 === 0 ? "#f4f4f4" : "#ffffff",
                    }}
                  >
                    <TableCell sx={{width:"380px"}} className={styles.tBodyCell}>
                      <Box className={styles.tPersonInfo}>
                        <Avatar
                          alt="User Profile"
                          src={row.user.photo}
                          className={styles.avatarImage}
                        />
                        <Box>
                          {role === "Admin" || role === "Owner" ? (
                            <Link
                              className={styles.tPersonName}
                              to={`/dashboard/employee=${row.user._id}`}
                            >
                              {row.user.username}
                            </Link>
                          ) : (
                            <Typography className={styles.tPersonName}>
                              {row.user.username}
                            </Typography>
                          )}
                          <Typography className={styles.tPersonDept}>
                            {row.user.role}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell className={styles.tBodyCell}>
                      {/* {formatTime(row.productiveTime)} */}
                     <Box sx={{textAlign:"center"}}>
                      -

                     </Box>
                    </TableCell>
                    <TableCell className={styles.tBodyCell}>
                      {/* {formatTime(row.offlineTime)} */}
                   <Box sx={{textAlign:"center"}}>
                      -

                     </Box>
                    </TableCell>
                    <TableCell className={styles.tBodyCell}>
                      {/* {formatTime(row.deskTime)} */}
<Box sx={{textAlign:"center"}}>
                      -

                     </Box>
                    </TableCell>
                    <TableCell className={styles.tBodyCell}>
                      {/* {row.arrivalTime || "-"} */}
                    <Box sx={{textAlign:"center"}}>
                      -

                     </Box>
                    </TableCell>
                    <TableCell className={styles.tBodyCell}>
                      {/* {row.leftTime || "-"} */}
                    <Box sx={{textAlign:"center"}}>
                      -

                     </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Box className={styles.tabContentWrapper}>
          <Box className={styles.noMenbersBox}>
            <Typography variant="h3">
              No team members are currently working
            </Typography>
            <Typography variant="body2">
              To see all team members, clear the filters and switch to the
              Employees tab.
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
};

export default AbsentMembers;
