"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";

// Mock report data
const mockReports = {
  compliance: {
    overall: 94.5,
    byCategory: [
      { category: "Chemical Safety", rate: 96.2, trend: "up", change: 2.1 },
      { category: "Equipment Safety", rate: 93.8, trend: "up", change: 1.5 },
      { category: "Environmental", rate: 91.5, trend: "down", change: -0.8 },
      { category: "Emergency Response", rate: 97.1, trend: "up", change: 3.2 },
    ],
    byPlant: [
      { plant: "Houston Plant", rate: 94.5, employees: 156, completed: 148 },
      { plant: "Dallas Plant", rate: 92.3, employees: 134, completed: 124 },
      { plant: "Austin Plant", rate: 96.8, employees: 98, completed: 95 },
    ],
    byRole: [
      { role: "Safety Manager", rate: 98.5, count: 5 },
      { role: "Safety Instructor", rate: 97.2, count: 8 },
      { role: "Safety Coordinator", rate: 95.8, count: 12 },
      { role: "Plant Manager", rate: 94.1, count: 15 },
      { role: "Employee", rate: 92.3, count: 116 },
    ],
  },
  training: {
    totalCourses: 24,
    totalEnrollments: 1247,
    completionRate: 87.3,
    averageTime: "2.4 hours",
    byCourse: [
      {
        course: "Chemical Safety Fundamentals",
        enrolled: 245,
        completed: 231,
        rate: 94.3,
      },
      {
        course: "Equipment Safety Protocols",
        enrolled: 189,
        completed: 167,
        rate: 88.4,
      },
      {
        course: "Environmental Compliance",
        enrolled: 156,
        completed: 142,
        rate: 91.0,
      },
      {
        course: "Emergency Response Training",
        enrolled: 98,
        completed: 89,
        rate: 90.8,
      },
      {
        course: "Personal Protective Equipment",
        enrolled: 312,
        completed: 278,
        rate: 89.1,
      },
    ],
    byMonth: [
      { month: "Jan 2024", enrollments: 156, completions: 142 },
      { month: "Dec 2023", enrollments: 189, completions: 167 },
      { month: "Nov 2023", enrollments: 145, completions: 134 },
      { month: "Oct 2023", enrollments: 178, completions: 156 },
    ],
  },
  performance: {
    userEngagement: 78.5,
    courseRatings: 4.6,
    timeToComplete: "2.4 hours",
    retakeRate: 12.3,
    satisfaction: 4.7,
    byDepartment: [
      { department: "Safety", engagement: 89.2, compliance: 96.8 },
      { department: "Operations", engagement: 76.4, compliance: 92.3 },
      { department: "Maintenance", engagement: 71.8, compliance: 88.9 },
      { department: "Training", engagement: 94.1, compliance: 98.5 },
    ],
  },
  incidents: {
    total: 3,
    resolved: 2,
    pending: 1,
    byType: [
      { type: "Near Miss", count: 2, severity: "Low" },
      { type: "Minor Injury", count: 1, severity: "Medium" },
    ],
    byMonth: [
      { month: "Jan 2024", incidents: 1, resolved: 1 },
      { month: "Dec 2023", incidents: 2, resolved: 1 },
    ],
  },
};

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = React.useState("last-30-days");
  const [selectedPlant, setSelectedPlant] = React.useState("all");

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "destructive";
      case "Medium":
        return "secondary";
      case "Low":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-1">Reports & Analytics</h1>
          <p className="body-large">
            Comprehensive insights into training compliance, performance, and
            safety metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 days</SelectItem>
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="last-90-days">Last 90 days</SelectItem>
              <SelectItem value="last-year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedPlant} onValueChange={setSelectedPlant}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plants</SelectItem>
              <SelectItem value="houston">Houston Plant</SelectItem>
              <SelectItem value="dallas">Dallas Plant</SelectItem>
              <SelectItem value="austin">Austin Plant</SelectItem>
            </SelectContent>
          </Select>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Compliance
            </CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockReports.compliance.overall}%
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Training Completion
            </CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockReports.training.completionRate}%
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +1.8% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              User Engagement
            </CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockReports.performance.userEngagement}%
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +3.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Safety Incidents
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockReports.incidents.total}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingDown className="h-3 w-3" />
              -1 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Reports */}
      <Tabs defaultValue="compliance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="incidents">Safety Incidents</TabsTrigger>
        </TabsList>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compliance by Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Compliance by Category
                </CardTitle>
                <CardDescription>
                  Training completion rates by safety category
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockReports.compliance.byCategory.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {category.rate}%
                        </span>
                        {getTrendIcon(category.trend)}
                        <span
                          className={`text-xs ${
                            category.trend === "up"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {category.change > 0 ? "+" : ""}
                          {category.change}%
                        </span>
                      </div>
                    </div>
                    <Progress value={category.rate} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Compliance by Role */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Compliance by Role
                </CardTitle>
                <CardDescription>
                  Training completion rates by user role
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockReports.compliance.byRole.map((role, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{role.role}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {role.rate}%
                        </span>
                        <Badge variant="outline">{role.count} users</Badge>
                      </div>
                    </div>
                    <Progress value={role.rate} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Plant Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Plant Comparison</CardTitle>
              <CardDescription>
                Compliance metrics across different plant locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mockReports.compliance.byPlant.map((plant, index) => (
                  <div key={index} className="space-y-4">
                    <div className="text-center">
                      <h3 className="font-semibold">{plant.plant}</h3>
                      <p className="text-sm text-muted-foreground">
                        {plant.employees} employees
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {plant.rate}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Compliance Rate
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completed</span>
                        <span className="font-medium">
                          {plant.completed}/{plant.employees}
                        </span>
                      </div>
                      <Progress value={plant.rate} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Course Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Course Performance
                </CardTitle>
                <CardDescription>
                  Enrollment and completion rates by course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockReports.training.byCourse.map((course, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">
                        {course.course}
                      </span>
                      <span className="text-sm font-medium">
                        {course.rate}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {course.completed}/{course.enrolled} completed
                      </span>
                    </div>
                    <Progress value={course.rate} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Training Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Training Trends
                </CardTitle>
                <CardDescription>
                  Monthly enrollment and completion trends
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockReports.training.byMonth.map((month, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{month.month}</span>
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="font-medium">
                            {month.enrollments}
                          </span>
                          <span className="text-muted-foreground ml-1">
                            enrolled
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">
                            {month.completions}
                          </span>
                          <span className="text-muted-foreground ml-1">
                            completed
                          </span>
                        </div>
                      </div>
                    </div>
                    <Progress
                      value={(month.completions / month.enrollments) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Training Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Training Summary</CardTitle>
              <CardDescription>
                Overall training program statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {mockReports.training.totalCourses}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {mockReports.training.totalEnrollments}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total Enrollments
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {mockReports.training.completionRate}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Completion Rate
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {mockReports.training.averageTime}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Avg. Time to Complete
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Department Performance
                </CardTitle>
                <CardDescription>
                  Engagement and compliance by department
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockReports.performance.byDepartment.map((dept, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{dept.department}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {dept.engagement}% engagement
                        </Badge>
                        <Badge variant="secondary">
                          {dept.compliance}% compliance
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Engagement</span>
                          <span>{dept.engagement}%</span>
                        </div>
                        <Progress value={dept.engagement} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Compliance</span>
                          <span>{dept.compliance}%</span>
                        </div>
                        <Progress value={dept.compliance} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>
                  Key performance indicators and user satisfaction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">
                      {mockReports.performance.userEngagement}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      User Engagement
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">
                      {mockReports.performance.courseRatings}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Course Rating
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">
                      {mockReports.performance.timeToComplete}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Avg. Completion Time
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">
                      {mockReports.performance.satisfaction}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Satisfaction Score
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Incident Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Incident Summary
                </CardTitle>
                <CardDescription>
                  Safety incidents by type and severity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">
                      {mockReports.incidents.total}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total Incidents
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-green-600">
                      {mockReports.incidents.resolved}
                    </div>
                    <p className="text-sm text-muted-foreground">Resolved</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-orange-600">
                      {mockReports.incidents.pending}
                    </div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {mockReports.incidents.byType.map((incident, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">{incident.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {incident.count} incidents
                        </p>
                      </div>
                      <Badge
                        variant={getSeverityColor(incident.severity) as any}
                      >
                        {incident.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  Monthly Trends
                </CardTitle>
                <CardDescription>
                  Incident trends and resolution rates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockReports.incidents.byMonth.map((month, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{month.month}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {month.incidents} incidents
                        </span>
                        <Badge variant="outline">
                          {month.resolved} resolved
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Resolution Rate</span>
                      <span>
                        {Math.round((month.resolved / month.incidents) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={(month.resolved / month.incidents) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}





