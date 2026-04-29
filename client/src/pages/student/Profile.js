import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockProfileService } from '../../services/mockData';
import {
  UserIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  PlusIcon,
  XMarkIcon,
  EnvelopeIcon,
  PhoneIcon,
  CodeBracketIcon,
  FolderIcon,
  CloudArrowUpIcon,
  KeyIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Profile = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [showCertModal, setShowCertModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newCert, setNewCert] = useState({
    name: '',
    issuer: '',
    date: '',
    certificateUrl: ''
  });
  const [newProject, setNewProject] = useState({
    title: '',
    language: '',
    githubLink: ''
  });
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailOTP, setEmailOTP] = useState('');
  const [phoneOTP, setPhoneOTP] = useState('');
  const [showEmailOTP, setShowEmailOTP] = useState(false);
  const [showPhoneOTP, setShowPhoneOTP] = useState(false);

  const fileInputRefs = {
    resume: useRef(null),
    idCard: useRef(null),
    intermediateMarks: useRef(null),
    tenthMarks: useRef(null)
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await mockProfileService.getProfile();
      setProfile(data);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalInfoUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const formData = new FormData(e.target);
      const updateData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phoneNumber: formData.get('phoneNumber'),
        github: formData.get('github'),
        linkedin: formData.get('linkedin'),
        branch: formData.get('branch'),
        year: formData.get('year')
      };

      await mockProfileService.updateProfile(updateData);
      updateUser(updateData);
      setProfile(prev => ({ ...prev, ...updateData }));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSendEmailOTP = () => {
    // OTP sent to backend (mock)
    toast.success('OTP sent to your email');
    setShowEmailOTP(true);
  };

  const handleVerifyEmailOTP = () => {
    if (emailOTP.length === 6) {
      setEmailVerified(true);
      setShowEmailOTP(false);
      toast.success('Email verified successfully');
    } else {
      toast.error('Invalid OTP');
    }
  };

  const handleSendPhoneOTP = () => {
    // OTP sent to backend (mock)
    toast.success('OTP sent to your phone');
    setShowPhoneOTP(true);
  };

  const handleVerifyPhoneOTP = () => {
    if (phoneOTP.length === 6) {
      setPhoneVerified(true);
      setShowPhoneOTP(false);
      toast.success('Phone verified successfully');
    } else {
      toast.error('Invalid OTP');
    }
  };

  const handleAddProject = async () => {
    if (!newProject.title.trim() || !newProject.language.trim()) return;

    try {
      const updatedProjects = [...(profile.profile.projects || []), {
        ...newProject,
        id: Date.now()
      }];
      
      await mockProfileService.updateProjects(updatedProjects);
      
      setProfile(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          projects: updatedProjects
        }
      }));
      
      setNewProject({ title: '', language: '', githubLink: '' });
      setShowProjectModal(false);
      toast.success('Project added successfully');
    } catch (error) {
      toast.error('Failed to add project');
    }
  };

  const handleRemoveProject = async (projectId) => {
    try {
      const updatedProjects = profile.profile.projects.filter(p => p.id !== projectId);
      await mockProfileService.updateProjects(updatedProjects);
      
      setProfile(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          projects: updatedProjects
        }
      }));
      
      toast.success('Project removed successfully');
    } catch (error) {
      toast.error('Failed to remove project');
    }
  };

  const handleEducationUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const formData = new FormData(e.target);
      const updateData = {
        cgpa: parseFloat(formData.get('cgpa')),
        backlogs: parseInt(formData.get('backlogs')),
        backlogSemesters: formData.get('backlogSemesters')
      };

      await mockProfileService.updateEducation(updateData);
      setProfile(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          education: { ...prev.profile.education, ...updateData }
        }
      }));
      toast.success('Education details updated successfully');
    } catch (error) {
      toast.error('Failed to update education details');
    } finally {
      setSaving(false);
    }
  };

  const handleCodingProfilesUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const formData = new FormData(e.target);
      const updateData = {
        leetcode: formData.get('leetcode'),
        hackerrank: formData.get('hackerrank'),
        codechef: formData.get('codechef'),
        smartinterviews: formData.get('smartinterviews'),
        skelo: formData.get('skelo')
      };

      await mockProfileService.updateCodingProfiles(updateData);
      setProfile(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          codingProfiles: updateData
        }
      }));
      toast.success('Coding profiles updated successfully');
    } catch (error) {
      toast.error('Failed to update coding profiles');
    } finally {
      setSaving(false);
    }
  };

  const handleSkillsUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const formData = new FormData(e.target);
      const updateData = {
        languages: formData.getAll('languages'),
        languageLevels: formData.getAll('languageLevels'),
        tools: formData.getAll('tools'),
        roles: formData.getAll('roles'),
        apps: formData.getAll('apps')
      };

      await mockProfileService.updateSkills(updateData);
      setProfile(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          skills: updateData
        }
      }));
      toast.success('Skills updated successfully');
    } catch (error) {
      toast.error('Failed to update skills');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCertification = async () => {
    if (!newCert.name.trim() || !newCert.issuer.trim()) return;

    try {
      const updatedCerts = [...(profile.profile.certifications || []), {
        ...newCert,
        date: new Date(newCert.date)
      }];
      
      await mockProfileService.updateSkillsCertifications({ certifications: updatedCerts });
      
      setProfile(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          certifications: updatedCerts
        }
      }));
      
      setNewCert({ name: '', issuer: '', date: '', certificateUrl: '' });
      setShowCertModal(false);
      toast.success('Certification added successfully');
    } catch (error) {
      toast.error('Failed to add certification');
    }
  };

  const handleRemoveCertification = async (certToRemove) => {
    try {
      const updatedCerts = profile.profile.certifications.filter(
        cert => cert.name !== certToRemove.name
      );
      
      await mockProfileService.updateSkillsCertifications({ certifications: updatedCerts });
      
      setProfile(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          certifications: updatedCerts
        }
      }));
      
      toast.success('Certification removed successfully');
    } catch (error) {
      toast.error('Failed to remove certification');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDocumentUpload = async (documentType, file) => {
    if (!file) return;
    
    try {
      // Create filename with roll number prefix
      const fileExtension = file.name.split('.').pop();
      const fileName = `${profile.rollNumber}_${documentType}_${Date.now()}.${fileExtension}`;
      
      // In a real app, this would upload to a server
      // For now, we'll just update the mock data
      const updatedDocuments = {
        ...profile.profile.documents,
        [documentType]: fileName
      };
      
      await mockProfileService.updateDocuments(updatedDocuments);
      
      setProfile(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          documents: updatedDocuments
        }
      }));
      
      toast.success(`${documentType} uploaded successfully as ${fileName}`);
    } catch (error) {
      toast.error('Failed to upload document');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <UserIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-medium text-gray-900">Profile not found</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-2 text-gray-600">Manage your personal information and placement details</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'personal', name: 'Personal Information', icon: UserIcon },
              { id: 'coding', name: 'Coding Profiles', icon: CodeBracketIcon },
              { id: 'projects', name: 'Projects', icon: FolderIcon },
              { id: 'education', name: 'Education', icon: AcademicCapIcon },
              { id: 'skills', name: 'Skills & Certifications', icon: DocumentTextIcon },
              { id: 'documents', name: 'Documents', icon: CloudArrowUpIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeSection === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Personal Information Section */}
          {activeSection === 'personal' && (
            <form onSubmit={handlePersonalInfoUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={profile.name}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">Roll Number</label>
                  <input
                    type="text"
                    value={profile.rollNumber}
                    className="input bg-gray-50"
                    disabled
                  />
                </div>

                <div>
                  <label className="label">Email Address</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      name="email"
                      defaultValue={profile.email}
                      className="input flex-1"
                      required
                    />
                    {!emailVerified ? (
                      <button
                        type="button"
                        onClick={handleSendEmailOTP}
                        className="btn-outline px-4"
                      >
                        Verify
                      </button>
                    ) : (
                      <span className="flex items-center text-green-600 px-4">
                        <CheckCircleIcon className="h-5 w-5 mr-1" />
                        Verified
                      </span>
                    )}
                  </div>
                  {showEmailOTP && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={emailOTP}
                        onChange={(e) => setEmailOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="input flex-1"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyEmailOTP}
                        className="btn-primary px-4"
                      >
                        Verify OTP
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="label">Phone Number</label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      name="phoneNumber"
                      defaultValue={profile.phoneNumber}
                      className="input flex-1"
                      required
                    />
                    {!phoneVerified ? (
                      <button
                        type="button"
                        onClick={handleSendPhoneOTP}
                        className="btn-outline px-4"
                      >
                        Verify
                      </button>
                    ) : (
                      <span className="flex items-center text-green-600 px-4">
                        <CheckCircleIcon className="h-5 w-5 mr-1" />
                        Verified
                      </span>
                    )}
                  </div>
                  {showPhoneOTP && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={phoneOTP}
                        onChange={(e) => setPhoneOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="input flex-1"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyPhoneOTP}
                        className="btn-primary px-4"
                      >
                        Verify OTP
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="label">GitHub Profile</label>
                  <input
                    type="url"
                    name="github"
                    defaultValue={profile.github || ''}
                    className="input"
                    placeholder="https://github.com/username"
                  />
                </div>

                <div>
                  <label className="label">LinkedIn Profile</label>
                  <input
                    type="url"
                    name="linkedin"
                    defaultValue={profile.linkedin || ''}
                    className="input"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="label">Branch</label>
                  <select name="branch" defaultValue={profile.branch} className="input" required>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="IT">IT</option>
                  </select>
                </div>

                <div>
                  <label className="label">Year</label>
                  <select name="year" defaultValue={profile.year} className="input" required>
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* Coding Profiles Section */}
          {activeSection === 'coding' && (
            <form onSubmit={handleCodingProfilesUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">LeetCode Profile</label>
                  <input
                    type="url"
                    name="leetcode"
                    defaultValue={profile.profile.codingProfiles?.leetcode || ''}
                    className="input"
                    placeholder="https://leetcode.com/username"
                  />
                </div>

                <div>
                  <label className="label">HackerRank Profile</label>
                  <input
                    type="url"
                    name="hackerrank"
                    defaultValue={profile.profile.codingProfiles?.hackerrank || ''}
                    className="input"
                    placeholder="https://hackerrank.com/username"
                  />
                </div>

                <div>
                  <label className="label">CodeChef Profile</label>
                  <input
                    type="url"
                    name="codechef"
                    defaultValue={profile.profile.codingProfiles?.codechef || ''}
                    className="input"
                    placeholder="https://codechef.com/users/username"
                  />
                </div>

                <div>
                  <label className="label">Smart Interviews Profile</label>
                  <input
                    type="url"
                    name="smartinterviews"
                    defaultValue={profile.profile.codingProfiles?.smartinterviews || ''}
                    className="input"
                    placeholder="https://smartinterviews.com/username"
                  />
                </div>

                <div>
                  <label className="label">Skelo Profile</label>
                  <input
                    type="url"
                    name="skelo"
                    defaultValue={profile.profile.codingProfiles?.skelo || ''}
                    className="input"
                    placeholder="https://skelo.io/username"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* Projects Section */}
          {activeSection === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Projects Completed</h3>
                <button
                  onClick={() => setShowProjectModal(true)}
                  className="btn-primary text-sm"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Project
                </button>
              </div>

              {profile.profile.projects && profile.profile.projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.profile.projects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{project.title}</h4>
                          <p className="text-sm text-gray-600">{project.language}</p>
                          {project.githubLink && (
                            <a
                              href={project.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-700 mt-1 inline-block"
                            >
                              View on GitHub →
                            </a>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveProject(project.id)}
                          className="text-red-600 hover:text-red-800 ml-4"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No projects added yet</p>
              )}
            </div>
          )}

          {/* Education Section */}
          {activeSection === 'education' && (
            <form onSubmit={handleEducationUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">CGPA</label>
                  <input
                    type="number"
                    name="cgpa"
                    defaultValue={profile.profile.education?.cgpa || ''}
                    className="input"
                    step="0.01"
                    min="0"
                    max="10"
                    placeholder="e.g., 8.5"
                  />
                </div>

                <div>
                  <label className="label">Number of Backlogs</label>
                  <input
                    type="number"
                    name="backlogs"
                    defaultValue={profile.profile.education?.backlogs || 0}
                    className="input"
                    min="0"
                    placeholder="e.g., 0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="label">Backlog Semesters (if any)</label>
                  <input
                    type="text"
                    name="backlogSemesters"
                    defaultValue={profile.profile.education?.backlogSemesters || ''}
                    className="input"
                    placeholder="e.g., Semester 3 - Cleared, Semester 5 - Pending"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* Skills & Certifications Section */}
          {activeSection === 'skills' && (
            <form onSubmit={handleSkillsUpdate} className="space-y-6">
              {/* Languages with Levels */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Programming Languages</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['C', 'Java', 'Python', 'JavaScript', 'C++', 'Go', 'Rust', 'TypeScript'].map((lang) => (
                    <div key={lang} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="languages"
                        value={lang}
                        id={`lang-${lang}`}
                        defaultChecked={profile.profile.skills?.languages?.includes(lang)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <label htmlFor={`lang-${lang}`} className="text-sm text-gray-700">{lang}</label>
                      <select
                        name="languageLevels"
                        className="input text-sm py-1 px-2 w-24"
                        defaultValue={profile.profile.skills?.languageLevels?.[profile.profile.skills?.languages?.indexOf(lang)] || ''}
                      >
                        <option value="">Level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tools Known</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Jenkins', 'VS Code', 'IntelliJ', 'Postman', 'Linux', 'MongoDB', 'PostgreSQL'].map((tool) => (
                    <label key={tool} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="tools"
                        value={tool}
                        defaultChecked={profile.profile.skills?.tools?.includes(tool)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{tool}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Roles Interested */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Roles Interested</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist', 'DevOps Engineer', 'Mobile Developer', 'Cloud Engineer', 'ML Engineer'].map((role) => (
                    <label key={role} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="roles"
                        value={role}
                        defaultChecked={profile.profile.skills?.roles?.includes(role)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Apps Known */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Apps/Platforms Known</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'Flutter', 'React Native'].map((app) => (
                    <label key={app} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="apps"
                        value={app}
                        defaultChecked={profile.profile.skills?.apps?.includes(app)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{app}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Certifications</h3>
                  <button
                    type="button"
                    onClick={() => setShowCertModal(true)}
                    className="btn-primary text-sm"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Certification
                  </button>
                </div>

                {profile.profile.certifications && profile.profile.certifications.length > 0 ? (
                  <div className="space-y-3">
                    {profile.profile.certifications.map((cert, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{cert.name}</h4>
                            <p className="text-sm text-gray-600">{cert.issuer}</p>
                            <p className="text-xs text-gray-500">
                              {formatDate(cert.date)}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            {cert.certificateUrl && (
                              <a
                                href={cert.certificateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:text-primary-500 text-sm"
                              >
                                View
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveCertification(cert)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No certifications added yet</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* Documents Section */}
          {activeSection === 'documents' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Documents</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Resume */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <DocumentTextIcon className="h-6 w-6 text-blue-600 mr-2" />
                    <h4 className="font-medium text-gray-900">Resume</h4>
                  </div>
                  {profile.profile.documents?.resume ? (
                    <div className="space-y-2">
                      <p className="text-sm text-green-600">✓ Uploaded as {profile.profile.documents.resume}</p>
                      <button 
                        onClick={() => fileInputRefs.resume.current?.click()}
                        className="btn-outline text-sm w-full"
                      >
                        Update Resume
                      </button>
                      <input
                        ref={fileInputRefs.resume}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => handleDocumentUpload('resume', e.target.files[0])}
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <CloudArrowUpIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload your resume</p>
                      <button 
                        onClick={() => fileInputRefs.resume.current?.click()}
                        className="btn-primary text-sm w-full"
                      >
                        <PlusIcon className="h-4 w-4 mr-1 inline" />
                        Upload
                      </button>
                      <input
                        ref={fileInputRefs.resume}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => handleDocumentUpload('resume', e.target.files[0])}
                      />
                    </div>
                  )}
                </div>

                {/* ID Card */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <DocumentTextIcon className="h-6 w-6 text-blue-600 mr-2" />
                    <h4 className="font-medium text-gray-900">College ID Card</h4>
                  </div>
                  {profile.profile.documents?.idCard ? (
                    <div className="space-y-2">
                      <p className="text-sm text-green-600">✓ Uploaded as {profile.profile.documents.idCard}</p>
                      <button 
                        onClick={() => fileInputRefs.idCard.current?.click()}
                        className="btn-outline text-sm w-full"
                      >
                        Update ID Card
                      </button>
                      <input
                        ref={fileInputRefs.idCard}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => handleDocumentUpload('idCard', e.target.files[0])}
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <CloudArrowUpIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload your ID card</p>
                      <button 
                        onClick={() => fileInputRefs.idCard.current?.click()}
                        className="btn-primary text-sm w-full"
                      >
                        <PlusIcon className="h-4 w-4 mr-1 inline" />
                        Upload
                      </button>
                      <input
                        ref={fileInputRefs.idCard}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => handleDocumentUpload('idCard', e.target.files[0])}
                      />
                    </div>
                  )}
                </div>

                {/* Intermediate Marks Memo */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <DocumentTextIcon className="h-6 w-6 text-blue-600 mr-2" />
                    <h4 className="font-medium text-gray-900">Intermediate Marks Memo</h4>
                  </div>
                  {profile.profile.documents?.intermediateMarks ? (
                    <div className="space-y-2">
                      <p className="text-sm text-green-600">✓ Uploaded as {profile.profile.documents.intermediateMarks}</p>
                      <button 
                        onClick={() => fileInputRefs.intermediateMarks.current?.click()}
                        className="btn-outline text-sm w-full"
                      >
                        Update Marks Memo
                      </button>
                      <input
                        ref={fileInputRefs.intermediateMarks}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => handleDocumentUpload('intermediateMarks', e.target.files[0])}
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <CloudArrowUpIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload intermediate marks</p>
                      <button 
                        onClick={() => fileInputRefs.intermediateMarks.current?.click()}
                        className="btn-primary text-sm w-full"
                      >
                        <PlusIcon className="h-4 w-4 mr-1 inline" />
                        Upload
                      </button>
                      <input
                        ref={fileInputRefs.intermediateMarks}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => handleDocumentUpload('intermediateMarks', e.target.files[0])}
                      />
                    </div>
                  )}
                </div>

                {/* 10th Class Marks Memo */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <DocumentTextIcon className="h-6 w-6 text-blue-600 mr-2" />
                    <h4 className="font-medium text-gray-900">10th Class Marks Memo</h4>
                  </div>
                  {profile.profile.documents?.tenthMarks ? (
                    <div className="space-y-2">
                      <p className="text-sm text-green-600">✓ Uploaded as {profile.profile.documents.tenthMarks}</p>
                      <button 
                        onClick={() => fileInputRefs.tenthMarks.current?.click()}
                        className="btn-outline text-sm w-full"
                      >
                        Update 10th Marks
                      </button>
                      <input
                        ref={fileInputRefs.tenthMarks}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => handleDocumentUpload('tenthMarks', e.target.files[0])}
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <CloudArrowUpIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload 10th class marks</p>
                      <button 
                        onClick={() => fileInputRefs.tenthMarks.current?.click()}
                        className="btn-primary text-sm w-full"
                      >
                        <PlusIcon className="h-4 w-4 mr-1 inline" />
                        Upload
                      </button>
                      <input
                        ref={fileInputRefs.tenthMarks}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => handleDocumentUpload('tenthMarks', e.target.files[0])}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Certification Modal */}
      {showCertModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add Certification</h3>
              <button
                onClick={() => setShowCertModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Certification Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., AWS Certified Developer"
                  value={newCert.name}
                  onChange={(e) => setNewCert(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="label">Issuing Organization</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Amazon Web Services"
                  value={newCert.issuer}
                  onChange={(e) => setNewCert(prev => ({ ...prev, issuer: e.target.value }))}
                />
              </div>

              <div>
                <label className="label">Date Obtained</label>
                <input
                  type="date"
                  className="input"
                  value={newCert.date}
                  onChange={(e) => setNewCert(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>

              <div>
                <label className="label">Certificate URL (Optional)</label>
                <input
                  type="url"
                  className="input"
                  placeholder="https://..."
                  value={newCert.certificateUrl}
                  onChange={(e) => setNewCert(prev => ({ ...prev, certificateUrl: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddCertification}
                className="btn-primary flex-1"
              >
                Add
              </button>
              <button
                onClick={() => setShowCertModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add Project</h3>
              <button
                onClick={() => setShowProjectModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Project Title</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., E-commerce Website"
                  value={newProject.title}
                  onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="label">Language/Stack</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., MERN Stack, Python Django"
                  value={newProject.language}
                  onChange={(e) => setNewProject(prev => ({ ...prev, language: e.target.value }))}
                />
              </div>

              <div>
                <label className="label">GitHub Link (Optional)</label>
                <input
                  type="url"
                  className="input"
                  placeholder="https://github.com/username/repo"
                  value={newProject.githubLink}
                  onChange={(e) => setNewProject(prev => ({ ...prev, githubLink: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddProject}
                className="btn-primary flex-1"
              >
                Add
              </button>
              <button
                onClick={() => setShowProjectModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
