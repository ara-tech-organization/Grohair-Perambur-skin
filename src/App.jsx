import { useEffect, useRef, useState } from 'react'
import {
  Phone, ArrowRight, ChevronDown, CheckCircle2, CalendarDays,
  Menu, X, Loader2, Send, MapPin, Stethoscope, Layers,
  UserCheck, ClipboardList, CalendarCheck, Mail, Check, Star, Quote,
  Info,
} from 'lucide-react'
import logo from './assets/logo.png'
import {
  PHONE, PHONE_DISPLAY, EMAIL, ADDRESS_LINES, MAPS_URL, GOOGLE_REVIEWS_URL, nav, trust,
  treatmentOptions, treatments, treatmentSections, stats, whyUs, steps, faqs, reviews,
} from './content'

/* ---------- helpers ---------- */
function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? 'in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

// Stub: wire to the CMS / API endpoint.
async function submitLead(data) {
  await new Promise((r) => setTimeout(r, 900))
  console.info('Lead submitted', data)
  return true
}

function Cta({ href = '#book', children, variant = 'primary', icon: Icon = ArrowRight, ...rest }) {
  return (
    <a href={href} className={`btn btn-${variant}`} {...rest}>
      <span>{children}</span>
      <Icon size={18} aria-hidden="true" className="btn-ic" />
    </a>
  )
}

function SectionHead({ title, text, center }) {
  return (
    <Reveal className={`sec-head ${center ? 'center' : ''}`}>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </Reveal>
  )
}

