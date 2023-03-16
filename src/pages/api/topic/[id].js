import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default async function handler(req, res) {
  const { id } = req.query;
  let response;
  if (req.method === "DELETE")
    response = await axios.delete(`${baseUrl}/topic/${id}`);
  else if (req.method === "PUT")
    response = await axios.put(`${baseUrl}/topic/${id}`, req.body);
  else response = await axios.get(`${baseUrl}/topic/${id}`);
  const data = response.data;
  res.status(200).json(data);
}
