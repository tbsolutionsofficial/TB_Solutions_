export interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  avatar: string;
  stars: 1 | 2 | 3 | 4 | 5;
  review: string;
  domain: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

const av = (seed: string) => `https://i.pravatar.cc/120?u=${seed}`;

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Sarah Chen",
    company: "Acme SaaS",
    role: "VP Engineering",
    avatar: av("sarah"),
    stars: 5,
    review:
      "TB_Solutions turned our AI roadmap into a shipping product in ten weeks. The team is genuinely world-class.",
    domain: "Artificial Intelligence",
    date: "2025-09-14",
    status: "approved",
  },
  {
    id: "t2",
    name: "Marcus Weber",
    company: "Industrial GmbH",
    role: "COO",
    avatar: av("marcus"),
    stars: 5,
    review:
      "Their ROS2 cell is running 24/7 with a 0.4% defect rate. Best partner we've worked with.",
    domain: "Robotics",
    date: "2025-08-22",
    status: "approved",
  },
  {
    id: "t3",
    name: "Priya Raman",
    company: "Fintech Co.",
    role: "CTO",
    avatar: av("priya"),
    stars: 5,
    review: "Sub-second dashboards on 4TB of data. They obsess over the details.",
    domain: "Software",
    date: "2025-07-30",
    status: "approved",
  },
  {
    id: "t4",
    name: "Diego Alvarez",
    company: "City of Example",
    role: "Smart City Director",
    avatar: av("diego"),
    stars: 5,
    review: "3,200 sensors deployed on time and under budget. Real civic impact.",
    domain: "IoT",
    date: "2025-06-18",
    status: "approved",
  },
  {
    id: "t5",
    name: "Lena Novak",
    company: "EnergyGrid Inc.",
    role: "Head of Ops",
    avatar: av("lena"),
    stars: 5,
    review: "The autonomous drone inspection saves us 60% on grid maintenance.",
    domain: "Drones",
    date: "2025-05-11",
    status: "approved",
  },
  {
    id: "t6",
    name: "Amir Khalid",
    company: "PharmaCorp",
    role: "Automation Lead",
    avatar: av("amir"),
    stars: 4,
    review: "Sub-mm repeatability on the arm we asked for. Great communication.",
    domain: "Robotics",
    date: "2025-04-02",
    status: "approved",
  },
  {
    id: "t7",
    name: "Jordan Blake",
    company: "Retail Co.",
    role: "Product Manager",
    avatar: av("jordan"),
    stars: 4,
    review: "Loved the process. Very collaborative team.",
    domain: "Automation",
    date: "2025-10-01",
    status: "pending",
  },
];

import { useFirestoreCollection, COLLECTIONS } from "@/lib/firestore";

// Collection is named "reviews" per spec; the local type/UI vocabulary stays "testimonials".
export function useTestimonials() {
  return useFirestoreCollection<Testimonial>(COLLECTIONS.reviews, { initialData: testimonials });
}
