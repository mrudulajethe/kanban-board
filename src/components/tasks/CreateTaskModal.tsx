import { useState } from "react";
import TaskForm from "./TaskForm";
import type { TaskFormValues } from "./TaskForm";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (values: TaskFormValues) => Promise<string | null>;
};

export default function CreateTaskModal({ open, onClose, onCreate }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleCreate(values: TaskFormValues) {
    setSubmitting(true);
    setError(null);

    const result = await onCreate(values);

    if (result) {
      setError(result);
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Create Task</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900">
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}

        <TaskForm onSubmit={handleCreate} submitting={submitting} />
      </div>
    </div>
  );
}