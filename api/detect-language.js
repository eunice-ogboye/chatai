export default async function handler(req, res) {
    const { text } = req.body;
    // Call Chrome Language Detection API
    const language = await detectLanguageAPI(text);
    res.status(200).json({ language });
  }