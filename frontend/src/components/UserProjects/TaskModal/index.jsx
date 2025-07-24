import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { useEffect } from "react";
import { Work, Assignment } from "@mui/icons-material";
import CustomTextField from "../../CustomTextField";
import CustomDropdown from "../../CustomDropDown";
import {
  useCreateTaskMutation,
  useGetSingleTaskQuery,
  useUpdateTaskMutation,
} from "../../../redux/services/task";
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
  handleCloseToaster,
  mappedProjectOptions,
  taskId,
}) => {
  const [createTask, isLoading] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const { data: getSingleTaskData, isLoading: getSingleTaskIsLoading } =
    useGetSingleTaskQuery(
      { id: taskId },
      {
        skip: !taskId,
      }
    );

  useEffect(() => {
    if (taskId && getSingleTaskData?.data) {
      const data = getSingleTaskData.data;

      setFormData({
        taskName: data.name || "",
        description: data.description || "",
        project: data?.projectId?._id || "",
        assignee: data.assignee?._id || "",
        status: data.status || "",
      });
    }
  }, [taskId, getSingleTaskData]);

  const handleSave = async () => {
    let newErrors = {};
    let isValid = true;

    // Perform validation
    if (formData.taskName.trim() === "") {
      newErrors.taskName = "Task Name is required.";
      isValid = false;
    }

    if (!formData.description) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    if (!formData.project) {
      newErrors.project = "Project is required";
      isValid = false;
    }

    if (!formData.assignee) {
      newErrors.assignee = "Assignee is required";
      isValid = false;
    }

    if (taskId && !formData.status) {
      newErrors.status = "Status is required";
      isValid = false;
    }

    setErrors(newErrors);
    const payload = {
      name: formData.taskName,
      description: formData.description,
      projectId: formData.project,
      assignee: formData.assignee,
      status: formData.status,
      userId,
      ownerId,
    };
    if (isValid) {
      if (taskId) {
        await updateTask({ id: taskId, payload });
        openToaster("Task Updated Successfully!", "success");
      } else {
        await createTask(payload);
        openToaster("Task Added Successfully!", "success");
      }
      onClose();
      setTimeout(()=>{
      handleCloseToaster();
      },5000)
      setFormData({
        taskName: "",
        description: "",
        project: "",
        assignee: "",
        status: "",
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
        {taskId ? "Update Task" : "Add Task"}
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

        <Box mt={2}>
          <CustomTextField
            label="Description"
            name="description"
            value={formData.description}
            handleChange={(e) => {
              handleChange(e, "description");
            }}
            handleBlur={(e) => handleBlur(e, "description")}
            placeholder="Enter Description"
            isRequired
            error={!!errors.description}
            helperText={errors.description}
            startIcon={<Work />}
          />
        </Box>

        <Box mt={2}>
          <CustomDropdown
            label="Project"
            name="project"
            selectedValue={formData.project}
            options={mappedProjectOptions}
            handleSelect={(e) => handleSelect(e, "project")}
            placeholder="Select Project"
            isRequired
            onBlur={(e) => handleBlur(e, "project")}
            error={!!errors?.project}
            helperText={errors?.project}
          />
        </Box>
        <Box mt={taskId ? 4 : 1}>
          <CustomDropdown
            label="Assignee"
            name="assignee"
            selectedValue={formData.assignee}
            options={formattedProfile}
            handleSelect={(e) => handleSelect(e, "assignee")}
            placeholder="Select Assignee"
            isRequired
            onBlur={(e) => handleBlur(e, "assignee")}
            error={errors?.assignee}
            helperText={errors?.assignee}
          />
        </Box>
        {taskId ? (
          <Box mt={4}>
            <CustomTextField
              label="Status"
              name="status"
              value={formData.status}
              handleChange={(e) => {
                handleChange(e, "status");
              }}
              handleBlur={(e) => handleBlur(e, "status")}
              placeholder="Enter Status "
              isRequired
              error={!!errors?.status}
              helperText={errors?.status}
              startIcon={<Assignment />}
            />
          </Box>
        ) : (
          ""
        )}
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
          onClick={() => onClose()}
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
