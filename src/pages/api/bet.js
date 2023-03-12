import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export default async function handler(req, res) {
  const body = req.body;
  const response = await axios.post(`${baseUrl}/bet`, body);
  const data = response.data;
  console.log(data);
  res.status(200).json(data);
}
