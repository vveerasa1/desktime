import { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { Person, Work, Assignment } from "@mui/icons-material"; // Icons for adornments
import CustomTextField from "../../CustomTextField";
import CustomDropdown from "../../CustomDropDown";
import {
  useCreateProjectMutation,
  useGetSingleProjectQuery,
  useUpdateProjectMutation,
} from "../../../redux/services/projects";
const ProjectModal = ({
  open,
  onClose,
  handleChange,
  handleBlur,
  formData,
  setFormData,
  errors,
  setErrors,
  openToaster,
  userId,
  ownerId,
  formattedProfile,
  handleSelect,
  handleCloseToaster,
  projectId,
  statusOptions
}) => {
  const [createProject, isLoading] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const { data: getSingleProjectData, isLoading: getSingleProjectIsLoading } =
    useGetSingleProjectQuery(
      { id: projectId },
      {
        skip: !projectId,
      }
    );

  useEffect(() => {
    if (projectId && getSingleProjectData) {
      const data = getSingleProjectData?.data;
      setFormData({
        projectName: data?.name,
        status: data?.status,
        teamLead: data?.lead?._id,
      });
    }
  }, [projectId, getSingleProjectData]);

  const handleSave = async () => {
    let newErrors = {};
    let isValid = true;

    // Perform validation
    if (formData.projectName?.trim() === "") {
      newErrors.projectName = "Project Name is required.";
      isValid = false;
    }
    if (projectId && formData.status?.trim() === "") {
      newErrors.status = "Status is required.";
      isValid = false;
    }
    if (!formData.teamLead) {
      newErrors.teamLead = "Team Lead is required";
      isValid = false;
    }

    setErrors(newErrors);
    const payload = {
      name: formData.projectName,
      status: formData.status,
      lead: formData.teamLead,
      userId,
      ownerId,
    };
    if (isValid) {
      try {
        if (projectId) {
          await updateProject({ id: projectId, payload }).unwrap();
          openToaster("Project Updated Successfully!", "success");
        } else {
          await createProject(payload).unwrap();
          openToaster("Project Added Successfully!", "success");
        }

        onClose();
        setTimeout(()=>{
        handleCloseToaster();

        },5000)
        setFormData({
          projectName: "",
          teamLead: "",
          status: "",
        });
      } catch (err) {
        openToaster("Something went wrong. Please try again.", "error");
        console.error("Project mutation error:", err);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #e0e0e0",
          padding: "16px 24px",
          fontWeight: "bold",
          color: "#333",
          borderRadius: "8px 8px 0 0",
        }}
      >
        {projectId ? "Edit Project" : "Add Project"}
      </DialogTitle>
      <DialogContent sx={{ padding: "24px", marginTop: 4 }}>
        <Box className="field">
          <CustomTextField
            label="Project Name"
            name="projectName"
            value={formData.projectName}
            handleChange={(e) => {
              handleChange(e, "projectName");
            }}
            handleBlur={(e) => handleBlur(e, "projectName")}
            placeholder="Enter project name"
            isRequired
            error={!!errors.projectName}
            helperText={errors.projectName}
            startIcon={<Work />}
          />
        </Box>
        {projectId ? (
          <Box mt={2}>
          <CustomDropdown
            label="Status"
            name="status"
            selectedValue={formData.status}
            options={statusOptions}
            handleSelect={(e)=> handleSelect(e,"status")}
            handleBlur={(e) => handleBlur(e, "status")}
            placeholder="Enter Status"
            isRequired
            error={!!errors.status}
            helperText={errors.status}
            startIcon={<Assignment />}
          />
        </Box>
        ):""}
       
        <Box mt={2}>
          <CustomDropdown
            label="Team Lead"
            name="teamLead"
            selectedValue={formData?.teamLead}
            options={formattedProfile}
            handleSelect={(e) => handleSelect(e, "teamLead")}
            placeholder="Select Team Lead"
            isRequired
            onBlur={(e) => handleBlur(e, "teamLead")}
            error={!!errors.teamLead}
            helperText={errors.teamLead}
          />
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          padding: "16px 24px",
          borderTop: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px",
          borderRadius: "0 0 8px 8px",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            borderColor: "#ccc",
            color: "#666",
            "&:hover": {
              borderColor: "#999",
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            backgroundColor: "#194CF0",
            "&:hover": {
              backgroundColor: "#143BA0",
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectModal;
