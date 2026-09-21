import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, MapPin } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { formatRating, formatCurrency, timeAgo } from '../lib/utils';
import { HotelCard, ActivityCard } from '../components/Cards';
import Loader from '../components/Loader';

export default function DestinationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    api.get(`/api/v1/destinations?id=${id}`).then(setData).catch(console.error).finally(() => setLoading(false));
    if (user) api.get('/api/v1/favorites').then(r => setFav((r.data || []).some(x => x.target_type === 'destinations' && x.target_id === Number(id))));
  }, [id, user]);

  const toggleFav = async () => {
    if (!user) return;
    await api.post('/api/v1/favorites', { target_type: 'destinations', target_id: Number(id) });
    setFav(true);
  };

  if (loading || !data) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl lg:text-5xl font-semibold">{data.name}</h1>
        {user && <button onClick={toggleFav} className="p-2"><Heart className={`w-6 h-6 ${fav ? 'fill-[color:var(--color-terra)] text-[color:var(--color-terra)]' : ''}`} /></button>}
      </div>
      <div className="flex items-center gap-3 mt-2 text-sm text-[color:var(--color-muted)]">
        <span className="chip">{data.region}</span>
        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{data.state}</span>
        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-[color:var(--color-sun)] text-[color:var(--color-sun)]" />{formatRating(data.avg_rating)} ({data.review_count})</span>
        <span className="chip">Best: {data.best_season}</span>
      </div>
      <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-[color:var(--color-cream-2)] mt-6">
        {data.hero_image && <img src={data.hero_image} alt={data.name} className="w-full h-full object-cover" />}
      </div>
      <p className="mt-6 text-lg leading-relaxed">{data.description}</p>
      <div className="flex flex-wrap gap-2 mt-4">
        {(data.tags || []).map(t => <span key={t} className="chip">#{t}</span>)}
      </div>
      {(data.highlights || []).length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-2xl font-semibold mb-3">Highlights</h2>
          <div className="flex flex-wrap gap-2">{data.highlights.map(h => <span key={h} className="chip bg-[color:var(--color-sage)]/20">{h}</span>)}</div>
        </div>
      )}
      {(data.hotels || []).length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-2xl font-semibold mb-4">Where to stay</h2>
          <div className="grid sm:grid-cols-2 gap-4">{data.hotels.map(h => <HotelCard key={h.id} h={h} />)}</div>
        </div>
      )}
      {(data.activities || []).length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-2xl font-semibold mb-4">Things to do</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{data.activities.map(a => <ActivityCard key={a.id} a={a} />)}</div>
        </div>
      )}
      <div className="mt-10">
        <h2 className="font-display text-2xl font-semibold mb-4">Reviews</h2>
        <div className="space-y-3">
          {(data.reviews || []).map(r => (
            <div key={r.id} className="card p-4">
              <div className="flex items-center gap-1 mb-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-[color:var(--color-sun)] text-[color:var(--color-sun)]' : 'text-[color:var(--color-line)]'}`} />)}</div>
              <p className="text-sm">{r.comment}</p>
              <div className="text-xs text-[color:var(--color-muted)] mt-1">{r.user?.full_name} · {timeAgo(r.created_at)}</div>
            </div>
          ))}
          {(data.reviews || []).length === 0 && <div className="text-sm text-[color:var(--color-muted)]">No reviews yet.</div>}
        </div>
      </div>
    </div>
  );
}

