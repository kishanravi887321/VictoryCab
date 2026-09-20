import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';
import { Spinner } from '../../components/Loader';

export default function BusinessRegister() {
  const { refresh } = useAuth();
  const navigate = useNavigate();
  const [type, setType] = useState('hotel');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/api/v1/businesses', { business_type: type, name, description: desc, address, phone, website });
      await refresh();
      setMsg('✓ Submitted! Admin verification usually takes < 24h.');
      setTimeout(() => navigate('/business'), 1500);
    } catch (e) { setMsg(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold mb-2">Register a business</h2>
      <p className="text-sm text-[color:var(--color-muted)] mb-6">Once verified by an admin, you can start receiving bookings and appear in AI recommendations.</p>
      <form onSubmit={submit} className="card p-6 space-y-4 max-w-xl">
        <div>
          <label className="text-xs uppercase tracking-widest text-[color:var(--color-muted)]">Type</label>
          <select value={type} onChange={e => setType(e.target.value)} className="w-full mt-1 border border-[color:var(--color-line)] rounded-lg px-3 py-2 bg-white">
            <option value="hotel">Hotel / Homestay</option>
            <option value="restaurant">Restaurant / Cafe</option>
            <option value="agency">Travel Agency</option>
            <option value="guide">Tour Guide</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-[color:var(--color-muted)]">Business name</label>
          <input required value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 border border-[color:var(--color-line)] rounded-lg px-3 py-2 bg-white" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-[color:var(--color-muted)]">Description</label>
          <textarea required value={desc} onChange={e => setDesc(e.target.value)} rows={3} className="w-full mt-1 border border-[color:var(--color-line)] rounded-lg px-3 py-2 bg-white" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs uppercase tracking-widest text-[color:var(--color-muted)]">Address</label>
            <input value={address} onChange={e => setAddress(e.target.value)} className="w-full mt-1 border border-[color:var(--color-line)] rounded-lg px-3 py-2 bg-white" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-[color:var(--color-muted)]">Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full mt-1 border border-[color:var(--color-line)] rounded-lg px-3 py-2 bg-white" />
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-[color:var(--color-muted)]">Website</label>
          <input value={website} onChange={e => setWebsite(e.target.value)} className="w-full mt-1 border border-[color:var(--color-line)] rounded-lg px-3 py-2 bg-white" />
        </div>
        <div className="flex items-center gap-3">
          <button disabled={saving} className="btn-primary text-sm flex items-center gap-2">{saving && <Spinner />} Submit for verification</button>
          {msg && <div className="text-sm">{msg}</div>}
        </div>
      </form>
    </div>
  );
}
