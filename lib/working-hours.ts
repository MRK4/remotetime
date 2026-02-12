import type { User } from "@/lib/users"

/** Décalage horaire approximatif en heures (UTC+) pour le fuseau donné */
export function getTimezoneOffsetHours(tz: string): number {
  const date = new Date()
  const utc = new Date(
    date.toLocaleString("en-US", { timeZone: "UTC" })
  ).getTime()
  const tzDate = new Date(
    date.toLocaleString("en-US", { timeZone: tz })
  ).getTime()
  return (tzDate - utc) / (1000 * 60 * 60)
}

/** Convertit heure locale (0-24) en position UTC (0-24) pour l'affichage */
export function localToUtcHours(localHour: number, tz: string): number {
  const offset = getTimezoneOffsetHours(tz)
  return (localHour - offset + 24) % 24
}

/** Retourne [startUtc, endUtc] pour un utilisateur (0-24) */
export function getUtcRange(user: User): [number, number] {
  const startUtc = localToUtcHours(user.workingHours.start, user.timezone)
  const endUtc = localToUtcHours(user.workingHours.end, user.timezone)
  return [startUtc, endUtc]
}

/** Vérifie si l'utilisateur est disponible à l'heure h (0-23) en UTC */
function isAvailableAtHour(user: User, h: number): boolean {
  const [startUtc, endUtc] = getUtcRange(user)
  if (endUtc > startUtc) {
    return h >= Math.floor(startUtc) && h < Math.ceil(endUtc)
  }
  // Plage traversant minuit : [startUtc, 24) ∪ [0, endUtc)
  return h >= Math.floor(startUtc) || h < Math.ceil(endUtc)
}

export type TimeSlot = { start: number; end: number }

/** Calcule les créneaux où tous les invités sont disponibles */
export function findOverlapSlots(invitedUsers: User[]): TimeSlot[] {
  if (invitedUsers.length === 0) return []

  const slots: TimeSlot[] = []
  let inSlot = false
  let slotStart = 0

  for (let h = 0; h <= 24; h++) {
    const allAvailable =
      h < 24 &&
      invitedUsers.every((u) => isAvailableAtHour(u, h))

    if (allAvailable && !inSlot) {
      inSlot = true
      slotStart = h
    } else if ((!allAvailable || h === 24) && inSlot) {
      inSlot = false
      if (slotStart < h) {
        slots.push({ start: slotStart, end: h })
      }
    }
  }

  return slots
}

/** Sélectionne le meilleur créneau (le plus long, ou le plus proche de l'heure actuelle si égalité) */
export function getBestMeetingSlot(slots: TimeSlot[]): TimeSlot | null {
  if (slots.length === 0) return null

  const nowUtc = new Date()
  const currentHour = nowUtc.getUTCHours() + nowUtc.getUTCMinutes() / 60

  const byDuration = [...slots].sort((a, b) => {
    const durA = b.end - b.start
    const durB = a.end - a.start
    if (durA !== durB) return durA - durB
    const midA = (a.start + a.end) / 2
    const midB = (b.start + b.end) / 2
    const distA = Math.min(
      Math.abs(midA - currentHour),
      Math.abs(midA - currentHour + 24),
      Math.abs(midA - currentHour - 24)
    )
    const distB = Math.min(
      Math.abs(midB - currentHour),
      Math.abs(midB - currentHour + 24),
      Math.abs(midB - currentHour - 24)
    )
    return distA - distB
  })

  return byDuration[0] ?? null
}
