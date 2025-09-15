import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Database } from '../lib/supabase'

type Task = Database['public']['Tables']['tasks']['Row']
type TaskInsert = Database['public']['Tables']['tasks']['Insert']
type TaskUpdate = Database['public']['Tables']['tasks']['Update']

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchTasks = async () => {
    if (!user) return

    setLoading(true)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tasks:', error)
    } else {
      setTasks(data || [])
    }
    setLoading(false)
  }

  const createTask = async (taskData: Omit<TaskInsert, 'user_id'>) => {
    if (!user) return { error: 'No user' }

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...taskData, user_id: user.id }])
      .select()
      .single()

    if (error) {
      console.error('Error creating task:', error)
      return { error }
    }

    setTasks(prev => [data, ...prev])
    return { data, error: null }
  }

  const updateTask = async (id: string, updates: TaskUpdate) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating task:', error)
      return { error }
    }

    setTasks(prev => prev.map(task => task.id === id ? data : task))
    return { data, error: null }
  }

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting task:', error)
      return { error }
    }

    setTasks(prev => prev.filter(task => task.id !== id))
    return { error: null }
  }

  const getTasksByTimeBucket = (timeBucket: 'S' | 'M' | 'L') => {
    return tasks.filter(task => task.time_bucket === timeBucket && !task.is_completed)
  }

  const getRandomTask = (timeBucket?: 'S' | 'M' | 'L') => {
    const availableTasks = timeBucket
      ? getTasksByTimeBucket(timeBucket)
      : tasks.filter(task => !task.is_completed)

    if (availableTasks.length === 0) return null

    const randomIndex = Math.floor(Math.random() * availableTasks.length)
    return availableTasks[randomIndex]
  }

  useEffect(() => {
    fetchTasks()
  }, [user])

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    getTasksByTimeBucket,
    getRandomTask,
    refetch: fetchTasks
  }
}