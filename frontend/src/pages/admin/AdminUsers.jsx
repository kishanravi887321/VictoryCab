import { useState, useEffect } from 'react';
import api from '../../lib/api';
import Loader from '../../components/Loader';

const ROLES = ['TOURIST', 'BUSINESS_OWNER', 'TOUR_GUIDE', 'TRAVEL_AGENT', 'ADMIN', 'SUPER_ADMIN'];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const load = () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (roleFilter) p.set('role', roleFilter);
    api.get(`/api/v1/admin/users?${p.toString()}`).then(r => setUsers(r.data || [])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [q, roleFilter]);

  const changeRole = async (id, role) => { await api.put('/api/v1/admin/users', { id, role }); load(); };
  const toggleBlock = async (id, blocked) => { await api.put('/api/v1/admin/users', { id, blocked }); load(); };

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold mb-4">Users</h2>
      <div className="flex gap-3 mb-4">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search…" className="border border-[color:var(--color-line)] rounded-full px-4 py-2 bg-white text-sm flex-1" />
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="border border-[color:var(--color-line)] rounded-full px-3 py-2 bg-white text-sm">
          <option value="">All roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      {loading ? <Loader /> : (
        <div className="space-y-2">
          {users.map(u => (
            <div key={u.id} className="card p-4 flex items-center gap-3">
              <div className="flex-1">
                <div className="font-medium text-sm">{u.full_name}</div>
                <div className="text-xs text-[color:var(--color-muted)]">{u.email}</div>
              </div>
              <select value={u.role} onChange={e => changeRole(u.id, e.target.value)} className="border border-[color:var(--color-line)] rounded-lg px-2 py-1 text-xs">
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <button onClick={() => toggleBlock(u.id, !u.blocked)} className={`text-xs ${u.blocked ? 'text-[color:var(--color-sage)]' : 'text-[color:var(--color-terra)]'}`}>{u.blocked ? 'Unblock' : 'Block'}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
