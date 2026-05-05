export const COOKING_CATEGORIES = [
  { id: 'veg', title: 'Veg Specialist', icon: 'Salad', color: 'text-green-500', bg: 'bg-green-500/10' },
  { id: 'non-veg', title: 'Non-Veg Specialist', icon: 'Drumstick', color: 'text-orange-500', bg: 'bg-orange-500/10' }
];

export const COOKING_TOPICS = {
  'veg': [
    { id: 'paneer-masala', title: 'Paneer Butter Masala', time: '25 min', difficulty: 'Medium', xp: 20 },
    { id: 'veg-biryani', title: 'Vegetable Biryani', time: '40 min', difficulty: 'Hard', xp: 30 },
    { id: 'dal-tadka', title: 'Dal Tadka', time: '15 min', difficulty: 'Easy', xp: 15 },
    { id: 'aloo-gobi', title: 'Aloo Gobi', time: '20 min', difficulty: 'Easy', xp: 15 },
    { id: 'palak-paneer', title: 'Palak Paneer', time: '25 min', difficulty: 'Medium', xp: 20 },
    { id: 'chana-masala', title: 'Chana Masala', time: '30 min', difficulty: 'Medium', xp: 20 },
    { id: 'baingan-bharta', title: 'Baingan Bharta', time: '30 min', difficulty: 'Medium', xp: 20 },
    { id: 'mix-veg', title: 'Mix Veg Curry', time: '25 min', difficulty: 'Easy', xp: 15 },
    { id: 'mushroom-mastani', title: 'Mushroom Mastani', time: '30 min', difficulty: 'Medium', xp: 20 },
    { id: 'okra-fry', title: 'Okra (Bhindi) Fry', time: '15 min', difficulty: 'Easy', xp: 15 }
  ],
  'non-veg': [
    { id: 'butter-chicken', title: 'Butter Chicken', time: '45 min', difficulty: 'Hard', xp: 35 },
    { id: 'chicken-biryani', title: 'Chicken Biryani', time: '50 min', difficulty: 'Expert', xp: 50 },
    { id: 'egg-curry', title: 'Egg Curry', time: '20 min', difficulty: 'Easy', xp: 15 },
    { id: 'fish-fry', title: 'Fish Fry', time: '15 min', difficulty: 'Easy', xp: 15 },
    { id: 'rogan-josh', title: 'Mutton Rogan Josh', time: '60 min', difficulty: 'Expert', xp: 60 },
    { id: 'tandoori-chicken', title: 'Tandoori Chicken', time: '40 min', difficulty: 'Hard', xp: 30 },
    { id: 'prawn-masala', title: 'Prawn Masala', time: '20 min', difficulty: 'Medium', xp: 20 },
    { id: 'chicken-stew', title: 'Chicken Stew', time: '30 min', difficulty: 'Medium', xp: 20 },
    { id: 'grilled-salmon', title: 'Grilled Salmon', time: '20 min', difficulty: 'Medium', xp: 20 },
    { id: 'chicken-alfredo', title: 'Chicken Alfredo', time: '25 min', difficulty: 'Easy', xp: 15 }
  ]
};

