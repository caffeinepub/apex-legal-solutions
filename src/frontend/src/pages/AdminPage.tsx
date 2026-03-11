import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Loader2, LogIn, LogOut, RefreshCw, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { ConsultationRequest } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  CaseType,
  ConsultationStatus,
  useGetAllRequests,
  useIsAdmin,
  useUpdateRequestStatus,
} from "../hooks/useQueries";

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
    // Motoko Time is nanoseconds
    return new Date(Number(ts / 1_000_000n)).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

function LoginScreen() {
  const { login, isLoggingIn } = useInternetIdentity();
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md px-4"
      >
        <div className="w-16 h-16 rounded-sm bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8 text-gold" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-foreground mb-3">
          Admin Portal
        </h1>
        <p className="text-muted-foreground mb-8">
          Sign in with Internet Identity to access the administration dashboard
          and manage consultation requests.
        </p>
        <Button
          onClick={login}
          disabled={isLoggingIn}
          data-ocid="admin.login.primary_button"
          className="bg-gold text-primary-foreground hover:bg-gold-light font-semibold px-8 py-5 h-auto"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Sign In to Admin
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}

function NotAdminScreen() {
  const { clear } = useInternetIdentity();
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center py-20">
      <div
        className="text-center max-w-md px-4"
        data-ocid="admin.access.error_state"
      >
        <div className="w-16 h-16 rounded-sm bg-destructive/10 border border-destructive/30 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-foreground mb-3">
          Access Denied
        </h1>
        <p className="text-muted-foreground mb-8">
          Your account does not have administrator privileges. Please contact a
          system administrator.
        </p>
        <Button
          onClick={clear}
          variant="outline"
          data-ocid="admin.logout.secondary_button"
          className="border-border text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const {
    data: requests,
    isLoading: reqLoading,
    refetch,
  } = useGetAllRequests();
  const updateStatus = useUpdateRequestStatus();
  const { clear } = useInternetIdentity();

  const [selectedRequest, setSelectedRequest] =
    useState<ConsultationRequest | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  if (isInitializing || adminLoading) {
    return (
      <div
        className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!identity) return <LoginScreen />;
  if (!isAdmin) return <NotAdminScreen />;

  const handleUpdateStatus = async (id: string, status: ConsultationStatus) => {
    setUpdatingId(id);
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success("Status updated successfully");
      if (selectedRequest?.id === id) {
        setSelectedRequest((prev) => (prev ? { ...prev, status } : prev));
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

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
              onClick={clear}
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
