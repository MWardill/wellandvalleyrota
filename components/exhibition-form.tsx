"use client";

import { useRef } from "react";
import { DEFAULT_SOCIETY_NAME, type Exhibition } from "@/lib/types";
import { createExhibitionAction, updateExhibitionAction } from "@/actions/exhibitions";

export default function ExhibitionForm({ existing }: { existing?: Exhibition }) {
  const formRef = useRef<HTMLFormElement>(null);
  const isEdit = Boolean(existing);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        if (isEdit) {
          await updateExhibitionAction(formData);
        } else {
          await createExhibitionAction(formData);
          formRef.current?.reset();
        }
      }}
      className="space-y-4 border border-base-300 bg-base-100 p-6"
    >
      <h2 className="font-display text-xl text-primary">
        {isEdit ? "Edit exhibition" : "New exhibition"}
      </h2>

      {existing && <input type="hidden" name="id" value={existing.id} />}

      <label className="form-control w-full">
        <span className="label-text uppercase text-xs tracking-wider">Society name</span>
        <input
          name="societyName"
          required
          defaultValue={existing?.societyName ?? DEFAULT_SOCIETY_NAME}
          className="input input-bordered w-full"
        />
      </label>

      <label className="form-control w-full">
        <span className="label-text uppercase text-xs tracking-wider">Title (optional)</span>
        <input
          name="title"
          defaultValue={existing?.title ?? ""}
          className="input input-bordered w-full"
        />
      </label>

      <div className="flex gap-4 flex-wrap">
        <label className="form-control">
          <span className="label-text uppercase text-xs tracking-wider">Start date</span>
          <input
            type="date"
            name="startDate"
            required
            defaultValue={existing?.startDate ?? ""}
            className="input input-bordered"
          />
        </label>
        <label className="form-control">
          <span className="label-text uppercase text-xs tracking-wider">End date</span>
          <input
            type="date"
            name="endDate"
            required
            defaultValue={existing?.endDate ?? ""}
            className="input input-bordered"
          />
        </label>
      </div>

      <button type="submit" className="btn btn-primary">
        {isEdit ? "Save changes" : "Create exhibition"}
      </button>
    </form>
  );
}
