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
    const monthsUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);

    if (monthsUntilExpiry <= 0) {
      return <Badge variant="destructive">Expired</Badge>;
    } else if (monthsUntilExpiry <= 6) {
      return <Badge variant="warning">Expiring Soon</Badge>;
    }
    return <Badge variant="secondary">Valid</Badge>;
  };

  return (
    <div className="border rounded-lg">
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
  );
}
