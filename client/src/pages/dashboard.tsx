import { useQuery } from "@tanstack/react-query";
import { Drug } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, Package, Clock } from "lucide-react";
import NavSidebar from "@/components/nav-sidebar";

export default function Dashboard() {
  const { user } = useAuth();
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

  // Get current date
  const now = new Date();

  // Define expiration categories
  const expiring30Days = drugs?.filter(drug => {
    const expirationDate = new Date(drug.expirationDate);
    const daysUntilExpiration = Math.floor((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration > 0 && daysUntilExpiration <= 30;
  }) || [];

  const expiring60Days = drugs?.filter(drug => {
    const expirationDate = new Date(drug.expirationDate);
    const daysUntilExpiration = Math.floor((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration > 30 && daysUntilExpiration <= 60;
  }) || [];

  const expiring90Days = drugs?.filter(drug => {
    const expirationDate = new Date(drug.expirationDate);
    const daysUntilExpiration = Math.floor((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration > 60 && daysUntilExpiration <= 90;
  }) || [];

  const expiring120Days = drugs?.filter(drug => {
    const expirationDate = new Date(drug.expirationDate);
    const daysUntilExpiration = Math.floor((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration > 90 && daysUntilExpiration <= 120;
  }) || [];

  // Combine all expiring drugs for the main list
  const expiringDrugs = [...expiring30Days, ...expiring60Days, ...expiring90Days, ...expiring120Days].sort((a, b) => {
    return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
  });

  const totalDrugs = drugs?.length || 0;
  const expiredDrugs = drugs?.filter(drug => new Date(drug.expirationDate) <= now).length || 0;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      <NavSidebar />
      <main className="flex-1 p-4 sm:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Welcome message with improved visibility across all devices */}
          <Card className="mb-6 sticky top-0 z-10">
            <CardContent className="pt-6 pb-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center">
                Welcome, {user?.username}
              </h1>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Drugs</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDrugs}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Expired</CardTitle>
                <AlertCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{expiredDrugs}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">All Expiring Soon</CardTitle>
                <Clock className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{expiringDrugs.length}</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-6 sm:mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 bg-red-100 dark:bg-red-950/40">
                <CardTitle className="text-sm font-medium">Within 30 Days</CardTitle>
                <Clock className="h-4 w-4 text-red-700" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-700">{expiring30Days.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 bg-orange-50 dark:bg-orange-950/30">
                <CardTitle className="text-sm font-medium">Within 60 Days</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{expiring60Days.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 bg-amber-50 dark:bg-amber-950/30">
                <CardTitle className="text-sm font-medium">Within 90 Days</CardTitle>
                <Clock className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{expiring90Days.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 bg-violet-50 dark:bg-violet-950/30">
                <CardTitle className="text-sm font-medium">Within 120 Days</CardTitle>
                <Clock className="h-4 w-4 text-violet-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-violet-600">{expiring120Days.length}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Drugs Expiring Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expiringDrugs?.map(drug => {
                  // Calculate days until expiration
                  const expirationDate = new Date(drug.expirationDate);
                  const daysUntilExpiration = Math.floor((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  
                  // Determine expiration category and styling
                  let badgeVariant = "outline";
                  let badgeText = "Within 120 days";
                  let badgeClass = "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300";
                  
                  if (daysUntilExpiration <= 30) {
                    badgeVariant = "destructive";
                    badgeText = "Within 30 days";
                    badgeClass = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
                  } else if (daysUntilExpiration <= 60) {
                    badgeVariant = "outline";
                    badgeText = "Within 60 days";
                    badgeClass = "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";
                  } else if (daysUntilExpiration <= 90) {
                    badgeVariant = "outline";
                    badgeText = "Within 90 days";
                    badgeClass = "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
                  }
                  
                  return (
                    <div key={drug.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded ${badgeClass}`}>
                      <div className="mb-2 sm:mb-0">
                        <h3 className="font-semibold">{drug.brandName}</h3>
                        <p className="text-sm">Batch: {drug.batchNumber}</p>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-1">
                        <div className="px-2 py-0.5 rounded text-xs font-medium bg-background/80 border">
                          {badgeText}
                        </div>
                        <p className="text-sm font-medium">Expires on</p>
                        <p className="text-sm">
                          {new Date(drug.expirationDate).toLocaleDateString()} 
                          <span className="text-xs ml-1">({daysUntilExpiration} days)</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}