import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default async function handler(req, res) {
  const { key } = req.body;

  if (!key) {
    return res.status(400).json({ message: "Missing user ID" });
  }

  try {
    let response;
    switch (req.method) {
      case "POST":
        response = await axios.get(`${baseUrl}/user/${key}/bets`);
        break;
      default:
        return res.status(405).json({ message: "Method not allowed" });
    }
    const data = response.data;
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
