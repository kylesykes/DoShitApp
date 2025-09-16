import React, { useState, useEffect } from 'react'

interface CelebrationProps {
  task: {
    title: string
    time_bucket: 'S' | 'M' | 'L'
  }
  onClose: () => void
}

export const Celebration: React.FC<CelebrationProps> = ({ task, onClose }) => {
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    // Trigger animation after component mounts
    setShowAnimation(true)

    // Auto-close after 4 seconds
    const timer = setTimeout(() => {
      onClose()
    }, 4000)

    return () => clearTimeout(timer)
  }, [onClose])

  const getCelebrationMessage = () => {
    const messages = [
      "🎉 Awesome work!",
      "🌟 You did it!",
      "💪 Great job!",
      "🚀 Task conquered!",
      "✨ Well done!",
      "🎯 Nailed it!",
      "🏆 Achievement unlocked!",
      "💯 Perfect execution!"
    ]

    return messages[Math.floor(Math.random() * messages.length)]
  }

  const getTaskSizeMessage = (bucket: 'S' | 'M' | 'L') => {
    switch (bucket) {
      case 'S': return "Even small wins count! 🎈"
      case 'M': return "Solid progress made! 🔥"
      case 'L': return "Major accomplishment! 🎊"
      default: return "Keep the momentum going! ⚡"
    }
  }

  const getEncouragementMessage = () => {
    const encouragements = [
      "Your brain just got a dopamine boost! 🧠✨",
      "Building momentum, one task at a time! 🌊",
      "Progress beats perfection every time! 📈",
      "You're stronger than you think! 💪",
      "Every completed task is a victory! 🏅",
      "Look at you being productive! 😎",
      "Task completed = goals achieved! 🎯",
      "You're making things happen! ⚡"
    ]

    return encouragements[Math.floor(Math.random() * encouragements.length)]
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-2xl shadow-2xl w-full max-w-md p-8 text-center text-white transform transition-all duration-500 ${
          showAnimation ? 'scale-100 rotate-0' : 'scale-50 rotate-12'
        }`}
      >
        {/* Confetti-like dots */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-yellow-300 rounded-full animate-ping`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          {/* Main celebration message */}
          <h1 className="text-3xl font-bold mb-4 animate-bounce">
            {getCelebrationMessage()}
          </h1>

          {/* Task completed */}
          <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">Task Completed:</h2>
            <p className="text-xl font-medium">"{task.title}"</p>
          </div>

          {/* Size-specific message */}
          <p className="text-lg mb-3 font-medium">
            {getTaskSizeMessage(task.time_bucket)}
          </p>

          {/* Encouragement */}
          <p className="text-base mb-6 opacity-90">
            {getEncouragementMessage()}
          </p>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={onClose}
              className="w-full bg-white text-purple-600 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors"
            >
              Continue Being Awesome! 🚀
            </button>

            <button
              onClick={onClose}
              className="w-full bg-transparent border-2 border-white text-white py-2 px-6 rounded-lg font-medium hover:bg-white hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors text-sm"
            >
              Close (auto-closes in a few seconds)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}