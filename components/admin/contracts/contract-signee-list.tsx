import { ContractWithSigners } from "@/lib/actions/contracts/get-contract";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Mail } from "lucide-react";

interface ContractSigneesListProps {
  contractId: string;
  signers: ContractWithSigners["signers"];
}

export function ContractSigneesList({ signers }: ContractSigneesListProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Signers</span>
          <Badge variant="secondary">{signers.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {signers.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No signers added yet. Click &quot;Invite Signees&quot; to begin.
          </p>
        ) : (
          signers.map((signer) => (
            <div
              key={signer.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 text-sm"
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-medium">{signer.name || signer.email}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {signer.email}
                </span>
              </div>

              {signer.status === "SIGNED" ? (
                <Badge className="bg-emerald-600 hover:bg-emerald-700 gap-1 text-white">
                  <CheckCircle2 className="w-3 h-3" /> Signed
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1 text-amber-600 border-amber-300">
                  <Clock className="w-3 h-3" /> Pending
                </Badge>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}