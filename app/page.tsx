'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [idea, setIdea] = useState('')
  const [botPassword, setBotPassword] = useState('')
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ repos: 0, latest: '—', daysBuilding: 0 })

  const getDaysBuilding = () => {
    const start = new Date('2026-01-01')
    const today = new Date()
    return Math.max(1, Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
  }

  useEffect(() => {
    const days = getDaysBuilding()
    setStats((s) => ({ ...s, daysBuilding: days }))

    fetch('https://api.github.com/users/maccstaxx')
      .then((r) => r.json())
      .then((user) => {
        setStats((s) => ({ ...s, repos: user.public_repos || 0, daysBuilding: days }))
      })
      .catch(() => setStats((s) => ({ ...s, daysBuilding: days })))

    fetch('https://api.github.com/users/maccstaxx/repos?sort=updated&per_page=1')
      .then((r) => r.json())
      .then((repos) => {
        if (repos?.[0]) setStats((s) => ({ ...s, latest: repos[0].name.slice(0, 12), daysBuilding: days }))
      })
      .catch(() => setStats((s) => ({ ...s, daysBuilding: days })))
  }, [])

  const askAI = async () => {
    if (!idea.trim()) return
    if (!botPassword.trim()) {
      setReply('Enter the bot password first.')
      return
    }

    setLoading(true)
    setReply('')

    try {
      const res = await fetch('/api/build-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: idea, password: botPassword }),
      })

      const data = await res.json()
      setReply(data.reply || data.error || 'No response returned.')
    } catch (error) {
      setReply('Could not connect to the AI endpoint.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white font-mono">
      <style>{`
        html, body { background: #080808; }
        @keyframes tick { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>

      <nav className="flex justify-center gap-8 border-b border-[#151515] px-6 py-5 text-[11px] tracking-[0.18em] text-zinc-500">
        <a href="#about">ABOUT</a>
        <a href="#projects">PROJECTS</a>
        <a href="#resume">RESUME</a>
        <a href="#contact">CONTACT</a>
      </nav>

      <section className="overflow-hidden border-b border-[#151515] py-3 whitespace-nowrap">
        <div className="inline-block animate-[tick_24s_linear_infinite]">
          {Array.from({ length: 4 }).flatMap(() => ['MACBUILDS.AI', 'EST. 2026', 'LEARNING OUT LOUD', 'POWERED BY AI', 'ALWAYS LEARNING', 'WORK WITH ME']).map((item, i) => (
            <span key={`${item}-${i}`} className="mr-12 text-[10px] tracking-[0.18em] text-zinc-800">{item}</span>
          ))}
        </div>
      </section>

      <section className="border-b border-[#151515] px-6 py-20 md:px-12 md:py-32">
        <p className="mb-4 text-[10px] tracking-[0.18em] text-zinc-600">WELCOME TO</p>
        <h1 className="mb-6 text-5xl font-bold tracking-[-0.06em] md:text-7xl">macbuilds</h1>
        <p className="mb-8 max-w-2xl text-sm leading-7 text-zinc-500">
          I’m learning out loud and building AI-powered tools, agents, and product experiments.
        </p>
        <div className="flex flex-wrap gap-4">
          <a href="#projects" className="rounded bg-white px-6 py-3 text-[11px] font-bold tracking-[0.12em] text-black">VIEW PROJECTS</a>
          <a href="#about" className="px-2 py-3 text-[11px] tracking-[0.12em] text-zinc-500">LEARN MORE →</a>
        </div>
      </section>

      <section className="grid border-b border-[#151515] md:grid-cols-3">
        {[
          { label: 'PROJECTS', value: stats.repos },
          { label: 'LATEST BUILD', value: stats.latest },
          { label: 'DAYS BUILDING', value: stats.daysBuilding },
        ].map((stat, i) => (
          <div key={stat.label} className={`flex items-center justify-between border-[#151515] px-6 py-5 md:block md:px-12 md:py-10 md:text-center ${i < 2 ? 'md:border-r' : ''}`}>
            <div className="text-2xl font-bold md:mb-2 md:text-4xl">{stat.value}</div>
            <div className="text-[10px] tracking-[0.18em] text-zinc-600">{stat.label}</div>
          </div>
        ))}
      </section>

      <section id="projects" className="border-b border-[#151515] px-6 py-16 md:px-12 md:py-24">
        <p className="mb-10 text-[10px] tracking-[0.18em] text-zinc-600">PROJECTS</p>

        <div className="rounded-md border border-[#222] bg-white/[0.02] p-6 md:p-10">
          <p className="mb-4 text-[10px] tracking-[0.18em] text-zinc-600">BUILD WITH MAC</p>
          <h2 className="mb-4 text-2xl font-bold leading-tight tracking-[-0.05em] md:text-3xl">PROJECT 001 — AI BUILD BLUEPRINT</h2>
          <p className="mb-6 max-w-2xl text-sm leading-7 text-zinc-500">Describe an idea. I’ll turn it into a product plan.</p>

          <input
            value={botPassword}
            onChange={(e) => setBotPassword(e.target.value)}
            type="password"
            placeholder="Enter bot password"
            className="mb-4 w-full rounded border border-[#222] bg-[#050505] p-4 text-sm text-white outline-none placeholder:text-zinc-700"
          />

          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Example: I want to build an AI assistant for real estate agents."
            className="mb-4 min-h-[140px] w-full resize-y rounded border border-[#222] bg-[#050505] p-4 text-sm text-white outline-none placeholder:text-zinc-700"
          />

          <button
            onClick={askAI}
            disabled={loading}
            className="rounded bg-white px-5 py-3 text-[11px] font-bold tracking-[0.12em] text-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'BUILDING...' : 'GENERATE BLUEPRINT'}
          </button>

          {reply && (
            <div className="mt-8 whitespace-pre-wrap rounded border border-[#1f1f1f] bg-[#0b0b0b] p-6 text-sm leading-7 text-zinc-300">
              {reply}
            </div>
          )}
        </div>
      </section>

      <section id="about" className="border-b border-[#151515] px-6 py-16 md:px-12 md:py-24">
        <p className="mb-10 text-[10px] tracking-[0.18em] text-zinc-600">ABOUT</p>
        <div className="rounded border border-dashed border-[#222] p-10 text-center text-[11px] tracking-[0.12em] text-zinc-700">BIO COMING SOON</div>
      </section>

      <section id="resume" className="border-b border-[#151515] px-6 py-16 md:px-12 md:py-24">
        <p className="mb-10 text-[10px] tracking-[0.18em] text-zinc-600">RESUME</p>
        <div className="rounded border border-dashed border-[#222] p-10 text-center text-[11px] tracking-[0.12em] text-zinc-700">EXPERIENCE COMING SOON</div>
      </section>

      <footer id="contact" className="px-6 py-12 md:px-12">
        <div className="grid gap-8 md:grid-cols-3 md:text-center">
          <FooterColumn title="CONTACT" links={[{ label: 'Reach out', href: '#contact' }]} />
          <FooterColumn title="NAVIGATE" links={[{ label: 'Home', href: '#' }, { label: 'About', href: '#about' }, { label: 'Projects', href: '#projects' }, { label: 'Resume', href: '#resume' }]} />
          <FooterColumn title="FIND ME" links={[{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/maccal/' }, { label: 'GitHub', href: 'https://github.com/maccstaxx' }]} />
        </div>
        <div className="mt-10 border-t border-[#151515] pt-6 text-center text-[11px] text-zinc-800">© 2026 macbuilds</div>
      </footer>
    </main>
  )
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="mb-4 text-[10px] tracking-[0.18em] text-zinc-600">{title}</p>
      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <a key={link.href} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined} className="text-sm text-zinc-500 no-underline">
            {link.label}
          </a>
        ))}
      </div>
    </div>
  )
}
