import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import {
  KeyRound,
  Loader2,
  LogOut,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { ConsultationRequest } from "../backend";
import { useActor } from "../hooks/useActor";
import { CaseType, ConsultationStatus } from "../hooks/useQueries";

const ADMIN_PIN = "ApexAdmin2024";

const CASE_TYPE_LABELS: Record<CaseType, string> = {
  [CaseType.civilLitigation]: "Civil Litigation",
  [CaseType.criminal]: "Criminal Defense",
  [CaseType.family]: "Family Law",
  [CaseType.employment]: "Employment Disputes",
  [CaseType.contracts]: "Contract Drafting",
  [CaseType.corporate]: "Corporate Advisory",
  [CaseType.realEstate]: "Real Estate",
  [CaseType.willsAndEstates]: "Wills & Estates",
};

const STATUS_BADGE: Record<
  ConsultationStatus,
  { label: string; className: string }
> = {
  [ConsultationStatus.pending]: {
    label: "Pending",
    className: "bg-yellow-400/20 text-yellow-300 border-yellow-400/30",
  },
  [ConsultationStatus.reviewed]: {
    label: "Reviewed",
    className: "bg-blue-400/20 text-blue-300 border-blue-400/30",
  },
  [ConsultationStatus.responded]: {
    label: "Responded",
    className: "bg-gold/20 text-gold-light border-gold/30",
  },
};

function formatDate(ts: bigint) {
  try {
    return new Date(Number(ts / 1_000_000n)).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "\u2014";
  }
}

interface LoginScreenProps {
  onLogin: (pin: string) => void;
}

function LoginScreen({ onLogin }: LoginScreenProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (pin === ADMIN_PIN) {
        onLogin(pin);
      } else {
        setError("Incorrect PIN. Please try again.");
        setPin("");
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md w-full px-4"
      >
        <div className="w-16 h-16 rounded-sm bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8 text-gold" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-foreground mb-3">
          Admin Portal
        </h1>
        <p className="text-muted-foreground mb-8">
          Enter your admin PIN to access the administration dashboard.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-sm p-6 text-left space-y-4"
        >
          <div className="space-y-2">
            <Label
              htmlFor="admin-pin"
              className="text-sm text-muted-foreground"
            >
              Admin PIN
            </Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="admin-pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter admin PIN"
                autoComplete="current-password"
                data-ocid="admin.pin.input"
                className="pl-9 bg-secondary border-border focus:border-gold focus:ring-gold/20"
              />
            </div>
            {error && (
              <p
                className="text-destructive text-sm"
                data-ocid="admin.login.error_state"
              >
                {error}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={loading || !pin}
            data-ocid="admin.login.primary_button"
            className="w-full bg-gold text-primary-foreground hover:bg-gold-light font-semibold py-5 h-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [pin, setPin] = useState("");

  const { actor, isFetching } = useActor();

  const {
    data: requests,
    isLoading: reqLoading,
    refetch,
  } = useQuery<ConsultationRequest[]>({
    queryKey: ["allRequestsPin", pin],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllRequestsWithPin(pin);
      } catch {
        toast.error("Failed to load requests. Please re-login.");
        setLoggedIn(false);
        return [];
      }
    },
    enabled: !!actor && !isFetching && loggedIn,
  });

  const [selectedRequest, setSelectedRequest] =
    useState<ConsultationRequest | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleLogin = (enteredPin: string) => {
    setPin(enteredPin);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setPin("");
  };

  const handleUpdateStatus = async (id: string, status: ConsultationStatus) => {
    if (!actor) return;
    setUpdatingId(id);
    try {
      await actor.updateRequestStatusWithPin(id, status, pin);
      toast.success("Status updated successfully");
      if (selectedRequest?.id === id) {
        setSelectedRequest((prev) => (prev ? { ...prev, status } : prev));
      }
      refetch();
    } catch {
      toast.error("Failed to update status. PIN may be invalid.");
      setLoggedIn(false);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!loggedIn) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="h-px w-6 bg-gold" />
              <span className="text-gold text-xs font-semibold uppercase tracking-[0.3em]">
                Admin Portal
              </span>
            </div>
            <h1 className="font-display text-3xl font-semibold text-foreground">
              Consultation Requests
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {requests?.length ?? 0} total requests
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              data-ocid="admin.refresh.secondary_button"
              className="border-border text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              data-ocid="admin.logout.secondary_button"
              className="border-border text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              Sign Out
            </Button>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card border border-border rounded-sm shadow-card overflow-hidden"
          data-ocid="admin.requests.table"
        >
          {reqLoading ? (
            <div
              className="p-8 space-y-3"
              data-ocid="admin.requests.loading_state"
            >
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full bg-secondary" />
              ))}
            </div>
          ) : !requests?.length ? (
            <div
              className="p-16 text-center"
              data-ocid="admin.requests.empty_state"
            >
              <p className="text-muted-foreground">
                No consultation requests yet.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                    Name
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                    Email
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                    Case Type
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                    Date
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req, i) => (
                  <TableRow
                    key={req.id}
                    data-ocid={`admin.request.row.${i + 1}`}
                    className="border-border hover:bg-secondary/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedRequest(req)}
                  >
                    <TableCell className="font-medium text-foreground">
                      {req.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {req.email}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {CASE_TYPE_LABELS[req.caseType] ?? req.caseType}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(req.submittedAt)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${STATUS_BADGE[req.status]?.className ?? ""}`}
                      >
                        {STATUS_BADGE[req.status]?.label ?? req.status}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={req.status}
                        onValueChange={(v) =>
                          handleUpdateStatus(req.id, v as ConsultationStatus)
                        }
                        disabled={updatingId === req.id}
                      >
                        <SelectTrigger
                          data-ocid={`admin.status.select.${i + 1}`}
                          className="w-32 h-7 text-xs bg-secondary border-border"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem
                            value={ConsultationStatus.pending}
                            className="text-xs focus:bg-secondary"
                          >
                            Pending
                          </SelectItem>
                          <SelectItem
                            value={ConsultationStatus.reviewed}
                            className="text-xs focus:bg-secondary"
                          >
                            Reviewed
                          </SelectItem>
                          <SelectItem
                            value={ConsultationStatus.responded}
                            className="text-xs focus:bg-secondary"
                          >
                            Responded
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </motion.div>
      </div>

      {/* Detail Modal */}
      <Dialog
        open={!!selectedRequest}
        onOpenChange={(o) => !o && setSelectedRequest(null)}
      >
        <DialogContent
          className="max-w-lg bg-card border-border shadow-card"
          data-ocid="admin.request.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-foreground">
              Request Details
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Full consultation request information.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Name
                  </p>
                  <p className="text-foreground font-medium">
                    {selectedRequest.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Status
                  </p>
                  <Badge
                    variant="outline"
                    className={`text-xs ${STATUS_BADGE[selectedRequest.status]?.className ?? ""}`}
                  >
                    {STATUS_BADGE[selectedRequest.status]?.label ??
                      selectedRequest.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Email
                  </p>
                  <p className="text-foreground text-sm">
                    {selectedRequest.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Phone
                  </p>
                  <p className="text-foreground text-sm">
                    {selectedRequest.phone}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Case Type
                  </p>
                  <p className="text-foreground text-sm">
                    {CASE_TYPE_LABELS[selectedRequest.caseType] ??
                      selectedRequest.caseType}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Request ID
                  </p>
                  <p className="text-gold font-mono text-xs break-all">
                    {selectedRequest.id}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Description
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed bg-secondary p-3 rounded-sm">
                    {selectedRequest.description}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Update Status
                  </p>
                  <Select
                    value={selectedRequest.status}
                    onValueChange={(v) =>
                      handleUpdateStatus(
                        selectedRequest.id,
                        v as ConsultationStatus,
                      )
                    }
                    disabled={updatingId === selectedRequest.id}
                  >
                    <SelectTrigger
                      data-ocid="admin.detail.status.select"
                      className="bg-secondary border-border"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value={ConsultationStatus.pending}>
                        Pending
                      </SelectItem>
                      <SelectItem value={ConsultationStatus.reviewed}>
                        Reviewed
                      </SelectItem>
                      <SelectItem value={ConsultationStatus.responded}>
                        Responded
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedRequest(null)}
                  data-ocid="admin.request.close.button"
                  className="border-border text-muted-foreground hover:text-foreground"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
