import React from 'react'

interface Task {
  id: string
  title: string
  description: string | null
  time_bucket: 'S' | 'M' | 'L'
  category: string | null
  is_completed: boolean
  created_at: string
}

interface TaskCardProps {
  task: Task
  onStart: (task: Task) => void
  onComplete: (task: Task) => void
  onDelete: (taskId: string) => void
  onArchive?: (taskId: string) => void
  showActions?: boolean
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStart,
  onComplete,
  onDelete,
  onArchive,
  showActions = true
}) => {
  const getTimeBucketDisplay = (bucket: 'S' | 'M' | 'L') => {
    switch (bucket) {
      case 'S': return { label: '<15 min', color: 'bg-green-100 text-green-800' }
      case 'M': return { label: '15min-1hr', color: 'bg-yellow-100 text-yellow-800' }
      case 'L': return { label: '>1hr', color: 'bg-red-100 text-red-800' }
    }
  }

  const timeBucketInfo = getTimeBucketDisplay(task.time_bucket)

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 ${task.is_completed ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className={`font-medium text-gray-900 ${task.is_completed ? 'line-through' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          )}
        </div>
        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${timeBucketInfo.color}`}>
          {timeBucketInfo.label}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {task.category && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {task.category}
            </span>
          )}
        </div>

        {showActions && !task.is_completed && (
          <div className="flex space-x-2">
            <button
              onClick={() => onStart(task)}
              className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Start
            </button>
            <button
              onClick={() => onComplete(task)}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Done
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        )}

        {task.is_completed && (
          <div className="flex items-center justify-between">
            <span className="text-green-600 text-sm font-medium">✓ Completed</span>
            {onArchive && (
              <button
                onClick={() => onArchive(task.id)}
                className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Archive
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}