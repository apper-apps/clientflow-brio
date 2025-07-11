import { startTaskTimer, stopTaskTimer, getTaskTimeLogs } from "@/services/api/taskService";
import { getAllTasks } from "@/services/api/taskService";

export const startTimer = async (taskId) => {
  try {
    const timerData = await startTaskTimer(taskId);
    return timerData;
  } catch (error) {
    throw new Error(`Failed to start timer: ${error.message}`);
  }
};

export const stopTimer = async (taskId) => {
  try {
    const timeLog = await stopTaskTimer(taskId);
    return timeLog;
  } catch (error) {
    throw new Error(`Failed to stop timer: ${error.message}`);
  }
};

export const getActiveTimer = async (taskId) => {
  try {
    const tasks = await getAllTasks();
    const task = tasks.find(t => t.Id === parseInt(taskId));
    
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.activeTimer) {
      return JSON.parse(task.activeTimer);
    }
    
    return null;
  } catch (error) {
    console.error("Error getting active timer:", error);
    return null;
  }
};

export const getTimeLogs = async (taskId) => {
  try {
    const timeLogs = await getTaskTimeLogs(taskId);
    return timeLogs;
  } catch (error) {
    throw new Error(`Failed to get time logs: ${error.message}`);
  }
};

export const getProjectTimeTracking = async (projectId) => {
  try {
    const tasks = await getAllTasks();
    const projectTasks = tasks.filter(t => t.projectId === String(projectId));
    
    let totalTime = 0;
    let activeTimers = 0;
    let totalEntries = 0;
    const timeLogs = [];

    projectTasks.forEach(task => {
      if (task.totalTime) {
        totalTime += task.totalTime || 0;
      }
      
      if (task.activeTimer) {
        activeTimers++;
      }
      
      // For a full implementation, time logs would be fetched from a separate table
      totalEntries += 1; // Placeholder
    });

    return {
      totalTime,
      activeTimers,
      totalEntries,
      timeLogs: timeLogs.slice(0, 10) // Return last 10 entries
    };
  } catch (error) {
    throw new Error(`Failed to get project time tracking: ${error.message}`);
  }
};

export const getAllTimeTracking = async () => {
  try {
    const tasks = await getAllTasks();
    
    const summary = {
      totalTime: 0,
      activeTimers: 0,
      totalEntries: 0,
      taskBreakdown: []
    };

    tasks.forEach(task => {
      if (task.totalTime) {
        summary.totalTime += task.totalTime || 0;
      }
      
      if (task.activeTimer) {
        summary.activeTimers++;
      }
      
      summary.totalEntries += 1; // Placeholder

      if (task.totalTime > 0 || task.activeTimer) {
        summary.taskBreakdown.push({
          taskId: task.Id,
          taskTitle: task.title || task.Name,
          projectId: task.projectId,
          totalTime: task.totalTime || 0,
          hasActiveTimer: !!task.activeTimer,
          entryCount: 1 // Placeholder
        });
      }
    });

    // Sort by total time descending
    summary.taskBreakdown.sort((a, b) => b.totalTime - a.totalTime);

    return summary;
  } catch (error) {
    throw new Error(`Failed to get all time tracking data: ${error.message}`);
  }
};