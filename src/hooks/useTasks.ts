import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Task, TaskPriority, TaskStatus } from "../types/task";
type CreateTaskInput = {
  title: string;
  description?: string;
  priority?: TaskPriority;
  due_date?: string;
};

export function useTasks(userId: string | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setTasks((data as Task[]) || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function createTask(input: CreateTaskInput) {
    if (!userId) return { error: "No user session found." };

    const { error } = await supabase.from("tasks").insert({
      title: input.title,
      description: input.description || null,
      priority: input.priority || "normal",
      due_date: input.due_date || null,
      status: "todo",
      user_id: userId,
    });

    if (error) {
      return { error: error.message };
    }

    await fetchTasks();
    return { error: null };
  }

  async function updateTaskStatus(taskId: string, status: TaskStatus) {
    const previousTasks = tasks;
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status } : task))
    );

    const { error } = await supabase
      .from("tasks")
      .update({ status })
      .eq("id", taskId);

    if (error) {
      setTasks(previousTasks);
      return { error: error.message };
    }

    return { error: null };
  }

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTaskStatus,
  };
}