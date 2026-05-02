import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockCompanyService } from '../../services/mockData';
import {
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarIcon,
  BriefcaseIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [visitedCompanies, setVisitedCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('visitDate');

  useEffect(() => {
    fetchCompanies();
  }, []);

  
  const fetchCompanies = async () => {
    try {
      // Use mock data instead of API calls
      const companiesData = await mockCompanyService.getAllCompanies();
      // Add mock visit dates and additional data
      const enhancedCompanies = companiesData.map((company, index) => ({
        ...company,
        visitDate: company.visitDate || new Date(Date.now() + (index + 1) * 7 * 86400000).toISOString(),
        intake: company.intake || 100 + Math.floor(Math.random() * 200),
        headquarters: company.location || 'India',
        companySize: ['100-500', '500-1000', '1000-5000', '5000+'][index % 4],
        positions: [
          { title: 'Software Engineer' },
          { title: 'Data Analyst' },
          { title: 'Product Manager' }
        ].slice(0, (index % 3) + 1)
      }));
      setCompanies(enhancedCompanies);
      
      // Separate visited companies
      const today = new Date();
      const visited = enhancedCompanies.filter(c => new Date(c.visitDate) < today);
      setVisitedCompanies(visited);
    } catch (error) {
      // Error fetching companies
    } finally {
      setLoading(false);
    }
  };

  const filterCompanies = useCallback(() => {
    let filtered = companies;

    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === 'package') {
      filtered = [...filtered].sort((a, b) => {
        const pkgA = parseFloat(a.package) || 0;
        const pkgB = parseFloat(b.package) || 0;
        return pkgB - pkgA;
      });
    } else if (sortBy === 'date') {
      filtered = [...filtered].sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
    } else if (sortBy === 'visitDate') {
      filtered = [...filtered].sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate));
    } else if (sortBy === 'intake') {
      filtered = [...filtered].sort((a, b) => (b.intake || 0) - (a.intake || 0));
    } else if (sortBy === 'location') {
      filtered = [...filtered].sort((a, b) => a.location.localeCompare(b.location));
    }

    return filtered;
  }, [companies, searchTerm, sortBy]);

  const filteredCompanies = useMemo(() => filterCompanies(), [filterCompanies]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getVisitStatus = (visitDate) => {
    const today = new Date();
    const visit = new Date(visitDate);

    if (visit < today) {
      return { text: 'Visited', color: 'bg-gray-100 text-gray-800' };
    } else if (visit.toDateString() === today.toDateString()) {
      return { text: 'Today', color: 'bg-red-100 text-red-800' };
    } else {
      const daysUntil = Math.ceil((visit - today) / (1000 * 60 * 60 * 24));
      return {
        text: daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`,
        color: 'bg-green-100 text-green-800'
      };
    }
  };

  const CompanyCard = React.memo(({ company }) => {
    const visitStatus = getVisitStatus(company.visitDate);

    return (
      <Link
        to={`/companies/${company._id}`}
        className="card hover:scale-[1.02] transition-all duration-300 group"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                  <BuildingOfficeIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {company.name}
                  </h3>
                  <p className="text-sm text-gray-500">{company.industry}</p>
                </div>
              </div>
            </div>
            <span className={`badge ${visitStatus.color}`}>
              {visitStatus.text}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <CalendarIcon className="h-4 w-4 mr-3 text-blue-500" />
              Visit: {formatDate(company.visitDate)}
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <MapPinIcon className="h-4 w-4 mr-3 text-green-500" />
              {company.headquarters}
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <BriefcaseIcon className="h-4 w-4 mr-3 text-purple-500" />
              {company.companySize} employees
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {company.description}
            </p>

            {company.positions && company.positions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {company.positions.slice(0, 2).map((position, idx) => (
                  <span
                    key={idx}
                    className="badge-primary"
                  >
                    {position.title}
                  </span>
                ))}
                {company.positions.length > 2 && (
                  <span className="badge bg-gray-100 text-gray-700">
                    +{company.positions.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-blue-600 flex items-center group-hover:translate-x-1 transition-transform">
              View Details
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </span>
            {company.package && (
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                {company.package}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="section-title">Visiting Companies</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore {companies.length}+ companies visiting our campus and prepare for your dream job
        </p>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="input pl-12"
                placeholder="Search companies by name, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <select
              className="input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="visitDate">Sort by Visit Date</option>
              <option value="package">Sort by Package</option>
              <option value="intake">Sort by Intake</option>
              <option value="location">Sort by Location</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-blue-600">{filteredCompanies.length}</span> of <span className="font-semibold">{companies.length}</span> companies
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      {/* Visited Companies Section */}
      {visitedCompanies.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Already Visited Companies</h3>
            <span className="badge bg-gray-100 text-gray-800">{visitedCompanies.length} visited</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visitedCompanies.map((company) => (
              <div key={company._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-lg">
                    <BuildingOfficeIcon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{company.name}</h4>
                    <p className="text-xs text-gray-500">{company.industry}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Visited: {formatDate(company.visitDate)}</span>
                  <span className="font-medium text-gray-700">{company.package}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Companies Grid */}
      {filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <CompanyCard key={company._id} company={company} />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4">
            <BuildingOfficeIcon className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No companies found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? 'Try adjusting your search'
              : 'No companies are currently available'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="btn-primary"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Companies;
