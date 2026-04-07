import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useAuth } from "./hooks/useAuth";
import { useTasks } from "./hooks/useTasks";
import Board from "./components/board/Board";
import CreateTaskModal from "./components/tasks/CreateTaskModal";
import type { TaskStatus } from "./types/task";
import type { TaskFormValues } from "./components/tasks/TaskForm";
import { isOverdue } from "./lib/utils";

export default function App() {
  const { userId, loading: authLoading } = useAuth();
  const { tasks, loading, error, createTask, updateTaskStatus } = useTasks(userId);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
      const matchesPriority =
        priorityFilter === "all" ? true : task.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [tasks, search, priorityFilter]);

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      completed: tasks.filter((t) => t.status === "done").length,
      overdue: tasks.filter((t) => isOverdue(t.due_date)).length,
    };
  }, [tasks]);

  async function handleCreate(values: TaskFormValues) {
    const result = await createTask(values);
    return result.error;
  }

  async function handleMoveTask(taskId: string, status: TaskStatus) {
    const result = await updateTaskStatus(taskId, status);
    if (result.error) {
      alert(result.error);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading your board...
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex min-h-screen items-center justify-center text-rose-600">
        Could not start guest session.
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 md:text-5xl">
              TaskFlow
            </h1>
            <p className="mt-2 text-base text-slate-600">
              A polished Kanban board for managing work visually.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks"
                className="bg-transparent outline-none"
              />
            </div>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2"
            >
              <option value="all">All priorities</option>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>

            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              New Task
            </button>
          </div>
        </header>

        <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
            <p className="text-sm font-medium text-slate-500">Total tasks</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-800">{stats.total}</p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
            <p className="text-sm font-medium text-slate-500">Completed</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-800">{stats.completed}</p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
            <p className="text-sm font-medium text-slate-500">Overdue</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-800">{stats.overdue}</p>
          </div>
        </section>

        {error ? (
          <div className="rounded-2xl bg-rose-50 p-4 text-rose-700">
            Failed to load tasks: {error}
          </div>
        ) : (
          <Board tasks={filteredTasks} onMoveTask={handleMoveTask} />
        )}

        <CreateTaskModal
          open={open}
          onClose={() => setOpen(false)}
          onCreate={handleCreate}
        />
      </div>
    </div>
  );
}