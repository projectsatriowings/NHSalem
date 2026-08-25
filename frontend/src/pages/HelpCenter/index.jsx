import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Accordion from '@/components/ui/Accordion'

const CATEGORIES = [
  { id: 'all', label: 'All Topics', icon: 'apps' },
  { id: 'delivery', label: 'Delivery & Orders', icon: 'local_shipping' },
  { id: 'quality', label: 'Quality & Packing', icon: 'verified' },
  { id: 'payments', label: 'Payments & Pricing', icon: 'payments' },
  { id: 'store', label: 'Store & Pickups', icon: 'storefront' },
]

const ALL_FAQS = [
  {
    id: 'faq-1',
    category: 'quality',
    title: 'How is the seafood packed and kept cold?',
    content: 'Our seafood is flash-frozen at -18°C using an advanced IQF (Individually Quick Frozen) process. Each piece is cleaned with purified brine to preserve its natural texture, moisture, and sea freshness without any chemical preservatives or artificial glazing.',
  },
  {
    id: 'faq-2',
    category: 'delivery',
    title: 'What is the delivery radius and delivery time in Salem?',
    content: 'We offer doorstep cold-chain delivery within an 8km radius from our Salem store. Orders placed during morning slots are delivered fresh within 60–90 minutes in temperature-monitored insulated bags.',
  },
  {
    id: 'faq-3',
    category: 'delivery',
    title: 'How do I track my order live?',
    content: (
      <span>
        You can track the live status of your catch preparation and dispatch at any time using our <Link to="/track-order" className="text-primary hover:underline font-bold">Track Order</Link> page with your Order ID.
      </span>
    ),
  },
  {
    id: 'faq-4',
    category: 'quality',
    title: 'What is your refund or replacement policy?',
    content: 'Because we deal in fresh, perishable seafood, cancellations are accepted before preparation begins. If you ever find any issue with cut quality, freshness, or weight upon delivery, contact our WhatsApp hotline (+91 95008 29167) immediately with a photo for instant replacement or refund.',
  },
  {
    id: 'faq-5',
    category: 'payments',
    title: 'How is daily market pricing calculated?',
    content: 'Seafood prices fluctuate naturally based on daily coastal landing rates, sea tides, and catch availability. Our catalog is updated daily so you always pay transparent, fair, dock-direct prices with zero hidden markups.',
  },
  {
    id: 'faq-6',
    category: 'payments',
    title: 'Which payment methods do you accept?',
    content: 'We accept all major UPI apps (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit cards (Visa, Mastercard, RuPay), Net Banking, and Cash on Delivery for eligible local orders.',
  },
  {
    id: 'faq-7',
    category: 'store',
    title: 'Can I visit the store for live custom cuts?',
    content: 'Yes! Our Salem flagship store at Cheran Nagar, Kondappanaickenpatti is open 7 days a week. You can hand-select whole fish and have our master butchers clean, descale, and cut into steaks, fillets, or curry pieces to your preference.',
  },
]

