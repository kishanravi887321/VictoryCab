import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { formatCurrency, formatRating } from '../lib/utils';

export function DestinationCard({ d }) {
  return (
    <Link to={`/destinations/${d.id}`} className="group block card overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[4/3] bg-[color:var(--color-cream-2)] overflow-hidden relative">
        {d.hero_image && <img src={d.hero_image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
        <div className="absolute top-3 left-3 chip bg-white/90">{d.region}</div>
      </div>
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-xl font-semibold leading-tight">{d.name}</h3>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-3.5 h-3.5 fill-[color:var(--color-sun)] text-[color:var(--color-sun)]" />{formatRating(d.avg_rating)}
          </div>
        </div>
        <p className="text-sm text-[color:var(--color-muted)] mt-1 line-clamp-2">{d.tagline}</p>
      </div>
    </Link>
  );
}

export function HotelCard({ h }) {
  return (
    <Link to={`/hotels/${h.id}`} className="group block card overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[4/3] bg-[color:var(--color-cream-2)] overflow-hidden relative">
        {h.image_url && <img src={h.image_url} alt={h.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
        <div className="absolute top-3 right-3 chip bg-white/90">{h.rating_stars}★</div>
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold leading-tight line-clamp-1">{h.name}</h3>
        <div className="flex items-center gap-1 text-xs text-[color:var(--color-muted)] mt-1">
          <MapPin className="w-3 h-3" />{h.address || 'India'}
        </div>
        <div className="flex items-end justify-between mt-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--color-muted)]">from</div>
            <div className="font-display text-lg font-semibold">{formatCurrency(h.price_per_night)}<span className="text-xs font-normal text-[color:var(--color-muted)]">/night</span></div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-3.5 h-3.5 fill-[color:var(--color-sun)] text-[color:var(--color-sun)]" />{formatRating(h.avg_rating)} <span className="text-[color:var(--color-muted)]">({h.review_count})</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ActivityCard({ a }) {
  return (
    <Link to={`/experiences/${a.id}`} className="group block card overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[4/3] bg-[color:var(--color-cream-2)] overflow-hidden relative">
        {a.image_url && <img src={a.image_url} alt={a.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
        <div className="absolute top-3 left-3 chip bg-white/90">{a.category}</div>
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold leading-tight line-clamp-2">{a.name}</h3>
        <div className="flex items-center gap-2 mt-2 text-xs text-[color:var(--color-muted)]">
          <span className="chip">{a.difficulty}</span>
          <span>~{a.duration_hours}h</span>
        </div>
        <div className="flex items-end justify-between mt-3">
          <div className="font-display text-lg font-semibold">{formatCurrency(a.price)}</div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-3.5 h-3.5 fill-[color:var(--color-sun)] text-[color:var(--color-sun)]" />{formatRating(a.avg_rating)}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function GuideCard({ g }) {
  return (
    <Link to={`/guides/${g.id}`} className="group block card overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4 flex items-start gap-3">
        <div className="w-16 h-16 rounded-full bg-[color:var(--color-cream-2)] overflow-hidden shrink-0">
          {g.image_url && <img src={g.image_url} alt={g.name} className="w-full h-full object-cover" />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-semibold leading-tight">{g.name}</h3>
          <p className="text-xs text-[color:var(--color-muted)] line-clamp-2 mt-1">{g.bio}</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-3.5 h-3.5 fill-[color:var(--color-sun)] text-[color:var(--color-sun)]" />{formatRating(g.avg_rating)}
            </div>
            <span className="text-[color:var(--color-muted)] text-xs">• {g.experience_years}y exp</span>
            <span className="ml-auto font-display font-semibold text-sm">{formatCurrency(g.price_per_day)}/day</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
