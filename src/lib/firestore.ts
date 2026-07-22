import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";
import { useQuery, useQueryClient, useMutation, type UseQueryOptions } from "@tanstack/react-query";
import { db } from "./firebase";

export const COLLECTIONS = {
  domains: "domains",
  gallery: "gallery",
  reviews: "reviews",
  projects: "projects",
  contacts: "contacts",
  media: "media",
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

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

export interface MediaAsset {
  id: string;
  name: string;
  type: "image" | "video" | "icon" | "pdf";
  url: string;
  publicId?: string;
  folder?: string;
  sizeKb?: number;
  uploadedAt: string;
}

export async function fetchCollection<T>(name: CollectionName): Promise<(T & { id: string })[]> {
  const snap = await getDocs(collection(db, name));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
}

export async function createDoc<T extends object>(name: CollectionName, data: T): Promise<string> {
  const ref = await addDoc(collection(db, name), data as Record<string, unknown>);
  return ref.id;
}

export async function updateDocById(
  name: CollectionName,
  id: string,
  data: Partial<Record<string, unknown>>,
): Promise<void> {
  await updateDoc(doc(db, name, id), data);
}

export async function deleteDocById(name: CollectionName, id: string): Promise<void> {
  await deleteDoc(doc(db, name, id));
}

// Generic read hook. Pass `initialData` (mapped from the static content seed) so first
// paint and offline/error states fall back to the existing content — never a blank section.
export function useFirestoreCollection<T>(
  name: CollectionName,
  options?: Partial<UseQueryOptions<(T & { id: string })[]>>,
) {
  return useQuery({
    queryKey: ["firestore", name],
    queryFn: () => fetchCollection<T>(name),
    staleTime: 60_000,
    ...options,
  });
}

// Generic CRUD mutation hook for the admin panel: invalidates the collection's query on success.
export function useFirestoreMutations(name: CollectionName) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["firestore", name] });

  const create = useMutation({
    mutationFn: (data: Record<string, unknown>) => createDoc(name, data),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      updateDocById(name, id, data),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteDocById(name, id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
