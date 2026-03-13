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
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Copy, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { CaseType } from "../hooks/useQueries";

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

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ConsultationModal({ open, onClose }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    caseType: "" as CaseType | "",
    description: "",
  });
  const [requestId, setRequestId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { actor, isFetching: actorLoading } = useActor();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.caseType || !actor || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const id = await actor.submitConsultationRequest(
        form.name,
        form.email,
        form.phone,
        form.caseType as CaseType,
        form.description,
      );
      const idStr = String(id);
      setRequestId(idStr);
    } catch (err) {
      console.error("Consultation submit error:", err);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setForm({
        name: "",
        email: "",
        phone: "",
        caseType: "",
        description: "",
      });
      setRequestId(null);
      setIsSubmitting(false);
    }, 300);
  };

  const copyId = () => {
    if (requestId) {
      navigator.clipboard.writeText(requestId);
      toast.success("Request ID copied!");
    }
  };

  const isReady = !!actor && !actorLoading;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className="max-w-lg bg-card border-border shadow-card"
        data-ocid="consultation.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground">
            {requestId ? "Request Submitted" : "Request Free Consultation"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {requestId
              ? "Your consultation request has been received. Use the ID below to track your case."
              : "Complete the form below. A qualified attorney will review your case shortly."}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {requestId ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-6"
              data-ocid="consultation.success_state"
            >
              <div className="flex flex-col items-center gap-5 text-center">
                <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-gold" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your unique Request ID
                  </p>
                  <div className="flex items-center gap-2 bg-secondary rounded-sm px-4 py-3">
                    <code className="text-gold font-mono text-sm flex-1 break-all">
                      {requestId}
                    </code>
                    <button
                      type="button"
                      onClick={copyId}
                      data-ocid="consultation.copy.button"
                      className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                      aria-label="Copy ID"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Save this ID to check your consultation status.
                  </p>
                </div>
                <Button
                  onClick={handleClose}
                  data-ocid="consultation.close.button"
                  className="bg-gold text-primary-foreground hover:bg-gold-light w-full"
                >
                  Done
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="grid gap-4 pt-2"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="cons-name"
                    className="text-xs text-muted-foreground uppercase tracking-wider"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="cons-name"
                    data-ocid="consultation.name.input"
                    required
                    placeholder="John Adeyemi"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="bg-secondary border-border focus:border-gold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="cons-email"
                    className="text-xs text-muted-foreground uppercase tracking-wider"
                  >
                    Email
                  </Label>
                  <Input
                    id="cons-email"
                    type="email"
                    data-ocid="consultation.email.input"
                    required
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    className="bg-secondary border-border focus:border-gold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="cons-phone"
                  className="text-xs text-muted-foreground uppercase tracking-wider"
                >
                  Phone Number
                </Label>
                <Input
                  id="cons-phone"
                  type="tel"
                  data-ocid="consultation.phone.input"
                  required
                  placeholder="+234 800 000 0000"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="bg-secondary border-border focus:border-gold"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Case Type
                </Label>
                <Select
                  value={form.caseType}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, caseType: v as CaseType }))
                  }
                  required
                >
                  <SelectTrigger
                    data-ocid="consultation.casetype.select"
                    className="bg-secondary border-border focus:border-gold"
                  >
                    <SelectValue placeholder="Select case type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {Object.entries(CASE_TYPE_LABELS).map(([value, label]) => (
                      <SelectItem
                        key={value}
                        value={value}
                        className="focus:bg-secondary"
                      >
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="cons-desc"
                  className="text-xs text-muted-foreground uppercase tracking-wider"
                >
                  Brief Description
                </Label>
                <Textarea
                  id="cons-desc"
                  data-ocid="consultation.description.textarea"
                  required
                  placeholder="Briefly describe your legal situation..."
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  className="bg-secondary border-border focus:border-gold resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  data-ocid="consultation.cancel.button"
                  className="flex-1 border-border text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  data-ocid="consultation.submit.button"
                  disabled={isSubmitting || !form.caseType || !isReady}
                  className="flex-1 bg-gold text-primary-foreground hover:bg-gold-light font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : !isReady ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Connecting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </div>

              {isSubmitting && (
                <div
                  data-ocid="consultation.loading_state"
                  className="text-center text-xs text-muted-foreground"
                >
                  Connecting to the blockchain...
                </div>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
