export const LISTENING_CHALLENGES = [
  {
    id: 'recognition',
    title: 'Word Recognition',
    time: '~2 min',
    xp: 10,
    icon: 'Ear',
    accent: 'bg-orange-500/10 text-orange-500',
    dotColor: 'bg-green-500'
  },
  {
    id: 'dictation',
    title: 'Sentence Dictation',
    time: '~4 min',
    xp: 15,
    icon: 'Music',
    accent: 'bg-pink-500/10 text-pink-500',
    dotColor: 'bg-orange-500'
  },
  {
    id: 'audio_match',
    title: 'Audio Matching',
    time: '~3 min',
    xp: 15,
    icon: 'Headphones',
    accent: 'bg-purple-500/10 text-purple-500',
    dotColor: 'bg-orange-500'
  }
];

export const LISTENING_DATA = {
  hindi: {
    recognition: [
      { id: 1, word: 'नमस्ते', audio: 'namaste.mp3', options: ['Hello', 'Goodbye', 'Thank you', 'Please'], correct: 'Hello' }
    ],
    dictation: [
      { id: 1, sentence: 'आप कैसे हैं?', translation: 'How are you?', audio: 'how_are_you.mp3' }
    ]
  }
};
