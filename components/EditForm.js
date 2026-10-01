'use client';

import { useEffect, useRef, useState } from 'react';
import SubmitButton from './SubmitButton';

export default function EditForm({ initialData, action }) {
  const inputRef = useRef(null);
  const [reviewUrl, setReviewUrl] = useState(initialData?.google_url || '');
  const [businessName, setBusinessName] = useState(initialData?.business_name || '');

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        fields: ['place_id', 'name', 'formatted_address'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.place_id) {
          const generatedUrl = `https://search.google.com/local/writereview?placeid=${place.place_id}`;
          setReviewUrl(generatedUrl);
          if (place.name) {
            setBusinessName(place.name);
          }
        }
      });
    }
  }, []);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Cari Nama Bisnis (Google Maps)</label>
        <input
          ref={inputRef}
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Ketik nama toko/bisnis di sini..."
          className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {/* Input hidden untuk menyimpan nama bisnis agar terkirim ke database */}
        <input type="hidden" name="business_name" value={businessName} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">URL Review Google Maps (Otomatis)</label>
        <input
          type="text"
          name="google_url" // Sesuai dengan kolom Supabase
          value={reviewUrl}
          onChange={(e) => setReviewUrl(e.target.value)}
          readOnly
          className="w-full border p-2 rounded-md bg-gray-100 text-gray-700"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          URL akan terisi otomatis saat kamu memilih lokasi dari daftar saran.
        </p>
      </div>

      <SubmitButton />
    </form>
  );
}
