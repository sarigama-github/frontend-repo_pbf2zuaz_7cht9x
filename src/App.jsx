import { useEffect, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { Menu, Calendar, Mail, PenSquare, Shield, Clock, ArrowRight, Check, FileText } from 'lucide-react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Hero() {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/2fSS9b44gtYBt4RI/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent pointer-events-none" />
      <div className="relative z-10 h-full container mx-auto px-6 md:px-10 flex items-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
            <Shield className="h-4 w-4 text-blue-400" />
            <span className="text-xs tracking-wider uppercase text-blue-300">Board-Certified Specialist</span>
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-semibold leading-tight">
            Precision Care for a Healthier Tomorrow
          </h1>
          <p className="mt-4 text-white/80 md:text-lg">
            A futuristic portfolio for a modern physician. Explore expertise, read insights, and book your appointment instantly.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#book" className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-lg transition-colors">
              Book Appointment <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a href="#blog" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-3 rounded-lg">
              Read Blog <FileText className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2"><Check className="h-4 w-4 text-blue-400" /> Evidence-based care</div>
            <div className="flex items-center gap-2"><Check className="h-4 w-4 text-blue-400" /> Patient-first approach</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Booking() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', time: '', note: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [slots, setSlots] = useState(["09:00", "10:00", "11:00", "14:00", "15:00"]) // default

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`).then(r => r.json()).then(d => {
      if (d?.settings?.available_slots?.length) setSlots(d.settings.available_slots)
    }).catch(() => {})
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/appointments`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.ok) {
        setMessage('Appointment request sent! We will confirm by email shortly.')
        setForm({ name: '', email: '', phone: '', date: '', time: '', note: '' })
      } else {
        setMessage('Could not book. Please try again.')
      }
    } catch (err) {
      setMessage('Network error.')
    } finally { setLoading(false) }
  }

  return (
    <section id="book" className="relative bg-[#0b0f14] text-white py-20">
      <div className="container mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold">Book an Appointment</h2>
            <p className="mt-3 text-white/70">Select a date and available time slot. You’ll receive a confirmation email.</p>
            <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
              <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required placeholder="Full name" className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
                <input required type="email" placeholder="Email" className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
                <input placeholder="Phone" className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
                <input required type="date" className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} />
                <select required className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500" value={form.time} onChange={e=>setForm({...form, time:e.target.value})}>
                  <option value="">Select time</option>
                  {slots.map(s=> <option key={s} value={s}>{s}</option>)}
                </select>
                <input placeholder="Short note" className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500 md:col-span-2" value={form.note} onChange={e=>setForm({...form, note:e.target.value})} />
                <button disabled={loading} className="md:col-span-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 rounded-lg px-5 py-3 inline-flex items-center gap-2 justify-center">
                  <Calendar className="h-4 w-4" /> {loading? 'Booking...' : 'Confirm Booking'}
                </button>
              </form>
              {message && <p className="mt-4 text-sm text-blue-300">{message}</p>}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 p-6 rounded-xl border border-white/10">
              <h3 className="text-xl font-semibold mb-2">What to expect</h3>
              <ul className="text-white/70 space-y-2">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-blue-400"/> Comprehensive evaluation</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-blue-400"/> Personalized treatment plan</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-blue-400"/> Seamless follow-up care</li>
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><Clock className="h-4 w-4 text-blue-400"/> Availability</h3>
              <p className="text-white/70">Weekdays 9:00–12:00, 2:00–5:00. Emergency slots on request.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Blog() {
  const [posts, setPosts] = useState([])
  useEffect(()=>{
    fetch(`${API_BASE}/api/blogs?published=true`).then(r=>r.json()).then(d=>{
      setPosts(d.items || [])
    }).catch(()=>{})
  },[])
  return (
    <section id="blog" className="bg-[#05070b] text-white py-20">
      <div className="container mx-auto px-6 md:px-10">
        <h2 className="text-3xl md:text-4xl font-semibold">Insights & Articles</h2>
        <p className="mt-2 text-white/70">Fresh perspectives on healthcare, research, and wellbeing.</p>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {posts.map(p => (
            <article key={p._id} className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/50 transition-colors">
              {p.cover_image && <img src={p.cover_image} className="h-40 w-full object-cover" alt=""/>}
              <div className="p-5">
                <h3 className="font-semibold text-lg group-hover:text-blue-300 transition-colors">{p.title}</h3>
                <p className="mt-2 text-sm text-white/70 line-clamp-3">{p.content}</p>
                <div className="mt-4 text-xs text-white/50">{(p.tags||[]).join(' • ')}</div>
              </div>
            </article>
          ))}
          {!posts.length && (
            <div className="md:col-span-3 text-white/60">No articles published yet.</div>
          )}
        </div>
      </div>
    </section>
  )
}

