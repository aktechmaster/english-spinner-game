/* ==========================================================================
   DEFAULT QUESTION DATABASE & DEFINITIONS
   ========================================================================== */
const DEFAULT_QUESTIONS = [
  // FRUITS & VEGETABLES
  { id: 'f1', category: 'fruits', format: 'three_in_five', question: 'Name 3 yellow fruits in 5 seconds!', hint: 'Think of tropical fruits.', answer: 'Banana, Lemon, Pineapple, Mango' },
  { id: 'f2', category: 'fruits', format: 'riddle', question: 'I am long and yellow. Monkeys love to eat me. What am I?', hint: 'Starts with B.', answer: 'Banana' },
  { id: 'f3', category: 'fruits', format: 'unscramble', question: 'Unscramble the fruit: A - P - P - L - E', hint: 'Red or green crunchy fruit.', answer: 'APPLE' },
  { id: 'f4', category: 'fruits', format: 'emoji', question: 'Guess the word: 🔴 + 🍏 = ?', hint: 'A red fruit.', answer: 'Red Apple / Cherry' },
  { id: 'f5', category: 'fruits', format: 'three_in_five', question: 'Name 3 green vegetables in 5 seconds!', hint: 'Healthy salad items.', answer: 'Broccoli, Spinach, Cucumber, Lettuce' },
  { id: 'f6', category: 'fruits', format: 'riddle', question: 'I am orange, long, and rabbits love to eat me. What am I?', hint: 'Starts with C.', answer: 'Carrot' },
  { id: 'f7', category: 'fruits', format: 'unscramble', question: 'Unscramble: O - R - A - N - G - E', hint: 'A fruit and a color.', answer: 'ORANGE' },
  { id: 'f8', category: 'fruits', format: 'three_in_five', question: 'Name 3 fruits that have seeds inside in 5 seconds!', hint: 'Watermelon is one.', answer: 'Watermelon, Apple, Orange, Grape' },

  // ANIMALS & WILDLIFE
  { id: 'a1', category: 'animals', format: 'three_in_five', question: 'Name 3 animals that can fly in 5 seconds!', hint: 'Birds or insects.', answer: 'Eagle, Bat, Bee, Butterfly, Parrot' },
  { id: 'a2', category: 'animals', format: 'riddle', question: 'I am the King of the Jungle and I roar loudly. What am I?', hint: 'Big wild cat.', answer: 'Lion' },
  { id: 'a3', category: 'animals', format: 'unscramble', question: 'Unscramble: E - L - E - P - H - A - N - T', hint: 'Has a long trunk and big ears.', answer: 'ELEPHANT' },
  { id: 'a4', category: 'animals', format: 'emoji', question: 'Guess the word: 🐱 + 👤 = ?', hint: 'A house pet.', answer: 'Cat' },
  { id: 'a5', category: 'animals', format: 'three_in_five', question: 'Name 3 animals that live in the ocean in 5 seconds!', hint: 'Sea creatures.', answer: 'Dolphin, Shark, Whale, Octopus, Fish' },
  { id: 'a6', category: 'animals', format: 'riddle', question: 'I have a long neck so I can eat leaves from tall trees. What am I?', hint: 'Starts with G.', answer: 'Giraffe' },
  { id: 'a7', category: 'animals', format: 'unscramble', question: 'Unscramble: D - O - L - P - H - I - N', hint: 'Smart sea mammal.', answer: 'DOLPHIN' },
  { id: 'a8', category: 'animals', format: 'three_in_five', question: 'Name 3 farm animals in 5 seconds!', hint: 'Animals raised by farmers.', answer: 'Cow, Chicken, Sheep, Horse, Pig' },

  // FOOD & DRINKS
  { id: 'fd1', category: 'food', format: 'three_in_five', question: 'Name 3 breakfast foods in 5 seconds!', hint: 'Foods you eat in the morning.', answer: 'Eggs, Bread, Milk, Cereal, Pancakes' },
  { id: 'fd2', category: 'food', format: 'riddle', question: 'I am cold, sweet, and come in flavors like chocolate and vanilla. What am I?', hint: 'Great on a hot day.', answer: 'Ice Cream' },
  { id: 'fd3', category: 'food', format: 'unscramble', question: 'Unscramble: P - I - Z - Z - A', hint: 'Italian round food with cheese.', answer: 'PIZZA' },
  { id: 'fd4', category: 'food', format: 'emoji', question: 'Guess the word: 🔥 + 🐕 = ?', hint: 'Popular street food.', answer: 'Hotdog' },
  { id: 'fd5', category: 'food', format: 'three_in_five', question: 'Name 3 sweet drinks in 5 seconds!', hint: 'Beverages.', answer: 'Juice, Soda, Milkshake, Tea, Coffee' },
  { id: 'fd6', category: 'food', format: 'riddle', question: 'I am made of two slices of bread with meat or cheese inside. What am I?', hint: 'Starts with S.', answer: 'Sandwich' },
  { id: 'fd7', category: 'food', format: 'unscramble', question: 'Unscramble: B - U - R - G - E - R', hint: 'Fast food sandwich.', answer: 'BURGER' },
  { id: 'fd8', category: 'food', format: 'three_in_five', question: 'Name 3 Italian foods in 5 seconds!', hint: 'Pasta is one.', answer: 'Pizza, Spaghetti, Lasagna, Gelato' },

  // COUNTRIES & PLACES
  { id: 'c1', category: 'countries', format: 'three_in_five', question: 'Name 3 countries in Asia in 5 seconds!', hint: 'Indonesia is one!', answer: 'Indonesia, Japan, China, Korea, Thailand' },
  { id: 'c2', category: 'countries', format: 'riddle', question: 'I am a famous country known for sushi, anime, and Mount Fuji. What country am I?', hint: 'Capital is Tokyo.', answer: 'Japan' },
  { id: 'c3', category: 'countries', format: 'unscramble', question: 'Unscramble: C - H - I - N - A', hint: 'Great Wall country.', answer: 'CHINA' },
  { id: 'c4', category: 'countries', format: 'three_in_five', question: 'Name 3 places in a school in 5 seconds!', hint: 'Where do you go?', answer: 'Classroom, Library, Canteen, Playground, Lab' },
  { id: 'c5', category: 'countries', format: 'riddle', question: 'You come to this room to read and borrow books quietly. What place is it?', hint: 'Starts with L.', answer: 'Library' },
  { id: 'c6', category: 'countries', format: 'unscramble', question: 'Unscramble: B - E - A - C - H', hint: 'Sand and sea waves.', answer: 'BEACH' },
  { id: 'c7', category: 'countries', format: 'three_in_five', question: 'Name 3 English-speaking countries in 5 seconds!', hint: 'USA, UK...', answer: 'USA, UK, Australia, Canada, New Zealand' },

  // JOBS & PROFESSIONS
  { id: 'j1', category: 'jobs', format: 'three_in_five', question: 'Name 3 community workers in 5 seconds!', hint: 'People who help us.', answer: 'Doctor, Teacher, Police Officer, Firefighter' },
  { id: 'j2', category: 'jobs', format: 'riddle', question: 'I put out dangerous fires and drive a big red truck. What is my job?', hint: 'Starts with F.', answer: 'Firefighter' },
  { id: 'j3', category: 'jobs', format: 'unscramble', question: 'Unscramble: D - O - C - T - O - R', hint: 'Works in a hospital.', answer: 'DOCTOR' },
  { id: 'j4', category: 'jobs', format: 'emoji', question: 'Guess the job: ✈️ + 👨‍✈️ = ?', hint: 'Flies airplanes.', answer: 'Pilot' },
  { id: 'j5', category: 'jobs', format: 'three_in_five', question: 'Name 3 jobs that wear a uniform in 5 seconds!', hint: 'Police, Doctor...', answer: 'Police, Nurse, Pilot, Soldier, Chef' },
  { id: 'j6', category: 'jobs', format: 'riddle', question: 'I cook delicious meals in a restaurant kitchen. What am I?', hint: 'Starts with C.', answer: 'Chef / Cook' },
  { id: 'j7', category: 'jobs', format: 'unscramble', question: 'Unscramble: T - E - A - C - H - E - R', hint: 'Person standing in front of your class!', answer: 'TEACHER' },

  // ACTIONS & HOBBIES
  { id: 'act1', category: 'actions', format: 'three_in_five', question: 'Name 3 sports played with a ball in 5 seconds!', hint: 'Football...', answer: 'Football, Basketball, Tennis, Volleyball' },
  { id: 'act2', category: 'actions', format: 'riddle', question: 'You do this action with your feet to move fast, faster than walking. What is it?', hint: 'Starts with R.', answer: 'Running' },
  { id: 'act3', category: 'actions', format: 'unscramble', question: 'Unscramble: S - W - I - M - M - I - N - G', hint: 'Moving in water.', answer: 'SWIMMING' },
  { id: 'act4', category: 'actions', format: 'three_in_five', question: 'Name 3 outdoor activities in 5 seconds!', hint: 'Fun outside.', answer: 'Cycling, Hiking, Running, Camping, Fishing' },
  { id: 'act5', category: 'actions', format: 'riddle', question: 'You use headphones or speakers to enjoy songs. What action is this?', hint: 'Listening to...', answer: 'Listening to Music' },
  { id: 'act6', category: 'actions', format: 'unscramble', question: 'Unscramble: D - A - N - C - I - N - G', hint: 'Moving your body to rhythm.', answer: 'DANCING' },

  // EVERYDAY OBJECTS
  { id: 'o1', category: 'objects', format: 'three_in_five', question: 'Name 3 things inside your school bag in 5 seconds!', hint: 'Stationery.', answer: 'Pencil, Book, Eraser, Ruler, Pen' },
  { id: 'o2', category: 'objects', format: 'riddle', question: 'I tell you the time of day and tick on the wall or wrist. What am I?', hint: 'Has two hands.', answer: 'Clock / Watch' },
  { id: 'o3', category: 'objects', format: 'unscramble', question: 'Unscramble: P - E - N - C - I - L', hint: 'Used for writing or drawing.', answer: 'PENCIL' },
  { id: 'o4', category: 'objects', format: 'emoji', question: 'Guess the word: 🌧️ + 🏹 = ?', hint: 'Colors in the sky after rain.', answer: 'Rainbow' },
  { id: 'o5', category: 'objects', format: 'three_in_five', question: 'Name 3 electrical devices in a house in 5 seconds!', hint: 'TV...', answer: 'TV, Fridge, Computer, Fan, Lamp' },
  { id: 'o6', category: 'objects', format: 'riddle', question: 'I keep your food and drinks cold so they do not spoil. What am I?', hint: 'In the kitchen.', answer: 'Refrigerator / Fridge' },
  { id: 'o7', category: 'objects', format: 'unscramble', question: 'Unscramble: C - O - M - P - U - T - E - R', hint: 'Digital device for working or gaming.', answer: 'COMPUTER' }
];

