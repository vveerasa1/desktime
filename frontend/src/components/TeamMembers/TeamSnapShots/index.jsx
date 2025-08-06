import { Link } from 'react-router-dom';
import styles from './index.module.css'
import { Paper,TableContainer,Table,TableHead,TableRow,TableCell,Box,Typography,Avatar,TableBody,Tooltip } from '@mui/material';
const TeamSnapShot = ({sscolumns,ssrows,styletimeblock,getStatusColor}) => {
  return (
    <>
      <TableContainer className={styles.tabContentWrapper} component={Paper}>
        <Table className={styles.teamTable}>
          <TableHead className={styles.tHead}>
            <TableRow className={styles.tHeadRow}>
              {sscolumns.map((col, index) => (
                <TableCell key={index} className={styles.tHeadSell}>
                  {col === "Timeline" ? (
                    <Box>
                      <Box className={styles.timelineLabelsRow}>
                        {[
                          "8 AM",
                          "10 AM",
                          "12 PM",
                          "2 PM",
                          "4 PM",
                          "6 PM",
                          "8 PM",
                          "10 PM",
                        ].map((label, i) => (
                          <Typography
                            key={i}
                            variant="caption"
                            className={styles.timelineLabel}
                          >
                            {label}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  ) : (
                    col
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {ssrows.map((row, idx) => (
              <TableRow
                key={idx}
                className={styles.tBodyRow}
                sx={{
                  backgroundColor: idx % 2 === 0 ? "#f8f8f8" : "#ffffff",
                }}
              >
                {/* Name & Avatar */}
                <TableCell className={styles.tBodyCell}>
                  <Box className={styles.tPersonInfo}>
                    <Box position="relative">
                      <Avatar className={styles.avatarImage}>
                        {row.initials}
                      </Avatar>
                    </Box>
                    <Box>
                      <Link className={styles.tPersonName} to="/">
                        {row.name}
                      </Link>
                      <Typography className={styles.tPersonDept}>
                        {row.role}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                {/* Timeline */}
                <TableCell className={styles.tBodyCell}>
                  <Box className={styles.timelineBar}>
                    {[
                      ...(row.timeline || []),
                      ...Array(
                        Math.max(0, 168 - (row.timeline?.length || 0))
                      ).fill("off"),
                    ]
                      .slice(0, 168)
                      .map((block, i) => {
                        const totalMinutes = 8 * 60 + i * 5;
                        const hour = Math.floor(totalMinutes / 60);
                        const minute = totalMinutes % 60;
                        const hour12 = hour % 12 === 0 ? 12 : hour % 12;
                        const ampm = hour < 12 ? "AM" : "PM";
                        const timeLabel = `${hour12}:${minute
                          .toString()
                          .padStart(2, "0")} ${ampm}`;

                        const statusLabel =
                          block.charAt(0).toUpperCase() + block.slice(1);

                        return (
                          <Tooltip
                            key={i}
                            title={`${statusLabel} at ${timeLabel}`}
                            arrow
                          >
                            <Box
                              sx={{
                                ...styletimeblock.timelineBlock,
                                width: `${100 / 168}%`,
                                background:
                                  block === "off"
                                    ? getStatusColor(block)
                                    : undefined,
                                backgroundColor:
                                  block !== "off"
                                    ? getStatusColor(block)
                                    : undefined,
                              }}
                            />
                          </Tooltip>
                        );
                      })}
                  </Box>
                </TableCell>

                {/* Total Time */}
                <TableCell className={styles.tBodyCell}>
                  {row.totalTime}
                </TableCell>

                {/* Avg Activity */}
                <TableCell className={styles.tBodyCell}>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color:
                        parseInt(row.avgActivity) > 70
                          ? "#2ecc71"
                          : parseInt(row.avgActivity) > 40
                          ? "#f39c12"
                          : "#e74c3c",
                    }}
                  >
                    {row.avgActivity}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TeamSnapShot;
