"use client";

import { useState } from "react";
import type { Exhibition } from "@/lib/types";
import { deleteExhibitionAction, setActiveExhibitionAction } from "@/actions/exhibitions";
import ExhibitionForm from "./exhibition-form";
import { SubmitButton } from "./submit-button";

function formatRange(start: string, end: string): string {
  const fmt = (s: string) =>
    new Date(s + "T12:00:00").toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  return `${fmt(start)} — ${fmt(end)}`;
}

export default function ExhibitionList({ exhibitions }: { exhibitions: Exhibition[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (exhibitions.length === 0) {
    return <p className="text-base-content/60 italic">No exhibitions yet. Create one above.</p>;
  }

  return (
    <ul className="space-y-3">
      {exhibitions.map((ex) => (
        <li key={ex.id} className="border border-base-300 bg-base-100 p-4">
          {editingId === ex.id ? (
            <div className="space-y-3">
              <ExhibitionForm existing={ex} />
              <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>
                Done
              </button>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-primary">
                    {ex.title || ex.societyName}
                  </span>
                  {ex.active && (
                    <span className="text-[11px] font-semibold tracking-wide
                                     uppercase bg-primary text-primary-content
                                     px-2 py-0.5">
                      Active
                    </span>
                  )}
                </div>
                <div className="text-sm text-base-content/70">{ex.societyName}</div>
                <div className="text-sm text-base-content/70">
                  {formatRange(ex.startDate, ex.endDate)}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                {!ex.active && (
                  <form action={setActiveExhibitionAction}>
                    <input type="hidden" name="id" value={ex.id} />
                    <SubmitButton className="btn btn-sm btn-primary">
                      Set active
                    </SubmitButton>
                  </form>
                )}
                <button className="btn btn-sm btn-outline" onClick={() => setEditingId(ex.id)}>
                  Edit
                </button>
                <form
                  action={async (formData) => {
                    if (confirm(`Delete "${ex.title || ex.societyName}"? This cannot be undone.`)) {
                      await deleteExhibitionAction(formData);
                    }
                  }}
                >
                  <input type="hidden" name="id" value={ex.id} />
                  <SubmitButton className="btn btn-sm btn-error btn-outline">
                    Delete
                  </SubmitButton>
                </form>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
