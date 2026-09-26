"use client";

import { clients } from "@/data/clients";

const OUTCOME_BADGE = {
  done: "bg-emerald-100 text-emerald-700",
  refused: "bg-red-100 text-red-700",
  noanswer: "bg-slate-200 text-slate-600",
};

export default function ClientList({ selectedClientId, onSelect, callStates, disabled }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
        Klientët ({clients.length})
      </h2>
      <div className="flex max-h-[65vh] flex-col gap-2 overflow-y-auto pr-1">
        {clients.map((c) => {
          const isSelected = c.id === selectedClientId;
          const state = callStates[c.id];
          return (
            <button
              key={c.id}
              disabled={disabled}
              onClick={() => onSelect(c)}
              className={`rounded-xl border p-3 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-400"
                  : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">
                  {c.vorname} {c.nachname}
                </span>
                {state && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${OUTCOME_BADGE[state]}`}>
                    {state === "done" ? "✔" : state === "refused" ? "✖" : "☎"}
                  </span>
                )}
              </div>
              <div className="mt-0.5 text-xs text-slate-500">{c.telefon}</div>
              <div className="text-xs text-slate-400">{c.adresse}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
