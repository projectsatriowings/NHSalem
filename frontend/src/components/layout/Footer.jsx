import { Link, useNavigate, useLocation } from 'react-router-dom'

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/#about' },
  { label: 'Store Locator', to: '/stores' },
  { label: 'Wholesale / B2B', to: '/bulk-orders' },
  { label: 'Special Offers', to: '/category/combos' },
]

const CATEGORY_LINKS = [
  { label: 'Fish', to: '/category/fish' },
  { label: 'Prawns & Shrimp', to: '/category/prawns-shrimp' },
  { label: 'Crabs', to: '/category/crabs' },
  { label: 'Lobster', to: '/category/lobster' },
  { label: 'Dried Fish', to: '/category/dried-fish' },
  { label: 'Combos', to: '/category/combos' },
]

const SUPPORT_LINKS = [
  { label: 'Help Center & FAQ', to: '/help' },
  { label: 'Track Your Order', to: '/track-order' },
  { label: 'Contact Us', to: '/#contact' },
]

export default function Footer() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLinkClick = (e, to) => {
    if (to.startsWith('/#')) {
      e.preventDefault()
      const sectionId = to.split('#')[1]
      if (location.pathname === '/') {
        const el = document.getElementById(sectionId)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      } else {
        navigate('/')
        setTimeout(() => {
          const el = document.getElementById(sectionId)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 150)
      }
    } else if (to === '/') {
      if (location.pathname === '/') {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  return (
    <footer
      className="relative w-full bg-[#000516] text-white shrink-0 overflow-hidden select-none border-t border-slate-800"
      aria-label="Site footer"
    >
      {/* ── Main Compact Footer Grid ─────────────────────────────────────── */}
      <div className="relative container-max pt-8 md:pt-10 pb-6 md:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 2xl:gap-16 items-start">
          
          {/* ── Left Column: Dominant Brand & Compliance Hub (6 of 12 cols) ── */}
          <div className="lg:col-span-6 xl:col-span-6 2xl:col-span-6 flex flex-col gap-4 text-left">
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 p-1 flex items-center justify-center shrink-0">
                <img
                  src="/crest.png"
                  alt="NH Salem Sea Foods Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-none">
                    NH Salem
                  </span>
                  <span className="text-[10px] font-extrabold text-[#fed255] uppercase tracking-wider px-2 py-0.5 rounded bg-[#fed255]/15 border border-[#fed255]/30">
                    Sea Foods
                  </span>
                </div>
                <p className="text-[11px] text-[#fed255] font-semibold tracking-wide mt-1 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  Premium Coastal Catch & Cold-Chain Delivery
                </p>
              </div>
            </div>

            {/* Brand Mission Tagline */}
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              Premium seafood sourced fresh from ocean waters, hygienically processed in coastal facilities, and cold-chain delivered to your doorstep.
            </p>

            {/* Direct Contact & Location Info Card (Clean & Compact) */}
            <div className="flex flex-col gap-2.5 text-xs text-slate-300 bg-white/[0.03] border border-white/10 p-4 rounded-2xl shadow-inner">
              {/* Phone & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Phone */}
                <a
                  href="tel:+919500829167"
                  className="flex items-center gap-2.5 group hover:text-white transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#fed255]/10 border border-[#fed255]/25 flex items-center justify-center text-[#fed255] shrink-0 group-hover:bg-[#fed255] group-hover:text-[#000516] transition-all">
                    <span className="material-symbols-outlined text-sm">call</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold leading-none mb-0.5">Hotline</span>
                    <span className="font-bold text-white group-hover:text-[#fed255] transition-colors leading-tight truncate">+91 95008 29167</span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:carenhsalem@gmail.com"
                  className="flex items-center gap-2.5 group hover:text-white transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#fed255]/10 border border-[#fed255]/25 flex items-center justify-center text-[#fed255] shrink-0 group-hover:bg-[#fed255] group-hover:text-[#000516] transition-all">
                    <span className="material-symbols-outlined text-sm">mail</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold leading-none mb-0.5">Email</span>
                    <span className="font-bold text-white group-hover:text-[#fed255] transition-colors leading-tight truncate">carenhsalem@gmail.com</span>
                  </div>
                </a>
              </div>

              {/* Registered Office */}
              <a
                href="https://maps.app.goo.gl/whSWam4pfC6ecYC39?g_st=iw"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 group hover:text-white transition-colors pt-2.5 border-t border-white/5"
              >
                <div className="w-7 h-7 rounded-lg bg-[#fed255]/10 border border-[#fed255]/25 flex items-center justify-center text-[#fed255] shrink-0 mt-0.5 group-hover:bg-[#fed255] group-hover:text-[#000516] transition-all">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                </div>
                <div className="leading-tight flex-1">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold block mb-0.5">Registered Office</span>
                  <span className="text-slate-200 group-hover:text-[#fed255] transition-colors leading-relaxed">
                    No. 4/174/F, Cheran Nagar, Kondappanaickenpatti, Salem – 636008
                  </span>
                </div>
              </a>

              {/* Marketed & Processed Lines */}
              <div className="pt-2.5 border-t border-white/5 flex flex-col gap-1 text-[11px] text-slate-400 leading-snug">
                <p>
                  <span className="text-slate-300 font-semibold">Marketed & Distributed by:</span>{' '}
                  <span className="text-slate-200">NH Salem Seafoods and Snacks</span>
                </p>
                <p>
                  <span className="text-slate-300 font-semibold">Processed & Packed by:</span>{' '}
                  <span className="text-slate-200">Mahiban Foods, No. 11/514, Sahaya Matha Pattanam, Thoothukudi – 628002</span>
                </p>
              </div>
            </div>

            {/* ── Compact FSSAI & GST Certification Badges ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* FSSAI Badge */}
              <div className="flex items-center gap-2.5 py-2 px-3.5 rounded-xl bg-white/[0.03] border border-emerald-500/30 shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <span className="material-symbols-outlined text-base">verified</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-black tracking-wider text-emerald-400 uppercase leading-none">
                      FSSAI Certified
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-[11px] font-bold text-white tracking-tight mt-0.5 truncate leading-tight">
                    Lic: 22426188000206
                  </p>
                </div>
              </div>

              {/* GST Badge */}
              <div className="flex items-center gap-2.5 py-2 px-3.5 rounded-xl bg-white/[0.03] border border-[#fed255]/30 shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-[#fed255]/15 border border-[#fed255]/30 flex items-center justify-center text-[#fed255] shrink-0">
                  <span className="material-symbols-outlined text-base">receipt_long</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-black tracking-wider text-[#fed255] uppercase leading-none">
                      GST Registered
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fed255]" />
                  </div>
                  <p className="text-[11px] font-bold text-white tracking-tight mt-0.5 truncate leading-tight">
                    33CKVPN4290M1Z3
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* ── Right Columns: Navigation & Categories (6 of 12 cols) ────────── */}
          <div className="lg:col-span-6 xl:col-span-6 2xl:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-8 xl:gap-12 2xl:gap-14 text-left">
            
            {/* Column 1: Quick Links */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-white/10">
                <span className="w-1.5 h-3.5 rounded-full bg-[#fed255]" />
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                  Quick Links
                </h3>
              </div>
              <ul className="space-y-2.5">
                {QUICK_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      onClick={(e) => handleLinkClick(e, link.to)}
                      className="text-xs text-slate-300 hover:text-[#fed255] transition-all flex items-center gap-1.5 group font-medium leading-tight py-0.5"
                    >
                      <span className="text-[9px] text-slate-500 group-hover:text-[#fed255] group-hover:translate-x-0.5 transition-all">›</span>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Seafood Categories */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-white/10">
                <span className="w-1.5 h-3.5 rounded-full bg-[#fed255]" />
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                  Categories
                </h3>
              </div>
              <ul className="space-y-2.5">
                {CATEGORY_LINKS.map((cat) => (
                  <li key={cat.label}>
                    <Link
                      to={cat.to}
                      onClick={(e) => handleLinkClick(e, cat.to)}
                      className="text-xs text-slate-300 hover:text-[#fed255] transition-all flex items-center gap-1.5 group font-medium leading-tight py-0.5"
                    >
                      <span className="text-[9px] text-slate-500 group-hover:text-[#fed255] group-hover:translate-x-0.5 transition-all">›</span>
                      <span>{cat.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Customer Care */}
            <div className="col-span-2 sm:col-span-1 flex flex-col">
              <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-white/10">
                <span className="w-1.5 h-3.5 rounded-full bg-[#10b981]" />
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                  Support
                </h3>
              </div>
              <ul className="space-y-2.5">
                {SUPPORT_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      onClick={(e) => handleLinkClick(e, link.to)}
                      className="text-xs text-slate-300 hover:text-[#10b981] transition-all flex items-center gap-1.5 group font-medium leading-tight py-0.5"
                    >
                      <span className="text-[9px] text-slate-500 group-hover:text-[#10b981] group-hover:translate-x-0.5 transition-all">›</span>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      </div>

      {/* ── Compact Bottom Legal & Social Bar ───────────────────────────── */}
      <div className="relative border-t border-slate-800/80 bg-[#00030d]">
        <div className="container-max py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Copyright & Tag */}
          <div className="flex items-center gap-3 text-center sm:text-left">
            <p className="text-xs text-slate-400 font-medium">
              © {new Date().getFullYear()} <span className="text-slate-200 font-semibold">NH Salem Sea Foods</span>. All rights reserved.
            </p>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span className="hidden md:flex text-[11px] text-slate-400 items-center gap-1.5">
              <span className="material-symbols-outlined text-[#fed255] text-xs">verified</span>
              Hygienic Coastal Processing • Cold-Chain Guaranteed
            </span>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-1.5">
            {[
              {
                id: 'instagram',
                label: 'Instagram',
                href: 'https://www.instagram.com/nh_salem_official?igsh=OWgxbWczdGpqcWIz&igsi=OWgxbWczdGpqcWIz&utm_source=qr',
                color: 'hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent',
              },
              {
                id: 'location',
                icon: 'location_on',
                label: 'Google Maps Location',
                href: 'https://maps.app.goo.gl/whSWam4pfC6ecYC39?g_st=iw',
                color: 'hover:bg-[#fed255] hover:text-[#000516] hover:border-[#fed255]',
              },
              {
                id: 'whatsapp',
                label: 'WhatsApp',
                href: 'https://wa.me/919500829167',
                color: 'hover:bg-[#10b981] hover:border-[#10b981]',
              },
            ].map((social) => (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit our ${social.label}`}
                className={`w-7 h-7 rounded-lg bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm shrink-0 hover:scale-105 ${social.color}`}
              >
                {social.id === 'instagram' ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                ) : social.id === 'whatsapp' ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.92 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.55 3.7-8.25 8.26-8.25a8.2 8.2 0 0 1 5.84 2.42 8.19 8.19 0 0 1 2.42 5.84c0 4.55-3.71 8.23-8.27 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.24-.64.8-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.24-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.42-.14-.01-.31-.01-.47-.01a.9.9 0 0 0-.65.3c-.23.24-.85.83-.85 2.03s.87 2.36.99 2.52c.12.17 1.71 2.6 4.14 3.65.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.1-.22-.16-.47-.28Z" />
                  </svg>
                ) : (
                  <span className="material-symbols-outlined text-[15px] leading-none" aria-hidden="true">
                    {social.icon}
                  </span>
                )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    )
  }