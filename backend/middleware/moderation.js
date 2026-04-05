const { detectHateSpeech } = require('../services/huggingFaceModeration');

const checkModeration = async (req, res, next) => {
  const text = req.body?.text;

  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({
      warning: true,
      message: 'Comment text is required.'
    });
  }

  try {
    const moderation = await detectHateSpeech(text);

    if (moderation.isHateSpeech) {
      return res.status(400).json({
        warning: true,
        message: 'Your comment was rejected because it appears to contain hate speech.',
        categories: moderation.categories
      });
    }

    next();
  } catch (error) {
    console.error('Moderation error:', error.message);
    return res.status(503).json({
      warning: true,
      message: 'Comment moderation is temporarily unavailable. Please try again later.'
    });
  }
};

module.exports = checkModeration;
