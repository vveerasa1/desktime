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
import { useCreateProjectMutation } from "../../../redux/services/projects";
const TaskModal = ({
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
    handleCloseToaster

}) => {
  const [createProject, isLoading] = useCreateProjectMutation();

  const handleSave = async () => {
    let newErrors = {};
    let isValid = true;

    // Perform validation
    if (formData.projectName.trim() === "") {
      newErrors.projectName = "Project Name is required.";
      isValid = false;
    }
    if (formData.taskName.trim() === "") {
      newErrors.taskName = "Task Name is required.";
      isValid = false;
    }
    if (!formData.assignee) {
      errors.assignee = "Assignee is required";
      isValid = false;
    }

    setErrors(newErrors);
    const payload ={
     name:formData.taskName,
     assignee:formData.assignee,
     status:formData.status,
     userId,
     ownerId
    }
    if (isValid) {
        await createProject(payload)
        openToaster("Task Added Successfully!", "success");
        onClose(); 
        handleCloseToaster()
        setFormData({
        projectName: "",
        taskName: "",
        description:"",
        assignee: "",
      });
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
        Add Project
      </DialogTitle>
      <DialogContent sx={{ padding: "24px", marginTop: 4 }}>
        <Box>
          <CustomTextField
            label="Task Name"
            name="taskName"
            value={formData.taskName}
            handleChange={(e) => {
              handleChange(e, "taskName");
            }}
            handleBlur={(e) => handleBlur(e, "taskName")}
            placeholder="Enter Task Name"
            isRequired
            error={!!errors.taskName}
            helperText={errors.taskName}
            startIcon={<Work />}
          />
        </Box>

        <Box>
          <CustomTextField
            label="Description"
            name="description"
            value={formData.projectName}
            handleChange={(e) => {
              handleChange(e, "projectName");
            }}
            handleBlur={(e) => handleBlur(e, "projectName")}
            placeholder="Enter Task Name"
            isRequired
            error={!!errors.projectName}
            helperText={errors.projectName}
            startIcon={<Work />}
          />
        </Box>
        <Box mt={2}>
          <CustomTextField
            label="Status"
            name="status"
            value={formData.taskName}
            handleChange={(e) => {
              handleChange(e, "taskName");
            }}
            handleBlur={(e) => handleBlur(e, "taskName")}
            placeholder="Enter task name"
            isRequired
            error={!!errors.taskName}
            helperText={errors.taskName}
            startIcon={<Assignment />}
          />
        </Box>
        <Box mt={2}>
           <CustomDropdown
            label="Assignee"
            name="assignee"
            selectedValue={formData.assignee}
            options={formattedProfile}
            handleSelect={(e) => handleSelect(e, "assignee")}
            placeholder="Select Assignee"
            isRequired
            onBlur={(e) => handleBlur(e, "assignee")}
            error={Boolean(formData.errors?.assignee)}
            helperText={formData.errors?.assignee}
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

export default TaskModal;
