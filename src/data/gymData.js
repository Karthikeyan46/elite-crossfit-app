export const pricingPlans = [
    {
        id: 'workout',
        name: 'Just Workout',
        price: '₹4999',
        period: 'month',
        features: [
            'Full Access to Gym Floor',
            'Cross Training Equipment',
            'Expert Facility Guidance',
            'Locker Room Access'
        ],
        buttonText: 'Join Workout',
        popular: false
    },
    {
        id: 'app-scan',
        name: 'Workout + App Scan',
        price: '₹5199',
        period: 'month',
        features: [
            'All Workout Features',
            'AI Food Scanner Access',
            'Digital Macro Tracking',
            'SaaS App Subscription'
        ],
        buttonText: 'Join with App',
        popular: true
    }
];

export const testimonials = [
    {
        id: 1,
        name: 'Amit Sharma',
        role: 'Pro Member',
        content: 'ELITE CROSS Fit Studio changed my life. The AI scanner is a game changer for my diet!',
        rating: 5,
        image: 'https://i.pravatar.cc/150?u=amit'
    },
    {
        id: 2,
        name: 'Priya Singh',
        role: 'Elite Member',
        content: 'The trainers are world-class, and the app makes it so easy to follow my workouts.',
        rating: 5,
        image: 'https://i.pravatar.cc/150?u=priya'
    },
    {
        id: 3,
        name: 'Vikram Mehta',
        role: 'Basic Member',
        content: 'Great community and atmosphere. The facility is top-notch.',
        rating: 4,
        image: 'https://i.pravatar.cc/150?u=vikram'
    }
];

export const galleryItems = [
    // Top Row: Premium Success & Training Highlights
    { id: 4, type: 'video', title: '10kg Weight Loss Transformation', category: 'Success', url: '/videos/Weight-loss-program-high-intensity-interval-training-thrice-a-week-for-7-weeks-result-10kg-weight-loss.mp4' },
    { id: 9, type: 'video', title: '120kg Deadlift PB', category: 'Training', url: '/videos/120-kg-dead-lift-2-RM-gain-strength.mp4' },
    { id: 10, type: 'video', title: '3ft Box Jump Master', category: 'Training', url: '/videos/Box-jump-3feet-endurace-speedandagility-motivation-fitnessfreak-fitnesschallenge-crossfitgames-crosstraining-fitnessworld.mp4' },
    
    // Core Training Content
    { id: 100, type: 'video', title: 'Front Flip Technique', category: 'Training', url: '/videos/front-flip.mp4' },
    { id: 101, type: 'video', title: 'Kettlebell Flow', category: 'Training', url: '/videos/kettlebell.mp4' },
    { id: 102, type: 'video', title: 'Push Your Absolute Limits', category: 'Training', url: '/videos/push-limits.mp4' },
    { id: 103, type: 'video', title: 'Strength & Endurance PB', category: 'Training', url: '/videos/strength-endurance.mp4' },
    { id: 104, type: 'video', title: 'Explosive Box Jumps', category: 'Training', url: '/videos/box-jump.mp4' },
    { id: 105, type: 'video', title: 'Daily Workout Motivation', category: 'Training', url: '/videos/workout-motivation.mp4' },

    // Training & IG Highlights
    { id: 14, type: 'video', title: 'Ring Handstand Holding', category: 'Training', url: '/videos/Ring-hand-stand-holding-crossfitlove-balance-training-crossfitgirls-motivacion-fitnessjourney-...-.mp4' },
    { id: 12, type: 'video', title: 'Morning Fitness Vibes', category: 'Training', url: '/videos/Morning-vibes-lifestyle-flexibilitytraining-motivation-weightloss-personaltrainer-udt-groupfitness-......-udumalpet-Elite-cross-fit-studio.....mp4' },
    { id: 6, type: 'video', title: 'Fat Loss Endurance', category: 'Success', url: '/videos/30-sec-work-30-rest-fatloss-endurancetraining-motivacion-speedtraining-lifelessons-.mp4' },
    { id: 21, type: 'video', title: 'Training Highlight 2', category: 'Training', url: '/videos/Instagram-2.mp4' },
    { id: 22, type: 'video', title: 'Training Highlight 3', category: 'Training', url: '/videos/Instagram-3.mp4' },
    { id: 23, type: 'video', title: 'Training Highlight 4', category: 'Training', url: '/videos/Instagram-4.mp4' },
    { id: 24, type: 'video', title: 'Training Highlight 5', category: 'Training', url: '/videos/Instagram-5.mp4' },
    { id: 25, type: 'video', title: 'Training Highlight 6', category: 'Training', url: '/videos/Instagram-6.mp4' },
    { id: 26, type: 'video', title: 'Training Highlight 7', category: 'Training', url: '/videos/Instagram-7.mp4' },
    { id: 27, type: 'video', title: 'Training Highlight 8', category: 'Training', url: '/videos/Instagram-8.mp4' },
    { id: 28, type: 'video', title: 'Cross Skipping', category: 'Training', url: '/videos/Instagram-9.mp4' },
];

export const workoutVideos = [
    {
        id: 1,
        title: 'Elite Power Lifting PB',
        duration: '12 sec',
        thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
        url: '/videos/deadlift.mp4'
    },
    {
        id: 2,
        title: 'Explosive Box Jump Prep',
        duration: '15 sec',
        thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
        url: '/videos/box-jump.mp4'
    },
    {
        id: 3,
        title: 'Weight Loss Transformation',
        duration: '45 sec',
        thumbnail: 'https://images.unsplash.com/photo-1574680077505-ef74a5af5431?auto=format&fit=crop&q=80&w=800',
        url: '/videos/weight-loss.mp4'
    }
];
