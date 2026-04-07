import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import Column from "./Column";
import type { Task, TaskStatus } from "../../types/task";

type Props = {
  tasks: Task[];
  onMoveTask: (taskId: string, status: TaskStatus) => Promise<void>;
};

const COLUMN_TITLES: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  in_review: "In Review",
  done: "Done",
};

const COLUMN_STYLES: Record<TaskStatus, string> = {
  todo: "bg-rose-50/80",
  in_progress: "bg-sky-50/80",
  in_review: "bg-violet-50/80",
  done: "bg-emerald-50/80",
};

export default function Board({ tasks, onMoveTask }: Props) {
  const sensors = useSensors(useSensor(PointerSensor));

  const grouped: Record<TaskStatus, Task[]> = {
    todo: tasks.filter((t) => t.status === "todo"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    in_review: tasks.filter((t) => t.status === "in_review"),
    done: tasks.filter((t) => t.status === "done"),
  };

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const taskId = String(active.id);
    const newStatus = String(over.id) as TaskStatus;

    if (!["todo", "in_progress", "in_review", "done"].includes(newStatus)) {
      return;
    }

    await onMoveTask(taskId, newStatus);
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="overflow-x-auto pb-2">
        <div className="grid min-w-[1100px] grid-cols-4 items-start gap-5">
          {Object.entries(COLUMN_TITLES).map(([status, title]) => (
            <Column
              key={status}
              id={status}
              title={title}
              tasks={grouped[status as TaskStatus]}
              tone={COLUMN_STYLES[status as TaskStatus]}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
}