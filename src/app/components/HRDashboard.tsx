import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  Briefcase,
  Users,
  TrendingUp,
  LogOut,
  Plus,
  FileText,
  BarChart3,
  Download,
  Eye,
  Edit,
  Trash2,
  Clock
} from 'lucide-react';
import { JobPostingForm } from './JobPostingForm';
import { CandidateRanking } from './CandidateRanking';
import { HRAnalytics } from './HRAnalytics';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface HRDashboardProps {
  user: any;
  accessToken: string;
  onLogout: () => void;
}

export function HRDashboard({ user, accessToken, onLogout }: HRDashboardProps) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadJobs(), loadAnalytics()]);
    setLoading(false);
  };
  
  const loadJobs = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3d608688/jobs/my-jobs`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      const data = await response.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };
  
  const loadAnalytics = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3d608688/analytics/dashboard`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };
  
  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3d608688/jobs/${jobId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };
  
  const handleJobCreated = async () => {
    setShowJobForm(false);
    setEditingJob(null);
    await loadData();
  };
  
  const handleViewCandidates = (job: any) => {
    setSelectedJob(job);
    setActiveTab('candidates');
  };
  
  const downloadReport = async (jobId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3d608688/reports/${jobId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      const data = await response.json();
      if (data.success) {
        // Download CSV
        const blob = new Blob([data.csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `candidates-report-${jobId}.csv`;
        a.click();
      }
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl">HR Manager Portal</h1>
              <p className="text-sm text-gray-600">Welcome, {user.user_metadata?.name || 'HR Manager'}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardDescription className="text-blue-100">Total Jobs</CardDescription>
              <CardTitle className="text-3xl">{analytics?.totalJobs || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="w-4 h-4" />
                <span>{analytics?.activeJobs || 0} active</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardDescription className="text-green-100">Applications</CardDescription>
              <CardTitle className="text-3xl">{analytics?.totalApplications || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4" />
                <span>Total received</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardDescription className="text-purple-100">Avg Match Score</CardDescription>
              <CardTitle className="text-3xl">{analytics?.avgMatchScore?.toFixed(1) || 0}%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>AI matching</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardDescription className="text-orange-100">Shortlisted</CardDescription>
              <CardTitle className="text-3xl">{analytics?.statusCounts?.shortlisted || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4" />
                <span>Candidates</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Job Postings</TabsTrigger>
            <TabsTrigger value="candidates">Candidate Rankings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics & Insights</TabsTrigger>
          </TabsList>
          
          {/* Job Postings Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl">Your Job Postings</h2>
              <Button onClick={() => setShowJobForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Job
              </Button>
            </div>
            
            {showJobForm && (
              <JobPostingForm
                accessToken={accessToken}
                editingJob={editingJob}
                onClose={() => {
                  setShowJobForm(false);
                  setEditingJob(null);
                }}
                onSuccess={handleJobCreated}
              />
            )}
            
            {jobs.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Briefcase className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">No job postings yet</p>
                  <Button onClick={() => setShowJobForm(true)}>
                    Create Your First Job Posting
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {jobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="mb-2">{job.title}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {job.description}
                          </CardDescription>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant="secondary">{job.type}</Badge>
                            <Badge variant="secondary">{job.location}</Badge>
                            <Badge variant="secondary">{job.experienceLevel}</Badge>
                            <Badge className="bg-blue-100 text-blue-700">
                              <Users className="w-3 h-3 mr-1" />
                              {job.applicantCount || 0} applicants
                            </Badge>
                          </div>
                        </div>
                        <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                          {job.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Required Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {job.requiredSkills?.slice(0, 8).map((skill: string, idx: number) => (
                            <Badge key={idx} variant="outline">{skill}</Badge>
                          ))}
                          {job.requiredSkills?.length > 8 && (
                            <Badge variant="outline">+{job.requiredSkills.length - 8} more</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewCandidates(job)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Candidates
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingJob(job);
                            setShowJobForm(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadReport(job.id)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export Report
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteJob(job.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t text-sm text-gray-500 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Candidates Tab */}
          <TabsContent value="candidates">
            <CandidateRanking
              job={selectedJob || jobs[0]}
              accessToken={accessToken}
              onStatusUpdate={loadAnalytics}
            />
          </TabsContent>
          
          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <HRAnalytics analytics={analytics} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}