import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  User,
  LogOut,
  Upload,
  Briefcase,
  TrendingUp,
  FileText,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import { ResumeUpload } from './ResumeUpload';
import { JobRecommendations } from './JobRecommendations';
import { MyApplications } from './MyApplications';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ApplicantDashboardProps {
  user: any;
  accessToken: string;
  onLogout: () => void;
}

export function ApplicantDashboard({ user, accessToken, onLogout }: ApplicantDashboardProps) {
  const [resumes, setResumes] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recommendations');
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadResumes(), loadApplications()]);
    setLoading(false);
  };
  
  const loadResumes = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3d608688/resumes/my-resumes`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      const data = await response.json();
      if (data.success) {
        setResumes(data.resumes);
      }
    } catch (error) {
      console.error('Error loading resumes:', error);
    }
  };
  
  const loadApplications = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3d608688/applications/my-applications`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      const data = await response.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };
  
  const getStatusStats = () => {
    return {
      total: applications.length,
      applied: applications.filter(a => a.status === 'applied').length,
      underReview: applications.filter(a => a.status === 'under_review').length,
      shortlisted: applications.filter(a => a.status === 'shortlisted').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
      hired: applications.filter(a => a.status === 'hired').length
    };
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
  
  const stats = getStatusStats();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl text-gray-900">Job Seeker Portal</h1>
              <p className="text-sm text-gray-600">Welcome, {user.user_metadata?.name || 'User'}</p>
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
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardDescription className="text-blue-100">Total Applications</CardDescription>
              <CardTitle className="text-4xl">{stats.total}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="w-4 h-4" />
                <span>Jobs applied</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-cyan-600 to-cyan-700 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardDescription className="text-cyan-100">Under Review</CardDescription>
              <CardTitle className="text-4xl">{stats.underReview}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>In progress</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardDescription className="text-green-100">Shortlisted</CardDescription>
              <CardTitle className="text-4xl">{stats.shortlisted}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Great news!</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-slate-600 to-slate-700 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-100">Resumes</CardDescription>
              <CardTitle className="text-4xl">{resumes.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4" />
                <span>Uploaded</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="recommendations">
              <TrendingUp className="w-4 h-4 mr-2" />
              Job Recommendations
            </TabsTrigger>
            <TabsTrigger value="applications">
              <Briefcase className="w-4 h-4 mr-2" />
              My Applications
            </TabsTrigger>
            <TabsTrigger value="resumes">
              <Upload className="w-4 h-4 mr-2" />
              Resume Management
            </TabsTrigger>
          </TabsList>
          
          {/* Job Recommendations Tab */}
          <TabsContent value="recommendations">
            <JobRecommendations
              accessToken={accessToken}
              hasResume={resumes.length > 0}
              onResumeUploadClick={() => setActiveTab('resumes')}
              onApplicationSuccess={loadApplications}
            />
          </TabsContent>
          
          {/* My Applications Tab */}
          <TabsContent value="applications">
            <MyApplications
              applications={applications}
              accessToken={accessToken}
              onRefresh={loadApplications}
            />
          </TabsContent>
          
          {/* Resume Management Tab */}
          <TabsContent value="resumes">
            <ResumeUpload
              accessToken={accessToken}
              resumes={resumes}
              onUploadSuccess={loadData}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}