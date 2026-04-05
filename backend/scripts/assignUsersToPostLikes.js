require('dotenv').config();
const mongoose = require('mongoose');
const Like = require('../models/Like');
const Post = require('../models/Post');
const User = require('../models/User');
const { generateUsers } = require('./seedUsers');

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function parseNumberFlag(args, name, fallback) {
  const value = args.find(arg => arg.startsWith(`${name}=`));
  if (!value) {
    return fallback;
  }

  const parsed = Number(value.split('=')[1]);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive integer.`);
  }

  return parsed;
}

function pickRandomUsers(users, count) {
  const pool = [...users];
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }
  return pool.slice(0, count);
}

async function assignUsersToPostLikes({
  posts = null,
  minLikes = 30,
  maxLikes = 40,
  targetUsers = 250,
  connect = true
} = {}) {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing. Set it in the environment or backend/.env.');
  }

  if (minLikes > maxLikes) {
    throw new Error('--min cannot be greater than --max.');
  }

  if (connect) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  let users = await User.find().select('_id');
  if (users.length < targetUsers) {
    const missingUsers = targetUsers - users.length;
    const insertedUsers = await User.insertMany(generateUsers(missingUsers));
    users = [...users, ...insertedUsers];
    console.log(`Inserted ${insertedUsers.length} missing users before assigning likes`);
  }

  if (users.length < maxLikes) {
    throw new Error(`Need at least ${maxLikes} users to assign likes per post.`);
  }

  const targetPosts = posts || await Post.find().select('_id author likes');
  if (targetPosts.length === 0) {
    throw new Error('No posts found. Seed posts first.');
  }

  await Like.deleteMany({ postId: { $in: targetPosts.map(post => post._id) } });

  const likeDocuments = [];
  const postUpdates = [];

  for (const post of targetPosts) {
    const likeCount = randomInt(minLikes, maxLikes);
    const selectedUsers = pickRandomUsers(users, likeCount);

    for (const user of selectedUsers) {
      likeDocuments.push({
        postId: post._id,
        userId: user._id
      });
    }

    postUpdates.push({
      updateOne: {
        filter: { _id: post._id },
        update: { $set: { likes: likeCount } }
      }
    });
  }

  await Like.insertMany(likeDocuments);
  await Post.bulkWrite(postUpdates);

  return {
    usersCount: users.length,
    likesAssigned: likeDocuments.length,
    postsCount: targetPosts.length
  };
}

async function main() {
  const args = process.argv.slice(2);
  const result = await assignUsersToPostLikes({
    minLikes: parseNumberFlag(args, '--min', 30),
    maxLikes: parseNumberFlag(args, '--max', 40),
    targetUsers: parseNumberFlag(args, '--users', 250),
    connect: true
  });

  console.log(`Assigned ${result.likesAssigned} likes across ${result.postsCount} posts`);
}

if (require.main === module) {
  main()
    .catch(error => {
      console.error('Assign likes failed:', error.message);
      process.exitCode = 1;
    })
    .finally(async () => {
      await mongoose.disconnect().catch(() => {});
    });
}

module.exports = {
  assignUsersToPostLikes
};
