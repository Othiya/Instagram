const axios = require('axios');

const HUGGING_FACE_MODEL = process.env.HF_MODEL || 'unitary/toxic-bert';
const HUGGING_FACE_API_URL = `https://router.huggingface.co/hf-inference/models/${HUGGING_FACE_MODEL}`;

const ATTRIBUTE_THRESHOLDS = {
  toxic: Number(process.env.HF_TOXIC_THRESHOLD || 0.8),
  identity_hate: Number(process.env.HF_IDENTITY_HATE_THRESHOLD || 0.5),
  threat: Number(process.env.HF_THREAT_THRESHOLD || 0.5),
  severe_toxic: Number(process.env.HF_SEVERE_TOXIC_THRESHOLD || 0.6),
  insult: Number(process.env.HF_INSULT_THRESHOLD || 0.85),
  obscene: Number(process.env.HF_OBSCENE_THRESHOLD || 0.9)
};

const getFlaggedCategories = predictions => {
  if (!Array.isArray(predictions)) {
    return [];
  }

  const scores = Object.fromEntries(
    predictions
      .filter(
        prediction =>
          prediction &&
          typeof prediction.label === 'string' &&
          typeof prediction.score === 'number'
      )
      .map(prediction => [prediction.label.toLowerCase(), prediction.score])
  );

  return Object.entries(ATTRIBUTE_THRESHOLDS)
    .filter(([attribute, threshold]) => {
      const score = scores[attribute];
      return typeof score === 'number' && score >= threshold;
    })
    .map(([attribute]) => attribute);
};

const detectHateSpeech = async text => {
  const apiKey = process.env.HF_API_KEY;

  if (!apiKey) {
    throw new Error('HF_API_KEY is not configured');
  }

  const response = await axios.post(
    HUGGING_FACE_API_URL,
    {
      inputs: text,
      parameters: {
        function_to_apply: 'sigmoid',
        top_k: 6
      }
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    }
  );

  const predictions = Array.isArray(response.data?.[0]) ? response.data[0] : response.data;
  const categories = getFlaggedCategories(predictions);

  return {
    isHateSpeech: categories.length > 0,
    categories,
    model: HUGGING_FACE_MODEL
  };
};

module.exports = { detectHateSpeech };
