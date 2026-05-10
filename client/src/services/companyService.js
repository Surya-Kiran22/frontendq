import api from './api';

export const companyService = {
  getAllCompanies: async () => {
    const response = await api.get('/companies');
    return response.data.companies;
  },

  getCompanyById: async (id) => {
    const response = await api.get(`/companies/${id}`);
    return response.data.company;
  },

  createCompany: async (companyData) => {
    const response = await api.post('/companies', companyData);
    return response.data.company;
  },

  updateCompany: async (id, companyData) => {
    const response = await api.put(`/companies/${id}`, companyData);
    return response.data.company;
  },

  deleteCompany: async (id) => {
    const response = await api.delete(`/companies/${id}`);
    return response.data;
  },

  getAllCompanyBranchMappings: async () => {
    const response = await api.get('/companies/mappings');
    return response.data.mappings;
  },

  updateCompanyBranchMapping: async (companyId, mappingData) => {
    const response = await api.put(`/companies/${companyId}/branch-mapping`, mappingData);
    return response.data.company;
  }
};
