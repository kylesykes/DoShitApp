import React, { useState } from 'react'
import { useTasks } from '../hooks/useTasks'
import { TaskForm } from '../components/Tasks/TaskForm'
import { TaskCard } from '../components/Tasks/TaskCard'

export const Dashboard: React.FC = () => {
  const { tasks, loading, createTask, updateTask, deleteTask, getTasksByTimeBucket, getRandomTask } = useTasks()
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)

  const handleCreateTask = async (taskData: {
    title: string
    description?: string
    time_bucket: 'S' | 'M' | 'L'
    category?: string
  }) => {
    setCreateLoading(true)
    const result = await createTask(taskData)
    setCreateLoading(false)

    if (!result.error) {
      setShowTaskForm(false)
    }
  }

  const handleStartTask = (task: any) => {
    // TODO: Implement timer functionality
    console.log('Starting task:', task.title)
  }

  const handleCompleteTask = async (task: any) => {
    await updateTask(task.id, { is_completed: true })
  }

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId)
    }
  }

  const handlePickRandomTask = (timeBucket?: 'S' | 'M' | 'L') => {
    const randomTask = getRandomTask(timeBucket)
    if (randomTask) {
      handleStartTask(randomTask)
    }
  }

  const incompleteTasks = tasks.filter(task => !task.is_completed)
  const completedTasks = tasks.filter(task => task.is_completed)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading your tasks...</div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-0">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Ready to get some shit done?
        </h1>
        <p className="text-gray-600">
          {incompleteTasks.length > 0
            ? `You have ${incompleteTasks.length} task${incompleteTasks.length !== 1 ? 's' : ''} waiting for you.`
            : "You're all caught up! Add some new tasks to tackle."
          }
        </p>
      </div>

      {/* Quick Actions */}
      {incompleteTasks.length > 0 && (
        <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Start</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={() => handlePickRandomTask()}
              className="bg-white text-gray-700 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="font-medium">Pick for me</div>
              <div className="text-sm text-gray-500">Any task</div>
            </button>
            <button
              onClick={() => handlePickRandomTask('S')}
              className="bg-green-100 text-green-800 px-4 py-3 rounded-lg hover:bg-green-200 transition-colors"
            >
              <div className="font-medium">Quick win</div>
              <div className="text-sm text-green-600">&lt;15 min</div>
            </button>
            <button
              onClick={() => handlePickRandomTask('M')}
              className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded-lg hover:bg-yellow-200 transition-colors"
            >
              <div className="font-medium">Medium task</div>
              <div className="text-sm text-yellow-600">15min-1hr</div>
            </button>
            <button
              onClick={() => handlePickRandomTask('L')}
              className="bg-red-100 text-red-800 px-4 py-3 rounded-lg hover:bg-red-200 transition-colors"
            >
              <div className="font-medium">Big project</div>
              <div className="text-sm text-red-600">&gt;1hr</div>
            </button>
          </div>
        </div>
      )}

      {/* Add Task Button */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Your Tasks</h2>
        <button
          onClick={() => setShowTaskForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Add New Task
        </button>
      </div>

      {/* Tasks List */}
      {incompleteTasks.length === 0 && completedTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-600 mb-6">Add your first task to get started!</p>
          <button
            onClick={() => setShowTaskForm(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add Your First Task
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Incomplete Tasks */}
          {incompleteTasks.length > 0 && (
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-3">
                To Do ({incompleteTasks.length})
              </h3>
              <div className="space-y-3">
                {incompleteTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStart={handleStartTask}
                    onComplete={handleCompleteTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-3">
                Completed ({completedTasks.length})
              </h3>
              <div className="space-y-3">
                {completedTasks.slice(0, 5).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStart={handleStartTask}
                    onComplete={handleCompleteTask}
                    onDelete={handleDeleteTask}
                    showActions={false}
                  />
                ))}
                {completedTasks.length > 5 && (
                  <p className="text-gray-500 text-sm text-center py-2">
                    And {completedTasks.length - 5} more completed tasks...
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowTaskForm(false)}
          loading={createLoading}
        />
      )}
    </div>
  )
}