export type TTask = {
    id: number
    title: string
    description: string
    status: 'todo' | 'in_progress' | 'done'
    due_date: string
    assigned_user_id: number
}

export type TTaskData = {
    data: TTask[];
    current_page: number;
    per_page: number;
    total: number;
}