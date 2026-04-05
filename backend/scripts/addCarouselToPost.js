require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Post = require('../models/Post');

const carouselImages = [
  'https://picsum.photos/seed/mountain123/600/600',
  'https://picsum.photos/seed/mountain123-b/600/600',
  'https://picsum.photos/seed/mountain123-c/600/600'
];

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  const post = await Post.findOne().sort({ createdAt: -1 });
  if (!post) {
    throw new Error('No posts found in database');
  }

  post.images = carouselImages;
  if (!post.imageUrl) {
    post.imageUrl = carouselImages[0];
  }
  await post.save();

  console.log(`Updated post ${post._id} (${post.author}) with ${carouselImages.length} carousel images`);
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
