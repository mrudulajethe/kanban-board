import { CalendarDays } from "lucide-react";
import type { Task } from "../../types/task";
import { formatDate, isOverdue } from "../../lib/utils";

type Props = {
  task: Task;
};

const STATUS_LABELS: Record<Task["status"], string> = {
  todo: "To Do",
  in_progress: "In Progress",
  in_review: "In Review",
  done: "Done",
};

const STATUS_STYLES: Record<Task["status"], string> = {
  todo: "bg-rose-100 text-rose-600",
  in_progress: "bg-sky-100 text-sky-600",
  in_review: "bg-violet-100 text-violet-600",
  done: "bg-emerald-100 text-emerald-600",
};

export default function TaskCard({ task }: Props) {
  const due = formatDate(task.due_date);
  const overdue = isOverdue(task.due_date);

  return (
    <div className="rounded-3xl border border-white/70 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[task.status]}`}
        >
          {STATUS_LABELS[task.status]}
        </span>

        {task.priority && (
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              task.priority === "high"
                ? "bg-rose-100 text-rose-600"
                : task.priority === "normal"
                ? "bg-amber-100 text-amber-600"
                : "bg-emerald-100 text-emerald-600"
            }`}
          >
            {task.priority}
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-slate-800">{task.title}</h3>

      {task.description && (
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {task.description}
        </p>
      )}

      {due && (
        <div
          className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
            overdue
              ? "bg-rose-100 text-rose-600"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          <CalendarDays className="h-3.5 w-3.5" />
          {overdue ? `Overdue: ${due}` : `Due: ${due}`}
        </div>
      )}
    </div>
  );
}