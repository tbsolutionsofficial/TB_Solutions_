import { collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useQuery, useQueryClient, useMutation, type UseQueryOptions } from "@tanstack/react-query";
import { db } from "./firebase";

export const COLLECTIONS = {
  domains: "domains",
  gallery: "gallery",
  reviews: "reviews",
  projects: "projects",
  contacts: "contacts",
  media: "media",
  settings: "settings",
} as const;

export const SITE_SETTINGS_DOC_ID = "site";

export interface SiteSettings {
  phone?: string;
  email?: string;
  whatsapp?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  address?: string;
}

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

// Upsert by explicit ID (merge: true) — used to seed/import known content (e.g. the
// static seed arrays) without creating duplicates on repeated runs.
export async function upsertDocById(
  name: CollectionName,
  id: string,
  data: Record<string, unknown>,
): Promise<void> {
  await setDoc(doc(db, name, id), data, { merge: true });
}

// Generic read hook. Pass `initialData` (mapped from the static content seed) so first
// paint and offline/error states fall back to the existing content — never a blank section.
// initialDataUpdatedAt is forced to 0 (epoch) whenever initialData is given: otherwise
// React Query treats the fallback as freshly-fetched and skips the real Firestore read
// for the whole staleTime window, so a fresh page load could show stale/fallback content
// instead of what's actually in Firestore.
export function useFirestoreCollection<T>(
  name: CollectionName,
  options?: Partial<UseQueryOptions<(T & { id: string })[]>>,
) {
  return useQuery({
    queryKey: ["firestore", name],
    queryFn: () => fetchCollection<T>(name),
    staleTime: 20_000,
    ...options,
    ...(options?.initialData ? { initialDataUpdatedAt: 0 } : {}),
  });
}

export async function fetchDoc<T>(name: CollectionName, id: string): Promise<(T & { id: string }) | null> {
  const snap = await getDoc(doc(db, name, id));
  return snap.exists() ? ({ id: snap.id, ...(snap.data() as T) }) : null;
}

// Single-document counterpart to useFirestoreCollection (same initialData/staleness handling).
export function useFirestoreDoc<T>(
  name: CollectionName,
  id: string,
  options?: Partial<UseQueryOptions<(T & { id: string }) | null>>,
) {
  return useQuery({
    queryKey: ["firestore", name, id],
    queryFn: () => fetchDoc<T>(name, id),
    staleTime: 20_000,
    ...options,
    ...(options?.initialData !== undefined ? { initialDataUpdatedAt: 0 } : {}),
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
