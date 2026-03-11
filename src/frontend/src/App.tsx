import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import ConsultationModal from "./components/ConsultationModal";
import Footer from "./components/Footer";
import Header from "./components/Header";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import StatusPage from "./pages/StatusPage";

export type Page = "home" | "status" | "admin";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [consultationOpen, setConsultationOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onOpenConsultation={() => setConsultationOpen(true)}
      />
      <main className="flex-1">
        {currentPage === "home" && (
          <HomePage onOpenConsultation={() => setConsultationOpen(true)} />
        )}
        {currentPage === "status" && <StatusPage />}
        {currentPage === "admin" && <AdminPage />}
      </main>
      <Footer onNavigate={setCurrentPage} />
      <ConsultationModal
        open={consultationOpen}
        onClose={() => setConsultationOpen(false)}
      />
      <Toaster richColors />
    </div>
  );
}
