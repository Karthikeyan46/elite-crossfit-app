export const challenges = [
  {
    id: '30-day-core',
    title: '30 Day Core Challenge',
    description: 'Build a rock-solid core with this progressive 30-day workout plan designed for all levels.',
    duration: 30,
    difficulty: 'Intermediate',
    category: 'Strength',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
    days: Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}: ${i % 3 === 0 ? 'Intense Core' : i % 3 === 1 ? 'Stability Focus' : 'Recovery & Stretching'}`,
      tasks: [
        { name: 'Plank', sets: 3, duration: '45s' },
        { name: 'Russian Twists', sets: 3, reps: '20' },
        { name: 'Leg Raises', sets: 3, reps: '15' },
        { name: 'Mountain Climbers', sets: 3, duration: '30s' }
      ]
    }))
  },
  {
    id: '21-day-hiit',
    title: '21 Day HIIT Blast',
    description: 'Torch calories and improve cardiovascular health with these high-intensity interval training sessions.',
    duration: 21,
    difficulty: 'Advanced',
    category: 'Cardio',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
    days: Array.from({ length: 21 }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}: ${i % 2 === 0 ? 'HIIT Sprints' : 'Active Recovery'}`,
      tasks: [
        { name: 'Burpees', sets: 4, reps: '15' },
        { name: 'Jumping Jacks', sets: 4, duration: '45s' },
        { name: 'Pushups', sets: 4, reps: '12' },
        { name: 'High Knees', sets: 4, duration: '30s' }
      ]
    }))
  },
  {
    id: '15-day-flexibility',
    title: '15 Day Flexibility Flow',
    description: 'Improve your range of motion and reduce muscle tension with daily yoga-inspired stretching.',
    duration: 15,
    difficulty: 'Beginner',
    category: 'Flexibility',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    days: Array.from({ length: 15 }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}: ${i % 5 === 0 ? 'Full Body Flow' : 'Targeted Release'}`,
      tasks: [
        { name: 'Downward Dog', duration: '1m' },
        { name: 'Cobra Stretch', duration: '45s' },
        { name: 'Child\'s Pose', duration: '2m' },
        { name: 'Pigeon Pose', duration: '1m per side' }
      ]
    }))
  }
];
