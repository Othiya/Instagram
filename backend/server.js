const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Post = require('./models/Post');
const { seedDatabase } = require('./seed');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ 
  origin: [
    'http://localhost:5173',
    process.env.FRONTEND_URL
  ]
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
  .then(async () => {
    console.log('MongoDB Connected Successfully!');
    
    // Check if database is empty
    const postCount = await Post.countDocuments();
    if (postCount === 0) {
      console.log('📀 Database is empty. Seeding...');
      try {
        await seedDatabase();
        console.log('✅ Database seeded successfully!');
      } catch (err) {
        console.error('❌ Error seeding database:', err.message);
      }
    } else {
      console.log(`📦 Database already has ${postCount} posts`);
    }
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  });

mongoose.connection.on('disconnected', () => console.warn('⚠️  MongoDB disconnected'));
mongoose.connection.on('reconnected', () => console.log('🔄 MongoDB reconnected'));

app.use('/api/posts', require('./routes/posts'));
app.use('/api/comments', require('./routes/comments')); 
app.use('/api/users', require('./routes/users'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
