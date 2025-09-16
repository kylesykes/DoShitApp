import React, { useState, useEffect, useRef } from 'react'

interface TimerProps {
  task: {
    id: string
    title: string
    time_bucket: 'S' | 'M' | 'L'
  }
  onComplete: () => void
  onCancel: () => void
  onSkipAndPickAnother?: () => void
}

export const Timer: React.FC<TimerProps> = ({ task, onComplete, onCancel, onSkipAndPickAnother }) => {
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Get suggested time based on bucket
  const getSuggestedTime = (bucket: 'S' | 'M' | 'L') => {
    switch (bucket) {
      case 'S': return 15 * 60 // 15 minutes
      case 'M': return 45 * 60 // 45 minutes
      case 'L': return 90 * 60 // 90 minutes
      default: return 25 * 60 // 25 minutes default
    }
  }

  useEffect(() => {
    setTimeLeft(getSuggestedTime(task.time_bucket))
  }, [task.time_bucket])

  useEffect(() => {
    if (isRunning && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            // Timer completed
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, isPaused, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    setIsRunning(true)
    setIsPaused(false)
    if (!startTime) {
      setStartTime(new Date())
    }
  }

  const handlePause = () => {
    setIsPaused(!isPaused)
  }

  const handleReset = () => {
    setIsRunning(false)
    setIsPaused(false)
    setTimeLeft(getSuggestedTime(task.time_bucket))
    setStartTime(null)
  }

  const handleStop = () => {
    setIsRunning(false)
    setIsPaused(false)
    onComplete()
  }

  const adjustTime = (minutes: number) => {
    setTimeLeft(prev => Math.max(0, prev + (minutes * 60)))
  }

  const progress = timeLeft > 0 ?
    ((getSuggestedTime(task.time_bucket) - timeLeft) / getSuggestedTime(task.time_bucket)) * 100 : 100

  const timeBucketInfo = {
    'S': { label: 'Small', color: 'bg-green-100 text-green-800', suggested: '15 min' },
    'M': { label: 'Medium', color: 'bg-yellow-100 text-yellow-800', suggested: '45 min' },
    'L': { label: 'Large', color: 'bg-red-100 text-red-800', suggested: '90 min' }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{task.title}</h2>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${timeBucketInfo[task.time_bucket].color}`}>
            {timeBucketInfo[task.time_bucket].label} ({timeBucketInfo[task.time_bucket].suggested})
          </span>
        </div>

        <div className="text-center mb-6">
          <div className="text-6xl font-mono font-bold text-gray-900 mb-4">
            {formatTime(timeLeft)}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {timeLeft === 0 && (
            <div className="text-green-600 font-semibold mb-4">
              🎉 Time's up! Great work!
            </div>
          )}
        </div>

        {/* Time adjustment buttons */}
        <div className="flex justify-center space-x-2 mb-6">
          <button
            onClick={() => adjustTime(-5)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            disabled={isRunning}
          >
            -5min
          </button>
          <button
            onClick={() => adjustTime(-1)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            disabled={isRunning}
          >
            -1min
          </button>
          <button
            onClick={() => adjustTime(1)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            disabled={isRunning}
          >
            +1min
          </button>
          <button
            onClick={() => adjustTime(5)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            disabled={isRunning}
          >
            +5min
          </button>
        </div>

        {/* Control buttons */}
        <div className="flex space-x-3 mb-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            >
              {startTime ? 'Resume' : 'Start'}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex-1 bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          )}

          <button
            onClick={handleReset}
            className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Skip button */}
        {onSkipAndPickAnother && (
          <div className="mb-3">
            <button
              onClick={onSkipAndPickAnother}
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors text-sm"
            >
              🔄 Skip & Pick Another Task
            </button>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleStop}
            className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          >
            Complete Task
          </button>
        </div>
      </div>
    </div>
  )
}