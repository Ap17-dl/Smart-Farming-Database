"use client";

import { useEffect, useMemo, useState } from "react";
import type { EntityName } from "@/types/entities";

type Field = {
  key: string;
  label: string;
  type?: "text" | "number" | "date";
};

export default function EntityManager({
  entity,
  title,
  fields,
  enableSearch = false
}: {
  entity: EntityName;
  title: string;
  fields: Field[];
  enableSearch?: boolean;
}) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    const url = new URL(`/api/${entity}`, window.location.origin);
    if (enableSearch && query.trim()) {
      url.searchParams.set("query", query.trim());
    }
    const response = await fetch(url.toString(), { cache: "no-store" });
    if (!response.ok) return;
    const data = (await response.json()) as Record<string, unknown>[];
    setItems(data);
  }

  useEffect(() => {
    loadData();
  }, [entity]);

  const ordered = useMemo(() => items, [items]);

  async function submit() {
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/${entity}/${editingId}` : `/api/${entity}`;

    const payload: Record<string, unknown> = {};
    for (const field of fields) {
      const value = form[field.key];
      if (value === undefined || value === "") continue;
      payload[field.key] = field.type === "number" ? Number(value) : value;
    }

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const body = await response.json();
      setMessage(body.error ?? "Request failed");
      return;
    }

    setMessage(editingId ? "Record updated" : "Record created");
    setEditingId(null);
    setForm({});
    await loadData();
  }

  async function remove(id: string) {
    await fetch(`/api/${entity}/${id}`, { method: "DELETE" });
    await loadData();
  }

  function startEdit(item: Record<string, unknown>) {
    setEditingId(String(item.id));
    const nextForm: Record<string, string> = {};
    for (const field of fields) {
      nextForm[field.key] = String(item[field.key] ?? "");
    }
    setForm(nextForm);
  }

  return (
    <section className="space-y-6">
      <div className="card p-5">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {fields.map((field) => (
            <input
              key={field.key}
              className="input"
              type={field.type ?? "text"}
              placeholder={field.label}
              value={form[field.key] ?? ""}
              onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
            />
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <button type="button" className="btn" onClick={submit}>
            {editingId ? "Update" : "Add"}
          </button>
          {editingId ? (
            <button
              type="button"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              onClick={() => {
                setEditingId(null);
                setForm({});
              }}
            >
              Cancel
            </button>
          ) : null}
        </div>
        {message ? <p className="mt-3 text-sm text-slate-600">{message}</p> : null}
      </div>

      <div className="card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Records</h3>
          {enableSearch ? (
            <div className="flex gap-2">
              <input className="input" placeholder="Search by name/phone" value={query} onChange={(e) => setQuery(e.target.value)} />
              <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm" onClick={loadData}>
                Search
              </button>
            </div>
          ) : null}
        </div>
        <div className="overflow-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                {fields.map((field) => (
                  <th key={field.key} className="px-2 py-2 font-semibold text-slate-700">
                    {field.label}
                  </th>
                ))}
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ordered.map((item) => (
                <tr key={String(item.id)} className="border-b border-slate-100">
                  {fields.map((field) => (
                    <td key={field.key} className="px-2 py-2 text-slate-600">
                      {String(item[field.key] ?? "-")}
                    </td>
                  ))}
                  <td className="px-2 py-2">
                    <div className="flex gap-2">
                      <button className="rounded border border-slate-300 px-2 py-1 text-xs" onClick={() => startEdit(item)}>
                        Edit
                      </button>
                      <button className="rounded border border-red-300 px-2 py-1 text-xs text-red-600" onClick={() => remove(String(item.id))}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
