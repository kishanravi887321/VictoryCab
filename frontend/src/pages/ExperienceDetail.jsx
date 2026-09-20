import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { formatRating, formatCurrency, timeAgo } from '../lib/utils';
import Loader from '../components/Loader';

export default function ExperienceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookMsg, setBookMsg] = useState('');
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState('');

  useEffect(() => { api.get(`/api/v1/activities?id=${id}`).then(setData).finally(() => setLoading(false)); }, [id]);

  const book = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    try {
      await api.post('/api/v1/bookings', { target_type: 'activities', target_id: Number(id), check_in: date, guests });
      setBookMsg('✓ Booking request sent!');
    } catch (e) { setBookMsg(e.message); }
  };

  if (loading || !data) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
      <h1 className="font-display text-4xl font-semibold">{data.name}</h1>
      <div className="flex items-center gap-3 mt-2 text-sm text-[color:var(--color-muted)]">
        <span className="chip">{data.category}</span>
        <span className="chip">{data.difficulty}</span>
        <span>~{data.duration_hours}h</span>
        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-[color:var(--color-sun)] text-[color:var(--color-sun)]" />{formatRating(data.avg_rating)}</span>
      </div>
      <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-[color:var(--color-cream-2)] mt-6">
        {data.image_url && <img src={data.image_url} alt={data.name} className="w-full h-full object-cover" />}
      </div>
      <div className="grid lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <p className="leading-relaxed">{data.description}</p>
          <div className="font-display text-3xl font-semibold mt-6">{formatCurrency(data.price)}<span className="text-base font-normal text-[color:var(--color-muted)]">/person</span></div>
        </div>
        <div className="card p-5">
          <div className="font-display text-lg font-semibold mb-3">Book this experience</div>
          <form onSubmit={book} className="space-y-3">
            <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full border border-[color:var(--color-line)] rounded-lg px-3 py-2 bg-white text-sm" />
            <input type="number" min={1} value={guests} onChange={e => setGuests(+e.target.value)} placeholder="Guests" className="w-full border border-[color:var(--color-line)] rounded-lg px-3 py-2 bg-white text-sm" />
            <button className="btn-primary w-full text-sm">Request booking</button>
            {bookMsg && <div className="text-sm">{bookMsg}</div>}
          </form>
        </div>
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
