export type User = {
  id: string
  firstName: string
  lastName: string
  avatarUrl: string
  role: string
  /** Fuseau horaire IANA (ex: Europe/Paris) */
  timezone: string
  /** Heures de travail [début, fin] en format 24h (ex: 9 = 9h, 18 = 18h) */
  workingHours: { start: number; end: number }
  /** Coordonnées géographiques [longitude, latitude] pour l'affichage sur la carte */
  location: [number, number]
}

export const USERS: User[] = [
  {
    id: "user-1",
    firstName: "Alice",
    lastName: "Dupont",
    avatarUrl:
      "https://api.dicebear.com/9.x/adventurer/svg?seed=Alice",
    role: "CEO",
    timezone: "Asia/Dubai",
    workingHours: { start: 9, end: 18 },
    location: [55.2708, 25.2048], // Dubai
  },
  {
    id: "user-2",
    firstName: "Bruno",
    lastName: "Martin",
    avatarUrl:
      "https://api.dicebear.com/9.x/adventurer/svg?seed=Bruno",
    role: "Developer",
    timezone: "America/New_York",
    workingHours: { start: 9, end: 17 },
    location: [-73.9352, 40.7306], // New York
  },
  {
    id: "user-3",
    firstName: "Claire",
    lastName: "Lefèvre",
    avatarUrl:
      "https://api.dicebear.com/9.x/adventurer/svg?seed=Claire",
    role: "Designer",
    timezone: "Europe/Paris",
    workingHours: { start: 10, end: 19 },
    location: [2.3417, 48.8606], // Paris
  },
  {
    id: "user-4",
    firstName: "David",
    lastName: "Moreau",
    avatarUrl:
      "https://api.dicebear.com/9.x/adventurer/svg?seed=David",
    role: "Developer",
    timezone: "Asia/Tokyo",
    workingHours: { start: 9, end: 18 },
    location: [139.6917, 35.6895], // Tokyo
  },
  {
    id: "user-5",
    firstName: "Emma",
    lastName: "Rossi",
    avatarUrl:
      "https://api.dicebear.com/9.x/adventurer/svg?seed=Emma",
    role: "Marketing",
    timezone: "Europe/London",
    workingHours: { start: 8, end: 16 },
    location: [-0.1276, 51.5074], // London
  },
]

