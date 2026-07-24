export type DomainSlug =
  | "artificial-intelligence"
  | "automation"
  | "software-development"
  | "robotics-embedded"
  | "iot-smart-systems"
  | "electronics-hardware"
  | "emerging-technologies"
  | "drone-technology"
  | "business-solutions"
  | "ui-ux-creative"
  | "digital-services";

export interface Domain {
  slug: DomainSlug;
  title: string;
  short: string;
  icon: string; // lucide icon name
  banner: string; // image url
  video?: string;
  items: string[];
  overview: string;
  services: { title: string; description: string }[];
  faq: { q: string; a: string }[];
  featured: boolean;
  order: number;
}

import projAi from "@/assets/proj-ai.jpg";
import projAutomation from "@/assets/proj-automation.jpg";
import projSaas from "@/assets/proj-saas.jpg";
import projRobotics from "@/assets/proj-robotics.jpg";
import projIot from "@/assets/proj-iot.jpg";
import projDrone from "@/assets/proj-drone.jpg";

export const domains: Domain[] = [
  {
    slug: "artificial-intelligence",
    title: "Artificial Intelligence",
    short: "Generative AI, agents, vision, NLP, and workflow automation.",
    icon: "Bot",
    banner: projAi,
    items: [
      "Generative AI",
      "Machine Learning",
      "Computer Vision",
      "NLP",
      "AI Agents",
      "AI Assistants",
      "AI Chatbots",
      "AI Voice Agents",
      "AI Workflow Automation",
      "AI Document Processing",
    ],
    overview:
      "We design and deploy production-grade AI systems — from custom LLM assistants to computer vision pipelines — that plug directly into your existing tools.",
    services: [
      { title: "Custom LLM Assistants", description: "RAG-based copilots trained on your data." },
      { title: "Computer Vision", description: "Detection, classification, OCR, quality control." },
      { title: "AI Workflow Automation", description: "n8n / Zapier / custom agent workflows." },
      { title: "Voice & Chat Agents", description: "Multilingual voice/chat bots on any channel." },
    ],
    faq: [
      {
        q: "Do you use open-source or proprietary models?",
        a: "Both. We pick the right model for cost, latency, and privacy.",
      },
      {
        q: "Can AI run on-premise?",
        a: "Yes — we deploy self-hosted stacks when data can't leave your infra.",
      },
    ],
    featured: true,
    order: 1,
  },
  {
    slug: "automation",
    title: "Automation",
    short: "Business, marketing, and industrial process automation.",
    icon: "Workflow",
    banner: projAutomation,
    items: [
      "WhatsApp Automation",
      "Email Automation",
      "Sales Automation",
      "Marketing Automation",
      "Workflow Automation",
      "Business Process Automation",
      "RPA",
      "Industrial Automation",
    ],
    overview:
      "Automate the repetitive so your team can focus on the strategic. From CRM syncs to factory-floor PLCs.",
    services: [
      { title: "Sales & Marketing Automation", description: "CRM, email drips, WhatsApp funnels." },
      { title: "RPA", description: "Bots that operate legacy systems 24/7." },
      { title: "Industrial Automation", description: "PLC, SCADA, MES integration." },
      { title: "Workflow Orchestration", description: "n8n, Make, Airflow, Temporal." },
    ],
    faq: [
      {
        q: "Which platforms do you support?",
        a: "n8n, Zapier, Make, Power Automate, custom Node/Python.",
      },
      { q: "How long until ROI?", a: "Typically 2-6 months depending on scope." },
    ],
    featured: true,
    order: 2,
  },
  {
    slug: "software-development",
    title: "Software Development",
    short: "Web, mobile, desktop, SaaS, and enterprise systems.",
    icon: "Code2",
    banner: projSaas,
    items: [
      "Web Development",
      "Full Stack",
      "Mobile Apps",
      "Desktop Apps",
      "PWA",
      "SaaS Development",
      "Enterprise Software",
      "API Development",
    ],
    overview:
      "Full-stack product engineering — from MVP to enterprise scale — with modern stacks and clean architecture.",
    services: [
      { title: "SaaS Platforms", description: "Multi-tenant, billing, RBAC out of the box." },
      { title: "Mobile Apps", description: "React Native and native iOS/Android." },
      { title: "Enterprise Systems", description: "ERP, HRMS, CRM, LMS custom builds." },
      { title: "APIs & Microservices", description: "GraphQL / REST / gRPC." },
    ],
    faq: [
      { q: "Which stacks?", a: "TypeScript, React, Next, Node, Python, Go, Postgres, Kubernetes." },
      { q: "Do you handle DevOps?", a: "Yes — CI/CD, observability, and cloud infra included." },
    ],
    featured: true,
    order: 3,
  },
  {
    slug: "robotics-embedded",
    title: "Robotics & Embedded",
    short: "ROS2, autonomous systems, firmware, and edge hardware.",
    icon: "Cpu",
    banner: projRobotics,
    items: [
      "Robotics",
      "ROS & ROS2",
      "Industrial Robotics",
      "Autonomous Robots",
      "Embedded Systems",
      "Firmware",
      "Arduino / ESP32",
      "STM32 / Raspberry Pi",
    ],
    overview:
      "From bench prototype to deployed robot fleet — mechanical, electrical, and control-software integration.",
    services: [
      { title: "ROS2 Development", description: "Nav2, MoveIt, custom perception stacks." },
      { title: "Firmware", description: "STM32, ESP32, RTOS, low-power design." },
      { title: "Autonomous Robots", description: "AMR/AGV, drones, mobile manipulators." },
      { title: "Simulation", description: "Gazebo, Isaac Sim digital twins." },
    ],
    faq: [
      {
        q: "Do you manufacture?",
        a: "We prototype in-house and coordinate contract manufacturing.",
      },
    ],
    featured: true,
    order: 4,
  },
  {
    slug: "iot-smart-systems",
    title: "IoT & Smart Systems",
    short: "Sensor networks, edge computing, and connected products.",
    icon: "Wifi",
    banner: projIot,
    items: [
      "IoT",
      "Industrial IoT",
      "Smart Home",
      "Smart Agriculture",
      "Smart Factory",
      "Smart City",
      "Sensor Networks",
      "Edge Computing",
    ],
    overview:
      "End-to-end IoT platforms — device firmware, connectivity, cloud ingest, and dashboards.",
    services: [
      { title: "Industrial IoT", description: "OPC-UA, MQTT, time-series analytics." },
      { title: "Smart Cities", description: "LoRaWAN, NB-IoT municipal networks." },
      { title: "Edge AI", description: "On-device inference for latency and privacy." },
      { title: "Dashboards", description: "Grafana, custom real-time UIs." },
    ],
    faq: [{ q: "What protocols?", a: "MQTT, CoAP, LoRaWAN, NB-IoT, BLE, Zigbee." }],
    featured: false,
    order: 5,
  },
  {
    slug: "electronics-hardware",
    title: "Electronics & Hardware",
    short: "PCB, power electronics, and hardware prototyping.",
    icon: "CircuitBoard",
    banner: projRobotics,
    items: [
      "Electronics Design",
      "PCB Design",
      "Circuit Design",
      "Power Electronics",
      "Product Development",
      "Hardware Prototyping",
    ],
    overview: "Circuit-to-product hardware engineering with a focus on manufacturability.",
    services: [
      { title: "PCB Design", description: "2-16 layer HDI, high-speed digital, RF." },
      { title: "Power Electronics", description: "DC-DC, motor drives, BMS." },
      { title: "DFM & Prototyping", description: "Rapid iterations with contract fab." },
    ],
    faq: [{ q: "Do you certify?", a: "We support CE, FCC, and UL certification." }],
    featured: false,
    order: 6,
  },
  {
    slug: "emerging-technologies",
    title: "Emerging Technologies",
    short: "AR/VR, 3D printing, and digital transformation.",
    icon: "Glasses",
    banner: projSaas,
    items: ["AR / VR", "3D Printing", "Digital Transformation"],
    overview: "Practical adoption of emerging tech — real ROI, not hype.",
    services: [
      {
        title: "AR/VR Experiences",
        description: "Training, product config, immersive dashboards.",
      },
      { title: "3D Printing", description: "Rapid prototyping and small-batch parts." },
      { title: "Digital Transformation", description: "Roadmaps and change management." },
    ],
    faq: [{ q: "Where do you start?", a: "A 2-week discovery phase." }],
    featured: false,
    order: 7,
  },
  {
    slug: "drone-technology",
    title: "Drone Technology",
    short: "UAV systems for inspection, mapping, and delivery.",
    icon: "Plane",
    banner: projDrone,
    items: ["Drone Technology", "UAV Solutions", "Drone Automation"],
    overview: "Custom UAV platforms, autopilots, payloads, and fleet software.",
    services: [
      { title: "Custom UAVs", description: "Multirotor / fixed-wing / hybrid VTOL." },
      { title: "Autonomy Stack", description: "Waypoint, BVLOS, obstacle avoidance." },
      { title: "Analytics", description: "Vision-based inspection & mapping." },
    ],
    faq: [{ q: "Regulatory?", a: "We assist with country-specific certification." }],
    featured: false,
    order: 8,
  },
  {
    slug: "business-solutions",
    title: "Business Solutions",
    short: "E-commerce, ERPs, and vertical management systems.",
    icon: "Building2",
    banner: projSaas,
    items: [
      "E-commerce",
      "Billing Software",
      "Inventory Management",
      "Booking Systems",
      "School / Hospital / Hotel Management",
      "LMS",
    ],
    overview: "Turnkey management systems tailored to your industry.",
    services: [
      { title: "E-commerce", description: "Shopify, custom headless, marketplaces." },
      { title: "ERP / Inventory", description: "Multi-warehouse, POS, accounting." },
      { title: "Vertical LMS/HMS", description: "School, hospital, hotel." },
    ],
    faq: [{ q: "Do you migrate legacy data?", a: "Yes — full migration playbooks." }],
    featured: false,
    order: 9,
  },
  {
    slug: "ui-ux-creative",
    title: "UI/UX & Creative",
    short: "Product design, branding, and motion.",
    icon: "Palette",
    banner: projSaas,
    items: ["UI/UX Design", "Product Design", "Brand Identity", "Logo Design", "Motion Graphics"],
    overview: "Design that ships — research, systems, and beautiful interfaces.",
    services: [
      { title: "Product Design", description: "Discovery to design systems." },
      { title: "Brand Identity", description: "Logos, guidelines, collateral." },
      { title: "Motion", description: "UI motion, explainers, promos." },
    ],
    faq: [{ q: "Do you build too?", a: "Yes — design + engineering under one roof." }],
    featured: false,
    order: 10,
  },
  {
    slug: "digital-services",
    title: "Digital Services",
    short: "SEO, CMS, maintenance, and performance.",
    icon: "Globe",
    banner: projSaas,
    items: [
      "SEO",
      "CMS",
      "Website Maintenance",
      "Performance Optimization",
      "Social Media Automation",
      "Technical Consulting",
    ],
    overview: "Keep your digital presence sharp, fast, and discoverable.",
    services: [
      { title: "SEO", description: "Technical + content strategy." },
      { title: "Maintenance", description: "SLA-backed upkeep." },
      { title: "Performance", description: "Core Web Vitals tuning." },
    ],
    faq: [{ q: "Ongoing support?", a: "Monthly retainers available." }],
    featured: false,
    order: 11,
  },
];

export const getDomain = (slug: string) => domains.find((d) => d.slug === slug);

import { useFirestoreCollection, fetchCollection, COLLECTIONS } from "@/lib/firestore";

const domainsFallback = domains.map((d) => ({ ...d, id: d.slug }));

export function useDomains() {
  return useFirestoreCollection<Domain>(COLLECTIONS.domains, { initialData: domainsFallback });
}

export function useDomain(slug: string) {
  const { data } = useDomains();
  return (data ?? domainsFallback).find((d) => d.slug === slug);
}

// Used by the route loader (runs before any hook/query cache exists) — checks Firestore
// first so admin-created domains resolve, falling back to the static seed.
export async function fetchDomainBySlug(slug: string): Promise<Domain | undefined> {
  try {
    const all = await fetchCollection<Domain>(COLLECTIONS.domains);
    const found = all.find((d) => d.slug === slug);
    if (found) return found;
  } catch {
    // fall through to static seed
  }
  return getDomain(slug);
}
