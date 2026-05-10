import api from './api';

export const companyService = {
  getAllCompanies: async () => {
    const response = await api.get('/companies');
    return response.companies;
  },

  getCompanyById: async (id) => {
    const response = await api.get(`/companies/${id}`);
    return response.company;
  },

  createCompany: async (companyData) => {
    const response = await api.post('/companies', companyData);
    return response.company;
  },

  updateCompany: async (id, companyData) => {
    const response = await api.put(`/companies/${id}`, companyData);
    return response.company;
  },

  deleteCompany: async (id) => {
    const response = await api.delete(`/companies/${id}`);
    return response;
  },

  getAllCompanyBranchMappings: async () => {
    const response = await api.get('/companies/mappings');
    return response.mappings;
  },

  updateCompanyBranchMapping: async (companyId, mappingData) => {
    const response = await api.put(`/companies/${companyId}/branch-mapping`, mappingData);
    return response.company;
  }
};
