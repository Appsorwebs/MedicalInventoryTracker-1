import { useQuery } from "@tanstack/react-query";
import { Drug } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Loader2 } from "lucide-react";
import NavSidebar from "@/components/nav-sidebar";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function Reports() {
  const { data: drugs, isLoading } = useQuery<Drug[]>({
    queryKey: ["/api/drugs"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  // Calculate expiration statistics
  const now = new Date();
  const expirationStats = {
    expired: 0,
    within30Days: 0,
    within90Days: 0,
    within180Days: 0,
    beyond180Days: 0,
  };

  drugs?.forEach((drug) => {
    const expirationDate = new Date(drug.expirationDate);
    const daysUntilExpiration = Math.floor(
      (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiration <= 0) expirationStats.expired++;
    else if (daysUntilExpiration <= 30) expirationStats.within30Days++;
    else if (daysUntilExpiration <= 90) expirationStats.within90Days++;
    else if (daysUntilExpiration <= 180) expirationStats.within180Days++;
    else expirationStats.beyond180Days++;
  });

  const expirationData = [
    { name: "Expired", value: expirationStats.expired },
    { name: "30 Days", value: expirationStats.within30Days },
    { name: "90 Days", value: expirationStats.within90Days },
    { name: "180 Days", value: expirationStats.within180Days },
    { name: ">180 Days", value: expirationStats.beyond180Days },
  ];

  // Calculate inventory by dosage form
  const dosageFormCount = drugs?.reduce((acc, drug) => {
    acc[drug.dosageForm] = (acc[drug.dosageForm] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dosageFormData = Object.entries(dosageFormCount || {}).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      <NavSidebar />
      <main className="flex-1 p-4 sm:p-8 overflow-auto mt-16 lg:mt-0">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Analytics & Reports</h1>

          <div className="grid gap-6 grid-cols-1 xl:grid-cols-2 mb-6">
            {/* Expiration Timeline Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Drug Expiration Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expirationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Dosage Forms Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Dosage Forms Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dosageFormData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {dosageFormData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Statistics */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Drugs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{drugs?.length || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Expired</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {expirationStats.expired}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Expiring Soon (30 days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {expirationStats.within30Days}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Dosage Forms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Object.keys(dosageFormCount || {}).length}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
