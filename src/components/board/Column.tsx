import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableTaskCard from "./SortableTaskCard";
import type { Task } from "../../types/task";

type Props = {
  id: string;
  title: string;
  tasks: Task[];
  tone: string;
};

export default function Column({ id, title, tasks, tone }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      className={`flex min-h-[420px] flex-col rounded-3xl border border-white/60 p-4 shadow-sm ${tone}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold tracking-tight text-slate-700">
          {title}
        </h2>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 shadow-sm">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 space-y-3 rounded-2xl p-1 transition ${
          isOver ? "bg-white/40" : ""
        }`}
      >
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.length > 0 ? (
            tasks.map((task) => <SortableTaskCard key={task.id} task={task} />)
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/40 p-6 text-center text-sm text-slate-500">
              No tasks here yet
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}