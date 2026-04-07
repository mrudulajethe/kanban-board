# TaskFlow

TaskFlow is a polished Kanban-style task board built for the Next Play Games Software Development assessment. It allows users to create tasks, organize work visually across board columns, and manage progress with a smooth drag-and-drop experience.

The app is built with **React**, **TypeScript**, **Tailwind CSS**, **Supabase**, and **dnd-kit**, with anonymous guest authentication and per-user task isolation enforced through Row Level Security.

---

## Live Demo

Add your deployed Vercel URL here:

[Live App](https://your-vercel-url.vercel.app)

---

## GitHub Repository

Add your GitHub repo URL here:

[Repository](https://github.com/your-username/your-repo-name)

---

## Features

### Core Features
- Kanban board with 4 workflow columns:
  - To Do
  - In Progress
  - In Review
  - Done
- Create new tasks with:
  - title
  - description
  - priority
  - due date
- Drag and drop tasks across columns
- Persistent task storage using Supabase
- Anonymous guest sign-in on first app launch
- Per-user task visibility using Row Level Security
- Loading and error state handling

### UI / UX Enhancements
- Soft pastel design theme
- Responsive board layout
- Search tasks by title
- Filter tasks by priority
- Summary cards for:
  - total tasks
  - completed tasks
  - overdue tasks
- Priority and status badges on each task card
- Due date indicators for overdue tasks

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend / Database / Auth
- Supabase
- PostgreSQL
- Supabase Anonymous Auth
- Supabase Row Level Security (RLS)

### Drag and Drop
- dnd-kit

### Deployment
- Vercel

---

## Design Approach

The UI was designed to feel modern, clean, and intentional, inspired by tools like Linear, Asana, and Notion. The goal was to create something that feels like a real product rather than a basic to-do list.

Design choices include:
- pastel color palette for each workflow column
- soft shadows and rounded cards
- clear hierarchy between headers, stats, columns, and tasks
- status and priority labels directly on cards
- improved readability through spacing and contrast

---

## Authentication and Security

This app uses **Supabase Anonymous Authentication** to automatically create a guest session for each user.

Each task is tied to the authenticated guest user through `user_id`, and **Row Level Security** ensures users can only read, create, update, and delete their own tasks.

### Security Notes
- only the Supabase **anon public key** is used in the frontend
- no service role key is exposed
- `.env` is excluded from version control through `.gitignore`

---

## Database Schema

### `tasks` table

```sql
create extension if not exists "pgcrypto";

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'in_review', 'done')),
  priority text default 'normal' check (priority in ('low', 'normal', 'high')),
  due_date date,
  user_id uuid not null,
  created_at timestamp with time zone not null default now()
);
```

## Row Level Security

```sql
alter table public.tasks enable row level security;

create policy "Users can view their own tasks"
on public.tasks
for select
using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
on public.tasks
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
on public.tasks
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own tasks"
on public.tasks
for delete
using (auth.uid() = user_id);
```

## Project Structure

```Bash
src/
  components/
    board/
      Board.tsx
      Column.tsx
      SortableTaskCard.tsx
      TaskCard.tsx
    tasks/
      CreateTaskModal.tsx
      TaskForm.tsx
  hooks/
    useAuth.ts
    useTasks.ts
  lib/
    supabase.ts
    utils.ts
  types/
    task.ts
  App.tsx
  main.tsx
  index.css
```

## Deployment

This project is deployed with Vercel.

### Steps

- Push the project to GitHub
- Import the GitHub repo into Vercel
- Add environment variables in Vercel:
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY
- Deploy the project

