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
}

export const USERS: User[] = [
  {
    id: "user-1",
    firstName: "Alice",
    lastName: "Dupont",
    avatarUrl:
      "https://api.dicebear.com/9.x/adventurer/svg?seed=Alice",
    role: "CEO",
    timezone: "Europe/Paris",
    workingHours: { start: 9, end: 18 },
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
  },
]

