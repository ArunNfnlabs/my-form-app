'use client';

import { useEffect, useState } from 'react';

type Submission = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
};

export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSubmissions() {
            const res = await fetch('/api/submissions');
            const data = await res.json();
            setSubmissions(data);
            setLoading(false);
        }
        fetchSubmissions();
    }, []);

    if (loading) return <p className="p-4">Loading...</p>;

    return (
        <main className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Submissions</h1>
            <ul className="space-y-4">
                {submissions.map((item) => (
                    <li key={item._id} className="border p-4 rounded shadow">
                        <p><strong>Name:</strong> {item.name}</p>
                        <p><strong>Email:</strong> {item.email}</p>
                        <p><strong>Phone:</strong> {item.phone}</p>
                        <p><strong>Message:</strong> {item.message}</p>
                    </li>
                ))}
            </ul>
        </main>
    );
}
