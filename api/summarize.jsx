export default async function handler(req, res) {
  const { text } = req.body;
  // Call Chrome Summarizer API
  const processor = new TextProcessor();
  const summary = await processor.summarize(text);
  console.log(summary); // { summary: "Shortened version of the text" }
  
  res.status(200).json({ summary });
}