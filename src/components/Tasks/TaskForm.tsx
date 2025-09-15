import React, { useState } from 'react'

interface TaskFormProps {
  onSubmit: (task: {
    title: string
    description?: string
    time_bucket: 'S' | 'M' | 'L'
    category?: string
  }) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel, loading = false }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [timeBucket, setTimeBucket] = useState<'S' | 'M' | 'L'>('S')
  const [category, setCategory] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      time_bucket: timeBucket,
      category: category.trim() || undefined
    })

    // Reset form
    setTitle('')
    setDescription('')
    setTimeBucket('S')
    setCategory('')
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel()
    }
  }

  const timeBucketOptions = [
    { value: 'S', label: 'Small (<15 min)', color: 'bg-green-100 text-green-800' },
    { value: 'M', label: 'Medium (15min-1hr)', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'L', label: 'Large (>1hr)', color: 'bg-red-100 text-red-800' }
  ]

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Task</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                What needs to be done?
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Clean the kitchen, Call mom, Write blog post"
                required
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Details (optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Any additional details..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How long will this take?
              </label>
              <div className="grid grid-cols-1 gap-2">
                {timeBucketOptions.map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="timeBucket"
                      value={option.value}
                      checked={timeBucket === option.value}
                      onChange={(e) => setTimeBucket(e.target.value as 'S' | 'M' | 'L')}
                      className="sr-only"
                    />
                    <div className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                      timeBucket === option.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${option.color}`}>
                        {option.label}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category (optional)
              </label>
              <input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Cleaning, Work, Personal"
              />
            </div>

            <div className="flex space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Adding...' : 'Add Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}