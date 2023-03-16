import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default async function handler(req, res) {
  const { id } = req.query;
  const response = await axios.get(`${baseUrl}/topic/${id}/bets`);
  const data = response.data;
  res.status(200).json(data);
}
