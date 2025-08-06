import { useState } from 'react';
import { useCreateOfflineRequestMutation } from '../redux/services/offlineRequests';

export const useOfflineTrackingModal = () => {
  const [open, setOpen] = useState(false);
  const [createOfflineRequest, { isLoading, isSuccess, isError, error }] = useCreateOfflineRequestMutation();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = async (formData) => {
    try {
      const payload = {
        userId: formData.userId,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        description: formData.description,
        projectName: formData.projectName,
        taskName: formData.taskName,
        productivity: formData.productivity
      };

      await createOfflineRequest(payload).unwrap();
      handleClose();
      return { success: true };
    } catch (err) {
      console.error('Failed to create offline request:', err);
      return { success: false, error: err };
    }
  };

  return {
    open,
    handleOpen,
    handleClose,
    handleSave,
    isLoading,
    isSuccess,
    isError,
    error
  };
}