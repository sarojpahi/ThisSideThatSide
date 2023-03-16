import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export default async function handler(req, res) {
  const body = req.body;
  const response = await axios.post(`${baseUrl}/topic`, body);
  const data = response.data;

  res.status(200).json(data);
}
