import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'

export default function StoreLocator() {
  const storeAddress = "4/174/F, Cheran Nagar / Kavery Nagar, Kondappanaickenpatti, Salem – 636008, Tamil Nadu"
  const mapQuery = "NH Salem Sea Foods, 4/174/F, Cheran Nagar, Kondappanaickenpatti, Salem"
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(storeAddress)}`

  return (
    <div className="bg-slate-50 min-h-screen pt-10 md:pt-14 pb-20 md:pb-28">
      <div className="container-max">
        
        {/* Page Header */}
        <div className="text-center mb-10 md:mb-14">
          <p className="text-[#fed255] font-bold tracking-widest uppercase text-xs sm:text-sm mb-2.5">
            Our Retail & Distribution Flagship
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#000516] tracking-tight mb-3.5">
            Visit Our Salem Store
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl 2xl:max-w-3xl mx-auto leading-relaxed">
            Drop by our flagship Salem hub to experience ocean-fresh coastal catches, live custom cutting, and cold-chain guaranteed delivery.
          </p>
        </div>

        {/* Fluid 12-Column Main Hub Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 2xl:gap-12 items-stretch w-full max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1720px] mx-auto mb-12">
          
          {/* Left Column: Store Details Card (5 cols on lg+) */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 bg-white rounded-[28px] p-7 sm:p-9 xl:p-10 shadow-xl border border-slate-100 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#000516] tracking-tight">
                    NH Salem Sea Foods
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Salem Flagship Experience Center
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Open Today
                </span>
              </div>

              {/* Info Items Stack */}
              <div className="space-y-5 mb-8">
                {/* Address */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/80 flex items-center justify-center shrink-0 text-blue-600 mt-0.5">
                    <span className="material-symbols-outlined text-lg">location_on</span>
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Store Address
                    </h3>
                    <p className="text-slate-700 text-sm leading-relaxed font-medium">
                      {storeAddress}
                    </p>
                  </div>
                </div>

                {/* Contact: Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100/80 flex items-center justify-center shrink-0 text-emerald-600 mt-0.5">
                      <span className="material-symbols-outlined text-lg">call</span>
                    </div>
                    <div>
                      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Hotline
                      </h3>
                      <a href="tel:+919500829167" className="text-slate-800 text-sm font-bold hover:text-[#000516] hover:underline transition-colors block">
                        +91 95008 29167
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100/80 flex items-center justify-center shrink-0 text-amber-600 mt-0.5">
                      <span className="material-symbols-outlined text-lg">mail</span>
                    </div>
                    <div>
                      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Email Support
                      </h3>
                      <a href="mailto:carenhsalem@gmail.com" className="text-slate-800 text-sm font-semibold hover:text-[#000516] hover:underline transition-colors block truncate max-w-[180px]">
                        carenhsalem@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100/80 flex items-center justify-center shrink-0 text-purple-600 mt-0.5">
                    <span className="material-symbols-outlined text-lg">schedule</span>
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Business Hours
                    </h3>
                    <div className="text-slate-700 text-sm font-medium space-y-0.5">
                      <p><span className="text-slate-900 font-semibold">Mon – Fri:</span> 10:00 AM – 6:00 PM</p>
                      <p><span className="text-slate-900 font-semibold">Sat – Sun:</span> 6:00 AM – 6:00 PM (Morning Fresh Catch)</p>
                    </div>
                  </div>
                </div>

                {/* Delivery Notice Chip */}
                <div className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200/70 flex items-center gap-3">
                  <span className="material-symbols-outlined text-teal-700 text-2xl shrink-0">moped</span>
                  <p className="text-teal-900 text-xs font-semibold leading-snug">
                    Instant delivery within <span className="font-bold underline">8km radius</span> across Salem.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-100">
              <a href={directionsUrl} target="_blank" rel="noreferrer" className="w-full sm:flex-1">
                <button 
                  type="button" 
                  className="w-full bg-[#000516] hover:bg-[#0b1e3d] text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex justify-center items-center gap-2 active:scale-[0.98] text-sm"
                >
                  <span className="material-symbols-outlined text-lg">directions</span>
                  Get Directions
                </button>
              </a>
              <a 
                href="https://wa.me/919500829167?text=Hi,%20I%20would%20like%20to%20know%20the%20store%20location%20and%20today's%20fresh%20catch" 
                target="_blank" 
                rel="noreferrer"
                className="w-full sm:w-auto"
              >
                <button 
                  type="button" 
                  className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1eb954] text-white font-bold py-3.5 px-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex justify-center items-center gap-2 active:scale-[0.98] text-sm"
                >
                  <span className="material-symbols-outlined text-lg">chat</span>
                  WhatsApp
                </button>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Google Maps Interactive Canvas (7 cols on lg+) */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-7 bg-white rounded-[28px] overflow-hidden shadow-xl border border-slate-100 flex flex-col min-h-[440px] lg:min-h-[540px] xl:min-h-[580px] 2xl:min-h-[640px]"
          >
            {/* Map Title Bar */}
            <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#fed255] text-lg">map</span>
                <span className="text-xs font-bold uppercase tracking-wider">Live Satellite Map & Route</span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline font-medium">
                Salem – 636008
              </span>
            </div>

            {/* Embedded Responsive iframe */}
            <div className="relative flex-1 w-full h-full min-h-[400px]">
              <iframe 
                src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                width="100%" 
                height="100%" 
                style={{ border: 0, width: '100%', height: '100%', minHeight: '400px' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="NH Salem Sea Foods Location Map"
              />
            </div>
          </motion.div>

        </div>

        {/* 3-Column Experience Grid (utilizing wide desktop screens) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1720px] mx-auto">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 text-[#fed255]">
              <span className="material-symbols-outlined text-2xl text-amber-600">phishing</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Morning Ocean Catch</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Daily batches arrive directly from coastal dock partners in Thoothukudi & Rameswaram by 6:00 AM.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600">
              <span className="material-symbols-outlined text-2xl">content_cut</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Live Custom Cutting</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Choose your exact cut: steaks, boneless cubes, curry cuts, or whole dressed, cleaned in chilled purified water.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
              <span className="material-symbols-outlined text-2xl">store</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Quick Store Pickup</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Pre-book your order on WhatsApp or our online store and have it packed and ready for 5-minute counter pickup.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
