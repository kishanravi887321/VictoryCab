import { Link } from 'react-router-dom';
import { Sparkles, Target, Map, MessageCircle, ArrowRight } from 'lucide-react';

export default function AIStudio() {
  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-16">
      <div className="text-center mb-14">
        <span className="chip mb-4"><Sparkles className="w-3 h-3 text-[color:var(--color-terra)]" /> AI Studio</span>
        <h1 className="font-display text-5xl lg:text-6xl font-semibold leading-tight">Grounded intelligence for your trip.</h1>
        <p className="text-lg text-[color:var(--color-muted)] mt-4 max-w-2xl mx-auto">Every score, price, itinerary, and answer here comes from Tourism360's verified database — never hallucinated by a model.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Card to="/ai/recommend" icon={Target} title="Smart Recommendations" body="Answer a short survey — get destinations ranked by real interest overlap, budget fit, activity availability, community rating, and season." color="var(--color-terra)" />
        <Card to="/ai/plan" icon={Map} title="AI Trip Planner" body="Compose day-wise itineraries using real hotels, attractions, restaurants, and activities. Route-optimised with Haversine + nearest-neighbor." color="var(--color-sage)" />
        <Card to="/ai/chat" icon={MessageCircle} title="Grounded Chatbot" body="Ask anything about our destinations. The assistant only cites verified DB entries — every fact is a real row, with sources." color="var(--color-sky)" />
      </div>
      <div className="mt-16 card p-8">
        <div className="font-display text-2xl font-semibold mb-3">How it stays grounded</div>
        <ol className="space-y-3 text-sm">
          <li><b>1. Start with a feeling.</b> Explore curated places, prices, opening hours, and ratings in one calm workspace.</li>
          <li><b>2. Rank with real math.</b> Scores are computed from Jaccard interest similarity, budget-vs-price fit, rating normalization, and season overlap.</li>
          <li><b>3. Compose only from retrieved data.</b> The itinerary can only reference stops that exist in the DB. Route ordering uses Haversine distance and greedy 2-opt.</li>
          <li><b>4. Cite sources.</b> Chat answers explicitly link to the DB rows they used, so you can verify every claim.</li>
        </ol>
      </div>
    </div>
  );
}

function Card({ to, icon: Icon, title, body, color }) {
  return (
    <Link to={to} className="group card p-6 hover:shadow-xl transition-shadow relative overflow-hidden">
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity" style={{ background: color }} />
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white mb-4" style={{ background: color }}><Icon className="w-5 h-5" /></div>
      <div className="font-display text-xl font-semibold">{title}</div>
      <div className="text-sm text-[color:var(--color-muted)] mt-2 mb-6">{body}</div>
      <div className="flex items-center gap-1 text-sm font-medium">Open <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></div>
    </Link>
  );
}
