///SEED.JS


require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const { assignUsersToPostLikes } = require('./scripts/assignUsersToPostLikes');

const posts = [
  {
    author: 'natgeo',
    imageUrl: 'https://picsum.photos/seed/mountain123/600/600',
    images: [
      'https://picsum.photos/seed/mountain123/600/600',
      'https://picsum.photos/seed/mountain123-b/600/600',
      'https://picsum.photos/seed/mountain123-c/600/600'
    ],
    caption: 'The mountains are calling and I must go 🏔️ #nature #adventure #explore',
    likes: 48291,
    reposts: 312
  },
  { author: 'foodie.world', imageUrl: 'https://picsum.photos/seed/brunch456/600/600', caption: 'Sunday brunch hits different 🍳☕ #foodie #brunch #weekend', likes: 7843, reposts: 54 },
  { author: 'cityscapes', imageUrl: 'https://picsum.photos/seed/city789/600/600', caption: 'Golden hour in the city ✨ #urban #photography #goldenhour', likes: 12950, reposts: 98 },
  { author: 'ocean.vibes', imageUrl: 'https://picsum.photos/seed/ocean001/600/600', caption: 'Just me, the waves, and endless blue 🌊 #ocean #travel #peace', likes: 31200, reposts: 220 },
  { author: 'arch.daily', imageUrl: 'https://picsum.photos/seed/arch002/600/600', caption: 'Brutalism never looked so beautiful 🏛️ #architecture #design #urban', likes: 9410, reposts: 77 },
  { author: 'forest.walks', imageUrl: 'https://picsum.photos/seed/forest003/600/600', caption: 'Into the woods for a morning reset 🌲🍃 #forest #hiking #mindfulness', likes: 15670, reposts: 133 },
  { author: 'street.lens', imageUrl: 'https://picsum.photos/seed/street004/600/600', caption: 'Stories written on every corner 📷 #streetphotography #blackandwhite', likes: 22340, reposts: 189 },
  { author: 'desert.nomad', imageUrl: 'https://picsum.photos/seed/desert005/600/600', caption: 'Silence so loud it echoes 🏜️ #desert #sahara #solitude', likes: 18900, reposts: 142 },
  { author: 'neon.tokyo', imageUrl: 'https://picsum.photos/seed/tokyo006/600/600', caption: 'Tokyo at 2am is a whole different city 🌃🎌 #tokyo #nightlife #japan', likes: 41200, reposts: 367 },
  { author: 'bloom.garden', imageUrl: 'https://picsum.photos/seed/flowers007/600/600', caption: 'Spring finally arrived and I am NOT ready 🌸🌺 #spring #flowers #bloom', likes: 6230, reposts: 41 },
  { author: 'coffee.culture', imageUrl: 'https://picsum.photos/seed/coffee008/600/600', caption: 'Your morning ritual, elevated ☕ #coffee #flatwhite #slowmorning', likes: 11450, reposts: 88 },
  { author: 'wild.africa', imageUrl: 'https://picsum.photos/seed/safari009/600/600', caption: 'Eye contact with a lion. Still processing 🦁 #safari #africa #wildlife', likes: 87340, reposts: 1024 },
];

