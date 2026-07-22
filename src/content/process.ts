import projAi from "@/assets/proj-ai.jpg";
import projAutomation from "@/assets/proj-automation.jpg";
import projSaas from "@/assets/proj-saas.jpg";

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  bannerImage: string;
  bannerTitle: string;
  bannerDescription: string;
}

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Discover",
    description: "We listen first. Understanding your goals, constraints, and opportunities before proposing any solution.",
    bannerImage: projAi,
    bannerTitle: "Workshops, interviews, audits",
    bannerDescription: "A 2-week discovery sprint aligning stakeholders, technical constraints, and success metrics.",
  },
  {
    step: "02",
    title: "Design",
    description: "We architect a tailored roadmap — technology, talent, and timeline aligned to your business outcomes.",
    bannerImage: projSaas,
    bannerTitle: "Architecture, prototypes, roadmap",
    bannerDescription: "Every deliverable, every milestone, every risk — documented before we write a line of code.",
  },
  {
    step: "03",
    title: "Deliver",
    description: "We execute with precision, keep communication transparent, and hand over solutions built to scale.",
    bannerImage: projAutomation,
    bannerTitle: "Ship, iterate, hand over",
    bannerDescription: "Weekly demos, transparent tracking, and complete documentation on delivery.",
  },
];
