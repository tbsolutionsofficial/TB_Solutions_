import projAi from "@/assets/proj-ai.jpg";
import projAutomation from "@/assets/proj-automation.jpg";
import projSaas from "@/assets/proj-saas.jpg";
import projRobotics from "@/assets/proj-robotics.jpg";
import projIot from "@/assets/proj-iot.jpg";
import projDrone from "@/assets/proj-drone.jpg";

export type GalleryCategory = "All" | "AI" | "Robotics" | "IoT" | "Drones" | "Software";

export interface GalleryItem {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  title: string;
  category: Exclude<GalleryCategory, "All">;
  span?: "sm" | "md" | "lg" | "xl";
}

export const galleryCategories: GalleryCategory[] = [
  "All",
  "AI",
  "Robotics",
  "IoT",
  "Drones",
  "Software",
];

export const galleryItems: GalleryItem[] = [
  { id: "g1", type: "image", src: projAi, title: "AI Copilot", category: "AI", span: "lg" },
  {
    id: "g2",
    type: "image",
    src: projRobotics,
    title: "Robotic Arm",
    category: "Robotics",
    span: "md",
  },
  { id: "g3", type: "image", src: projIot, title: "Sensor Mesh", category: "IoT", span: "sm" },
  {
    id: "g4",
    type: "image",
    src: projDrone,
    title: "Survey Drone",
    category: "Drones",
    span: "md",
  },
  {
    id: "g5",
    type: "image",
    src: projSaas,
    title: "Analytics Suite",
    category: "Software",
    span: "sm",
  },
  {
    id: "g6",
    type: "image",
    src: projAutomation,
    title: "Factory Line",
    category: "Robotics",
    span: "xl",
  },
  { id: "g7", type: "image", src: projAi, title: "Vision QC", category: "AI", span: "md" },
  { id: "g8", type: "image", src: projIot, title: "Smart Grid", category: "IoT", span: "md" },
  { id: "g9", type: "image", src: projDrone, title: "BVLOS Ops", category: "Drones", span: "sm" },
  {
    id: "g10",
    type: "image",
    src: projSaas,
    title: "Command Center",
    category: "Software",
    span: "lg",
  },
];

import { useFirestoreCollection, COLLECTIONS } from "@/lib/firestore";

export function useGallery() {
  return useFirestoreCollection<GalleryItem>(COLLECTIONS.gallery, { initialData: galleryItems });
}