/* ---------- custom dropdown ---------- */
function Dropdown({ id, value, onChange, options, placeholder = 'Select' }) {
  const [open, setOpen] = useState(false)
  const [hi, setHi] = useState(-1)
  const [up, setUp] = useState(false)
  const wrap = useRef(null)
  const btn = useRef(null)

  useEffect(() => {
    if (!open) return
    const off = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false) }
    document.addEventListener('pointerdown', off)
    return () => document.removeEventListener('pointerdown', off)
  }, [open])

  const openList = () => {
    const r = btn.current.getBoundingClientRect()
    setUp(window.innerHeight - r.bottom < 300 && r.top > 300)
    setHi(Math.max(0, options.indexOf(value)))
    setOpen(true)
  }
  const pick = (o) => {
    onChange(o)
    setOpen(false)
    btn.current.focus()
  }
  const onKey = (e) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); openList() }
      return
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setHi((h) => (h + 1) % options.length) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => (h - 1 + options.length) % options.length) }
    else if (e.key === 'Home') { e.preventDefault(); setHi(0) }
    else if (e.key === 'End') { e.preventDefault(); setHi(options.length - 1) }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (hi >= 0) pick(options[hi]) }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false) }
    else if (e.key === 'Tab') setOpen(false)
  }

  return (
    <div className={`dd ${open ? 'open' : ''} ${up ? 'up' : ''}`} ref={wrap}>
      <button
        type="button" id={id} ref={btn} className={`dd-btn ${value ? '' : 'ph'}`}
        aria-haspopup="listbox" aria-expanded={open} aria-controls={`${id}-list`}
        onClick={() => (open ? setOpen(false) : openList())} onKeyDown={onKey}
      >
        <span>{value || placeholder}</span>
        <ChevronDown size={18} aria-hidden="true" />
      </button>
      <ul className="dd-list" id={`${id}-list`} role="listbox" aria-activedescendant={hi >= 0 ? `${id}-o${hi}` : undefined}>
        {options.map((o, i) => (
          <li
            key={o} id={`${id}-o${i}`} role="option" aria-selected={o === value}
            className={`${i === hi ? 'hi' : ''} ${o === value ? 'sel' : ''}`}
            onMouseEnter={() => setHi(i)} onClick={() => pick(o)}
          >
            <span>{o}</span>
            {o === value && <Check size={16} aria-hidden="true" />}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---------- lead form ---------- */
function LeadForm({ id, heading, text, button, dark, optionalDate = true }) {
  const [vals, setVals] = useState({ name: '', mobile: '', treatment: '', date: '' })
  const [errs, setErrs] = useState({})
  const [state, setState] = useState('idle')

  const set = (k) => (e) => setVals((v) => ({ ...v, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (vals.name.trim().length < 2) e.name = 'Please enter your name'
    if (!/^[6-9]\d{9}$/.test(vals.mobile.replace(/\s|-/g, '').replace(/^(\+91|0)/, '')))
      e.mobile = 'Enter a valid 10-digit mobile number'
    if (!vals.treatment) e.treatment = 'Please select a treatment'
    return e
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrs(e)
    if (Object.keys(e).length) return
    setState('loading')
    await submitLead(vals)
    setState('done')
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <form className={`lead ${dark ? 'lead-dark' : ''}`} onSubmit={onSubmit} noValidate id={id}>
      {state === 'done' ? (
        <div className="lead-done">
          <CheckCircle2 size={48} aria-hidden="true" />
          <h3>Thank you</h3>
          <p>Your request has been received. Our team will contact you shortly to schedule your consultation.</p>
        </div>
      ) : (
        <>
          {heading && <h3>{heading}</h3>}
          {text && <p className="lead-sub">{text}</p>}
          <div className={`field ${errs.name ? 'bad' : ''}`}>
            <label htmlFor={`${id}-name`}>Name</label>
            <input id={`${id}-name`} value={vals.name} onChange={set('name')} autoComplete="name" placeholder="Enter your name" />
            {errs.name && <small>{errs.name}</small>}
          </div>
          <div className={`field ${errs.mobile ? 'bad' : ''}`}>
            <label htmlFor={`${id}-mobile`}>Mobile Number</label>
            <input id={`${id}-mobile`} type="tel" inputMode="numeric" value={vals.mobile} onChange={set('mobile')} autoComplete="tel" placeholder="10-digit mobile number" />
            {errs.mobile && <small>{errs.mobile}</small>}
          </div>
          <div className={`field ${errs.treatment ? 'bad' : ''}`}>
            <label htmlFor={`${id}-treatment`}>Select Your Treatment</label>
            <Dropdown id={`${id}-treatment`} value={vals.treatment} onChange={(v) => setVals((x) => ({ ...x, treatment: v }))} options={treatmentOptions} placeholder="Select your treatment" />
            {errs.treatment && <small>{errs.treatment}</small>}
          </div>
          <div className="field">
            <label htmlFor={`${id}-date`}>Preferred Appointment Date{optionalDate ? ' (Optional)' : ''}</label>
            <input id={`${id}-date`} type="date" min={today} value={vals.date} onChange={set('date')} />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={state === 'loading'}>
            {state === 'loading' ? <Loader2 size={18} className="spin" aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}
            <span>{state === 'loading' ? 'SENDING' : button}</span>
          </button>
          {text && <p className="disclaimer">By submitting this form, you agree to be contacted by our team regarding your enquiry.</p>}
        </>
      )}
    </form>
  )
}

/* ---------- scroll spy + deep links ---------- */
const BASE = import.meta.env.BASE_URL // e.g. '/Grohair-Perambur-Land/'
const SECTION_IDS = ['top', 'treatments', ...treatmentSections.map((t) => t.id), 'reviews', 'why-us', 'process', 'faq', 'appointment']
const NAV_OF = Object.fromEntries(treatmentSections.map((t) => [t.id, 'treatments']))

function useScrollSpy() {
  const [active, setActive] = useState('top')

  useEffect(() => {
    let current = ''
    let ready = false
    let ticking = false

    const compute = () => {
      ticking = false
      const line = 140
      let id = SECTION_IDS[0]
      for (const sid of SECTION_IDS) {
        const el = document.getElementById(sid)
        if (el && el.getBoundingClientRect().top <= line) id = sid
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (atBottom) id = SECTION_IDS[SECTION_IDS.length - 1]
      if (id === current) return
      current = id
      setActive(id)
      if (ready) {
        const url = BASE + (id === 'top' ? '' : id) + window.location.search
        window.history.replaceState(null, '', url)
      }
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(compute)
      }
    }

    // Deep link: open straight onto the section, then glide to it
    const hash = decodeURIComponent(window.location.pathname.slice(BASE.length - 1).replace(/^\/+|\/+$/g, '') || window.location.hash.slice(1))
    const target = hash && document.getElementById(hash)
    let timer
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    if (target) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      timer = setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setTimeout(() => { ready = true; compute() }, 1200)
      }, 350)
    } else {
      ready = true
    }
    // in-page links: smooth scroll, URL is then kept in sync by the scroll spy
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]')
      if (!a) return
      const el = document.getElementById(a.getAttribute('href').slice(1))
      if (!el) return
      e.preventDefault()
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    document.addEventListener('click', onClick)
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', onClick)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return NAV_OF[active] || active
}

/* ---------- header ---------- */
function Header() {
  const active = useScrollSpy()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <header className={`hdr ${scrolled ? 'scrolled' : ''}`}>
      <div className="wrap hdr-in">
        <a href="#top" className="brand" aria-label="Advanced GroHair &amp; GloSkin Perambur">
          <img src={logo} alt="Advanced GroHair and GloSkin" />
        </a>
        <nav className={`nav ${open ? 'open' : ''}`} aria-label="Primary">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className={active === n.href.slice(1) ? 'active' : ''}
              aria-current={active === n.href.slice(1) ? 'true' : undefined}
              onClick={() => setOpen(false)}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="hdr-act">
          <a href={`tel:${PHONE}`} className="btn btn-primary btn-sm">
            <Phone size={16} aria-hidden="true" /><span>Call Now</span>
          </a>
          <button className="burger" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  )
}

/* ---------- sections ---------- */
function Hero() {
  return (
    <section className="hero" id="top">
      <div className="blob b1" /><div className="blob b2" />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1 className="rise" style={{ '--d': '100ms' }}>
            Advanced <em>Skin Treatments</em> in Perambur, Chennai
          </h1>
          <p className="lead-p rise" style={{ '--d': '200ms' }}>
            Explore personalised aesthetic skin treatments with professional consultation and treatment planning.
          </p>
          <h2 className="hero-sub rise" style={{ '--d': '260ms' }}>Available Treatments</h2>
          <ul className="tgrid">
            {treatments.map(({ icon: Icon, title, id }, i) => (
              <li key={id} className="rise" style={{ '--d': `${300 + i * 60}ms` }}>
                <a href={`#${id}`}><Icon size={20} aria-hidden="true" /><span>{title}</span></a>
              </li>
            ))}
          </ul>
          <ul className="tbar">
            {trust.map(({ icon: Icon, text }, i) => (
              <li key={text} className="rise" style={{ '--d': `${680 + i * 80}ms` }}>
                <Icon size={18} aria-hidden="true" /><span>{text}</span>
              </li>
            ))}
          </ul>
          <div className="rise" style={{ '--d': '1000ms' }}>
            <Cta href="#book">Book Your Consultation</Cta>
          </div>
        </div>
        <div className="hero-form rise" style={{ '--d': '250ms' }} id="book">
          <LeadForm id="hero-form" heading="Book Your Appointment" button="BOOK APPOINTMENT" optionalDate={false} />
        </div>
      </div>
    </section>
  )
}

function Treatments() {
  return (
    <section className="sec" id="treatments">
      <div className="wrap">
        <SectionHead center title="Choose Your Skin Treatment" text="Explore treatment options based on your individual skin concerns." />
        <div className="grid g3">
          {treatments.map(({ id, icon: Icon, title, text }, i) => (
            <Reveal key={id} delay={(i % 3) * 90} className="card tcard">
              <span className="ic"><Icon size={26} aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{text}</p>
              <a href={`#${id}`} className="link">Explore Treatment<ArrowRight size={16} aria-hidden="true" /></a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Story({ data: d, tint, flip, index }) {
  const Badge = treatments.find((t) => t.id === d.id)?.icon
  return (
    <section className={`sec gx ${tint ? 'gx-tint' : ''} ${flip ? 'gx-flip' : ''}`} id={d.id}>
      <div className="blob b1" /><div className="blob b2" />
      {Badge && <Badge className="gx-mark" size={260} strokeWidth={1} aria-hidden="true" />}
      <div className="wrap gx-grid">
        <Reveal className="gx-left">
          <span className="gx-num">{String(index + 1).padStart(2, '0')}</span>
          <h2>{d.title}</h2>
          <p>{d.intro}</p>
          {d.list && (
            <>
              <h3 className="gx-sub">{d.listTitle}</h3>
              <ul className="gx-chips gx-cards">
                {d.list.map((t, i) => {
                  const Icon = d.listIcons[i]
                  return (
                    <Reveal as="li" key={t} delay={150 + i * 80}>
                      <Icon size={18} aria-hidden="true" /><span>{t}</span>
                    </Reveal>
                  )
                })}
              </ul>
            </>
          )}
          {d.note && (
            <p className="note" role="note"><Info size={20} aria-hidden="true" /><span><b>Important:</b> {d.note}</span></p>
          )}
          <Cta href="#book">{d.cta}</Cta>
        </Reveal>
        <Reveal delay={150} className="gx-right">
          <h3>During Your Consultation</h3>
          <ol className="gx-line">
            {d.understand.map((t, i) => {
              const Icon = d.understandIcons[i]
              return (
                <Reveal as="li" key={t} delay={250 + i * 110}>
                  <span className="gx-node"><Icon size={22} aria-hidden="true" /></span>
                  <span className="gx-text">{t}</span>
                </Reveal>
              )
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}

function Reviews() {
  const dev = import.meta.env.DEV // empty review slots are only drawn while developing
  const items = reviews.length ? reviews.slice(0, 3) : dev ? [0, 1, 2].map((i) => ({ placeholder: true, key: i })) : []
  return (
    <section className="sec tint" id="reviews">
      <div className="wrap">
        <SectionHead center title="Trusted by Clients for Their Skin Treatment Journey" />
        <div className="tr3">
          {stats.map(({ value, label, text }, i) => (
            <Reveal key={label} delay={i * 90} className="tr3-card">
              <b className="tr3-v">{value}{i === 0 && <Star size={30} fill="currentColor" aria-hidden="true" />}</b>
              <h3>{label}</h3>
              <p>{text}</p>
            </Reveal>
          ))}
        </div>
        {items.length > 0 && (
          <>
            <h3 className="rev-title">Google Reviews</h3>
            <div className="grid g3">
              {items.map((r, i) => (
                <Reveal key={r.key ?? r.name} delay={i * 90} className="card review">
                  {r.placeholder ? (
                    <div className="slot"><Quote size={32} aria-hidden="true" /><span>Add 3 genuine Google reviews in content.js</span></div>
                  ) : (
                    <>
                      <Quote className="rev-q" size={30} aria-hidden="true" />
                      <div className="stars" aria-label={`${r.rating || 5} out of 5 stars`}>
                        {Array.from({ length: r.rating || 5 }).map((_, k) => <Star key={k} size={18} fill="currentColor" aria-hidden="true" />)}
                      </div>
                      <p>{r.text}</p>
                      <div className="rev-by"><b>{r.name}</b>{r.date && <span>{r.date}</span>}</div>
                    </>
                  )}
                </Reveal>
              ))}
            </div>
          </>
        )}
        <Reveal delay={200} className="center-cta">
          <Cta href={GOOGLE_REVIEWS_URL} target="_blank" rel="noreferrer" icon={Star}>View Google Reviews</Cta>
        </Reveal>
      </div>
    </section>
  )
}

function WhyUs() {
  const icons = [Layers, Stethoscope, ClipboardList, CalendarCheck, UserCheck]
  return (
    <section className="sec why4" id="why-us">
      <div className="wrap">
        <div className="why4-panel">
          <div className="blob b3" />
          <Reveal as="h2" className="why4-h">A Consultation-Led Approach to Skin Treatments</Reveal>
          <ul className="why4-grid">
            {whyUs.map((t, i) => {
              const Icon = icons[i]
              return (
                <Reveal as="li" key={t} delay={i * 80} className="why4-item">
                  <span className="why4-ic"><Icon size={24} aria-hidden="true" /></span>
                  <span>{t}</span>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Process() {
  return (
    <section className="sec" id="process">
      <div className="wrap">
        <SectionHead center title="Book Your Skin Treatment Appointment" />
        <ol className="steps">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={i * 110} className="step">
              <span className="ic"><Icon size={24} aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>
          ))}
        </ol>
        <Reveal delay={200} className="center-cta"><Cta href="#book">Book Your Appointment</Cta></Reveal>
      </div>
    </section>
  )
}

function Faq() {
  const [open, setOpen] = useState(0)
  const columns = [faqs]
  return (
    <section className="sec tint" id="faq">
      <div className="wrap">
        <SectionHead center title="Frequently Asked Questions" />
        <div className="faq">
          {columns.map((col, c) => (
            <div className="faq-col" key={c}>
              {col.map(([q, a], j) => {
                const i = j
                return (
                  <Reveal key={q} delay={j * 70} className={`qa ${open === i ? 'open' : ''}`}>
                    <h3>
                      <button aria-expanded={open === i} aria-controls={`faq-${i}`} onClick={() => setOpen(open === i ? -1 : i)}>
                        <span><b>{i + 1}.</b> {q}</span>
                        <ChevronDown size={20} aria-hidden="true" />
                      </button>
                    </h3>
                    <div className="ans" id={`faq-${i}`} role="region"><div><p>{a}</p></div></div>
                  </Reveal>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Final() {
  return (
    <section className="final" id="appointment">
      <div className="blob b3" />
      <div className="wrap hero-grid">
        <Reveal className="final-copy">
          <h2>Ready to Explore Your Skin Treatment Options?</h2>
          <p>Book an appointment at Advanced GroHair &amp; GloSkin, Perambur.</p>
          <div className="btn-row">
            <Cta href="#final-form" variant="light" icon={CalendarDays}>BOOK YOUR CONSULTATION</Cta>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <LeadForm id="final-form" heading="" button="BOOK APPOINTMENT" optionalDate={false} />
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="ftr">
      <div className="blob b1" />
      <div className="wrap">
        <div className="ftr-grid">
          <div className="ftr-brand">
            <img src={logo} alt="Advanced GroHair and GloSkin" />
            <a href="#book" className="btn btn-primary btn-sm"><CalendarCheck size={16} aria-hidden="true" /><span>Book Consultation</span></a>
          </div>
          <div>
            <h4 className="ftr-h">Explore</h4>
            <ul>
              {nav.map((n) => <li key={n.href}><a href={n.href}>{n.label}</a></li>)}
              <li><a href="#book">Book appointment</a></li>
            </ul>
          </div>
          <div>
            <h4 className="ftr-h">Treatments</h4>
            <ul>
              {treatments.map((t) => <li key={t.id}><a href={`#${t.id}`}>{t.title}</a></li>)}
            </ul>
          </div>
          <div>
            <h4 className="ftr-h">Contact</h4>
            <ul className="ftr-contact">
              <li><Phone size={18} aria-hidden="true" /><a href={`tel:${PHONE}`}>{PHONE_DISPLAY}</a></li>
              <li><Mail size={18} aria-hidden="true" /><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
              <li><MapPin size={18} aria-hidden="true" /><a href={MAPS_URL} target="_blank" rel="noreferrer">{ADDRESS_LINES.map((l) => <span key={l} className="addr-l">{l}</span>)}</a></li>
            </ul>
          </div>
        </div>
        <div className="ftr-bar">
          <small>© {year} Advanced GroHair &amp; GloSkin, Perambur. All rights reserved.</small>
        </div>
      </div>
    </footer>
  )
}

function StickyBar() {
  return (
    <div className="sticky-bar">
      <a href={`tel:${PHONE}`}><Phone size={18} aria-hidden="true" />Call Now</a>
      <a href="#book" className="primary"><CalendarDays size={18} aria-hidden="true" />Book Consultation</a>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Treatments />
        {treatmentSections.map((t, i) => <Story key={t.id} data={t} index={i} tint={i % 2 === 0} flip={i % 2 === 1} />)}
        <Reviews />
        <WhyUs />
        <Process />
        <Faq />
        <Final />
      </main>
      <Footer />
      <StickyBar />
    </>
  )
}