function Admin() {
  const [tab, setTab] = useState('settings')
  const [auth, setAuth] = useState('')
  const [allowed, setAllowed] = useState(false)
  const [settings, setSettings] = useState({ notification_email: '', available_slots: [] })
  const [appointments, setAppointments] = useState([])
  const [post, setPost] = useState({ title: '', content: '', cover_image: '', tags: '', published: false })
  const secret = (import.meta.env.VITE_ADMIN_KEY || 'letmein')

  const load = async () => {
    const s = await fetch(`${API_BASE}/api/settings`).then(r=>r.json())
    setSettings(s.settings)
    const a = await fetch(`${API_BASE}/api/appointments`).then(r=>r.json())
    setAppointments(a.items || [])
  }

  const saveSettings = async () => {
    const payload = { ...settings, available_slots: (settings.available_slots||[]).filter(Boolean) }
    await fetch(`${API_BASE}/api/settings`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    await load()
  }

  const publish = async () => {
    const payload = { ...post, tags: post.tags ? post.tags.split(',').map(t=>t.trim()).filter(Boolean) : [] }
    const res = await fetch(`${API_BASE}/api/blogs`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    if (res.ok) setPost({ title:'', content:'', cover_image:'', tags:'', published:false })
  }

  if (!allowed) {
    return (
      <section id="admin" className="bg-[#05070b] text-white py-20">
        <div className="container mx-auto px-6 md:px-10 max-w-xl">
          <h2 className="text-3xl font-semibold flex items-center gap-3"><Shield className="h-6 w-6 text-blue-400"/> Admin Access</h2>
          <p className="mt-2 text-white/70">Restricted to the doctor and developer. Enter the access key.</p>
          <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-6">
            <input type="password" placeholder="Access key" value={auth} onChange={e=>setAuth(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 outline-none" />
            <button onClick={()=> setAllowed(auth === secret)} className="mt-4 w-full bg-blue-600 hover:bg-blue-500 rounded-lg px-4 py-3">Enter</button>
            <p className="mt-2 text-xs text-white/50">Tip: configure VITE_ADMIN_KEY in environment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="admin" className="bg-[#05070b] text-white py-20">
      <div className="container mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold flex items-center gap-3"><Shield className="h-6 w-6 text-blue-400"/> Admin Console</h2>
          <div className="flex gap-2">
            {['settings','slots','posts'].map(t => (
              <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-lg border ${tab===t? 'border-blue-500 bg-blue-500/20' : 'border-white/10 bg-white/5'}`}>{t.toUpperCase()}</button>
            ))}
          </div>
        </div>

        {tab==='settings' && (
          <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6 max-w-2xl">
            <label className="text-sm text-white/70">Notification email</label>
            <input value={settings.notification_email||''} onChange={e=>setSettings({...settings, notification_email:e.target.value})} className="mt-2 w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 outline-none" />
            <button onClick={saveSettings} className="mt-4 bg-blue-600 hover:bg-blue-500 rounded-lg px-4 py-3">Save</button>
          </div>
        )}

        {tab==='slots' && (
          <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6 max-w-3xl">
            <label className="text-sm text-white/70">Available slots (comma separated like 09:00, 10:30, 11:00)</label>
            <input value={(settings.available_slots||[]).join(', ')} onChange={e=>setSettings({...settings, available_slots:e.target.value.split(',').map(s=>s.trim())})} className="mt-2 w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 outline-none" />
            <button onClick={saveSettings} className="mt-4 bg-blue-600 hover:bg-blue-500 rounded-lg px-4 py-3">Save Slots</button>
            <div className="mt-8">
              <h3 className="font-semibold mb-3">Booked Appointments</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-white/60">
                    <tr>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(a => (
                      <tr key={a._id} className="border-t border-white/10">
                        <td className="p-2">{a.name}</td>
                        <td className="p-2">{a.email}</td>
                        <td className="p-2">{a.date}</td>
                        <td className="p-2">{a.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab==='posts' && (
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><PenSquare className="h-4 w-4"/> New Post</h3>
              <input placeholder="Title" value={post.title} onChange={e=>setPost({...post, title:e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 outline-none mb-3" />
              <textarea placeholder="Content" rows={6} value={post.content} onChange={e=>setPost({...post, content:e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 outline-none mb-3" />
              <input placeholder="Cover image URL" value={post.cover_image} onChange={e=>setPost({...post, cover_image:e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 outline-none mb-3" />
              <input placeholder="Tags (comma separated)" value={post.tags} onChange={e=>setPost({...post, tags:e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 outline-none mb-3" />
              <label className="flex items-center gap-2 text-sm text-white/80 mb-3">
                <input type="checkbox" checked={post.published} onChange={e=>setPost({...post, published:e.target.checked})} /> Publish now
              </label>
              <button onClick={publish} className="bg-blue-600 hover:bg-blue-500 rounded-lg px-4 py-3">Publish</button>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold mb-3">Live Preview</h3>
              <h4 className="text-xl font-semibold">{post.title || 'Post title'}</h4>
              <p className="mt-2 text-white/70 whitespace-pre-wrap">{post.content || 'Start writing...'}</p>
              {post.tags && <div className="mt-4 text-xs text-white/50">{post.tags}</div>}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-black text-white/70 py-10">
      <div className="container mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Doctor Portfolio. All rights reserved.</p>
        <div className="flex gap-6 text-white/60">
          <a href="#book" className="hover:text-white">Appointments</a>
          <a href="#blog" className="hover:text-white">Blog</a>
          <a href="#admin" className="hover:text-white">Admin</a>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur border-b border-white/10">
        <div className="container mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600" />
            <span className="font-semibold">Dr. Portfolio</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-white/80">
            <a href="#book" className="hover:text-white">Appointments</a>
            <a href="#blog" className="hover:text-white">Blog</a>
            <a href="#admin" className="hover:text-white">Admin</a>
          </nav>
          <button className="md:hidden p-2"><Menu className="h-6 w-6" /></button>
        </div>
      </header>

      <main className="pt-16">
        <Hero />
        <Booking />
        <Blog />
        <Admin />
      </main>

      <Footer />
    </div>
  )
}
