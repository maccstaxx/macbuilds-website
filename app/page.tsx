'use client'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const [doorsOpen, setDoorsOpen] = useState(false)
  const [loaderGone, setLoaderGone] = useState(false)
  const [stats, setStats] = useState({ repos: 0, latest: '—', followers: 0 })
  const [counted, setCounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [aiInput, setAiInput] = useState('')
  const [aiResult, setAiResult] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const heroCanvasRef = useRef<HTMLCanvasElement>(null)
  const projCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    setTimeout(() => setDoorsOpen(true), 1800)
    setTimeout(() => setLoaderGone(true), 3200)
  }, [])

  useEffect(() => {
    if (isMobile) return
    const move = (e: MouseEvent) => {
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = e.clientX + 'px'
        cursorDotRef.current.style.top = e.clientY + 'px'
      }
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [isMobile])

  useEffect(() => {
    const handleScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      if (progressRef.current) progressRef.current.style.width = (window.scrollY / h * 100) + '%'
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const canvas = heroCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const pts: any[] = []
    const N = 500, TURNS = 6, RADIUS = 90, HEIGHT = 420
    for (let i = 0; i < N; i++) {
      const p = i / N
      const angle = p * Math.PI * 2 * TURNS
      pts.push({ x: Math.cos(angle) * RADIUS, y: (p - 0.5) * HEIGHT, z: Math.sin(angle) * RADIUS, g: 0, strand: 1 })
    }
    for (let i = 0; i < N; i++) {
      const p = i / N
      const angle = p * Math.PI * 2 * TURNS + Math.PI
      pts.push({ x: Math.cos(angle) * RADIUS, y: (p - 0.5) * HEIGHT, z: Math.sin(angle) * RADIUS, g: 0, strand: 2 })
    }
    for (let i = 0; i < TURNS * 8; i++) {
      const p = i / (TURNS * 8)
      const angle = p * Math.PI * 2 * TURNS
      const y = (p - 0.5) * HEIGHT
      for (let j = 0; j <= 8; j++) {
        const f = j / 8
        pts.push({ x: Math.cos(angle) * RADIUS * (1 - 2 * f), y, z: Math.sin(angle) * RADIUS * (1 - 2 * f), g: 0, strand: 0 })
      }
    }

    let mx = -999, my = -999, t = 0
    const section = canvas.parentElement!

    const onMove = (e: MouseEvent) => { const r = section.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top }
    const onTouch = (e: TouchEvent) => { const r = section.getBoundingClientRect(); mx = e.touches[0].clientX - r.left; my = e.touches[0].clientY - r.top }
    const onLeave = () => { mx = -999; my = -999 }

    section.addEventListener('mousemove', onMove)
    section.addEventListener('mouseleave', onLeave)
    section.addEventListener('touchmove', onTouch, { passive: true })
    section.addEventListener('touchend', onLeave)

    let animId: number
    const draw = () => {
      const cx = canvas.width * (canvas.width < 500 ? 0.85 : 0.72)
      const cy = canvas.height * 0.5
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t += 0.005
      const projected = pts.map(p => {
        const x1 = p.x * Math.cos(t) - p.z * Math.sin(t)
        const z1 = p.x * Math.sin(t) + p.z * Math.cos(t)
        const ps = 420 / (420 + z1 + RADIUS)
        const sx = cx + x1 * ps
        const sy = cy + p.y * ps
        const sz = Math.max(0.5, (p.strand === 0 ? 2.5 : 3) * ps)
        const d = mx === -999 ? 9999 : Math.hypot(sx - mx, sy - my)
        const hov = Math.max(0, 1 - d / 80)
        p.g = p.g + (hov - p.g) * 0.12
        const dep = (z1 + RADIUS) / (2 * RADIUS)
        return { sx, sy, sz, g: p.g, z1, dep, strand: p.strand }
      })
      projected.sort((a, b) => a.z1 - b.z1)
      projected.forEach(p => {
        const baseAlpha = p.strand === 0 ? 0.45 : 0.55 + p.dep * 0.4
        if (p.g > 0.05) {
          ctx.shadowBlur = 14
          ctx.shadowColor = `rgba(0,255,70,0.9)`
          ctx.fillStyle = `rgba(0,${Math.round(200 + p.g * 55)},70,${Math.min(1, baseAlpha + p.g * 0.85)})`
        } else {
          ctx.shadowBlur = p.strand === 0 ? 2 : 4
          ctx.shadowColor = `rgba(0,255,70,0.2)`
          ctx.fillStyle = p.strand === 0 ? `rgba(0,200,60,${baseAlpha})` : `rgba(0,220,70,${baseAlpha})`
        }
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, p.sz + p.g * 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      section.removeEventListener('mousemove', onMove)
      section.removeEventListener('mouseleave', onLeave)
      section.removeEventListener('touchmove', onTouch)
      section.removeEventListener('touchend', onLeave)
    }
  }, [])

  useEffect(() => {
    const canvas = projCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)

    let mx = -999, my = -999
    const section = canvas.parentElement!
    const move = (e: MouseEvent) => { const r = section.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top }
    const touch = (e: TouchEvent) => { const r = section.getBoundingClientRect(); mx = e.touches[0].clientX - r.left; my = e.touches[0].clientY - r.top }
    const leave = () => { mx = -999; my = -999 }

    section.addEventListener('mousemove', move)
    section.addEventListener('mouseleave', leave)
    section.addEventListener('touchmove', touch, { passive: true })
    section.addEventListener('touchend', leave)

    let animId: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let x = 0; x < canvas.width; x += 16) {
        for (let y = 0; y < canvas.height; y += 16) {
          const d = Math.hypot(x - mx, y - my)
          const a = Math.max(0.05, Math.min(0.6, 1 - d / 80))
          ctx.beginPath()
          ctx.arc(x, y, 0.8 + Math.max(0, 1.5 * (1 - d / 60)), 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${a})`
          ctx.fill()
        }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      section.removeEventListener('mousemove', move)
      section.removeEventListener('mouseleave', leave)
      section.removeEventListener('touchmove', touch)
      section.removeEventListener('touchend', leave)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted) {
        setCounted(true)
        fetch('https://api.github.com/users/maccstaxx').then(r => r.json()).then(user => {
          let r = 0, f = 0
          const tR = user.public_repos || 0, tF = user.followers || 0
          const iv = setInterval(() => {
            r = Math.min(r + 1, tR); f = Math.min(f + 1, tF)
            setStats(s => ({ ...s, repos: r, followers: f }))
            if (r === tR && f === tF) clearInterval(iv)
          }, 60)
        })
        fetch('https://api.github.com/users/maccstaxx/repos?sort=updated&per_page=1').then(r => r.json()).then(repos => {
          if (repos[0]) setStats(s => ({ ...s, latest: repos[0].name.slice(0, 10) }))
        })
      }
    }, { threshold: 0.3 })
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [counted])

  const handleAiSubmit = async () => {
    if (!aiInput.trim() || aiLoading) return
    setAiLoading(true)
    setAiResult('')
    setAiError('')
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: aiInput }) })
      const data = await res.json()
      if (data.error) setAiError(data.error)
      else setAiResult(data.reply)
    } catch {
      setAiError('Something went wrong. Try again.')
    } finally {
      setAiLoading(false)
    }
  }

  const tickerItems = ['MACBUILDS', 'BOSTON, MA', 'BUILDING IN PUBLIC', 'OPEN TO OPPORTUNITIES', 'GITHUB: MACCSTAXX', 'MACBUILDS.AI']

  return (
    <main style={{ background: '#080808', minHeight: '100vh', color: '#fff', fontFamily: 'Space Mono, monospace', cursor: isMobile ? 'auto' : 'none' }}>
      <div ref={progressRef} style={{ position: 'fixed', top: 0, left: 0, height: '1px', background: '#fff', zIndex: 9999, width: '0%', transition: 'width 0.1s ease' }} />

      {!loaderGone && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9997, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
            <span style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', fontFamily: 'Space Mono, monospace' }}>welcome to</span>
          </div>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', background: '#080808', borderRight: '1px solid #222', zIndex: 2, transform: doorsOpen ? 'translateX(-101%)' : 'translateX(0)', transition: 'transform 1.2s cubic-bezier(0.76,0,0.24,1)' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', background: '#080808', borderLeft: '1px solid #222', zIndex: 2, transform: doorsOpen ? 'translateX(101%)' : 'translateX(0)', transition: 'transform 1.2s cubic-bezier(0.76,0,0.24,1)' }} />
        </div>
      )}

      {!isMobile && (
        <div ref={cursorDotRef} style={{ position: 'fixed', width: '5px', height: '5px', background: '#fff', borderRadius: '50%', pointerEvents: 'none', zIndex: 9998, transform: 'translate(-50%,-50%)' }} />
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>
        <nav style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: isMobile ? '18px 24px' : '24px 48px', borderBottom: '1px solid #151515', gap: isMobile ? '20px' : '36px', flexWrap: 'wrap' }}>
          {['About', 'Projects', 'AI', 'Resume', 'Contact'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: '11px', color: '#666', textDecoration: 'none', letterSpacing: '0.1em' }}>{l}</a>
          ))}
        </nav>

        <div style={{ borderBottom: '1px solid #151515', padding: '12px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <div style={{ display: 'inline-block', animation: 'tick 20s linear infinite' }}>
            {[...tickerItems, ...tickerItems].map((t, i) => (
              <span key={i} style={{ fontSize: '10px', color: '#333', letterSpacing: '0.15em', marginRight: '48px' }}>{t}</span>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid #151515' }}>
          <canvas ref={heroCanvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1, padding: isMobile ? '64px 24px 56px' : '120px 48px 100px' }}>
            <h1 style={{ fontSize: isMobile ? '48px' : '72px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: isMobile ? '28px' : '40px', lineHeight: 1.0, fontFamily: 'Space Mono, monospace', textShadow: '0 0 40px rgba(0,255,70,0.08), 2px 2px 0 rgba(0,255,70,0.05)' }}>
              macbuilds
            </h1>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <a href="#projects" style={{ background: '#fff', color: '#000', padding: '12px 24px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.08em' }}>VIEW PROJECTS</a>
              <a href="#about" style={{ fontSize: '11px', color: '#555', textDecoration: 'none', letterSpacing: '0.08em' }}>Learn more →</a>
            </div>
          </div>
        </div>

        <div ref={statsRef} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', borderBottom: '1px solid #151515' }}>
          {[{ num: stats.repos, label: 'PROJECTS' }, { num: stats.latest, label: 'LATEST BUILD' }, { num: stats.followers, label: 'GITHUB FOLLOWERS' }].map((s, i) => (
            <div key={i} style={{ padding: isMobile ? '28px 24px' : '40px 48px', borderBottom: isMobile ? '1px solid #151515' : 'none', borderRight: !isMobile && i < 2 ? '1px solid #151515' : 'none', textAlign: 'center' }}>
              <div style={{ fontSize: isMobile ? '28px' : '36px', fontWeight: 700, marginBottom: '8px' }}>{s.num}</div>
              <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.15em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div id="ai" style={{ padding: isMobile ? '48px 24px' : '80px 48px', borderBottom: '1px solid #151515' }}>
          <p style={{ fontSize: '10px', color: '#555', letterSpacing: '0.15em', marginBottom: '8px' }}>MACBUILDS.AI</p>
          <p style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '32px', fontFamily: 'Space Mono, monospace' }}>Got an idea? I'll build you a blueprint.</p>
          <div style={{ display: 'flex', gap: '12px', flexDirection: isMobile ? 'column' : 'row', marginBottom: '32px' }}>
            <input
              value={aiInput}
              onChange={e => setAiInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAiSubmit()}
              placeholder="Describe your product idea..."
              style={{ flex: 1, background: '#0f0f0f', border: '1px solid #222', borderRadius: '4px', padding: '14px 16px', color: '#fff', fontFamily: 'Space Mono, monospace', fontSize: '13px', outline: 'none' }}
            />
            <button
              onClick={handleAiSubmit}
              disabled={aiLoading || !aiInput.trim()}
              style={{ background: aiLoading ? '#1a1a1a' : '#fff', color: aiLoading ? '#555' : '#000', border: 'none', borderRadius: '4px', padding: '14px 28px', fontFamily: 'Space Mono, monospace', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', cursor: aiLoading ? 'default' : 'pointer', whiteSpace: 'nowrap' }}
            >
              {aiLoading ? 'BUILDING...' : 'BUILD BLUEPRINT →'}
            </button>
          </div>
          {aiLoading && (
            <div style={{ border: '1px solid #1a1a1a', borderRadius: '4px', padding: isMobile ? '28px 20px' : '40px 32px', color: '#444', fontSize: '11px', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ display: 'inline-block', animation: 'pulse 1.2s ease-in-out infinite' }}>◆</span>
              Analyzing your idea and generating blueprint...
            </div>
          )}
          {aiError && (
            <div style={{ border: '1px solid #3a1a1a', borderRadius: '4px', padding: '20px 24px', color: '#ff4444', fontSize: '11px', letterSpacing: '0.05em' }}>{aiError}</div>
          )}
          {aiResult && (
            <div style={{ border: '1px solid #1a2a1a', borderRadius: '4px', padding: isMobile ? '28px 20px' : '40px 40px', background: '#0a0f0a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <span style={{ fontSize: '10px', color: '#0f0', letterSpacing: '0.15em' }}>BLUEPRINT GENERATED</span>
                <button onClick={() => { setAiResult(''); setAiInput('') }} style={{ background: 'none', border: 'none', color: '#444', fontSize: '11px', cursor: 'pointer', fontFamily: 'Space Mono, monospace', letterSpacing: '0.05em' }}>CLEAR ×</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                {aiResult.split(/\n(?=\d+\.)/).filter(Boolean).map((section, i) => {
                  const lines = section.trim().split('\n')
                  const title = lines[0]
                  const body = lines.slice(1).join('\n').trim()
                  return (
                    <div key={i} style={{ borderLeft: '2px solid #0f0', paddingLeft: '20px' }}>
                      <p style={{ fontSize: '11px', color: '#0f0', letterSpacing: '0.1em', marginBottom: '10px', fontWeight: 700 }}>{title}</p>
                      <p style={{ fontSize: '12px', color: '#aaa', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{body}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <canvas ref={projCanvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div id="projects" style={{ padding: isMobile ? '48px 24px' : '80px 48px', borderBottom: '1px solid #151515' }}>
              <p style={{ fontSize: '10px', color: '#555', letterSpacing: '0.15em', marginBottom: '40px' }}>PROJECTS</p>
              <div style={{ border: '1px dashed #222', borderRadius: '4px', padding: isMobile ? '32px 20px' : '48px 32px', textAlign: 'center', color: '#333', fontSize: '11px', letterSpacing: '0.05em' }}>PROJECTS COMING SOON</div>
            </div>
            <div id="about" style={{ padding: isMobile ? '48px 24px' : '80px 48px', borderBottom: '1px solid #151515' }}>
              <p style={{ fontSize: '10px', color: '#555', letterSpacing: '0.15em', marginBottom: '40px' }}>ABOUT</p>
              <div style={{ border: '1px dashed #222', borderRadius: '4px', padding: isMobile ? '32px 20px' : '48px 32px', textAlign: 'center', color: '#333', fontSize: '11px', letterSpacing: '0.05em' }}>BIO COMING SOON</div>
            </div>
            <div id="resume" style={{ padding: isMobile ? '48px 24px' : '80px 48px', borderBottom: '1px solid #151515' }}>
              <p style={{ fontSize: '10px', color: '#555', letterSpacing: '0.15em', marginBottom: '40px' }}>RESUME</p>
              <div style={{ border: '1px dashed #222', borderRadius: '4px', padding: isMobile ? '32px 20px' : '48px 32px', textAlign: 'center', color: '#333', fontSize: '11px', letterSpacing: '0.05em' }}>EXPERIENCE COMING SOON</div>
            </div>
          </div>
        </div>

        <div id="contact" style={{ borderTop: '1px solid #151515', padding: isMobile ? '48px 24px 32px' : '60px 48px 40px', background: '#080808' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: isMobile ? '36px' : '40px', marginBottom: '48px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <p style={{ fontSize: '10px', color: '#555', letterSpacing: '0.15em', marginBottom: '20px' }}>CONTACT</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href="mailto:macj300@gmail.com" style={{ fontSize: '12px', color: '#555', textDecoration: 'none', letterSpacing: '0.05em' }}>macj300@gmail.com</a>
                <span style={{ fontSize: '12px', color: '#555', letterSpacing: '0.05em' }}>Boston, MA</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <p style={{ fontSize: '10px', color: '#555', letterSpacing: '0.15em', marginBottom: '20px' }}>NAVIGATE</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[{ label: 'Home', href: '#' }, { label: 'About', href: '#about' }, { label: 'Projects', href: '#projects' }, { label: 'Resume', href: '#resume' }, { label: 'Contact', href: '#contact' }].map(l => (
                  <a key={l.label} href={l.href} style={{ fontSize: '12px', color: '#555', textDecoration: 'none', letterSpacing: '0.05em' }}>{l.label}</a>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <p style={{ fontSize: '10px', color: '#555', letterSpacing: '0.15em', marginBottom: '20px' }}>FIND ME</p>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <a href="https://www.linkedin.com/in/maccal/" target="_blank" rel="noreferrer" style={{ color: '#555' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                </a>
                <a href="https://github.com/maccstaxx" target="_blank" rel="noreferrer" style={{ color: '#555' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                </a>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #151515', paddingTop: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', color: '#333' }}>© 2026 macbuilds</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes tick { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes pulse { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
        @media (max-width: 767px) { * { -webkit-tap-highlight-color: transparent; } }
      `}</style>
    </main>
  )
}
