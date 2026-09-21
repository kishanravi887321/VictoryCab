import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, MapPin } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { formatRating, formatCurrency, timeAgo } from '../lib/utils';
import Loader, { Spinner } from '../components/Loader';

export default function HotelDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fav, setFav] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookMsg, setBookMsg] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    api.get(`/api/v1/hotels?id=${id}`).then(setData).finally(() => setLoading(false));
    if (user) api.get('/api/v1/favorites').then(r => setFav((r.data || []).some(x => x.target_type === 'hotels' && x.target_id === Number(id))));
  }, [id, user]);

  const toggleFav = async () => {
    if (!user) return;
    await api.post('/api/v1/favorites', { target_type: 'hotels', target_id: Number(id) });
    setFav(true);
  };

  const book = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    try {
      await api.post('/api/v1/bookings', { target_type: 'hotels', target_id: Number(id), check_in: checkIn, check_out: checkOut, guests });
      setBookMsg('✓ Booking request sent! Check your dashboard.');
    } catch (e) { setBookMsg(e.message); }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    await api.post('/api/v1/reviews', { target_type: 'hotels', target_id: Number(id), rating: reviewRating, comment: reviewComment });
    setReviewComment('');
    const fresh = await api.get(`/api/v1/hotels?id=${id}`);
    setData(fresh);
  };

  if (loading || !data) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl font-semibold">{data.name}</h1>
        {user && <button onClick={toggleFav}><Heart className={`w-6 h-6 ${fav ? 'fill-[color:var(--color-terra)] text-[color:var(--color-terra)]' : ''}`} /></button>}
      </div>
      <div className="flex items-center gap-3 mt-2 text-sm text-[color:var(--color-muted)]">
        <span className="chip">{data.rating_stars}★</span>
        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{data.address}</span>
        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-[color:var(--color-sun)] text-[color:var(--color-sun)]" />{formatRating(data.avg_rating)} ({data.review_count})</span>
      </div>
      <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-[color:var(--color-cream-2)] mt-6">
        {data.image_url && <img src={data.image_url} alt={data.name} className="w-full h-full object-cover" />}
      </div>
      <div className="grid lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <p className="leading-relaxed">{data.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">{(data.amenities || []).map(a => <span key={a} className="chip">{a}</span>)}</div>
          <div className="font-display text-3xl font-semibold mt-6">{formatCurrency(data.price_per_night)}<span className="text-base font-normal text-[color:var(--color-muted)]">/night</span></div>
        </div>
        <div className="card p-5">
          <div className="font-display text-lg font-semibold mb-3">Book this stay</div>
          <form onSubmit={book} className="space-y-3">
            <input type="date" required value={checkIn} onChange={e => setCheckIn(e.target.value)} className="w-full border border-[color:var(--color-line)] rounded-lg px-3 py-2 bg-white text-sm" />
            <input type="date" required value={checkOut} onChange={e => setCheckOut(e.target.value)} className="w-full border border-[color:var(--color-line)] rounded-lg px-3 py-2 bg-white text-sm" />
            <input type="number" min={1} value={guests} onChange={e => setGuests(+e.target.value)} className="w-full border border-[color:var(--color-line)] rounded-lg px-3 py-2 bg-white text-sm" />
            <button className="btn-primary w-full text-sm">Request booking</button>
            {bookMsg && <div className="text-sm">{bookMsg}</div>}
          </form>
        </div>
      </div>
      <section className="mt-10">
        <h2 className="font-display text-2xl font-semibold mb-4">Reviews</h2>
        {user && (
          <form onSubmit={submitReview} className="card p-4 mb-4 flex gap-3 items-end">
            <select value={reviewRating} onChange={e => setReviewRating(+e.target.value)} className="border border-[color:var(--color-line)] rounded-lg px-2 py-1 text-sm">
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}★</option>)}
            </select>
            <input value={reviewComment} onChange={e => setReviewComment(e.target.value)} placeholder="Write a review…" className="flex-1 border border-[color:var(--color-line)] rounded-lg px-3 py-2 text-sm bg-white" />
            <button className="btn-primary text-sm">Post</button>
          </form>
        )}
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

