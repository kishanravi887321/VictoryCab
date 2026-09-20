import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { Spinner } from '../../components/Loader';

const INTERESTS = ['heritage', 'beach', 'nature', 'adventure', 'spiritual', 'food', 'romantic', 'trekking', 'offbeat', 'photography', 'culture', 'wellness', 'wildlife'];

export default function Settings() {
  const { profile, refresh } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [interests, setInterests] = useState([]);
  const [travelType, setTravelType] = useState('leisure');
  const [budget, setBudget] = useState('mid');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || '');
      setPhone(profile.phone || '');
      setInterests(profile.preferences?.interests || []);
      setTravelType(profile.preferences?.travel_type || 'leisure');
      setBudget(profile.preferences?.budget || 'mid');
    }
  }, [profile]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      await api.put('/api/v1/profile', { full_name: name, phone, preferences: { interests, travel_type: travelType, budget } });
      setMsg('Saved.');
      refresh();
    } catch (e) { setMsg(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold mb-4">Profile settings</h2>
      <form onSubmit={save} className="card p-6 space-y-4 max-w-xl">
        <div>
          <label className="text-xs uppercase tracking-widest text-[color:var(--color-muted)]">Full name</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 border border-[color:var(--color-line)] rounded-lg px-3 py-2 bg-white" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-[color:var(--color-muted)]">Phone</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full mt-1 border border-[color:var(--color-line)] rounded-lg px-3 py-2 bg-white" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-[color:var(--color-muted)] mb-2 block">Interests</label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(i => <button type="button" key={i} onClick={() => setInterests(interests.includes(i) ? interests.filter(x => x !== i) : [...interests, i])} className={`chip ${interests.includes(i) ? 'bg-[color:var(--color-terra)] text-white border-[color:var(--color-terra)]' : ''}`}>#{i}</button>)}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button disabled={saving} className="btn-primary text-sm flex items-center gap-2">{saving && <Spinner />} Save</button>
          {msg && <div className="text-sm">{msg}</div>}
        </div>
      </form>
    </div>
  );
}
