const router = require('express').Router();
const Post = require('../models/Post');

// GET all posts for the feed
router.get('/feed', async (req, res) => {
  try {
    const posts = await Post.find().sort('-createdAt');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LIKE / UNLIKE toggle
router.put('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const delta = req.body.liked ? 1 : -1;
    post.likes = Math.max(0, post.likes + delta);
    await post.save();
    res.json({ likes: post.likes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// REPOST / UN-REPOST toggle
router.put('/:id/repost', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const delta = req.body.reposted ? 1 : -1;
    post.reposts = Math.max(0, post.reposts + delta);
    await post.save();
    res.json({ reposts: post.reposts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;