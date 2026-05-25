import { TaskDetailTable } from '@/components/task-detail-table';
export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TaskDetailTable id={id} />;
}