export const COOKING_STEPS = {
  'paneer-masala': [
    "Sauté onions, ginger, and garlic until golden brown.",
    "Add tomato puree and standard Indian spices (turmeric, chili, salt).",
    "Mix in butter, heavy cream, and fresh paneer cubes.",
    "Simmer on low heat until the gravy thickens and richness develops."
  ],
  'veg-biryani': [
    "Parboil high-quality basmati rice with whole spices.",
    "Sauté mixed garden veggies with biryani masala and yogurt.",
    "Layer the parboiled rice over the vegetable base.",
    "Dum cook on low flame for 15 minutes to lock in flavors."
  ],
  'dal-tadka': [
    "Pressure cook yellow lentils with turmeric and salt until soft.",
    "Prepare a hot tempering with ghee, cumin, garlic, and dried red chilies.",
    "Pour the sizzling tempering directly over the cooked dal.",
    "Garnish with fresh cilantro and a squeeze of lime."
  ],
  'aloo-gobi': [
    "Sauté cauliflower florets and potato wedges until slightly golden.",
    "Add turmeric, coriander powder, ginger, and green chilies.",
    "Cook covered on low heat until the vegetables are tender.",
    "Finish with a pinch of dry mango powder (amchur) for tanginess."
  ],
  'palak-paneer': [
    "Blanch fresh spinach leaves and blend into a smooth puree.",
    "Sauté aromatics (cumin, garlic) in oil or ghee.",
    "Add the spinach puree and sautéed paneer cubes.",
    "Cook for 5 minutes and finish with a swirl of fresh cream."
  ],
  'chana-masala': [
    "Cook soaked chickpeas until soft but holding shape.",
    "Prepare a spicy tomato-onion base with ginger-garlic paste.",
    "Simmer the chickpeas in the spicy gravy with chana masala.",
    "Add amchur and garam masala at the end for extra punch."
  ],
  'baingan-bharta': [
    "Roast a large eggplant over an open flame until charred and soft.",
    "Peel, mash, and sauté with finely chopped onions and tomatoes.",
    "Add green chilies, turmeric, and a handful of green peas.",
    "Garnish with lots of fresh coriander for the best aroma."
  ],
  'mix-veg': [
    "Sauté carrots, beans, and peas in a little oil.",
    "Add basic curry spices and a spoonful of thick yogurt.",
    "Simmer until the veggies are soft and coated in gravy.",
    "Serve hot with fresh rotis or paratha."
  ],
  'mushroom-mastani': [
    "Sauté button mushrooms with sliced onions and peppers.",
    "Add a paste made of cashews and blanched tomatoes.",
    "Cook until the gravy starts releasing oil and becomes rich.",
    "Finish with a touch of heavy cream and kasuri methi."
  ],
  'okra-fry': [
    "Sauté thinly chopped okra with cumin and asafoetida.",
    "Add turmeric and chili powder after moisture reduces.",
    "Fry on high heat until the okra becomes crispy.",
    "Avoid covering the pan to prevent the okra from getting slimy."
  ],
  'butter-chicken': [
    "Marinate chicken chunks in yogurt, lemon, and spices for 2 hours.",
    "Grill or pan-fry the chicken until cooked through.",
    "Prepare a rich makhani gravy with tomatoes and white butter.",
    "Add chicken to gravy and finish with heavy cream and honey."
  ],
  'chicken-biryani': [
    "Marinate chicken with curd, fried onions, and biryani spices.",
    "Partially cook basmati rice with whole garam masala.",
    "Layer the marinated chicken and rice in a heavy-bottomed pot.",
    "Seal the pot and Dum cook for 20-25 minutes."
  ],
  'egg-curry': [
    "Boil, peel, and light fry the eggs until skin is golden.",
    "Prepare a spicy onion-tomato gravy with ginger-garlic.",
    "Add eggs to the gravy and simmer for 5-7 minutes.",
    "Finish with fresh garam masala and coriander."
  ],
  'fish-fry': [
    "Marinate fish fillets with ginger-garlic paste and lemon juice.",
    "Coat with a mix of rava (semolina) and spices for crunch.",
    "Shallow fry on a hot pan until both sides are golden brown.",
    "Garnish with lemon wedges and onion rings."
  ],
  'rogan-josh': [
    "Sauté ginger powder and fennel seeds in ghee.",
    "Add mutton chunks and brown well on all sides.",
    "Add a mix of yogurt and Kashmiri red chili powder.",
    "Slow cook until the mutton is fork-tender and oil floats on top."
  ],
  'tandoori-chicken': [
    "Make deep gashes in chicken drumsticks or whole chicken.",
    "Apply a first marinade of lemon and salt, followed by spicy yogurt.",
    "Roast in a preheated oven or tandoor at high heat.",
    "Baste with butter in the last 5 minutes for a smoky finish."
  ],
  'prawn-masala': [
    "Clean prawns thoroughly and devein.",
    "Sauté with chopped garlic, curry leaves, and green chilies.",
    "Add tomato paste, turmeric, and seafood masala.",
    "Cook for just 5 minutes to keep prawns juicy and tender."
  ],
  'chicken-stew': [
    "Sauté chicken with whole peppercorns and cinnamon.",
    "Add creamy coconut milk, cubed potatoes, and carrots.",
    "Simmer gently on low heat until chicken is tender.",
    "Serve hot with steamed appams or boiled rice."
  ],
  'grilled-salmon': [
    "Season salmon fillets with sea salt, cracked pepper, and dill.",
    "Sear on a hot grill, skin-side down, until crispy.",
    "Flip and cook for 1-2 more minutes for medium-rare.",
    "Serve immediately with a side of lemon butter sauce."
  ],
  'chicken-alfredo': [
    "Boil fettuccine pasta in salted water until al dente.",
    "Sauté chicken breast strips until golden.",
    "Prepare a sauce with heavy cream, butter, and lots of Parmesan.",
    "Toss the pasta and chicken into the creamy sauce and serve."
  ]
};
