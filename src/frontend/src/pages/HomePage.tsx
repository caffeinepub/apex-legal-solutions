import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Briefcase,
  Building,
  Building2,
  FileText,
  Gavel,
  Home,
  Receipt,
  Scale,
  ScrollText,
  Shield,
  ShieldAlert,
  Users,
} from "lucide-react";
import type { Variants } from "motion/react";
import { motion } from "motion/react";

const litigationServices = [
  {
    icon: Scale,
    title: "Civil Litigation",
    description:
      "Expert representation in civil disputes, contract claims, and tort cases. We fight for your rights in every civil matter.",
  },
  {
    icon: Shield,
    title: "Criminal Defense",
    description:
      "Vigorous defense against criminal charges. We protect your freedom and ensure due process at every stage.",
  },
  {
    icon: Users,
    title: "Family Law",
    description:
      "Compassionate guidance through divorce, custody disputes, adoption, and all matters affecting families.",
  },
  {
    icon: Briefcase,
    title: "Employment Disputes",
    description:
      "Defending employee rights against wrongful termination, discrimination, and workplace violations.",
  },
  {
    icon: Gavel,
    title: "Arbitration",
    description:
      "Skilled arbitration counsel for commercial and civil disputes. We help you resolve conflicts efficiently outside traditional court proceedings.",
  },
  {
    icon: ShieldAlert,
    title: "Consumer Disputes",
    description:
      "Protecting consumers against unfair trade practices, defective products, and contractual breaches. We ensure your consumer rights are upheld.",
  },
  {
    icon: ScrollText,
    title: "Human Rights Issues",
    description:
      "Dedicated advocacy for fundamental human rights violations. We stand up against discrimination, unlawful detention, and breaches of constitutional rights.",
  },
];

const nonLitigationServices = [
  {
    icon: FileText,
    title: "Contract Drafting",
    description:
      "Precision-crafted contracts that protect your interests. From simple agreements to complex commercial deals.",
  },
  {
    icon: Receipt,
    title: "Tax Advisories and Compliance",
    description:
      "Strategic tax planning and compliance counsel for individuals and businesses — navigating tax laws, filings, and regulatory requirements.",
  },
  {
    icon: Home,
    title: "Real Estate",
    description:
      "Comprehensive legal support for property transactions, title reviews, leases, and development projects.",
  },
  {
    icon: Building2,
    title: "Wills & Estates",
    description:
      "Thoughtful estate planning — wills, trusts, probate, and succession to protect your legacy.",
  },
  {
    icon: Building,
    title: "Business Formation and Compliance",
    description:
      "End-to-end legal support for starting your business — entity selection, registration, structuring, and ongoing compliance to set you up for success.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface Props {
  onOpenConsultation: () => void;
}

export default function HomePage({ onOpenConsultation }: Props) {
  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-[88vh] flex items-center overflow-hidden"
        data-ocid="hero.section"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-lexconsult.dim_1600x800.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl"
          >
            {/* Tagline pill */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-8"
            >
              <div className="h-px w-8 bg-gold" />
              <span className="text-gold text-xs font-semibold uppercase tracking-[0.3em]">
                Free Legal Consultation
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] text-foreground mb-6"
            >
              Justice.
              <br />
              <span className="text-gold">Clarity.</span>
              <br />
              Results.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl"
            >
              Apex Legal Solutions provides expert legal representation across
              litigation and advisory services. Every client deserves access to
              exceptional legal counsel — that's why your first consultation is
              always free.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                onClick={onOpenConsultation}
                data-ocid="hero.consultation.primary_button"
                className="bg-gold text-primary-foreground hover:bg-gold-light font-semibold text-base px-8 py-6 h-auto rounded-sm shadow-gold group"
              >
                Request Free Consultation
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                data-ocid="hero.services.secondary_button"
                onClick={() =>
                  document
                    .getElementById("services")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary font-medium text-base px-8 py-6 h-auto rounded-sm"
              >
                Our Services
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute bottom-0 left-0 right-0 bg-card/80 backdrop-blur-sm border-t border-border"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
              {[
                { value: "15+", label: "Years Experience" },
                { value: "12", label: "Practice Areas" },
                { value: "100%", label: "Free Consultation" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-2xl font-semibold text-gold">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Services */}
      <section
        id="services"
        className="py-24 bg-background"
        data-ocid="services.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-gold" />
              <span className="text-gold text-xs font-semibold uppercase tracking-[0.3em]">
                Practice Areas
              </span>
              <div className="h-px w-8 bg-gold" />
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-foreground">
              Comprehensive Legal Services
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              From the courtroom to the boardroom, our attorneys bring decades
              of combined expertise to every client engagement.
            </p>
          </motion.div>

          {/* Two columns */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Litigation */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-semibold text-gold uppercase tracking-[0.25em] px-3">
                  Litigation Services
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid gap-4"
              >
                {litigationServices.map((service, i) => (
                  <motion.div
                    key={service.title}
                    variants={cardVariants}
                    data-ocid={`litigation.service.item.${i + 1}`}
                    className="group flex gap-4 p-5 rounded-sm bg-card border border-border hover:border-gold/40 hover:shadow-gold-sm transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-sm bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                      <service.icon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {service.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Non-litigation */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-semibold text-gold uppercase tracking-[0.25em] px-3">
                  Non-Litigation
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid gap-4"
              >
                {nonLitigationServices.map((service, i) => (
                  <motion.div
                    key={service.title}
                    variants={cardVariants}
                    data-ocid={`nonlitigation.service.item.${i + 1}`}
                    className="group flex gap-4 p-5 rounded-sm bg-card border border-border hover:border-gold/40 hover:shadow-gold-sm transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-sm bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                      <service.icon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {service.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section
        className="py-24 bg-card border-y border-border"
        data-ocid="about.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="h-px w-8 bg-gold" />
              <span className="text-gold text-xs font-semibold uppercase tracking-[0.3em]">
                About Apex Legal Solutions
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-6 leading-tight">
              Legal Expertise,
              <br />
              <span className="text-gold">Accessible to All</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Apex Legal Solutions was founded on a singular belief: that
                quality legal representation should not be a privilege reserved
                for the few. Every person, regardless of background, deserves
                access to expert legal counsel when they need it most.
              </p>
              <p>
                Our team of seasoned attorneys brings decades of combined
                experience across both litigation and advisory practices.
                Whether you're facing a criminal charge, navigating a business
                dispute, or planning your estate, we bring the full weight of
                our expertise to your case.
              </p>
              <p className="text-foreground font-medium">
                That's why every consultation is completely free. No
                obligations. No hidden fees. Just honest legal guidance.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-background" data-ocid="cta.section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="h-px w-8 bg-gold" />
              <span className="text-gold text-xs font-semibold uppercase tracking-[0.3em]">
                Get Started Today
              </span>
              <div className="h-px w-8 bg-gold" />
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-6">
              Your Legal Matter Deserves
              <br />
              Expert Attention
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
              Don't navigate complex legal waters alone. Request a free
              consultation today and let our experienced attorneys guide you
              toward the best possible outcome.
            </p>
            <Button
              onClick={onOpenConsultation}
              data-ocid="cta.consultation.primary_button"
              className="bg-gold text-primary-foreground hover:bg-gold-light font-semibold text-base px-10 py-6 h-auto rounded-sm shadow-gold group"
            >
              Request Free Consultation
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
