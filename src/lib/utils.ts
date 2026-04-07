export function formatDate(date: string | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString();
}

export function isOverdue(date: string | null) {
  if (!date) return false;
  const today = new Date();
  const due = new Date(date);
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return due < today;
}