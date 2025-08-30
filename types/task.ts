export type TTask = {
    id: number
    title: string
    description: string
    status: string
    due_date: string
    assigned_user_id: number
}

export type TTaskData = {
    data: TTask[];
    current_page: number;
    per_page: number;
    total: number;
}

export type TCurrentTask = Omit<TTask, "id" | 'assigned_user_id'> & {
    id: number | null;
    assigned_user_id: string | null;
}