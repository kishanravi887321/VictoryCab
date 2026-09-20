import { useState, useEffect, useRef } from 'react';
import api from '../lib/api';
import { Spinner } from '../components/Loader';
import { Send, Trash2, Plus } from 'lucide-react';

export default function AIChat() {
  const [convos, setConvos] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const msgEnd = useRef(null);

  const loadConvos = async () => setConvos(await api.get('/api/v1/ai/chat'));

  useEffect(() => { loadConvos(); }, []);
  useEffect(() => {
    if (activeId) api.get(`/api/v1/ai/chat?conversation_id=${activeId}`).then(c => setMessages(c.messages || []));
    else setMessages([]);
  }, [activeId]);
  useEffect(() => { msgEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim() || sending) return;
    const msg = input;
    setInput('');
    setMessages(m => [...m, { role: 'user', content: msg }]);
    setSending(true);
    try {
      const r = await api.post('/api/v1/ai/chat', { message: msg, conversation_id: activeId });
      if (!activeId) setActiveId(r.conversation_id);
      setMessages(m => [...m, { role: 'assistant', content: r.answer, sources: r.sources }]);
      loadConvos();
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', content: `Error: ${e.message}` }]);
    } finally { setSending(false); }
  };

  const deleteConvo = async (id) => {
    if (!confirm('Delete this conversation?')) return;
    await api.del('/api/v1/ai/chat', { id });
    if (activeId === id) { setActiveId(null); setMessages([]); }
    loadConvos();
  };

  const suggestions = ['Tell me about Kerala backwaters', 'What can I do in Rishikesh?', 'Best hotels in Udaipur', 'Adventure activities in Ladakh', 'Where should I eat in Varanasi?'];

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
      <h1 className="font-display text-4xl font-semibold mb-6">Grounded Chatbot</h1>
      <div className="grid lg:grid-cols-[250px_1fr] gap-4" style={{ minHeight: '60vh' }}>
        <div className="card p-3 space-y-1 h-fit">
          <button onClick={() => { setActiveId(null); setMessages([]); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-[color:var(--color-terra)] text-white"><Plus className="w-4 h-4" /> New chat</button>
          {convos.map(c => (
            <div key={c.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer ${activeId === c.id ? 'bg-[color:var(--color-cream-2)]' : 'hover:bg-[color:var(--color-cream-2)]'}`}>
              <button onClick={() => setActiveId(c.id)} className="flex-1 text-left truncate">{c.title}</button>
              <button onClick={() => deleteConvo(c.id)} className="text-[color:var(--color-muted)] hover:text-[color:var(--color-terra)]"><Trash2 className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
        <div className="card flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '55vh' }}>
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="text-sm text-[color:var(--color-muted)] mb-4">Ask anything about Indian destinations. All answers cite verified DB entries.</div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestions.map(s => <button key={s} onClick={() => { setInput(s); }} className="chip hover:border-[color:var(--color-ink)]">{s}</button>)}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${m.role === 'user' ? 'bg-[color:var(--color-ink)] text-[color:var(--color-cream)]' : 'bg-[color:var(--color-cream-2)]'}`}>
                  <div className="whitespace-pre-wrap">{m.content}</div>
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-[color:var(--color-line)] text-xs text-[color:var(--color-muted)]">
                      Sources: {m.sources.map(s => s.name).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {sending && <div className="flex justify-start"><div className="bg-[color:var(--color-cream-2)] rounded-2xl px-4 py-3"><Spinner /></div></div>}
            <div ref={msgEnd} />
          </div>
          <div className="border-t border-[color:var(--color-line)] p-3 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask about destinations, hotels, activities…" className="flex-1 border border-[color:var(--color-line)] rounded-full px-4 py-2 bg-white text-sm outline-none" />
            <button onClick={send} disabled={sending} className="btn-primary flex items-center gap-1"><Send className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
