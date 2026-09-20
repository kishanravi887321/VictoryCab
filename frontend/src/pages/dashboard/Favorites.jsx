import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import api from '../../lib/api';
import Loader, { EmptyState } from '../../components/Loader';

export default function Favorites() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/api/v1/favorites').then(setItems).finally(() => setLoading(false)); }, []);

  const remove = async (type, id) => {
    await api.post('/api/v1/favorites', { target_type: type, target_id: id });
    setItems(i => i.filter(x => !(x.target_type === type && x.target_id === id)));
  };

  const linkFor = (type, id) => type === 'destinations' ? `/destinations/${id}` : type === 'hotels' ? `/hotels/${id}` : type === 'activities' ? `/experiences/${id}` : '/';

  if (loading) return <Loader />;
  if (items.length === 0) return <EmptyState title="No favorites yet" body="Tap the heart on any listing to save it here." />;

  const grouped = items.reduce((acc, f) => { (acc[f.target_type] = acc[f.target_type] || []).push(f); return acc; }, {});

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-semibold">My favorites</h2>
      {Object.entries(grouped).map(([type, favs]) => (
        <section key={type}>
          <div className="text-xs uppercase tracking-widest text-[color:var(--color-muted)] mb-2 capitalize">{type.replace('_', ' ')}</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {favs.map(f => (
              <div key={f.id} className="card overflow-hidden group">
                <Link to={linkFor(f.target_type, f.target_id)}>
                  <div className="aspect-[4/3] bg-[color:var(--color-cream-2)] overflow-hidden">
                    {f.target_image && <img src={f.target_image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />}
                  </div>
                </Link>
                <div className="p-3 flex items-center justify-between">
                  <Link to={linkFor(f.target_type, f.target_id)} className="font-medium text-sm truncate">{f.target_name}</Link>
                  <button onClick={() => remove(f.target_type, f.target_id)} className="text-[color:var(--color-terra)] p-1 shrink-0"><Heart className="w-4 h-4 fill-current" /></button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
