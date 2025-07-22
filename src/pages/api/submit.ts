import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/db"; // adjust path if needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, email, phone, message } = req.body;

    try {
      const client = await clientPromise;
      const db = client.db("my-form-db"); // your DB name
      const collection = db.collection("submissions");

      await collection.insertOne({ name, email, phone, message, createdAt: new Date() });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Insert error:", error);
      res.status(500).json({ success: false, error: "Database insert failed" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
