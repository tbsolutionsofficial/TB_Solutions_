// Admin-panel mock entities. Replace with fetched data later; shapes stay stable.

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  domain?: string;
  createdAt: string;
  read: boolean;
}

export interface Offer {
  id: string;
  title: string;
  discount: number;
  description: string;
  expiresAt: string;
  domains: string[];
  active: boolean;
}

export interface MediaAsset {
  id: string;
  name: string;
  type: "image" | "video" | "icon" | "pdf";
  url: string;
  folder: string;
  sizeKb: number;
  uploadedAt: string;
}

import projAi from "@/assets/proj-ai.jpg";
import projSaas from "@/assets/proj-saas.jpg";
import projRobotics from "@/assets/proj-robotics.jpg";
import projDrone from "@/assets/proj-drone.jpg";
import projIot from "@/assets/proj-iot.jpg";
import projAutomation from "@/assets/proj-automation.jpg";

export const mockContacts: Contact[] = [
  { id: "c1", name: "Sarah Chen", email: "sarah@acme.com", phone: "+1 555 0100", company: "Acme SaaS", message: "Looking for an AI copilot for our product.", domain: "Artificial Intelligence", createdAt: "2025-10-11T09:14:00Z", read: false },
  { id: "c2", name: "Marcus Weber", email: "marcus@industrial.de", company: "Industrial GmbH", message: "Need help scaling our ROS2 stack across a new plant.", domain: "Robotics", createdAt: "2025-10-10T14:22:00Z", read: false },
  { id: "c3", name: "Priya Raman", email: "priya@fintech.co", company: "Fintech Co.", message: "Interested in analytics dashboards.", domain: "Software", createdAt: "2025-10-08T10:03:00Z", read: true },
  { id: "c4", name: "Diego Alvarez", email: "diego@example.gov", company: "City of Example", message: "Sensor mesh expansion inquiry.", domain: "IoT", createdAt: "2025-10-07T16:41:00Z", read: true },
  { id: "c5", name: "Lena Novak", email: "lena@energy.com", company: "EnergyGrid Inc.", message: "Drone fleet quote please.", domain: "Drones", createdAt: "2025-10-05T11:20:00Z", read: true },
];

export const mockOffers: Offer[] = [
  { id: "o1", title: "AI Discovery Sprint", discount: 20, description: "20% off our 2-week AI discovery engagement.", expiresAt: "2025-12-31", domains: ["Artificial Intelligence"], active: true },
  { id: "o2", title: "IoT Starter Kit", discount: 15, description: "Bundle discount for sensor mesh pilots.", expiresAt: "2025-11-30", domains: ["IoT"], active: true },
  { id: "o3", title: "Automation Audit", discount: 100, description: "Free workflow automation audit.", expiresAt: "2025-12-15", domains: ["Automation"], active: false },
];

export const mockMedia: MediaAsset[] = [
  { id: "m1", name: "proj-ai.jpg", type: "image", url: projAi, folder: "Projects", sizeKb: 148, uploadedAt: "2025-09-01" },
  { id: "m2", name: "proj-saas.jpg", type: "image", url: projSaas, folder: "Projects", sizeKb: 172, uploadedAt: "2025-09-01" },
  { id: "m3", name: "proj-robotics.jpg", type: "image", url: projRobotics, folder: "Projects", sizeKb: 165, uploadedAt: "2025-09-01" },
  { id: "m4", name: "proj-drone.jpg", type: "image", url: projDrone, folder: "Projects", sizeKb: 158, uploadedAt: "2025-09-01" },
  { id: "m5", name: "proj-iot.jpg", type: "image", url: projIot, folder: "Projects", sizeKb: 161, uploadedAt: "2025-09-01" },
  { id: "m6", name: "proj-automation.jpg", type: "image", url: projAutomation, folder: "Projects", sizeKb: 174, uploadedAt: "2025-09-01" },
];

export const adminUser = {
  name: "Admin",
  email: "admin@tbsolutions.dev",
  role: "Owner",
  avatar: "https://i.pravatar.cc/80?u=admin",
};

export const dashboardStats = {
  totalProjects: 42,
  pendingReviews: 3,
  unreadContacts: 2,
  activeBanners: 6,
};

export const chartData = [
  { month: "Apr", projects: 4, contacts: 12 },
  { month: "May", projects: 6, contacts: 18 },
  { month: "Jun", projects: 5, contacts: 22 },
  { month: "Jul", projects: 8, contacts: 26 },
  { month: "Aug", projects: 7, contacts: 30 },
  { month: "Sep", projects: 9, contacts: 34 },
  { month: "Oct", projects: 11, contacts: 41 },
];
