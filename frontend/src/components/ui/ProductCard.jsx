import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from './Button'
import Badge from './Badge'
import useCartStore from '@/store/cartStore'
import { getImageUrl } from '@/services/api'
import useWishlistStore from '@/store/wishlistStore'
import useAuthStore from '@/store/authStore'
import useToastStore from '@/store/toastStore'

/**
 * ProductCard — Level 1 card with:
 * - Image rounded on top only
 * - Badge (fresh/hot/new/premium)
 * - Weight chips that update price
 * - Add to Cart → morphs into quantity stepper
 * - Wishlist toggle
 */
export default function ProductCard({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(0)
  const { addItem, getItem, updateQuantity, removeItem } = useCartStore()
  const { toggle: toggleWishlist, isWishlisted } = useWishlistStore()
  const { addToast } = useToastStore()

  const {
    id,
    name,
    tagline,
    image,

    weights = [],
    variants = [],
    rating,
    reviewCount,
    unit,
    catchTime,
    categoryThumbnail,
  } = product

  const finalVariants = (variants && variants.length > 0)
    ? variants
    : ((weights && weights.length > 0)
      ? weights
      : [])

  const currentVariant = finalVariants[selectedVariant] || finalVariants[0] || { label: unit || '500g', mrp: 0, onlinePrice: 0 }
  const cartItem = getItem(id, currentVariant.label)
  const wishlisted = isWishlisted(id)

  const handleWishlistToggle = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    const { user, setCartLoginPopupOpen, setPendingAction } = useAuthStore.getState()
    if (!user) {
      setPendingAction({
        type: 'TOGGLE_WISHLIST',
        payload: { id, name }
      })
      setCartLoginPopupOpen(true)
      return
    }
    toggleWishlist(id)
  }

  const handleAdd = () => {
    const { user, setCartLoginPopupOpen, setPendingAction } = useAuthStore.getState()
    if (!user) {
      setPendingAction({
        type: 'ADD_TO_CART',
        payload: {
          id,
          name,
          image: image || categoryThumbnail,
          weight: currentVariant.label,
          price: currentVariant.onlinePrice,
          quantity: 1,
        }
      })
      setCartLoginPopupOpen(true)
      return
    }
    addItem({
      id,
      name,
      image: image || categoryThumbnail,
      weight: currentVariant.label,
      price: currentVariant.onlinePrice,
      quantity: 1,
    })
    addToast({ message: `${name} added to cart!`, type: 'success' })
  }

  const handleIncrease = () => updateQuantity(id, currentVariant.label, cartItem.quantity + 1)
  const handleDecrease = () => {
    if (cartItem.quantity <= 1) removeItem(id, currentVariant.label)
    else updateQuantity(id, currentVariant.label, cartItem.quantity - 1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-100 hover:border-slate-200 overflow-hidden group flex flex-col transition-all"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] w-full bg-slate-50">
        <Link to={`/product/${id}`} aria-label={`View ${name}`}>
          <img
            src={getImageUrl(image) || categoryThumbnail}
            alt={name}
            className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105 p-2"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-90" />
        </Link>

        {/* Wishlist */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleWishlistToggle}
          aria-label={wishlisted ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.25)] backdrop-blur-[10px] border border-[rgba(255,255,255,0.25)] shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-10"
        >
          <span
            className={`material-symbols-outlined ${wishlisted ? 'filled text-white' : 'text-white'} transition-all [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]`}
            style={{ fontSize: '18px' }}
            aria-hidden="true"
          >
            favorite
          </span>
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 flex-1">
        {/* Title & Subtitle */}
        <div>
          <Link to={`/product/${id}`}>
            <h3 className="text-sm sm:text-[16px] font-bold text-slate-900 tracking-tight line-clamp-1 hover:text-amber-600 transition-colors">
              {name}
            </h3>
          </Link>
          {tagline && (
            <p className="text-[11px] sm:text-[13px] text-slate-500 mt-0.5 line-clamp-1 font-medium">{tagline}</p>
          )}
        </div>

        {/* Weight/Quantity Selector */}
        {finalVariants.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide py-0.5 flex-nowrap mt-0.5">
            {finalVariants.map((v, i) => (
              <button
                key={v.label}
                onClick={() => setSelectedVariant(i)}
                aria-pressed={selectedVariant === i}
                className={`px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all flex-shrink-0 ${selectedVariant === i
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                  }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}

        {/* Spacer to push price and CTA to bottom */}
        <div className="flex-1" />

        {/* Price & CTA Block */}
        <div className="pt-1.5 sm:pt-2 border-t border-slate-100 mt-auto">
          <div className="flex items-baseline gap-1.5 mb-1.5 sm:mb-2 flex-wrap">
            <p className="text-base sm:text-lg font-black text-slate-900">
              ₹{currentVariant.onlinePrice?.toLocaleString()}
            </p>
            {currentVariant.mrp && currentVariant.mrp > currentVariant.onlinePrice && (
              <div className="flex items-center gap-1">
                <p className="text-[11px] sm:text-xs text-slate-400 line-through font-medium">
                  ₹{currentVariant.mrp.toLocaleString()}
                </p>
                <span className="text-[9px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1 sm:px-1.5 py-0.5 rounded">
                  {Math.round(((currentVariant.mrp - currentVariant.onlinePrice) / currentVariant.mrp) * 100)}% OFF
                </span>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!cartItem ? (
              <motion.button
                key="add"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.15 }}
                onClick={handleAdd}
                className="w-full flex items-center justify-center gap-1.5 bg-[#0a192f] text-white px-3 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold hover:bg-slate-800 active:scale-[0.98] transition-all shadow-sm cursor-pointer select-none"
                aria-label={`Add ${name} to cart`}
              >
                <span className="material-symbols-outlined text-[16px] sm:text-[18px]" aria-hidden="true">
                  shopping_cart
                </span>
                <span>Add to Cart</span>
              </motion.button>
            ) : (
              <motion.div
                key="stepper"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.15 }}
                className="w-full h-8 sm:h-9 flex items-center justify-between bg-[#0a192f] rounded-xl overflow-hidden p-0.5 sm:p-1 shadow-inner"
              >
                <button
                  onClick={handleDecrease}
                  aria-label="Decrease quantity"
                  className="w-8 sm:w-9 h-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px]" aria-hidden="true">
                    remove
                  </span>
                </button>
                <span className="px-1 text-center text-white text-xs sm:text-sm font-bold">
                  {cartItem.quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  aria-label="Increase quantity"
                  className="w-8 sm:w-9 h-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px]" aria-hidden="true">
                    add
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}