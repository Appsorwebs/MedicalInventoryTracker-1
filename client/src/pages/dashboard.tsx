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

  const expiringDrugs = drugs?.filter(drug => {
    const expirationDate = new Date(drug.expirationDate);
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    return expirationDate <= sixMonthsFromNow;
  });

  const totalDrugs = drugs?.length || 0;
  const expiredDrugs = drugs?.filter(drug => new Date(drug.expirationDate) <= new Date()).length || 0;

  return (
    <div className="flex h-screen bg-background">
      <NavSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Welcome, {user?.username}</h1>
          
          <div className="grid gap-6 md:grid-cols-3 mb-8">
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
                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{expiringDrugs?.length}</div>
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
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Drugs Expiring Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expiringDrugs?.map(drug => (
                  <div key={drug.id} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <h3 className="font-semibold">{drug.brandName}</h3>
                      <p className="text-sm text-muted-foreground">Batch: {drug.batchNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Expires on</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(drug.expirationDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
