import { toast } from 'react-toastify';

export const getAllClients = async () => {
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
        { field: { Name: "email" } },
        { field: { Name: "company" } },
        { field: { Name: "status" } },
        { field: { Name: "createdAt" } },
        { field: { Name: "notes" } }
      ]
    };
    
    const response = await apperClient.fetchRecords('client', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching clients:", error);
    toast.error("Failed to fetch clients");
    return [];
  }
};

export const getClientById = async (id) => {
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
        { field: { Name: "email" } },
        { field: { Name: "company" } },
        { field: { Name: "status" } },
        { field: { Name: "createdAt" } },
        { field: { Name: "notes" } }
      ]
    };
    
    const response = await apperClient.getRecordById('client', parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching client:", error);
    toast.error("Failed to fetch client");
    return null;
  }
};

export const createClient = async (clientData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
// Only include Updateable fields
    const params = {
      records: [{
        Name: clientData.name || clientData.Name || '',
        Tags: clientData.Tags || '',
        Owner: clientData.Owner || null,
        email: clientData.email || '',
        company: clientData.company || '',
        status: clientData.status || 'active',
        createdAt: clientData.createdAt || new Date().toISOString(),
        notes: clientData.notes || ''
      }]
    };
    
    const response = await apperClient.createRecord('client', params);
    
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
        toast.success("Client created successfully");
        return successfulRecord.data;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error creating client:", error);
    toast.error("Failed to create client");
    return null;
  }
};

export const updateClient = async (id, clientData) => {
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
        Name: clientData.Name || clientData.name,
        Tags: clientData.Tags,
        Owner: clientData.Owner,
        email: clientData.email,
        company: clientData.company,
        status: clientData.status,
        createdAt: clientData.createdAt,
        notes: clientData.notes
      }]
    };
    
    const response = await apperClient.updateRecord('client', params);
    
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
        toast.success("Client updated successfully");
        return successfulRecord.data;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error updating client:", error);
    toast.error("Failed to update client");
    return null;
  }
};

export const deleteClient = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord('client', params);
    
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
      
      toast.success("Client deleted successfully");
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error deleting client:", error);
    toast.error("Failed to delete client");
    return false;
  }
};