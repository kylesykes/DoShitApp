# Do Shit App - Project Plan

## Project Overview

A Progressive Web App designed to help combat depression-related lack of motivation by gamifying task completion with time-boxed activities, progress tracking, and positive reinforcement.

## Core Problem Statement

Depression often manifests as melancholy and lack of motivation, making it difficult to start and complete even small tasks. This app aims to lower the barrier to action by:
- Breaking tasks into manageable time chunks
- Providing structure through timers
- Celebrating small wins
- Building momentum through visible progress

## Core Features

### 1. Task Management
- **Task Lists**: Create and organize lists of activities/tasks
- **Time Buckets**: Assign tasks to time categories:
  - Small (S): <15 minutes
  - Medium (M): 15 minutes - 1 hour
  - Large (L): >1 hour
- **Task Categories**: Personal, hobbies, cleaning, errands, self-care, etc.
- **Task Details**: Optional description, notes, difficulty level

### 2. Session Management
- **Task Selection**: Browse tasks by time bucket or category
- **Timer System**: Dedicated timer for each session
- **Focus Mode**: Minimize distractions during active sessions
- **Pause/Resume**: Handle interruptions gracefully

### 3. Progress & Motivation
- **Completion Celebration**: Visual/audio feedback for completed tasks
- **Streaks**: Track consecutive days with completed tasks
- **Statistics**: Time spent, tasks completed, favorite categories
- **Achievement System**: Unlock badges/rewards for milestones
- **Mood Tracking**: Optional before/after mood ratings

### 4. Offline Support (PWA)
- **Offline Task Creation**: Add tasks without internet
- **Offline Timer**: Full timer functionality offline
- **Data Sync**: Automatic sync when connection restored
- **App Install**: Installable on mobile home screen

## Technical Architecture

### Frontend Stack
- **React** with TypeScript for type safety
- **PWA Features**: Service Worker, Web App Manifest
- **State Management**: React Context or Zustand for simplicity
- **UI Library**: Tailwind CSS + Headless UI for clean mobile-first design
- **Timer**: Web APIs (setTimeout, Web Workers for accuracy)

### Backend Stack
- **Supabase** for backend services:
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - Row Level Security (RLS)
  - Edge Functions if needed

### Hosting & Deployment
- **Vercel** is excellent for PWAs and React apps
- Automatic HTTPS, edge caching, preview deployments
- Good Supabase integration

## Database Schema (Preliminary)

```sql
-- Users table (handled by Supabase Auth)

-- Task Lists
task_lists (
  id, user_id, name, description, created_at, updated_at
)

-- Tasks
tasks (
  id, user_id, list_id, title, description,
  time_bucket (S/M/L), category, difficulty,
  is_completed, created_at, updated_at
)

-- Task Sessions
task_sessions (
  id, user_id, task_id, started_at, completed_at,
  planned_duration, actual_duration, was_completed,
  mood_before, mood_after, notes
)

-- User Preferences
user_preferences (
  id, user_id, default_timer_sounds,
  celebration_preferences, notification_settings
)
```

## Development Phases

### Phase 1: MVP (2-3 weeks)
- [ ] Basic task CRUD operations
- [ ] Simple timer functionality
- [ ] Time bucket assignment
- [ ] Basic completion tracking
- [ ] PWA setup (installable, offline-ready)

### Phase 2: Motivation Features (2 weeks)
- [ ] Completion celebrations
- [ ] Basic statistics dashboard
- [ ] Streak tracking
- [ ] Achievement system

### Phase 3: Enhanced UX (1-2 weeks)
- [ ] Improved offline support
- [ ] Better mobile experience
- [ ] Notifications (optional)
- [ ] Mood tracking integration

### Phase 4: Polish & Deploy (1 week)
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Production deployment to Vercel

## PWA Considerations

### Service Worker Features
- Cache task data for offline access
- Background sync for task updates
- Cache timer functionality
- Cache UI assets

### Mobile Experience
- Touch-friendly interface
- Proper viewport configuration
- App-like navigation
- Splash screen configuration

## Key User Flows

1. **First Time Setup**: Create account → Create first task list → Add sample tasks
2. **Daily Use**: Open app → Browse tasks by time available → Start timer → Complete task → Celebrate
3. **Task Management**: Add new tasks → Organize into lists → Assign time buckets
4. **Progress Review**: View statistics → Check streaks → See completed tasks

## Success Metrics

- Daily active usage
- Tasks completed per session
- User retention (key for motivation apps)
- Time from opening app to starting first task
- Streak lengths

## Risks & Considerations

- **Motivation Sustainability**: How to keep users engaged long-term
- **Perfectionism Trap**: Ensure flexibility, not rigid structure
- **Overwhelm Prevention**: Don't make the app itself feel like a burden
- **Privacy**: Sensitive mental health data handling

---

## Next Steps

1. Validate feature priorities and user flow
2. Set up development environment
3. Create wireframes/mockups
4. Initialize React + Supabase project
5. Begin Phase 1 development





  1. Authentication: Do you want to require account creation, or would you prefer a "guest mode" that syncs later? Some people prefer less
  friction initially.
  -> yes, we should just require accounts from the start using Supabase authentication.
  2. Task Sharing/Social: Any interest in sharing progress with friends/family, or should this be completely private?
  -> Eventually, but not now.
  3. Notifications: Would gentle reminders be helpful, or could they feel overwhelming? (e.g., "You haven't done anything today" vs "You have 3
   quick tasks available")
   -> I think a reminder push notification would be appropriate, but we can save push notifications for later. for now we could just put something on the landing page encouraging them to start a task (or have us pick one for them if they're indecisive)

  4. Celebration Style: What type of celebrations feel motivating to you? Visual confetti, encouraging messages, progress bars, sounds?
  -> visual confetti and encouraging messages seems appropriate for a first pass
  5. Task Complexity: Should tasks support subtasks/checklists, or keep it simple with single actions?
  -> lets keep it single actions for now. I was imagining either just putting a short text in there or snapping a picture of something that needs done (but the picture can be a later version, for now just single text actions is fine)

  Technical & Usage

  6. Multiple Devices: Important to sync between phone and computer, or primarily mobile-focused?
  -> lets just focus on mobile for now
  7. Data Export: Want ability to export your data/statistics for personal tracking?
  -> not now, but maybe in the future
  8. Mood Integration: How detailed should mood tracking be? Simple good/neutral/bad or more nuanced?
  -> this could be as simple as a "how are you feeling right now?" prior to starting with a good/neutral/bad and then after the task is done "how are you feeling now?"

  Mental Health Considerations

  9. Failure Handling: How should the app respond when you don't complete a task? Gentle encouragement vs neutral vs ignore?
  -> gentle encouragement seems like a good first step
  10. Pressure Management: Any features that might accidentally create pressure/guilt we should avoid?
  -> we'll keep an eye on this as we go