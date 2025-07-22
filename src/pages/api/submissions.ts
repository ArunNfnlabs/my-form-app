import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = await clientPromise;
        const db = client.db("my-form-db"); // use your DB name
        const submissions = await db.collection("submissions").find().toArray();
        res.status(200).json(submissions);
    } catch (error) {
        console.error("Fetch error:", error);
        res.status(500).json({ error: "Unable to fetch submissions" });
    }
}
