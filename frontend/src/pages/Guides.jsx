import { useState, useEffect } from 'react';
import api from '../lib/api';
import { GuideCard } from '../components/Cards';
import Loader from '../components/Loader';

export default function Guides() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/v1/tour-guides').then(r => setItems(r.data || [])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <h1 className="font-display text-4xl font-semibold mb-6">Tour Guides</h1>
      {loading ? <Loader /> : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{items.map(g => <GuideCard key={g.id} g={g} />)}</div>}
    </div>
  );
}
