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

// Lead submission -> https://adgrohairperambur.com/api/email.php (emails the clinic and adds a sheet row)
const LEAD_API = 'https://adgrohairperambur.com/api/email.php'
const LEAD_SOURCES = {
  'hero-form': 'Skin - Hero Form',
  'popup-form': 'Skin - Popup Form',
  'final-form': 'Skin - Final Form',
}

async function submitLead(v, formId) {
  const digits = v.mobile.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '')
  const payload = {
    name: v.name.trim(),
    phone: `+91${digits}`, // same format as the hair page; stored as 91XXXXXXXXXX in the sheet
    area: v.area.trim(),
    concern: v.treatment,
    date: v.date || '',
    source: LEAD_SOURCES[formId] || 'Skin Landing Page',
  }
  try {
    const res = await fetch(LEAD_API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    return (await res.json()).success === true
  } catch {
    return false
  }
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
  const [vals, setVals] = useState({ name: '', mobile: '', area: '', treatment: '', date: '' })
  const [errs, setErrs] = useState({})
  const [state, setState] = useState('idle')

  const set = (k) => (e) => setVals((v) => ({ ...v, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (vals.name.trim().length < 2) e.name = 'Please enter your name'
    if (vals.area.trim().length < 2) e.area = 'Please enter your area name'
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
    const sent = await submitLead(vals, id)
    if (sent) {
      window.location.assign(BASE + 'thankyou') // /thankyou page (also usable as the ads conversion page)
      return
    }
    setState('error')
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
          <div className={`field ${errs.area ? 'bad' : ''}`}>
            <label htmlFor={`${id}-area`}>Area Name</label>
            <input id={`${id}-area`} value={vals.area} onChange={set('area')} autoComplete="address-level2" placeholder="Enter your area name" />
            {errs.area && <small>{errs.area}</small>}
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
          {state === 'error' && <p className="lead-err" role="alert">We could not send your request. Please try again or call us on {PHONE_DISPLAY}.</p>}
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
const SECTION_IDS = ['top', 'treatments', ...treatmentSections.map((t) => t.id), 'reviews', 'why-us', 'process', 'customer-reviews', 'faq', 'appointment']
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
              <li key={id} className="rise" style={{ '--d': `${400 + i * 60}ms` }}>
                <a href={`#${id}`}>
                  <span className="tg-ic"><Icon size={18} aria-hidden="true" /></span>
                  <span className="tg-t">{title}</span>
                  <ArrowRight className="tg-ar" size={16} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <ul className="kpis">
            {trust.map(({ value, label, star }, i) => (
              <li key={label} className="rise" style={{ '--d': `${240 + i * 80}ms` }}>
                <b>{value}{star && <Star size={22} fill="currentColor" aria-hidden="true" />}</b>
                <span>{label}</span>
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
      </div>
    </section>
  )
}

function ReviewCard({ r, dup }) {
  const [open, setOpen] = useState(false)
  const long = r.text.length > 210
  return (
    <article className="rv-card" aria-hidden={dup || undefined}>
      <header className="rv-head">
        <span className="rv-av" aria-hidden="true">{r.name.trim().charAt(0).toUpperCase()}</span>
        <span className="rv-who"><b>{r.name}</b>{r.date && <small>{r.date}</small>}</span>
        <Quote className="rv-q" size={34} aria-hidden="true" />
      </header>
      <div className="stars" aria-label={`${r.rating} out of 5 stars`}>
        {Array.from({ length: r.rating }).map((_, k) => <Star key={k} size={18} fill="currentColor" aria-hidden="true" />)}
      </div>
      <p className={`rv-text ${open ? 'open' : ''}`}>{r.text}</p>
      {long && <button type="button" className="rv-more" onClick={() => setOpen((o) => !o)} aria-expanded={open}>{open ? 'Show less' : 'Read more'}</button>}
    </article>
  )
}

function CustomerReviews() {
  const track = useRef(null)
  const paused = useRef(false)
  const n = reviews.length

  // The list is rendered twice; when the view passes the first copy it is silently
  // moved back by exactly one copy, so the carousel loops 1-5-1-5 with no rewind.
  const setWidth = (el) => (el.children[n] ? el.children[n].offsetLeft - el.children[0].offsetLeft : 0)
  const jump = (el, delta) => {
    el.style.scrollSnapType = 'none'
    el.style.scrollBehavior = 'auto'
    el.scrollLeft += delta
    el.style.scrollBehavior = ''
    requestAnimationFrame(() => { el.style.scrollSnapType = '' })
  }
  const normalise = (el) => {
    const w = setWidth(el)
    if (w && el.scrollLeft >= w) jump(el, -w)
  }
  const go = (dir) => {
    const el = track.current
    if (!el) return
    const w = setWidth(el)
    if (dir < 0 && el.scrollLeft < 4 && w) jump(el, w)
    else normalise(el)
    const step = el.children[1].offsetLeft - el.children[0].offsetLeft
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }
  useEffect(() => {
    if (!n || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      const el = track.current
      if (!el || paused.current) return
      normalise(el)
      const step = el.children[1].offsetLeft - el.children[0].offsetLeft
      el.scrollBy({ left: step, behavior: 'smooth' })
    }, 2000)
    return () => clearInterval(id)
    // eslint-disable-next-line
  }, [])
  if (!reviews.length) return null
  const hold = (v) => () => { paused.current = v }
  return (
    <section className="sec" id="customer-reviews">
      <div className="wrap">
        <SectionHead center title="Google Reviews" />
        <div className="rv" onMouseEnter={hold(true)} onMouseLeave={hold(false)} onFocus={hold(true)} onBlur={hold(false)} onTouchStart={hold(true)} onTouchEnd={() => setTimeout(hold(false), 4000)}>
          <div className="rv-track" ref={track} tabIndex={0} aria-label="Customer reviews" onScroll={(e) => { const el = e.currentTarget; clearTimeout(el._t); el._t = setTimeout(() => normalise(el), 180) }}>
            {[...reviews, ...reviews].map((r, i) => <ReviewCard key={`${r.name}-${i}`} r={r} dup={i >= n} />)}
          </div>
          <div className="rv-nav">
            <button type="button" onClick={() => go(-1)} aria-label="Previous reviews"><ChevronDown size={20} style={{ transform: 'rotate(90deg)' }} /></button>
            <button type="button" onClick={() => go(1)} aria-label="Next reviews"><ChevronDown size={20} style={{ transform: 'rotate(-90deg)' }} /></button>
          </div>
        </div>
        <div className="center-cta">
          <Cta href={GOOGLE_REVIEWS_URL} target="_blank" rel="noreferrer" icon={Star}>View Google Reviews</Cta>
        </div>
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
            <Reveal as="li" key={title} delay={i * 110} className="step flow">
              <span className="flow-node"><Icon size={26} aria-hidden="true" /><em>{i + 1}</em></span>
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

/* ---------- pop ups: appointment form + call ---------- */
const CALL_AFTER_MS = 2000 // call pop up appears this long after the form pop up is closed
const AUTO_OPEN_MS = 3000 // form pop up opens this long after every page load / refresh; 0 disables

function Modal({ onClose, label, children }) {
  const box = useRef(null)
  useEffect(() => {
    const prev = document.activeElement
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    box.current?.querySelector('input, button, a')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus?.()
    }
  }, [onClose])
  return (
    <div className="modal" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-label={label} ref={box}>
        <button type="button" className="modal-x" onClick={onClose} aria-label="Close"><X size={22} /></button>
        {children}
      </div>
    </div>
  )
}

function CallPopup({ onBook }) {
  return (
    <div className="callpop">
      <span className="callpop-ic"><Phone size={30} aria-hidden="true" /></span>
      <span className="callpop-tag">Free Consultation</span>
      <h3>Call Advanced GroHair &amp; GloSkin, Perambur</h3>
      <p className="callpop-note">Your first consultation is free. Call us to book your appointment.</p>
      <a href={`tel:${PHONE}`} data-direct className="callpop-num">{PHONE_DISPLAY}</a>
      <div className="callpop-act">
        <a href={`tel:${PHONE}`} data-direct className="btn btn-primary"><Phone size={18} aria-hidden="true" /><span>Call Now</span></a>
        <button type="button" className="btn btn-ghost-dark" onClick={onBook}><CalendarDays size={18} aria-hidden="true" /><span>Book Online</span></button>
      </div>
    </div>
  )
}

function Popups() {
  const [modal, setModal] = useState(null) // 'form' | 'call' | null
  const fromCall = useRef(false) // form was opened from the call pop up
  const callTimer = useRef(null)
  // closing the booking form shows the free-consultation call pop up CALL_AFTER_MS later
  const close = () => {
    const showCall = modal === 'form' && !fromCall.current
    setModal(null)
    fromCall.current = false
    clearTimeout(callTimer.current)
    if (showCall) callTimer.current = setTimeout(() => setModal((m) => m || 'call'), CALL_AFTER_MS)
  }

  useEffect(() => {
    // capture phase, so booking / call links open a pop up instead of scrolling or dialling
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a')
      if (!a || a.hasAttribute('data-direct') || a.closest('.modal')) return
      const href = a.getAttribute('href') || ''
      if (href === '#book' || href === '#final-form') setModal('form')
      else if (href.startsWith('tel:')) setModal('call')
      else return
      clearTimeout(callTimer.current)
      e.preventDefault()
      e.stopImmediatePropagation()
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  useEffect(() => {
    if (!AUTO_OPEN_MS) return
    const t = setTimeout(() => setModal((m) => m || 'form'), AUTO_OPEN_MS)
    return () => clearTimeout(t)
  }, [])

  if (!modal) return null
  return (
    <Modal onClose={close} label={modal === 'form' ? 'Book your appointment' : 'Call the clinic'}>
      {modal === 'form'
        ? <LeadForm id="popup-form" heading="Book Your Appointment" button="BOOK APPOINTMENT" optionalDate={false} />
        : <CallPopup onBook={() => { fromCall.current = true; setModal('form') }} />}
    </Modal>
  )
}

/* ---------- /thankyou page ---------- */
function ThankYou() {
  useEffect(() => {
    document.title = 'Thank You | Advanced GroHair & GloSkin Perambur'
    const m = document.createElement('meta')
    m.name = 'robots'
    m.content = 'noindex'
    document.head.appendChild(m)
    window.scrollTo(0, 0)
    return () => m.remove()
  }, [])
  return (
    <main className="thanks">
      <div className="blob b1" /><div className="blob b2" />
      <div className="thanks-card">
        <a href={BASE} className="brand" aria-label="Advanced GroHair & GloSkin Perambur"><img src={logo} alt="Advanced GroHair and GloSkin" /></a>
        <CheckCircle2 className="thanks-ic" size={64} aria-hidden="true" />
        <h1>Thank You</h1>
        <p>Your request has been received. Our team will contact you shortly to schedule your consultation.</p>
        <div className="thanks-act">
          <a href={`tel:${PHONE}`} className="btn btn-primary"><Phone size={18} aria-hidden="true" /><span>Call Now</span></a>
          <a href={BASE} className="btn btn-ghost-dark"><ArrowRight size={18} aria-hidden="true" /><span>Back to Home</span></a>
        </div>
      </div>
    </main>
  )
}

export default function App() {
  const trim = (p) => p.replace(/\/+$/, '')
  const isThanks = trim(window.location.pathname) === trim(BASE + 'thankyou')
  if (isThanks) return <ThankYou />
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
        <CustomerReviews />
        <Faq />
        <Final />
      </main>
      <Footer />
      <StickyBar />
      <Popups />
    </>
  )
}
