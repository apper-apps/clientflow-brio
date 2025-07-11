import { toast } from 'react-toastify';

export const getAllTasks = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "title" } },
        { field: { Name: "priority" } },
        { field: { Name: "status" } },
        { field: { Name: "dueDate" } },
        { field: { Name: "totalTime" } },
        { field: { Name: "activeTimer" } },
        { field: { Name: "projectId" } }
      ]
    };
    
    const response = await apperClient.fetchRecords('task', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    toast.error("Failed to fetch tasks");
    return [];
  }
};

export const getTaskById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "title" } },
        { field: { Name: "priority" } },
        { field: { Name: "status" } },
        { field: { Name: "dueDate" } },
        { field: { Name: "totalTime" } },
        { field: { Name: "activeTimer" } },
        { field: { Name: "projectId" } }
      ]
    };
    
    const response = await apperClient.getRecordById('task', parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching task:", error);
    toast.error("Failed to fetch task");
    return null;
  }
};

export const createTask = async (taskData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Only include Updateable fields
    const params = {
      records: [{
        Name: taskData.Name || taskData.name || taskData.title || '',
        Tags: taskData.Tags || '',
        Owner: taskData.Owner || null,
        title: taskData.title || taskData.Name || taskData.name || '',
        priority: taskData.priority || 'medium',
        status: taskData.status || 'todo',
        dueDate: taskData.dueDate || null,
        totalTime: taskData.totalTime || 0,
        activeTimer: taskData.activeTimer || null,
        projectId: taskData.projectId ? parseInt(taskData.projectId) : null
      }]
    };
    
    const response = await apperClient.createRecord('task', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
        return null;
      }
      
      const successfulRecord = response.results.find(result => result.success);
      if (successfulRecord) {
        toast.success("Task created successfully");
        return successfulRecord.data;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error creating task:", error);
    toast.error("Failed to create task");
    return null;
  }
};

export const updateTask = async (id, taskData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Only include Updateable fields
    const params = {
      records: [{
        Id: parseInt(id),
        Name: taskData.Name || taskData.name || taskData.title,
        Tags: taskData.Tags,
        Owner: taskData.Owner,
        title: taskData.title || taskData.Name || taskData.name,
        priority: taskData.priority,
        status: taskData.status,
        dueDate: taskData.dueDate,
        totalTime: taskData.totalTime,
        activeTimer: taskData.activeTimer,
        projectId: taskData.projectId ? parseInt(taskData.projectId) : null
      }]
    };
    
    const response = await apperClient.updateRecord('task', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
        return null;
      }
      
      const successfulRecord = response.results.find(result => result.success);
      if (successfulRecord) {
        toast.success("Task updated successfully");
        return successfulRecord.data;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error updating task:", error);
    toast.error("Failed to update task");
    return null;
  }
};

export const updateTaskStatus = async (id, status) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      records: [{
        Id: parseInt(id),
        status: status
      }]
    };
    
    const response = await apperClient.updateRecord('task', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
        return null;
      }
      
      const successfulRecord = response.results.find(result => result.success);
      if (successfulRecord) {
        toast.success("Task status updated successfully");
        return successfulRecord.data;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error updating task status:", error);
    toast.error("Failed to update task status");
    return null;
  }
};

export const deleteTask = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord('task', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        failedRecords.forEach(record => {
          if (record.message) toast.error(record.message);
        });
        return false;
      }
      
      toast.success("Task deleted successfully");
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error deleting task:", error);
    toast.error("Failed to delete task");
    return false;
  }
};

export const startTaskTimer = async (id) => {
  try {
    const now = new Date().toISOString();
    const timerData = {
      Id: parseInt(id),
      startTime: now
    };
    
    // Update the task with active timer
    const updateResult = await updateTask(id, {
      activeTimer: JSON.stringify(timerData)
    });
    
    if (updateResult) {
      toast.success("Timer started successfully");
      return timerData;
    }
    
    return null;
  } catch (error) {
    console.error("Error starting timer:", error);
    toast.error("Failed to start timer");
    return null;
  }
};

export const stopTaskTimer = async (id) => {
  try {
    const task = await getTaskById(id);
    if (!task || !task.activeTimer) {
      throw new Error("No active timer for this task");
    }
    
    const now = new Date().toISOString();
    const activeTimer = JSON.parse(task.activeTimer);
    const startTime = new Date(activeTimer.startTime);
    const endTime = new Date(now);
    const duration = endTime.getTime() - startTime.getTime();
    
    const timeLog = {
      Id: Date.now(),
      startTime: activeTimer.startTime,
      endTime: now,
      duration: duration,
      date: startTime.toISOString().split('T')[0]
    };
    
    const newTotalTime = (task.totalTime || 0) + duration;
    
    // Update the task to clear active timer and update total time
    const updateResult = await updateTask(id, {
      activeTimer: null,
      totalTime: newTotalTime
    });
    
    if (updateResult) {
      toast.success("Timer stopped successfully");
      return timeLog;
    }
    
    return null;
  } catch (error) {
    console.error("Error stopping timer:", error);
    toast.error("Failed to stop timer");
    return null;
  }
};

export const getTaskTimeLogs = async (id) => {
  try {
    const task = await getTaskById(id);
    if (!task) {
      return [];
    }
    
    // For now, return empty array as time logs would need separate table
    // In a full implementation, this would query a separate time_logs table
    return [];
  } catch (error) {
    console.error("Error fetching time logs:", error);
    return [];
  }
};