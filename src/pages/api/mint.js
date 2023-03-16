import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const response = await axios.post(`${baseUrl}/user/mint`, req.body);
      const data = response.data;
      console.log(data);
      res.status(200).json(data);
    } else res.status(400).json("Bad Request");
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
}
