import { Drug } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

type DrugListProps = {
  drugs: Drug[];
  isLoading: boolean;
};

export default function DrugList({ drugs, isLoading }: DrugListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  const getExpiryStatus = (date: string) => {
    const expiryDate = new Date(date);
    const now = new Date();
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry <= 0) {
      return <Badge variant="destructive">Expired</Badge>;
    } else if (daysUntilExpiry <= 60) {
      return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-300">Within 60 days</Badge>;
    } else if (daysUntilExpiry <= 90) {
      return <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-300">Within 90 days</Badge>;
    } else if (daysUntilExpiry <= 120) {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-300">Within 120 days</Badge>;
    }
    return <Badge variant="secondary">Valid</Badge>;
  };

  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden space-y-4">
        {drugs.map((drug) => (
          <Card key={drug.id} className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{drug.brandName}</h3>
                  <p className="text-sm text-muted-foreground">{drug.genericName}</p>
                </div>
                {getExpiryStatus(drug.expirationDate)}
              </div>
              <div className="text-sm">
                <p>Batch: {drug.batchNumber}</p>
                <p>Expires: {new Date(drug.expirationDate).toLocaleDateString()}</p>
                <p>Quantity: {drug.quantity}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand Name</TableHead>
              <TableHead>Generic Name</TableHead>
              <TableHead>Batch Number</TableHead>
              <TableHead>Expiration Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drugs.map((drug) => (
              <TableRow key={drug.id}>
                <TableCell className="font-medium">{drug.brandName}</TableCell>
                <TableCell>{drug.genericName}</TableCell>
                <TableCell>{drug.batchNumber}</TableCell>
                <TableCell>
                  {new Date(drug.expirationDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{getExpiryStatus(drug.expirationDate)}</TableCell>
                <TableCell>{drug.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}