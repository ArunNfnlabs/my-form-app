'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      alert('Submitted!');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } else {
      alert('Submission failed!');
    }
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Contact Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full border p-2" required />
        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full border p-2" required />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full border p-2" />
        <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Message" className="w-full border p-2" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">Submit</button>
      </form>
      <Link href="/submissions" className="text-blue-600 underline mt-4 block">View Submissions</Link>

    </main>
  );
}
