export const MATHS_DATA = {
  subjects: [
    {
      id: 1,
      title: 'Calculus',
      icon: '📐',
      description: 'Study of continuous change through derivatives and integrals.',
      stats: { subjects: 12, problems: 450, difficulty: 'Hard' },
      difficulty: 'Hard',
      estHours: 60,
      subtopics: [
        { id: 0, name: 'Limits & Continuity', problems: 50, difficulty: 'Easy', color: '#4ade80', concepts: ["L'Hôpital", "Squeeze Theorem", "Continuity"], description: 'Understanding global and local behavior of functions.' },
        { id: 1, name: 'Derivatives', problems: 50, difficulty: 'Medium', color: '#facc15', concepts: ['Chain Rule', 'Product Rule', 'Optimization'], description: 'Rates of change and gradients of curves.' },
        { id: 2, name: 'Integrals', problems: 50, difficulty: 'Hard', color: '#f87171', concepts: ['U-Substitution', 'Integration by Parts', 'Definite Integrals'], description: 'Area under curves and accumulation of quantities.' },
      ],
      videos: [
        { title: 'Calculus 1 Full Course', channel: 'Professor Leonard', duration: '12:45:00', query: 'Professor Leonard Calculus 1' },
        { title: 'Essence of Calculus', channel: '3Blue1Brown', duration: '3:20:00', query: '3Blue1Brown Essence of Calculus' },
        { title: 'Calculus AB/BC Prep', channel: 'Khan Academy', duration: '1:15:30', query: 'Khan Academy Calculus' }
      ]
    },
    {
      id: 2,
      title: 'Discrete Math',
      icon: '🔗',
      description: 'Mathematics of countable, distinct structures.',
      stats: { subjects: 8, problems: 320, difficulty: 'Medium' },
      difficulty: 'Medium',
      estHours: 45,
      subtopics: [
        { id: 0, name: 'Set Theory', problems: 40, difficulty: 'Easy', color: '#4ade80', concepts: ['Unions', 'Intersections', 'Power Sets'], description: 'Collections of distinct objects and their interactions.' },
        { id: 1, name: 'Logic & Proofs', problems: 40, difficulty: 'Medium', color: '#facc15', concepts: ['Truth Tables', 'Induction', 'Contradiction'], description: 'Formal reasoning and mathematical verification.' },
        { id: 2, name: 'Graph Theory', problems: 40, difficulty: 'Hard', color: '#f87171', concepts: ['BFS/DFS', 'Dijkstra', 'Planarity'], description: 'Modeling relationships between discrete objects.' },
      ],
      videos: [
        { title: 'Discrete Math for Computer Science', channel: 'MIT OpenCourseWare', duration: '1:05:00', query: 'MIT Discrete Math' },
        { title: 'Set Theory Basics', channel: 'The TrevTutor', duration: '15:20', query: 'TrevTutor Set Theory' },
        { title: 'Graph Theory Introduction', channel: 'Sarada Herke', duration: '12:10', query: 'Graph Theory Intro' }
      ]
    },
    {
      id: 3,
      title: 'Linear Algebra',
      icon: '📊',
      description: 'Vectors, matrices, and linear transformations.',
      stats: { subjects: 10, problems: 380, difficulty: 'Medium' },
      difficulty: 'Medium',
      estHours: 50,
      subtopics: [
        { id: 0, name: 'Matrix Operations', problems: 45, difficulty: 'Easy', color: '#4ade80', concepts: ['Multiplication', 'Inversion', 'Determinants'], description: 'Fundamental manipulations of linear numerical arrays.' }
      ],
      videos: [
        { title: 'Linear Algebra Full Course', channel: 'Gilbert Strang', duration: '1:00:00', query: 'Gilbert Strang Linear Algebra' }
      ]
    },
    { id: 4, title: 'Probability', icon: '🎲', description: 'Quantifying uncertainty and random variables.', stats: { subjects: 7, problems: 280, difficulty: 'Medium' }, difficulty: 'Medium', estHours: 40, subtopics: [] },
    { id: 5, title: 'Diff Equations', icon: '📉', description: 'Equations involving derivatives of functions.', stats: { subjects: 6, problems: 250, difficulty: 'Hard' }, difficulty: 'Hard', estHours: 55, subtopics: [] },
    { id: 6, title: 'Numerical Methods', icon: '💻', description: 'Approximating mathematical solutions computationally.', stats: { subjects: 5, problems: 200, difficulty: 'Medium' }, difficulty: 'Medium', estHours: 35, subtopics: [] }
  ],
  problems: {
    '1-0': [ // Calculus - Limits
      { id: 0, title: 'Evaluate Limit with L\'Hôpital', formula: 'lim x→0 (sin x / x)', difficulty: 'Easy', xp: 50, 
        quiz: {
          question: 'What is the limit of (sin x / x) as x approaches 0?',
          options: ['0', '1', 'Infinity', 'Undefined'],
          correct: 1,
          explanation: 'Using L\'Hôpital\'s Rule, we differentiate the numerator and denominator: cos(x)/1. As x→0, cos(0) = 1.'
        }
      },
      { id: 1, title: 'Squeeze Theorem Application', formula: 'lim x→0 x² sin(1/x)', difficulty: 'Medium', xp: 75,
        quiz: {
          question: 'The Squeeze Theorem is used when:',
          options: ['Function is differentiable', 'Function is trapped between two others', 'Limit is infinity', 'Numerator is 0'],
          correct: 1,
          explanation: 'Squeeze theorem applies when -x² ≤ x² sin(1/x) ≤ x²; since limits of -x² and x² are 0, the middle function is 0.'
        }
      }
    ]
  }
};