const TOPIC_DEFINITIONS = {
  fruits: { name: 'Fruits & Veggies', icon: 'fa-apple-whole', color: 'from-rose-500 to-amber-500' },
  animals: { name: 'Animals & Wildlife', icon: 'fa-paw', color: 'from-emerald-500 to-teal-600' },
  food: { name: 'Food & Drinks', icon: 'fa-pizza-slice', color: 'from-amber-500 to-orange-600' },
  countries: { name: 'Countries & Places', icon: 'fa-earth-americas', color: 'from-blue-500 to-indigo-600' },
  jobs: { name: 'Jobs & Professions', icon: 'fa-user-tie', color: 'from-purple-500 to-pink-600' },
  actions: { name: 'Actions & Hobbies', icon: 'fa-person-running', color: 'from-cyan-500 to-blue-600' },
  objects: { name: 'Everyday Objects', icon: 'fa-box-open', color: 'from-violet-500 to-purple-600' }
};

const FORMAT_DEFINITIONS = {
  three_in_five: { title: '3-in-5 Challenge', badge: '⚡ 3-in-5' },
  riddle: { title: 'English Riddle', badge: '🧩 Riddle' },
  unscramble: { title: 'Word Unscramble', badge: '🔤 Unscramble' },
  emoji: { title: 'Emoji Guess', badge: '🖼️ Emoji Guess' }
};
