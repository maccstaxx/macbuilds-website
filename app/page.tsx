'use client'

import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const [idea, setIdea] = useState('')
  const [botPassword, setBotPassword] = useState('')
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ repos: 0, latest: '—', daysBuilding: 0 })
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const heroCanvasRef = useRef<HTMLCanvasElement>(null)
  const projCanvasRef = useRef<HTMLCanvasElement>(null)

  const getDaysBuilding = () => {
    const start = new Date('2026-06-01T00:00:00')
    const today = new Date()
    return Math.max(1, Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
  }

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!cursorDotRef.current) return
      cursorDotRef.current.style.left = `${e.clientX}px`
      cursorDotRef.current.style.top = `${e.clientY}px`
    }

    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight
      if (!progressRef.current || height <= 0) return
      progressRef.current.style.width = `${(window.scrollY / height) * 100}%`
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const canvas = heroCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const section = canvas.parentElement
    if (!section) return

    let width = 0
    let height = 0
    let mx = -9999
    let my = -9999
    let t = 0
    let animId = 0

    const pts: { x: number; y: number; z: number; g: number; strand: number }[] = []
    const pointCount = 500
    const turns = 6
    const radius = 90
    const dnaHeight = 420

    for (let i = 0; i < pointCount; i += 1) {
      const p = i / pointCount
      const angle = p * Math.PI * 2 * turns
      pts.push({ x: Math.cos(angle) * radius, y: (p - 0.5) * dnaHeight, z: Math.sin(angle) * radius, g: 0, strand: 1 })
    }

    for (let i = 0; i < pointCount; i += 1) {
      const p = i / pointCount
      const angle = p * Math.PI * 2 * turns + Math.PI
      pts.push({ x: Math.cos(angle) * radius, y: (p - 0.5) * dnaHeight, z: Math.sin(angle) * radius, g: 0, strand: 2 })
    }

    for (let i = 0; i < turns * 8; i += 1) {
      const p = i / (turns * 8)
      const angle = p * Math.PI * 2 * turns
      const y = (p - 0.5) * dnaHeight

      for (let j = 0; j <= 8; j += 1) {
        const f = j / 8
        pts.push({ x: Math.cos(angle) * radius * (1 - 2 * f), y, z: Math.sin(angle) * radius * (1 - 2 * f), g: 0, strand: 0 })
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const ratio = window.devicePixelRatio || 1
      canvas.width = Math.floor(width * ratio)
      canvas.height = Math.floor(height * ratio)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      mx = e.clientX - rect.left
      my = e.clientY - rect.top
    }

    const onTouch = (e: TouchEvent) => {
      const rect = section.getBoundingClientRect()
      mx = e.touches[0].clientX - rect.left
      my = e.touches[0].clientY - rect.top
    }

    const onLeave = () => {
      mx = -9999
      my = -9999
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      t += 0.005

      const centerX = width > 700 ? width * 0.74 : width * 0.5
      const centerY = height * 0.52

      const projected = pts.map((p) => {
        const x1 = p.x * Math.cos(t) - p.z * Math.sin(t)
        const z1 = p.x * Math.sin(t) + p.z * Math.cos(t)
        const perspective = 420 / (420 + z1 + radius)
        const sx = centerX + x1 * perspective
        const sy = centerY + p.y * perspective
        const size = Math.max(0.5, (p.strand === 0 ? 2.2 : 3) * perspective)
        const distance = mx === -9999 ? 9999 : Math.hypot(sx - mx, sy - my)
        const hover = Math.max(0, 1 - distance / 90)
        p.g = p.g + (hover - p.g) * 0.12
        return { sx, sy, size, glow: p.g, z1, depth: (z1 + radius) / (2 * radius), strand: p.strand }
      })

      projected.sort((a, b) => a.z1 - b.z1)

      projected.forEach((p) => {
        const baseAlpha = p.strand === 0 ? 0.42 : 0.48 + p.depth * 0.42
        ctx.beginPath()
        ctx.shadowBlur = p.glow > 0.05 ? 18 : p.strand === 0 ? 3 : 5
        ctx.shadowColor = p.glow > 0.05 ? 'rgba(35,255,105,0.9)' : 'rgba(35,255,105,0.22)'
        ctx.fillStyle = p.strand === 0
          ? `rgba(70,255,125,${Math.min(1, baseAlpha + p.glow * 0.5)})`
          : `rgba(0,${Math.round(205 + p.glow * 50)},80,${Math.min(1, baseAlpha + p.glow * 0.85)})`
        ctx.arc(p.sx, p.sy, p.size + p.glow * 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      animId = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    section.addEventListener('mousemove', onMove)
    section.addEventListener('touchmove', onTouch)
    section.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      section.removeEventListener('mousemove', onMove)
      section.removeEventListener('touchmove', onTouch)
      section.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  useEffect(() => {
    const canvas = projCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const section = canvas.parentElement
    if (!section) return

    let width = 0
    let height = 0
    let mx = -9999
    let my = -9999
    let animId = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const ratio = window.devicePixelRatio || 1
      canvas.width = Math.floor(width * ratio)
      canvas.height = Math.floor(height * ratio)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const move = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      mx = e.clientX - rect.left
      my = e.clientY - rect.top
    }

    const leave = () => {
      mx = -9999
      my = -9999
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      for (let x = 0; x < width; x += 16) {
        for (let y = 0; y < height; y += 16) {
          const distance = Math.hypot(x - mx, y - my)
          const alpha = Math.max(0.04, Math.min(0.55, 1 - distance / 90))
          const dotSize = 0.7 + Math.max(0, 1.4 * (1 - distance / 70))
          ctx.beginPath()
          ctx.arc(x, y, dotSize, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(80,255,140,${alpha})`
          ctx.fill()
        }
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    section.addEventListener('mousemove', move)
    section.addEventListener('mouseleave', leave)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      section.removeEventListener('mousemove', move)
      section.removeEventListener('mouseleave', leave)
    }
  }, [])

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
    <main className="relative min-h-screen overflow-hidden bg-[#050805] text-white font-mono md:cursor-none">
      <style>{`
        html, body { background: #050805; }
        @keyframes tick { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .texture-bg {
          background-image:
            radial-gradient(circle at 18% 8%, rgba(35,255,105,.14), transparent 28%),
            radial-gradient(circle at 82% 16%, rgba(0,180,70,.20), transparent 27%),
            radial-gradient(circle at 50% 95%, rgba(90,255,155,.08), transparent 34%),
            linear-gradient(rgba(255,255,255,.026) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.026) 1px, transparent 1px);
          background-size: auto, auto, auto, 42px 42px, 42px 42px;
        }
        .texture-bg:before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: .22;
          background-image:
            radial-gradient(rgba(255,255,255,.13) 1px, transparent 1px),
            radial-gradient(rgba(38,255,112,.18) 1px, transparent 1px);
          background-size: 7px 7px, 19px 19px;
          mix-blend-mode: overlay;
        }
        .texture-bg:after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: repeating-linear-gradient(to bottom, rgba(255,255,255,.026), rgba(255,255,255,.026) 1px, transparent 1px, transparent 5px);
          opacity: .3;
        }
      `}</style>

      <div className="texture-bg pointer-events-none fixed inset-0" />
      <div ref={progressRef} className="fixed left-0 top-0 z-[9999] h-px w-0 bg-emerald-200 transition-[width] duration-100" />
      <div ref={cursorDotRef} className="pointer-events-none fixed z-[9998] hidden h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-200 shadow-[0_0_18px_rgba(52,211,153,.8)] md:block" />

      <nav className="relative z-10 flex justify-center gap-8 border-b border-emerald-500/10 bg-black/30 px-6 py-5 text-[11px] tracking-[0.18em] text-zinc-500 backdrop-blur">
        <a href="#about">ABOUT</a>
        <a href="#projects">PROJECTS</a>
        <a href="#resume">RESUME</a>
        <a href="#contact">CONTACT</a>
      </nav>

      <section className="relative z-10 overflow-hidden border-b border-emerald-500/10 bg-black/20 py-3 whitespace-nowrap">
        <div className="inline-block animate-[tick_24s_linear_infinite]">
          {Array.from({ length: 4 }).flatMap(() => ['MACBUILDS.AI', 'EST. 2026', 'LEARNING OUT LOUD', 'POWERED BY AI', 'ALWAYS BUILDING', 'WORK WITH ME']).map((item, i) => (
            <span key={`${item}-${i}`} className="mr-12 text-[10px] tracking-[0.18em] text-emerald-900/80">{item}</span>
          ))}
        </div>
      </section>

      <section className="relative z-10 min-h-[560px] overflow-hidden border-b border-emerald-500/10">
        <canvas ref={heroCanvasRef} className="absolute inset-0 h-full w-full" />
        <div className="relative z-10 px-6 py-20 md:px-12 md:py-32">
          <p className="mb-4 text-[10px] tracking-[0.18em] text-emerald-500/70">WELCOME TO</p>
          <h1 className="mb-6 text-5xl font-bold leading-none tracking-[-0.06em] md:text-7xl">macbuilds</h1>
          <p className="mb-8 max-w-2xl text-sm leading-7 text-zinc-400">
            I’m learning out loud and building AI-powered tools, agents, and product experiments.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#projects" className="rounded bg-emerald-300 px-6 py-3 text-[11px] font-bold tracking-[0.12em] text-black shadow-[0_0_30px_rgba(52,211,153,.18)]">VIEW PROJECTS</a>
            <a href="#about" className="px-2 py-3 text-[11px] tracking-[0.12em] text-zinc-500">LEARN MORE →</a>
          </div>
        </div>
      </section>

      <section className="relative z-10 grid border-b border-emerald-500/10 bg-black/20 md:grid-cols-3">
        {[
          { label: 'PROJECTS', value: stats.repos },
          { label: 'LATEST BUILD', value: stats.latest },
          { label: 'DAYS BUILDING', value: stats.daysBuilding },
        ].map((stat, i) => (
          <div key={stat.label} className={`flex items-center justify-between border-emerald-500/10 px-6 py-5 md:block md:px-12 md:py-10 md:text-center ${i < 2 ? 'md:border-r' : ''}`}>
            <div className="text-2xl font-bold text-emerald-100 md:mb-2 md:text-4xl">{stat.value}</div>
            <div className="text-[10px] tracking-[0.18em] text-emerald-700/70">{stat.label}</div>
          </div>
        ))}
      </section>

      <section className="relative z-10 overflow-hidden border-b border-emerald-500/10">
        <canvas ref={projCanvasRef} className="absolute inset-0 h-full w-full opacity-70" />
        <div id="projects" className="relative z-10 px-6 py-16 md:px-12 md:py-24">
          <p className="mb-10 text-[10px] tracking-[0.18em] text-emerald-500/70">PROJECTS</p>

          <div className="rounded-md border border-emerald-500/15 bg-black/55 p-6 shadow-[0_0_80px_rgba(16,185,129,.08)] backdrop-blur md:p-10">
            <p className="mb-4 text-[10px] tracking-[0.18em] text-emerald-500/70">BUILD WITH MAC</p>
            <h2 className="mb-4 text-2xl font-bold leading-tight tracking-[-0.05em] md:text-3xl">PROJECT 001 — AI BUILD BLUEPRINT</h2>
            <p className="mb-6 max-w-2xl text-sm leading-7 text-zinc-400">Describe an idea. I’ll turn it into a product plan.</p>

            <input
              value={botPassword}
              onChange={(e) => setBotPassword(e.target.value)}
              type="password"
              placeholder="Enter bot password"
              className="mb-4 w-full rounded border border-emerald-500/15 bg-[#050805] p-4 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-emerald-400/50"
            />

            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Example: I want to build an AI assistant for real estate agents."
              className="mb-4 min-h-[140px] w-full resize-y rounded border border-emerald-500/15 bg-[#050805] p-4 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-emerald-400/50"
            />

            <button
              onClick={askAI}
              disabled={loading}
              className="rounded bg-emerald-300 px-5 py-3 text-[11px] font-bold tracking-[0.12em] text-black shadow-[0_0_30px_rgba(52,211,153,.18)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'BUILDING...' : 'GENERATE BLUEPRINT'}
            </button>

            {reply && (
              <div className="mt-8 whitespace-pre-wrap rounded border border-emerald-500/15 bg-black/60 p-6 text-sm leading-7 text-zinc-300">
                {reply}
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="about" className="relative z-10 border-b border-emerald-500/10 px-6 py-16 md:px-12 md:py-24">
        <p className="mb-10 text-[10px] tracking-[0.18em] text-emerald-500/70">ABOUT</p>
        <div className="rounded border border-dashed border-emerald-500/15 bg-black/30 p-10 text-center text-[11px] tracking-[0.12em] text-zinc-700 backdrop-blur">BIO COMING SOON</div>
      </section>

      <section id="resume" className="relative z-10 border-b border-emerald-500/10 px-6 py-16 md:px-12 md:py-24">
        <p className="mb-10 text-[10px] tracking-[0.18em] text-emerald-500/70">RESUME</p>
        <div className="rounded border border-dashed border-emerald-500/15 bg-black/30 p-10 text-center text-[11px] tracking-[0.12em] text-zinc-700 backdrop-blur">EXPERIENCE COMING SOON</div>
      </section>

      <footer id="contact" className="relative z-10 bg-black/20 px-6 py-12 md:px-12">
        <div className="grid gap-8 md:grid-cols-3 md:text-center">
          <FooterColumn title="CONTACT" links={[{ label: 'Reach out', href: '#contact' }]} />
          <FooterColumn title="NAVIGATE" links={[{ label: 'Home', href: '#' }, { label: 'About', href: '#about' }, { label: 'Projects', href: '#projects' }, { label: 'Resume', href: '#resume' }]} />
          <div>
            <p className="mb-4 text-[10px] tracking-[0.18em] text-emerald-500/70">FIND ME</p>
            <div className="flex justify-start gap-4 md:justify-center">
              <SocialLink href="https://www.linkedin.com/in/maccal/" label="LinkedIn" icon="linkedin" />
              <SocialLink href="https://github.com/maccstaxx" label="GitHub" icon="github" />
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-emerald-500/10 pt-6 text-center text-[11px] text-zinc-800">© 2026 macbuilds</div>
      </footer>
    </main>
  )
}

function SocialLink({ href, label, icon }: { href: string; label: string; icon: 'linkedin' | 'github' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="group flex h-11 w-11 items-center justify-center rounded-full border border-emerald-500/15 bg-black/40 text-zinc-500 transition hover:border-emerald-300/60 hover:text-emerald-300 hover:shadow-[0_0_28px_rgba(52,211,153,.16)]"
    >
      {icon === 'linkedin' ? <LinkedInIcon /> : <GitHubIcon />}
    </a>
  )
}

function LinkedInIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.28 8.25h4.43V23H.28V8.25Zm7.18 0h4.24v2.02h.06c.59-1.12 2.03-2.3 4.18-2.3 4.47 0 5.29 2.94 5.29 6.76V23h-4.42v-7.33c0-1.75-.03-4-2.44-4-2.45 0-2.82 1.91-2.82 3.88V23H7.46V8.25Z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.15c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18A11.1 11.1 0 0 1 12 6.05c.98 0 1.95.13 2.87.38 2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.79.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="mb-4 text-[10px] tracking-[0.18em] text-emerald-500/70">{title}</p>
      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <a key={link.href} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined} className="text-sm text-zinc-500 no-underline hover:text-emerald-300">
            {link.label}
          </a>
        ))}
      </div>
    </div>
  )
}
