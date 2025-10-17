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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

// Mock plant data
const mockPlants = [
  {
    id: "1",
    name: "Houston Plant",
    location: "Houston, TX",
    status: "active",
    employees: 156,
    complianceRate: 94.5,
    activeUsers: 142,
    totalCourses: 24,
    completedCourses: 148,
    inProgressCourses: 8,
    safetyIncidents: 2,
    lastInspection: "2024-01-10",
    nextInspection: "2024-04-10",
    manager: "John Smith",
    managerEmail: "john.smith@specchem.com",
    managerPhone: "+1 (555) 123-4567",
    address: "1234 Industrial Blvd, Houston, TX 77001",
    establishedDate: "2018-03-15",
    departments: ["Safety", "Operations", "Maintenance", "Training"],
    certifications: ["ISO 14001", "OHSAS 18001", "OSHA VPP"],
  },
  {
    id: "2",
    name: "Dallas Plant",
    location: "Dallas, TX",
    status: "active",
    employees: 134,
    complianceRate: 92.3,
    activeUsers: 128,
    totalCourses: 22,
    completedCourses: 124,
    inProgressCourses: 6,
    safetyIncidents: 1,
    lastInspection: "2024-01-08",
    nextInspection: "2024-04-08",
    manager: "Sarah Johnson",
    managerEmail: "sarah.johnson@specchem.com",
    managerPhone: "+1 (555) 234-5678",
    address: "5678 Manufacturing Ave, Dallas, TX 75201",
    establishedDate: "2019-06-20",
    departments: ["Safety", "Operations", "Maintenance", "Quality"],
    certifications: ["ISO 14001", "OHSAS 18001"],
  },
  {
    id: "3",
    name: "Austin Plant",
    location: "Austin, TX",
    status: "active",
    employees: 98,
    complianceRate: 96.8,
    activeUsers: 95,
    totalCourses: 20,
    completedCourses: 95,
    inProgressCourses: 3,
    safetyIncidents: 0,
    lastInspection: "2024-01-12",
    nextInspection: "2024-04-12",
    manager: "Mike Chen",
    managerEmail: "mike.chen@specchem.com",
    managerPhone: "+1 (555) 345-6789",
    address: "9012 Production St, Austin, TX 73301",
    establishedDate: "2020-09-10",
    departments: ["Safety", "Operations", "Maintenance"],
    certifications: ["ISO 14001", "OSHA VPP"],
  },
];

export default function PlantsPage() {
  const [selectedStatus, setSelectedStatus] = React.useState("all");

  const filteredPlants = mockPlants.filter(plant => {
    return selectedStatus === "all" || plant.status === selectedStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getComplianceColor = (rate: number) => {
    if (rate >= 95) return "text-green-600";
    if (rate >= 90) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-1">Plant Management</h1>
          <p className="body-large">
            Monitor plant operations, compliance, and safety metrics across all
            locations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Add Plant
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plants</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPlants.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockPlants.filter(p => p.status === "active").length} active
            </p>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPlants.reduce((acc, plant) => acc + plant.employees, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all locations
            </p>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Compliance
            </CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                mockPlants.reduce(
                  (acc, plant) => acc + plant.complianceRate,
                  0
                ) / mockPlants.length
              )}
              %
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
              Safety Incidents
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPlants.reduce(
                (acc, plant) => acc + plant.safetyIncidents,
                0
              )}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Plant Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPlants.map(plant => (
          <Card key={plant.id} className="course-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{plant.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {plant.location}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(plant.status)}>
                  {plant.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold text-primary">
                    {plant.employees}
                  </div>
                  <p className="text-sm text-muted-foreground">Employees</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <div
                    className={`text-2xl font-bold ${getComplianceColor(plant.complianceRate)}`}
                  >
                    {plant.complianceRate}%
                  </div>
                  <p className="text-sm text-muted-foreground">Compliance</p>
                </div>
              </div>

              {/* Training Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Training Progress</span>
                  <span>
                    {plant.completedCourses}/{plant.totalCourses} courses
                  </span>
                </div>
                <Progress
                  value={(plant.completedCourses / plant.totalCourses) * 100}
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{plant.inProgressCourses} in progress</span>
                  <span>{plant.activeUsers} active users</span>
                </div>
              </div>

              {/* Safety Status */}
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-2">
                  {plant.safetyIncidents === 0 ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                  )}
                  <span className="text-sm font-medium">
                    {plant.safetyIncidents} incidents
                  </span>
                </div>
                <Badge
                  variant={
                    plant.safetyIncidents === 0 ? "default" : "secondary"
                  }
                >
                  {plant.safetyIncidents === 0 ? "Safe" : "Attention"}
                </Badge>
              </div>

              {/* Plant Manager */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Plant Manager</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{plant.manager}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {plant.managerEmail}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Contact
                  </Button>
                </div>
              </div>

              {/* Certifications */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Certifications</h4>
                <div className="flex flex-wrap gap-1">
                  {plant.certifications.map((cert, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Inspection Dates */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Last Inspection
                  </div>
                  <p className="font-medium">
                    {formatDate(plant.lastInspection)}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Next Inspection
                  </div>
                  <p className="font-medium">
                    {formatDate(plant.nextInspection)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Manage Users
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredPlants.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No plants found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filter criteria
          </p>
        </div>
      )}
    </div>
  );
}





