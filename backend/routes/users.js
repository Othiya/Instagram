const router = require('express').Router();
const User = require('../models/User');
const CAT_AVATAR_URL = 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

// Demo identity
const DEMO_USER = {
  username: 'fat_cat',
  email: 'fatcatto.demo@example.com',
  fullName: 'Fat Cat',
  bio: 'Local demo account',
  avatarUrl: CAT_AVATAR_URL,
  location: 'Dhaka, Bangladesh',
  website: '',
  followersCount: 128,
  followingCount: 96,
  postsCount: 4,
  isVerified: false,
  isPrivate: false
};

async function ensureDemoUser() {
  let user = await User.findOne({
    $or: [
      { username: DEMO_USER.username },
      { username: 'fat_catto' },
      { username: '_mld_' },
      { username: '_sleepy_123' },
      { username: 'you.demo' },
      { email: DEMO_USER.email },
      { email: 'sleepy123.demo@example.com' },
      { email: 'mld.demo@example.com' },
      { email: 'you.demo@example.com' }
    ]
  });

  if (!user) {
    user = await User.create(DEMO_USER);
  } else {
    Object.assign(user, DEMO_USER);
    await user.save();
  }
  return user;
}

// Current viewer
router.get('/me', async (req, res) => {
  try {
    const user = await ensureDemoUser();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
