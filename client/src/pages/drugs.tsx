import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Drug } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import DrugList from "@/components/drug-list";
import DrugForm from "@/components/drug-form";
import NavSidebar from "@/components/nav-sidebar";
import { useAuth } from "@/hooks/use-auth";

export default function Drugs() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const { data: drugs, isLoading } = useQuery<Drug[]>({
    queryKey: ["/api/drugs"],
  });

  const canAddDrugs = ["admin", "pharmacist"].includes(user?.role || "");

  return (
    <div className="flex h-screen bg-background">
      <NavSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Drug Inventory</h1>
            {canAddDrugs && (
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Drug
              </Button>
            )}
          </div>

          <DrugList drugs={drugs || []} isLoading={isLoading} />

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DrugForm onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}