const commentData = {
  natgeo: [
    { author: 'wanderlust_k', text: 'Absolutely breathtaking! Which range is this? 😍' },
    { author: 'hikerpro99', text: 'I hiked here last summer, one of the best decisions of my life' },
    { author: 'adventure_mel', text: 'Adding this to the bucket list RIGHT NOW 🏔️' },
    { author: 'photo_chase', text: 'The lighting is unreal. What time did you shoot this?' },
    { author: 'travel.diaries', text: 'Nature never disappoints 🌿' },
  ],
  'foodie.world': [
    { author: 'cheflena', text: 'That hollandaise looks perfect omg 🤤' },
    { author: 'brunch.club', text: 'Where is this place?? Need the address immediately' },
    { author: 'eggsbenedict_fan', text: 'Sunday mood activated ☕' },
    { author: 'yum.daily', text: 'I can almost smell this through the screen' },
  ],
  cityscapes: [
    { author: 'urbanclick', text: 'The lighting here is genuinely perfect' },
    { author: 'photogeek_x', text: 'Sony A7 or Canon? The depth of field is insane' },
    { author: 'citylover_bd', text: 'Which city is this? The architecture is gorgeous' },
    { author: 'golden.hour.club', text: 'Golden hour never misses 🌇' },
    { author: 'lens.life', text: 'Saved for inspo. This is editorial level' },
    { author: 'frame.by.frame', text: 'The silhouette against the sky is everything' },
  ],
  'ocean.vibes': [
    { author: 'salty.hair', text: 'This is my entire personality 🌊' },
    { author: 'wave.rider', text: 'Where is this?? The water color is unreal' },
    { author: 'beach.therapy', text: 'Instantly feel calmer just looking at this' },
    { author: 'coastal.dreams', text: 'Take me there please 😭' },
  ],
  'arch.daily': [
    { author: 'concrete.poetry', text: 'Brutalism done right — this is stunning' },
    { author: 'design.nerd', text: 'The geometry in this shot is *chef kiss*' },
    { author: 'archi.student', text: 'Studying architecture and this is literally what keeps me going' },
    { author: 'urban.form', text: 'Bold, raw, and beautiful. Love it' },
    { author: 'space.matters', text: 'The play of light on those surfaces 🤍' },
  ],
  'forest.walks': [
    { author: 'trail.seeker', text: 'The forest has such healing energy 🌲' },
    { author: 'morning.hiker', text: 'This is why I wake up at 5am' },
    { author: 'green.soul', text: 'Nature therapy > any other therapy' },
    { author: 'deep.woods', text: 'The mist between the trees is magical' },
  ],
  'street.lens': [
    { author: 'street.stories', text: 'Documentary gold right here 📷' },
    { author: 'b.and.w.forever', text: 'B&W street photography hits different every single time' },
    { author: 'candid.life', text: 'The subject has no idea how iconic this shot is' },
    { author: 'urban.souls', text: 'Every face tells a story' },
    { author: 'raw.frame', text: 'This is what real photography looks like' },
  ],
  'desert.nomad': [
    { author: 'sand.dunes', text: 'The silence out there is unlike anything else' },
    { author: 'sahara.dreams', text: 'Spent 2 weeks in the Sahara — this brought it all back 🏜️' },
    { author: 'nomad.life', text: 'Just you, the wind, and endless horizon' },
    { author: 'lost.in.sand', text: 'The colors at this hour are otherworldly' },
  ],
  'neon.tokyo': [
    { author: 'tokyonights', text: 'Tokyo 2am is a completely different dimension 🌃' },
    { author: 'neon.hunter', text: 'The neon reflections on the wet street are everything' },
    { author: 'japan.diaries', text: 'Miss this city every single day 😭🎌' },
    { author: 'blade.runner.vibes', text: 'Straight out of a Cyberpunk scene' },
    { author: 'night.crawler', text: 'The city that never sleeps but does it beautifully' },
    { author: 'shinjuku.nights', text: 'Which area is this? Shinjuku or Shibuya?' },
  ],
  'bloom.garden': [
    { author: 'petal.chaser', text: 'Spring is the best season and I will not be taking questions 🌸' },
    { author: 'garden.therapy', text: 'My anxiety just dropped 10 points looking at this' },
    { author: 'flora.fan', text: 'The colors in this bloom season are insane' },
    { author: 'spring.mood', text: 'Nature said: here is your serotonin 🌺' },
  ],
  'coffee.culture': [
    { author: 'espresso.soul', text: 'A flat white and a good book is my entire situationship ☕' },
    { author: 'latte.art.fan', text: 'The pour on that is immaculate' },
    { author: 'slow.mornings', text: 'Mornings like this make everything worth it' },
    { author: 'cafe.hopper', text: 'Which café is this? The aesthetic is perfect' },
    { author: 'bean.to.cup', text: 'Single origin? The color of that shot looks amazing' },
  ],
  'wild.africa': [
    { author: 'safari.dreams', text: 'Eye contact with a lion is top 3 life experiences no question' },
    { author: 'wildlife.lens', text: 'The focus on those eyes is absolutely perfect 🦁' },
    { author: 'africa.calling', text: 'Africa always calls you back. Always.' },
    { author: 'big.five.fan', text: 'How close were you?? This is incredible' },
    { author: 'golden.mane', text: 'The mane on this one is majestic' },
    { author: 'wild.heart', text: 'This photo belongs in National Geographic' },
    { author: 'bush.life', text: 'The most humbling experience you can have on earth' },
  ],
};

async function seedDatabase() {
  try {
    await Post.deleteMany({});
    await Comment.deleteMany({});

    const savedPosts = await Post.insertMany(posts);
    console.log(`✅ Seeded ${savedPosts.length} posts`);

    let totalComments = 0;
    for (const post of savedPosts) {
      const comments = commentData[post.author] || [];
      if (comments.length === 0) continue;
      await Comment.insertMany(
        comments.map(c => ({ postId: post._id, author: c.author, text: c.text, parentCommentId: null }))
      );
      totalComments += comments.length;
    }
    console.log(`✅ Seeded ${totalComments} comments`);

    const likeResult = await assignUsersToPostLikes({
      posts: savedPosts,
      minLikes: 30,
      maxLikes: 40,
      targetUsers: 250,
      connect: false
    });
    console.log(`✅ Assigned ${likeResult.likesAssigned} likes across ${likeResult.postsCount} posts`);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    throw err;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  mongoose.connect(process.env.MONGO_URI).then(async () => {
    await seedDatabase();
    mongoose.disconnect();
  }).catch(err => {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  });
}

module.exports = { seedDatabase };




