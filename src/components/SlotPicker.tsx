"use client";

import { useMemo } from "react";

export type Slot = { starts_at: string; label: string };

const DAY = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Paris" });
const TIME = new Intl.DateTimeFormat("fr-FR", { hour: "numeric", minute: "2-digit", timeZone: "Europe/Paris" });
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Jour à Paris (AAAA-MM-JJ), pour regrouper les créneaux. */
export const dayKey = (iso: string) => new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" }).format(new Date(iso));
/** « 9 h », « 14 h 30 ». */
export const hourLabel = (iso: string) => TIME.format(new Date(iso)).replace(":", " h ").replace(/^0/, "").replace(/ h 00$/, " h");
/** « Jeudi 3 décembre ». */
export const dayLabel = (iso: string) => cap(DAY.format(new Date(iso)));

/** Choix du jour puis de l'heure parmi les créneaux libres. */
export function SlotPicker({
  slots,
  day,
  slot,
  onDay,
  onSlot,
  error,
}: {
  slots: Slot[];
  day: string;
  slot: string;
  onDay: (d: string) => void;
  onSlot: (s: string) => void;
  error?: string;
}) {
  const days = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const s of slots) {
      const k = dayKey(s.starts_at);
      map.set(k, [...(map.get(k) ?? []), s]);
    }
    return [...map.entries()];
  }, [slots]);
  const daySlots = days.find(([k]) => k === day)?.[1] ?? [];

  return (
    <>
      <fieldset>
        <legend className="field-label">Jour</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {days.map(([k, list]) => (
            <button key={k} type="button" className="chip" aria-pressed={day === k} onClick={() => onDay(k)}>
              {dayLabel(list[0]!.starts_at)}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="field-label">Heure <span className="text-muted">(heure de Paris)</span></legend>
        <div className="mt-4 flex flex-wrap gap-2" data-field="slot" tabIndex={-1}>
          {daySlots.map((s) => (
            <button key={s.starts_at} type="button" className="chip" aria-pressed={slot === s.starts_at} onClick={() => onSlot(s.starts_at)}>
              {hourLabel(s.starts_at)}
            </button>
          ))}
        </div>
        {error ? <p id="slot-error" className="mt-2 text-sm text-[#f0937f]">{error}</p> : null}
      </fieldset>
    </>
  );
}
