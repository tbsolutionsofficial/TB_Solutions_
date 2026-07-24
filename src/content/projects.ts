import projAi from "@/assets/proj-ai.jpg";
import projAutomation from "@/assets/proj-automation.jpg";
import projSaas from "@/assets/proj-saas.jpg";
import projRobotics from "@/assets/proj-robotics.jpg";
import projIot from "@/assets/proj-iot.jpg";
import projDrone from "@/assets/proj-drone.jpg";
import type { DomainSlug } from "./domains";

export interface Project {
  id: string;
  title: string;
  slug: string;
  tag: string;
  domain: DomainSlug;
  description: string;
  fullDescription: string;
  image: string;
  images: string[];
  techStack: string[];
  tags: string[];
  client: string;
  clientLogo?: string;
  completionDate: string;
  status: "published" | "draft" | "archived";
  featured: boolean;
  sortOrder: number;
  urls: {
    github?: string;
    website?: string;
    demo?: string;
    docs?: string;
    figma?: string;
    extraLinks?: { label: string; url: string }[];
  };
  seo: { title: string; description: string; keywords: string[] };
}

export const projects: Project[] = [
  {
    id: "p1",
    title: "Enterprise AI Copilot",
    slug: "enterprise-ai-copilot",
    tag: "Artificial Intelligence",
    domain: "artificial-intelligence",
    description:
      "Custom GPT-powered assistant integrated across CRM and support workflows for a global SaaS firm.",
    fullDescription:
      "A production RAG stack with retrieval over 3M documents, connected to Salesforce, Zendesk, and internal APIs. Reduced average ticket resolution by 43%.",
    image: projAi,
    images: [projAi, projSaas],
    techStack: ["OpenAI", "Pinecone", "Next.js", "Node", "Postgres"],
    tags: ["AI", "RAG", "Enterprise"],
    client: "Acme SaaS",
    completionDate: "2025-08-12",
    status: "published",
    featured: true,
    sortOrder: 1,
    urls: { website: "https://example.com", demo: "https://demo.example.com" },
    seo: {
      title: "Enterprise AI Copilot Case Study",
      description: "How TB_Solutions cut support resolution time by 43%.",
      keywords: ["AI", "copilot", "RAG"],
    },
  },
  {
    id: "p2",
    title: "Autonomous Factory Line",
    slug: "autonomous-factory-line",
    tag: "Robotics · Automation",
    domain: "robotics-embedded",
    description:
      "End-to-end ROS2 orchestration for a 40-arm assembly cell with real-time quality inspection.",
    fullDescription:
      "ROS2 + Nav2 + custom vision QC, deployed across a 40-arm cell. 24/7 uptime with 0.4% defect rate.",
    image: projAutomation,
    images: [projAutomation, projRobotics],
    techStack: ["ROS2", "Python", "OpenCV", "PLC", "Kubernetes"],
    tags: ["Robotics", "Automation"],
    client: "Industrial GmbH",
    completionDate: "2025-06-04",
    status: "published",
    featured: true,
    sortOrder: 2,
    urls: {},
    seo: {
      title: "Autonomous Factory Line",
      description: "ROS2 factory automation.",
      keywords: ["ROS2"],
    },
  },
  {
    id: "p3",
    title: "Analytics Command Center",
    slug: "analytics-command-center",
    tag: "SaaS · Software",
    domain: "software-development",
    description:
      "Multi-tenant analytics dashboard powering decisions for a fintech operating in 14 markets.",
    fullDescription:
      "Sub-second query on 4TB of event data via ClickHouse, embedded dashboards, RBAC.",
    image: projSaas,
    images: [projSaas],
    techStack: ["React", "ClickHouse", "Node", "TypeScript"],
    tags: ["SaaS", "Analytics"],
    client: "Fintech Co.",
    completionDate: "2025-05-18",
    status: "published",
    featured: true,
    sortOrder: 3,
    urls: { website: "https://example.com" },
    seo: {
      title: "Analytics Command Center",
      description: "Fintech analytics platform.",
      keywords: ["analytics"],
    },
  },
  {
    id: "p4",
    title: "Precision Robotic Arm",
    slug: "precision-robotic-arm",
    tag: "Robotics · Hardware",
    domain: "robotics-embedded",
    description:
      "Six-axis manipulator with force-feedback and computer vision for pharma production.",
    fullDescription: "Custom 6DOF arm with sub-mm repeatability, integrated with cleanroom SCADA.",
    image: projRobotics,
    images: [projRobotics],
    techStack: ["ROS2", "STM32", "OpenCV"],
    tags: ["Robotics", "Pharma"],
    client: "PharmaCorp",
    completionDate: "2025-03-22",
    status: "published",
    featured: false,
    sortOrder: 4,
    urls: {},
    seo: {
      title: "Precision Robotic Arm",
      description: "Pharma robotics.",
      keywords: ["robotics"],
    },
  },
  {
    id: "p5",
    title: "Smart City Sensor Mesh",
    slug: "smart-city-sensor-mesh",
    tag: "IoT · Embedded",
    domain: "iot-smart-systems",
    description: "Municipal LoRaWAN network for air quality, traffic and lighting across 60 sq km.",
    fullDescription: "3,200 nodes, edge inference, real-time dashboards, and citizen-facing app.",
    image: projIot,
    images: [projIot],
    techStack: ["LoRaWAN", "ESP32", "InfluxDB", "React Native"],
    tags: ["IoT", "Smart City"],
    client: "City of Example",
    completionDate: "2025-02-14",
    status: "published",
    featured: true,
    sortOrder: 5,
    urls: {},
    seo: { title: "Smart City Sensor Mesh", description: "Municipal IoT.", keywords: ["iot"] },
  },
  {
    id: "p6",
    title: "Autonomous Survey Drone",
    slug: "autonomous-survey-drone",
    tag: "Drones · AI",
    domain: "drone-technology",
    description:
      "Beyond-visual-line-of-sight inspection drone with onboard vision for energy grids.",
    fullDescription: "Fixed-wing VTOL, 4-hour endurance, onboard defect detection.",
    image: projDrone,
    images: [projDrone],
    techStack: ["PX4", "Jetson", "TensorRT"],
    tags: ["Drone", "AI"],
    client: "EnergyGrid Inc.",
    completionDate: "2024-12-08",
    status: "published",
    featured: true,
    sortOrder: 6,
    urls: {},
    seo: {
      title: "Autonomous Survey Drone",
      description: "BVLOS drone inspection.",
      keywords: ["drone"],
    },
  },
];

import { useFirestoreCollection, COLLECTIONS } from "@/lib/firestore";

const projectsFallback = projects.map((p) => ({ ...p, id: p.id }));

export function useProjects() {
  return useFirestoreCollection<Project>(COLLECTIONS.projects, { initialData: projectsFallback });
}

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export function useProject(slug: string) {
  const { data } = useProjects();
  return (data ?? projectsFallback).find((p) => p.slug === slug);
}
