import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
  due_date: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

type Props = {
  onSubmit: (values: TaskFormValues) => Promise<void>;
  submitting: boolean;
};

export default function TaskForm({ onSubmit, submitting }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "normal",
      due_date: "",
    },
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="mb-1 block text-sm font-medium">Title</label>
        <input
          {...register("title")}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          placeholder="Enter task title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-rose-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          {...register("description")}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          rows={4}
          placeholder="Optional description"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Priority</label>
        <select
          {...register("priority")}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Due date</label>
        <input
          type="date"
          {...register("due_date")}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {submitting ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}