import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DisclaimerGateProps {
  onAccept: () => void;
}

export default function DisclaimerGate({ onAccept }: DisclaimerGateProps) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Important Disclaimer
          </h2>
          <div className="w-12 h-1 bg-amber-500 rounded" />
        </div>
        <p className="text-gray-700 leading-relaxed text-sm">
          You are accessing this app for free legal consultations at your free
          will. The advises provided are preliminary in nature and does not
          constitute a full and final advises and should not be acted upon. The
          full and final advises will be subject to the full review of all the
          other relevant documents and materials.
        </p>
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-amber-600 cursor-pointer"
          />
          <span className="text-sm text-gray-600">
            I have read and understood the above disclaimer and wish to proceed.
          </span>
        </label>
        <Button
          onClick={onAccept}
          disabled={!checked}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Accept &amp; Continue
        </Button>
      </div>
    </div>
  );
}
