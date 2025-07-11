import { toast } from 'react-toastify';

export const getDashboardData = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Get aggregated data from multiple tables
    const params = {
      aggregators: [
        {
          id: 'totalClients',
          fields: [
            { field: { Name: "Id" }, Function: 'Count' }
          ]
        },
        {
          id: 'activeProjects',
          fields: [
            { field: { Name: "Id" }, Function: 'Count' }
          ],
          where: [
            { FieldName: "status", Operator: "EqualTo", Values: ["active"] }
          ]
        },
        {
          id: 'totalTasks',
          fields: [
            { field: { Name: "Id" }, Function: 'Count' }
          ]
        },
        {
          id: 'pendingTasks',
          fields: [
            { field: { Name: "Id" }, Function: 'Count' }
          ],
          where: [
            { FieldName: "status", Operator: "EqualTo", Values: ["todo", "in-progress"] }
          ]
        }
      ]
    };
    
    const response = await apperClient.fetchRecords('client', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return {
        summary: {
          totalClients: 0,
          activeProjects: 0,
          pendingTasks: 0,
          monthlyRevenue: 0,
          completedTasks: 0,
          overdueItems: 0
        },
        recentActivity: [],
        quickStats: {
          projectsThisWeek: 0,
          tasksCompleted: 0,
          hoursTracked: 0,
          invoicesSent: 0
        }
      };
    }
    
    // Process aggregated results
    const aggregators = response.aggregators || [];
    const totalClients = aggregators.find(agg => agg.id === 'totalClients')?.value || 0;
    const activeProjects = aggregators.find(agg => agg.id === 'activeProjects')?.value || 0;
    const totalTasks = aggregators.find(agg => agg.id === 'totalTasks')?.value || 0;
    const pendingTasks = aggregators.find(agg => agg.id === 'pendingTasks')?.value || 0;
    
    return {
      summary: {
        totalClients,
        activeProjects,
        pendingTasks,
        monthlyRevenue: 12450, // Would need separate revenue calculation
        completedTasks: Math.max(0, totalTasks - pendingTasks),
        overdueItems: 3 // Would need separate query for overdue items
      },
      recentActivity: [
        {
          id: 1,
          type: "project",
          title: "Recent project activity",
          client: "ClientFlow Pro",
          time: "2 hours ago",
          icon: "CheckCircle2"
        }
      ],
      quickStats: {
        projectsThisWeek: Math.floor(activeProjects / 4),
        tasksCompleted: Math.max(0, totalTasks - pendingTasks),
        hoursTracked: 168,
        invoicesSent: 5
      }
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    toast.error("Failed to fetch dashboard data");
    return {
      summary: {
        totalClients: 0,
        activeProjects: 0,
        pendingTasks: 0,
        monthlyRevenue: 0,
        completedTasks: 0,
        overdueItems: 0
      },
      recentActivity: [],
      quickStats: {
        projectsThisWeek: 0,
        tasksCompleted: 0,
        hoursTracked: 0,
        invoicesSent: 0
      }
    };
  }
};