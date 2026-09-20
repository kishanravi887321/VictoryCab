import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { formatRating, formatCurrency, timeAgo } from '../lib/utils';
import Loader from '../components/Loader';

export default function GuideDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => { api.get(`/api/v1/tour-guides?id=${id}`).then(setData).finally(() => setLoading(false)); }, [id]);

  const book = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    try {
      const end = new Date(date); end.setDate(end.getDate() + 1);
      await api.post('/api/v1/bookings', { target_type: 'tour_guides', target_id: Number(id), check_in: date, check_out: end.toISOString().slice(0, 10), guests: 1 });
      setMsg('✓ Guide requested. They\'ll confirm shortly.');
    } catch (e) { setMsg(e.message); }
  };

  if (loading || !data) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
      <div className="flex items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-[color:var(--color-cream-2)] overflow-hidden shrink-0">
          {data.image_url && <img src={data.image_url} alt={data.name} className="w-full h-full object-cover" />}
        </div>
        <div>
          <h1 className="font-display text-4xl font-semibold">{data.name}</h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-[color:var(--color-muted)]">
            <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-[color:var(--color-sun)] text-[color:var(--color-sun)]" />{formatRating(data.avg_rating)}</span>
            <span>{data.experience_years}y experience</span>
            <span className="font-display font-semibold">{formatCurrency(data.price_per_day)}/day</span>
          </div>
        </div>
      </div>
      <p className="mt-6 leading-relaxed">{data.bio}</p>
      <div className="flex flex-wrap gap-2 mt-4">
        {(data.languages || []).map(l => <span key={l} className="chip">{l}</span>)}
        {(data.specialties || []).map(s => <span key={s} className="chip bg-[color:var(--color-sage)]/20">{s}</span>)}
      </div>
      <div className="card p-5 mt-8 max-w-md">
        <div className="font-display text-lg font-semibold mb-3">Request this guide</div>
        <form onSubmit={book} className="space-y-3">
          <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full border border-[color:var(--color-line)] rounded-lg px-3 py-2 bg-white text-sm" />
          <button className="btn-primary w-full text-sm">Request guide</button>
          {msg && <div className="text-sm">{msg}</div>}
        </form>
      </div>
      <section className="mt-10">
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
      </section>
    </div>
  );
}
