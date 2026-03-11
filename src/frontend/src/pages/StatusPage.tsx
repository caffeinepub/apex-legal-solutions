import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  MessageSquare,
  Search,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ConsultationStatus, useCheckStatus } from "../hooks/useQueries";

const STATUS_CONFIG: Record<
  ConsultationStatus,
  {
    label: string;
    icon: typeof Clock;
    color: string;
    bg: string;
    description: string;
  }
> = {
  [ConsultationStatus.pending]: {
    label: "Pending",
    icon: Clock,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/30",
    description:
      "Your request has been received and is awaiting attorney review.",
  },
  [ConsultationStatus.reviewed]: {
    label: "Reviewed",
    icon: CheckCircle2,
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/30",
    description:
      "An attorney has reviewed your case and is preparing a response.",
  },
  [ConsultationStatus.responded]: {
    label: "Responded",
    icon: MessageSquare,
    color: "text-gold",
    bg: "bg-gold/10 border-gold/30",
    description: "An attorney has responded to your consultation request.",
  },
};

export default function StatusPage() {
  const [requestId, setRequestId] = useState("");
  const [result, setResult] = useState<ConsultationStatus | null>(null);
  const [notFound, setNotFound] = useState(false);

  const check = useCheckStatus();

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestId.trim()) return;
    setNotFound(false);
    setResult(null);
    try {
      const status = await check.mutateAsync(requestId.trim());
      setResult(status);
    } catch {
      setNotFound(true);
      toast.error("Request ID not found. Please check and try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background py-20">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-gold" />
              <span className="text-gold text-xs font-semibold uppercase tracking-[0.3em]">
                Case Tracker
              </span>
              <div className="h-px w-8 bg-gold" />
            </div>
            <h1 className="font-display text-4xl font-semibold text-foreground mb-3">
              Check Request Status
            </h1>
            <p className="text-muted-foreground">
              Enter the unique Request ID you received after submitting your
              consultation form.
            </p>
          </div>

          <div className="bg-card border border-border rounded-sm p-8 shadow-card">
            <form onSubmit={handleCheck} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="request-id"
                  className="text-xs text-muted-foreground uppercase tracking-wider"
                >
                  Request ID
                </Label>
                <Input
                  id="request-id"
                  data-ocid="status.requestid.input"
                  placeholder="Enter your request ID..."
                  value={requestId}
                  onChange={(e) => setRequestId(e.target.value)}
                  className="bg-secondary border-border focus:border-gold font-mono text-sm"
                  required
                />
              </div>
              <Button
                type="submit"
                data-ocid="status.check.primary_button"
                disabled={check.isPending || !requestId.trim()}
                className="w-full bg-gold text-primary-foreground hover:bg-gold-light font-semibold py-5 h-auto"
              >
                {check.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Check Status
                  </>
                )}
              </Button>

              {check.isPending && (
                <div
                  data-ocid="status.loading_state"
                  className="text-center text-xs text-muted-foreground"
                >
                  Looking up your request...
                </div>
              )}
            </form>

            {/* Result */}
            {result &&
              (() => {
                const config = STATUS_CONFIG[result];
                const Icon = config.icon;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 pt-6 border-t border-border"
                    data-ocid="status.result.panel"
                  >
                    <div
                      className={`flex items-start gap-4 p-5 rounded-sm border ${config.bg}`}
                    >
                      <Icon
                        className={`w-6 h-6 mt-0.5 flex-shrink-0 ${config.color}`}
                      />
                      <div>
                        <div
                          className={`text-lg font-semibold font-display ${config.color}`}
                        >
                          {config.label}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {config.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })()}

            {notFound && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                data-ocid="status.error_state"
                className="mt-6 pt-6 border-t border-border"
              >
                <div className="flex items-start gap-4 p-5 rounded-sm border bg-destructive/10 border-destructive/30">
                  <AlertCircle className="w-6 h-6 mt-0.5 flex-shrink-0 text-destructive" />
                  <div>
                    <div className="text-lg font-semibold font-display text-destructive">
                      Not Found
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      No request found with this ID. Please double-check the ID
                      and try again.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
