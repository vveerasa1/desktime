import { Box,Typography,Grid,Paper,Button } from "@mui/material"
import LoadingComponent from "../../ComponentLoader"
import EditIcon from "@mui/icons-material/Edit";
const ColleaguesList = ({
    navigate,
      colleaguesData,
      isLoading
}) => {
  return (
    <Box>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <Grid
          container
          spacing={3}
          sx={{
            display: "flex !important",
            justifyContent: "",
          }}
        >
          {colleaguesData &&
            colleaguesData.length > 0 &&
            colleaguesData.map((colleague, index) => (
              <Grid
                size={{ xs: 12, md: 4 }}
                item
                xs={12}
                sm={6}
                md={3} // Changed from md={3} to md={4} for 3 columns per row
                key={index}
              >
                <Paper
                  elevation={5}
                  sx={{
                    borderRadius: 2,
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    p={2}
                    display="flex"
                    gap={2}
                    alignItems="center"
                    flexDirection={"row"}
                  >
                    <Box>
                      <img
                        src={colleague.photo}
                        alt={colleague.username}
                        style={{ width: 70, height: 70, borderRadius: "50%" }}
                      />
                    </Box>

                    <Box sx={{ width: "100% !important" }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {colleague.username}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Team: {colleague.team}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex !important",
                        justifyContent: "end",
                      }}
                      display={"flex"}
                    >
                      <Box>
                        <Button
                        onClick={()=>{
                          navigate(`/settings/edit/${colleague._id}`)
                        }}
                        >
                          <EditIcon />
                        </Button>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ paddingX: 2, paddingBottom: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Email: {colleague.email}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
        </Grid>
      )}
    </Box>
  )
}

export default ColleaguesList
