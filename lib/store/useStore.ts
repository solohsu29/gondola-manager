import { CertificateExpiry, Document, Gondola, Notification, Project } from "@/components/data-types"
import { create } from "zustand"

interface StoreState {
    projects: Project[]
    fetchProjects: () => Promise<void>
    gondolas: Gondola[]
    fetchGondolas: () => Promise<void>
    certificateExpiries: CertificateExpiry[]
    fetchCertificateExpiries: () => Promise<void>
    notifications: Notification[]
    fetchNotifications: () => Promise<void>
    documents: Document[]
    fetchDocuments: () => Promise<void>
  
    // Computed values
    activeGondolas: Gondola[]
    expiringCertificates: CertificateExpiry[]
    pendingInspections: Gondola[]
    totalProjects: number 
    recentProjects: Project[]
  
    // Actions
    addProject: (project: Project) => void
    updateProject: (id: string, project: Partial<Project>) => void
    deleteProject: (id: string) => void
  
    addGondola: (gondola: Gondola) => void
    updateGondola: (id: string, gondola: Partial<Gondola>) => Promise<void>
    deleteGondola: (id: string) => Promise<void>
  
    addDocument: (document: Document) => void
    updateDocument: (id: string, document: Partial<Document>) => void
    deleteDocument: (id: string) => void
  
    addGondolaPhoto: (
      gondolaId: string,
      photo: { id: string; url: string; uploadedAt: Date; description: string },
    ) => void
    deleteGondolaPhoto: (gondolaId: string, photoId: string) => void
  
    addNotification: (notification: Notification) => void
    markNotificationAsRead: (id: string) => void
    deleteNotification: (id: string) => void
  }

  
  // Helper to calculate days between dates
  const daysBetween = (date1: Date, date2: Date): number => {
    const oneDay = 24 * 60 * 60 * 1000 // hours*minutes*seconds*milliseconds
    return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay))
  }
  
export const useStore = create<StoreState>((set, get) => ({
    projects: [],
    gondolas: [],
    certificateExpiries: [],
    expiringCertificates:[],
    activeGondolas:[],
  totalProjects:0,
  recentProjects:[],
    fetchProjects: async () => {
      const res = await fetch('/api/projects');
      console.log('res from projects',res)
      const data = await res.json();
      console.log('data from pj',data)
      set({
        projects: data,
        totalProjects: data?.length,
        recentProjects: data?.sort((a: any, b: any) => {
          const aDate = typeof a.createdAt === 'string' ? new Date(a.createdAt) : a.createdAt;
          const bDate = typeof b.createdAt === 'string' ? new Date(b.createdAt) : b.createdAt;
          return bDate.getTime() - aDate.getTime();
        })
      });
    },

    fetchGondolas: async () => {
      const res = await fetch('/api/gondolas');
      const data = await res.json();
      console.log('data from gondolas',data)
      set({ gondolas: data,activeGondolas:data.filter((g:any) => g.status === "deployed")  });
    },
    addGondola: (gondola) => {
      set((state) => ({
        gondolas: [
          ...state.gondolas,
          {
            ...gondola,
            photos: Array.isArray(gondola.photos) ? gondola.photos : [],
            documents: Array.isArray(gondola.documents) ? gondola.documents : [],
          },
        ],
      }));
    },
    updateGondola: async (id, updatedGondola) => {
      const res = await fetch(`/api/gondolas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGondola),
      });
      if (!res.ok) throw new Error('Failed to update gondola');
      set((state) => ({
        gondolas: state.gondolas.map((g) =>
          g.id === id
            ? {
                ...g,
                ...updatedGondola,
                photos: Array.isArray(updatedGondola.photos)
                  ? updatedGondola.photos
                  : g.photos || [],
                documents: Array.isArray(updatedGondola.documents)
                  ? updatedGondola.documents
                  : g.documents || [],
              }
            : g
        ),
      }));
    },
    deleteGondola: async (id) => {
      const res = await fetch(`/api/gondolas/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete gondola');
      set((state) => ({
        gondolas: state.gondolas.filter((g) => g.id !== id),
      }));
    },
  
    fetchCertificateExpiries: async () => {
      const res = await fetch('/api/certificate-expiries');
      const data = await res.json();
      set({ certificateExpiries: data, expiringCertificates: data?.filter((c:any) => c.status === "expired")});
    },
    notifications: [],
    fetchNotifications: async () => {
      // TODO: implement API and fetching
      set({ notifications: [] });
    },
    documents: [],
    fetchDocuments: async () => {
      // TODO: implement API and fetching
      set({ documents: [] });
    }
    ,
    get pendingInspections() {
      const today = new Date()
      return get().gondolas.filter((g) => {
        if (!g.nextInspection) return false
        const daysUntilInspection = daysBetween(today, g.nextInspection)
        return daysUntilInspection <= 7
      })
    },
  
  
    // Actions
    addProject: (project) =>
      set((state) => ({
        projects: [...state.projects, project],
      })),
  
    updateProject: (id, updatedProject) =>
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === id ? { ...project, ...updatedProject } : project,
        ),
      })),
  
    deleteProject: async (id: string) => {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete project');
      set((state) => ({
        projects: state.projects.filter((project) => project.id !== id),
      }));
    },
  
    addDocument: (document) =>
      set((state) => ({
        documents: [...state.documents, document],
      })),
  
    updateDocument: (id, updatedDocument) =>
      set((state) => ({
        documents: state.documents.map((document) =>
          document.id === id ? { ...document, ...updatedDocument } : document,
        ),
      })),
  
    deleteDocument: (id) =>
      set((state) => ({
        documents: state.documents.filter((document) => document.id !== id),
      })),
  
    addGondolaPhoto: (gondolaId, photo) =>
      set((state) => ({
        gondolas: state.gondolas.map((gondola) =>
          gondola.id === gondolaId ? { ...gondola, photos: [...gondola.photos, photo] } : gondola,
        ),
      })),
  
    deleteGondolaPhoto: (gondolaId, photoId) =>
      set((state) => ({
        gondolas: state.gondolas.map((gondola) =>
          gondola.id === gondolaId
            ? { ...gondola, photos: gondola.photos.filter((photo) => photo.id !== photoId) }
            : gondola,
        ),
      })),
  
    addNotification: (notification) =>
      set((state) => ({
        notifications: [...state.notifications, notification],
      })),
  
    markNotificationAsRead: (id) =>
      set((state) => ({
        notifications: state.notifications.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification,
        ),
      })),
  
    deleteNotification: (id) =>
      set((state) => ({
        notifications: state.notifications.filter((notification) => notification.id !== id),
      })),
  }))