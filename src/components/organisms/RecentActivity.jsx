import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
const RecentActivity = () => {
  const navigate = useNavigate();
  
  const activities = [
    {
      id: 1,
      type: "project",
      title: "Project 'Website Redesign' marked as completed",
      client: "TechCorp Inc",
      time: "2 hours ago",
      icon: "CheckCircle2",
      iconColor: "text-green-500",
      entityId: 1
    },
    {
      id: 2,
      type: "task",
      title: "New task assigned: 'Review wireframes'",
      client: "StartupXYZ",
      time: "4 hours ago",
      icon: "Plus",
      iconColor: "text-blue-500",
      entityId: 2
    },
    {
      id: 3,
      type: "invoice",
      title: "Invoice #1247 sent to client",
      client: "Digital Agency",
      time: "6 hours ago",
      icon: "FileText",
      iconColor: "text-purple-500",
      entityId: 1247
    },
    {
      id: 4,
      type: "client",
      title: "New client 'Fashion Brand' added",
      client: "Fashion Brand",
      time: "1 day ago",
      icon: "UserPlus",
      iconColor: "text-emerald-500",
      entityId: 3
    },
    {
      id: 5,
      type: "payment",
      title: "Payment received from TechCorp Inc",
      client: "TechCorp Inc",
      time: "2 days ago",
      icon: "DollarSign",
      iconColor: "text-green-600",
      entityId: 1
    }
  ];

  const getActivityBadge = (type) => {
    const badges = {
      project: { variant: "primary", label: "Project" },
      task: { variant: "secondary", label: "Task" },
      invoice: { variant: "warning", label: "Invoice" },
      client: { variant: "success", label: "Client" },
      payment: { variant: "success", label: "Payment" }
    };
    return badges[type] || { variant: "default", label: "Activity" };
  };

  const handleActivityClick = (activity) => {
    switch (activity.type) {
      case "project":
        navigate(`/projects/${activity.entityId}`);
        break;
      case "task":
        navigate("/tasks");
        break;
      case "invoice":
        navigate("/invoices");
        break;
      case "client":
        navigate(`/clients/${activity.entityId}`);
        break;
      case "payment":
        navigate("/invoices");
        break;
      default:
        break;
    }
  };

  const handleKeyPress = (event, activity) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleActivityClick(activity);
    }
  };
  return (
    <Card className="h-full">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h3>
          <Badge variant="primary">Live</Badge>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity, index) => (
<motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
              onClick={() => handleActivityClick(activity)}
              onKeyPress={(e) => handleKeyPress(e, activity)}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${activity.title}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${activity.iconColor}`}>
                <ApperIcon name={activity.icon} size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge 
                    variant={getActivityBadge(activity.type).variant}
                    className="text-xs"
                  >
                    {getActivityBadge(activity.type).label}
                  </Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </span>
                </div>
                
                <p className="text-sm text-gray-900 dark:text-white font-medium mb-1">
                  {activity.title}
                </p>
                
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {activity.client}
                </p>
              </div>
              
              <div className="flex-shrink-0">
                <ApperIcon 
                  name="ChevronRight" 
                  size={16} 
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200" 
                />
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-200">
            View all activity
          </button>
        </div>
      </div>
    </Card>
  );
};

export default RecentActivity;