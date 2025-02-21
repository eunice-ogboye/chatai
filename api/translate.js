export default async function handler(req, res) {
    const { text, targetLanguage } = req.body;
    // Call Chrome Translator API
    const translatedText = await translateTextAPI(text, targetLanguage);
    res.status(200).json({ translatedText });
  }