export default function HelpCenter() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFaqs = ALL_FAQS.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    const matchesSearch = !searchQuery.trim() || 
      faq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof faq.content === 'string' && faq.content.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Hero Section with Search */}
      <section className="py-14 sm:py-20 md:py-24 bg-[#000516] text-white" aria-labelledby="help-heading">
        <div className="container-max text-center max-w-4xl mx-auto">
          <p className="text-[#fed255] font-bold tracking-widest uppercase text-xs sm:text-sm mb-3">
            24/7 Customer Care & Support
          </p>
          <h1 id="help-heading" className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            How Can We Help You Today?
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Search our knowledge base for questions on freshness, custom cuts, deliveries, or reach out to our dedicated seafood team.
          </p>

          {/* Interactive Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-2xl">
              search
            </span>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g. delivery, packaging, refund, custom cut)..."
              className="w-full pl-12 pr-10 py-3.5 sm:py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#fed255] focus:bg-white/15 transition-all text-sm sm:text-base backdrop-blur-md"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Layout Grid */}
      <div className="container-max py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 2xl:gap-12 items-start w-full max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1720px] mx-auto">
          
          {/* Main Column: Topics Filter & Accordion FAQs (8 cols on lg+) */}
          <div className="lg:col-span-8">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-3 mb-8 no-scrollbar">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 shadow-sm ${
                      isActive 
                        ? 'bg-[#000516] text-[#fed255] shadow-md ring-2 ring-[#fed255]/20' 
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-base ${isActive ? 'text-[#fed255]' : 'text-slate-500'}`}>
                      {cat.icon}
                    </span>
                    {cat.label}
                  </button>
                )
              })}
            </div>

            {/* Header with Result Count */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
              <h2 className="text-2xl sm:text-3xl font-black text-[#000516] tracking-tight">
                Frequently Asked Questions
              </h2>
              <span className="text-xs text-slate-500 font-bold bg-slate-200/60 px-3 py-1 rounded-full">
                {filteredFaqs.length} {filteredFaqs.length === 1 ? 'Topic' : 'Topics'}
              </span>
            </div>

            {/* Accordion Component */}
            {filteredFaqs.length > 0 ? (
              <Accordion items={filteredFaqs} allowMultiple={false} defaultOpen="faq-1" />
            ) : (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-sm">
                <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">sentiment_dissatisfied</span>
                <h3 className="text-base font-bold text-slate-800 mb-1">No matching answers found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  We couldn't find an answer for "{searchQuery}". Reach out to our team directly below.
                </p>
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                  className="text-xs font-bold text-[#000516] hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            )}

            {/* Quality & Trust Banner below FAQs */}
            <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#000516] to-[#0b1e3d] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#fed255]/15 border border-[#fed255]/30 flex items-center justify-center shrink-0 text-[#fed255]">
                  <span className="material-symbols-outlined text-3xl">verified_user</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base sm:text-lg mb-1">
                    100% Ocean Freshness Guarantee
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md">
                    Zero chemical preservatives. Sourced daily from Tamil Nadu docks, packed with chilled brine protection.
                  </p>
                </div>
              </div>
              <Link 
                to="/quality" 
                className="shrink-0 px-5 py-3 rounded-xl bg-[#fed255] hover:bg-[#ecc246] text-[#000516] font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98]"
              >
                Our Quality Standards →
              </Link>
            </div>
          </div>

          {/* Sidebar Column: Direct Support Channels (4 cols on lg+) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            <div className="bg-white rounded-[28px] shadow-xl border border-slate-100 p-7 sm:p-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">Live Assistance</span>
              </div>
              <h2 className="text-2xl font-black text-[#000516] mb-2 tracking-tight">
                Need Immediate Help?
              </h2>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Our support team is available daily from 6:00 AM to 6:00 PM for custom cut requests, bulk orders, and live delivery updates.
              </p>
              
              <div className="space-y-3.5">
                {/* WhatsApp Chat Card */}
                <a
                  href="https://wa.me/919500829167?text=Hi,%20I%20need%20help%20with%20my%20NH%20Salem%20Sea%20Foods%20order"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl hover:border-emerald-400 hover:bg-emerald-100/70 transition-all group shadow-sm"
                >
                  <div className="w-11 h-11 bg-[#25D366] text-white rounded-xl flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-2xl">chat</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-0.5">Instant WhatsApp</p>
                    <p className="text-slate-900 font-bold text-sm group-hover:text-emerald-900 transition-colors">Chat with Seafood Team</p>
                    <span className="text-[10px] text-emerald-700 font-medium">Avg reply: &lt; 5 mins</span>
                  </div>
                </a>

                {/* Call Card */}
                <a
                  href="tel:+919500829167"
                  className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl hover:border-blue-500 hover:bg-blue-50/70 transition-all group shadow-sm"
                >
                  <div className="w-11 h-11 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-200 transition-colors">
                    <span className="material-symbols-outlined text-2xl">call</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Phone Hotline</p>
                    <p className="text-slate-800 font-bold text-sm group-hover:text-blue-700 transition-colors">+91 95008 29167</p>
                    <span className="text-[10px] text-slate-500 font-medium">Toll-free customer care</span>
                  </div>
                </a>

                {/* Email Card */}
                <a
                  href="mailto:carenhsalem@gmail.com"
                  className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl hover:border-amber-500 hover:bg-amber-50/70 transition-all group shadow-sm"
                >
                  <div className="w-11 h-11 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-amber-200 transition-colors">
                    <span className="material-symbols-outlined text-2xl">mail</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Email Support</p>
                    <p className="text-slate-800 font-bold text-sm group-hover:text-amber-700 transition-colors truncate">carenhsalem@gmail.com</p>
                    <span className="text-[10px] text-slate-500 font-medium">24 hour response SLA</span>
                  </div>
                </a>
              </div>

              {/* Store Visit Action */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <Link
                  to="/stores"
                  className="w-full bg-[#000516] hover:bg-[#0b1e3d] text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex justify-center items-center gap-2 active:scale-[0.98] text-xs sm:text-sm"
                >
                  <span className="material-symbols-outlined text-base">location_on</span>
                  Visit Salem Store Location
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

