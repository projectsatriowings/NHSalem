import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import { ProgressStepper } from '@/components/ui/Stepper'
import Input from '@/components/ui/Input'
import useCart from '@/store/cartStore'
import useToastStore from '@/store/toastStore'
import useAuthStore from '@/store/authStore'
import { placeOrder, getUserAddresses, createUserAddress } from '@/services/api'
import useRazorpay from '@/hooks/useRazorpay'
import Modal from '@/components/ui/Modal'

const CHECKOUT_STEPS = [
  { id: 'address', label: 'Delivery Address', icon: 'location_on' },
  { id: 'slot', label: 'Delivery Slot', icon: 'schedule' },
  { id: 'payment', label: 'Payment', icon: 'payment' },
  { id: 'summary', label: 'Order Summary', icon: 'receipt' },
]

// Generate available delivery dates (next 7 days starting today)
function getAvailableDates() {
  const dates = []
  const today = new Date()
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    
    const day = d.getDay() // 0 = Sunday, 6 = Saturday
    const isWeekend = day === 0 || day === 6
    const isToday = i === 0
    const isTomorrow = i === 1

    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const dateFormatted = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
    const dayFull = d.toLocaleDateString('en-US', { weekday: 'long' })
    const monthName = d.toLocaleDateString('en-US', { month: 'short' })
    const dayNumber = d.getDate()

    dates.push({
      dateObj: d,
      dateKey,
      dateFormatted,
      dayName,
      dayFull,
      monthName,
      dayNumber,
      isWeekend,
      isToday,
      isTomorrow
    })
  }
  return dates
}

// Generate delivery slots for a selected date
function getSlotsForSelectedDate(dateObj, isToday) {
  const day = dateObj.getDay()
  const isWeekend = day === 0 || day === 6 // Saturday or Sunday
  
  // Weekday: 10:00 AM – 6:00 PM (10-12, 12-2, 2-4, 4-6)
  // Weekend: 6:00 AM – 6:00 PM (6-8, 8-10, 10-12, 12-2, 2-4, 4-6)
  const startHour = isWeekend ? 6 : 10
  const endHour = 18 // 6 PM
  
  const currentHour = new Date().getHours()
  const slots = []

  const formatHour = (hour) => {
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour)
    return `${displayHour}:00 ${ampm}`
  }

  for (let h = startHour; h < endHour; h += 2) {
    const isPast = isToday && h <= currentHour
    const timeRange = `${formatHour(h)} – ${formatHour(h + 2)}`
    
    let tag = null
    if (isWeekend && h === 6) tag = '🌅 Early Catch'
    else if (isWeekend && h === 8) tag = '✨ Morning Fresh'
    
    const dateFormatted = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    
    slots.push({
      id: `${dateFormatted} | ${timeRange}`,
      dateFormatted,
      timeRange,
      startHour: h,
      endHour: h + 2,
      isPast,
      tag
    })
  }

  return slots
}

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: 'qr_code', description: 'Google Pay, PhonePe, Paytm, BHIM' },
  { id: 'card', label: 'Credit / Debit Card', icon: 'credit_card', description: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icon: 'account_balance', description: 'All major Indian banks supported' },
]

const addressSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
  line1: z.string().min(5, 'Enter a complete address'),
  city: z.string().min(2, 'Enter your city'),
  state: z.string().min(2, 'Enter your state'),
})

export default function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  const { items, subtotal, discount, total, clearCart } = useCart()
  const { addToast } = useToastStore()

  const availableDates = getAvailableDates()
  const todaySlots = getSlotsForSelectedDate(availableDates[0].dateObj, true)
  const hasSlotsToday = todaySlots.some(s => !s.isPast)
  const defaultDate = hasSlotsToday ? availableDates[0] : (availableDates[1] || availableDates[0])

  const [step, setStep] = useState('address')
  const [selectedDate, setSelectedDate] = useState(defaultDate)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0].id)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [successOrderRef, setSuccessOrderRef] = useState(null)

  // Address management state
  const [savedAddresses, setSavedAddresses] = useState([])
  const [loadingAddresses, setLoadingAddresses] = useState(true)
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [addingNewAddress, setAddingNewAddress] = useState(false)
  const [chosenAddress, setChosenAddress] = useState(null) // the address object used for the order

  const addressForm = useForm({ resolver: zodResolver(addressSchema) })

  // Fetch saved addresses on mount
  useEffect(() => {
    async function fetchAddresses() {
      try {
        const res = await getUserAddresses()
        if (res.success && res.addresses.length > 0) {
          setSavedAddresses(res.addresses)
          // Auto-select the default address
          const defaultAddr = res.addresses.find(a => a.is_default) || res.addresses[0]
          setSelectedAddressId(defaultAddr.id)
          setChosenAddress(defaultAddr)
          setAddingNewAddress(false)
        } else {
          // No saved addresses — show the new address form
          setSavedAddresses([])
          setAddingNewAddress(true)
        }
      } catch (err) {
        console.error('Failed to fetch addresses:', err)
        setAddingNewAddress(true)
      } finally {
        setLoadingAddresses(false)
      }
    }
    if (user) {
      fetchAddresses()
    }
  }, [user])

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr.id)
    setChosenAddress(addr)
    setAddingNewAddress(false)
  }

  const handleNextFromAddress = async (formData) => {
    if (addingNewAddress) {
      // Save the new address to the backend
      try {
        const res = await createUserAddress(formData)
        if (res.success) {
          setChosenAddress(res.address)
          setSavedAddresses(prev => [...prev, res.address])
          setSelectedAddressId(res.address.id)
          addToast({ message: '📍 Address saved for future orders!', type: 'success' })
        }
      } catch (err) {
        console.error('Failed to save address:', err)
        // Still proceed — use form data as the address
        setChosenAddress(formData)
      }
    }
    setStep('slot')
  }

  const handleContinueAddress = () => {
    if (addingNewAddress) {
      // Validate form, then call handleNextFromAddress with form data
      addressForm.handleSubmit(handleNextFromAddress)()
    } else if (chosenAddress) {
      // Using a saved address — go directly
      setStep('slot')
    } else {
      addToast({ message: 'Please select or add a delivery address', type: 'warning' })
    }
  }

  const handleNextFromSlot = () => {
    if (!selectedSlot) {
      addToast({ message: 'Please select a delivery slot', type: 'warning' })
      return
    }
    setStep('payment')
  }

  const handleNextFromPayment = () => {
    if (!selectedPayment) {
      addToast({ message: 'Please select a payment method', type: 'warning' })
      return
    }
    setStep('summary')
  }

  const { initiatePayment, loading: paymentLoading } = useRazorpay()

  const handlePlaceOrder = async () => {
    const orderAddress = chosenAddress || addressForm.getValues()
    const addressString = orderAddress 
      ? `${orderAddress.line1 || ''}, ${orderAddress.city || ''}, ${orderAddress.state || ''}`.trim()
      : ''

    initiatePayment({
      amount: total,
      name: user?.name,
      email: user?.email,
      phone: user?.phone || orderAddress?.phone || '',
      address: addressString,
      onSuccess: async (paymentData) => {
        setPlacingOrder(true)
        try {
          const { orderId } = await placeOrder({
            items,
            address: orderAddress,
            slot: selectedSlot,
            paymentMethod: 'razorpay',
            razorpayOrderId: paymentData.razorpayOrderId,
            razorpayPaymentId: paymentData.razorpayPaymentId,
            razorpaySignature: paymentData.razorpaySignature,
          })
          clearCart()
          sessionStorage.setItem('justCompletedOrderId', orderId)
          addToast({ message: '🎉 Order placed successfully!', type: 'success', duration: 5000 })
          setSuccessOrderRef(orderId)
        } catch (err) {
          console.error('Order placement error:', err)
          addToast({ message: 'Something went wrong while placing the order. Please contact support.', type: 'error' })
        } finally {
          setPlacingOrder(false)
        }
      },
      onFailure: (err) => {
        console.error('Razorpay payment failed:', err)
      }
    })
  }

  if (items.length === 0 && !successOrderRef) {
    navigate('/cart')
    return null
  }

  return (
    <div className="min-h-screen bg-surface-container-low py-8">
      <div className="container-max max-w-5xl">
        <h1 className="text-display-lg-mobile text-on-surface mb-8">Checkout</h1>

        {/* Stepper */}
        <div className="bg-white rounded-[20px] shadow-card p-6 mb-8">
          <ProgressStepper steps={CHECKOUT_STEPS} currentStep={step} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left panel */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* STEP 1: Address */}
              {step === 'address' && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h2 className="text-headline-sm text-on-surface">Delivery Address</h2>

                  {loadingAddresses ? (
                    <div className="bg-white rounded-[20px] shadow-card p-8 flex items-center justify-center">
                      <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                      <span className="ml-3 text-body-md text-on-surface-variant">Loading saved addresses…</span>
                    </div>
                  ) : (
                    <>
                      {/* Saved addresses list */}
                      {savedAddresses.length > 0 && (
                        <div className="space-y-3">
                          {savedAddresses.map((addr) => (
                            <label
                              key={addr.id}
                              htmlFor={`addr-${addr.id}`}
                              className={`flex items-start gap-4 bg-white rounded-[20px] shadow-card p-5 cursor-pointer border-2 transition-all ${
                                selectedAddressId === addr.id && !addingNewAddress
                                  ? 'border-primary'
                                  : 'border-transparent hover:border-outline-variant'
                              }`}
                              onClick={() => handleSelectSavedAddress(addr)}
                            >
                              <input
                                type="radio"
                                id={`addr-${addr.id}`}
                                name="address"
                                checked={selectedAddressId === addr.id && !addingNewAddress}
                                onChange={() => handleSelectSavedAddress(addr)}
                                className="mt-1 accent-primary"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-label-md font-bold text-on-surface">{addr.name}</span>
                                  <span className="px-2 py-0.5 bg-surface-container rounded-full text-label-sm text-on-surface-variant">
                                    {addr.label || 'Home'}
                                  </span>
                                  {addr.is_default && (
                                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-label-sm font-semibold">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-body-md text-on-surface-variant">{addr.line1}, {addr.city}, {addr.state} — {addr.pincode}</p>
                                <p className="text-label-sm text-on-surface-variant mt-0.5">{addr.phone}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}

                      {/* Add new address toggle */}
                      <button
                        onClick={() => { setAddingNewAddress(true); setSelectedAddressId(null); setChosenAddress(null) }}
                        className={`w-full flex items-center gap-4 bg-white rounded-[20px] p-5 border-2 border-dashed transition-all ${
                          addingNewAddress ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }} aria-hidden="true">add_location</span>
                        <span className="text-label-md font-semibold text-primary">Add New Address</span>
                      </button>

                      {/* New address form */}
                      <AnimatePresence>
                        {addingNewAddress && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="bg-white rounded-[20px] shadow-card p-6 space-y-4">
                              <Input label="Full Name" id="new-name" required {...addressForm.register('name')} error={addressForm.formState.errors.name?.message} />
                              <Input label="Mobile Number" id="new-phone" type="tel" required {...addressForm.register('phone')} error={addressForm.formState.errors.phone?.message} />
                              <Input label="Pincode" id="new-pincode" required {...addressForm.register('pincode')} error={addressForm.formState.errors.pincode?.message} />
                              <Input label="Address Line 1" id="new-line1" required {...addressForm.register('line1')} error={addressForm.formState.errors.line1?.message} />
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input label="City" id="new-city" required {...addressForm.register('city')} error={addressForm.formState.errors.city?.message} />
                                <Input label="State" id="new-state" required {...addressForm.register('state')} error={addressForm.formState.errors.state?.message} />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button variant="secondary" onClick={() => navigate('/cart')}>
                      Back
                    </Button>
                    <Button variant="primary" className="flex-1" onClick={handleContinueAddress}>
                      Continue to Delivery Slot
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Slot */}
              {step === 'slot' && (() => {
                const currentSlots = getSlotsForSelectedDate(selectedDate.dateObj, selectedDate.isToday)
                const allSlotsPassed = currentSlots.every(s => s.isPast)

                return (
                  <motion.div
                    key="slot"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-headline-sm text-on-surface mb-1">Select Delivery Date & Time</h2>
                      <p className="text-body-md text-on-surface-variant">
                        Choose your preferred delivery date and time slot. All slots include our cold-chain freshness guarantee.
                      </p>
                    </div>

                    {/* 1. Date Selector */}
                    <div>
                      <label className="text-label-md font-bold text-on-surface mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl" aria-hidden="true">calendar_month</span>
                        <span>1. Select Delivery Date</span>
                      </label>

                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                        {availableDates.map((d) => {
                          const isSelected = selectedDate.dateKey === d.dateKey
                          return (
                            <button
                              key={d.dateKey}
                              type="button"
                              onClick={() => {
                                setSelectedDate(d)
                                setSelectedSlot(null)
                              }}
                              className={`p-3 rounded-[16px] border-2 transition-all flex flex-col items-center justify-between text-center relative cursor-pointer ${
                                isSelected
                                  ? 'bg-primary text-on-primary border-primary shadow-md scale-[1.02]'
                                  : 'bg-white text-on-surface border-outline-variant hover:border-primary/60 hover:bg-surface-container-lowest'
                              }`}
                            >
                              {d.isToday ? (
                                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full mb-1 ${
                                  isSelected ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                                }`}>
                                  Today
                                </span>
                              ) : d.isWeekend ? (
                                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full mb-1 ${
                                  isSelected ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  Weekend
                                </span>
                              ) : (
                                <span className="h-4 mb-1" />
                              )}

                              <span className={`text-[11px] font-bold uppercase tracking-wider ${
                                isSelected ? 'text-on-primary/90' : 'text-on-surface-variant'
                              }`}>
                                {d.dayName}
                              </span>

                              <span className="text-xl font-black my-0.5">
                                {d.dayNumber}
                              </span>

                              <span className={`text-[11px] font-medium ${
                                isSelected ? 'text-on-primary/80' : 'text-on-surface-variant'
                              }`}>
                                {d.monthName}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* 2. Operating Hours Info Banner */}
                    <div className={`p-4 rounded-[16px] border flex items-start gap-3 transition-all ${
                      selectedDate.isWeekend
                        ? 'bg-amber-50/90 border-amber-200 text-amber-950'
                        : 'bg-blue-50/90 border-blue-200 text-blue-950'
                    }`}>
                      <span className={`material-symbols-outlined text-2xl shrink-0 mt-0.5 ${
                        selectedDate.isWeekend ? 'text-amber-700' : 'text-blue-700'
                      }`} aria-hidden="true">
                        {selectedDate.isWeekend ? 'wb_twilight' : 'storefront'}
                      </span>
                      <div className="text-sm">
                        <p className="font-bold text-[13px] sm:text-sm">
                          {selectedDate.isWeekend
                            ? `Weekend Operating Hours (${selectedDate.dayFull}): 6:00 AM – 6:00 PM`
                            : `Weekday Operating Hours (${selectedDate.dayFull}): 10:00 AM – 6:00 PM`}
                        </p>
                        <p className="text-xs opacity-90 mt-0.5 leading-relaxed">
                          {selectedDate.isWeekend
                            ? '🌅 Weekend Special! Early morning fresh catch & delivery slots available starting from 6:00 AM.'
                            : 'Standard weekday delivery operating hours with 2-hour guaranteed fresh slots.'}
                        </p>
                      </div>
                    </div>

                    {/* 3. Time Slots */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-label-md font-bold text-on-surface flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-xl" aria-hidden="true">schedule</span>
                          <span>2. Select Delivery Time for {selectedDate.dateFormatted}</span>
                        </label>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          selectedDate.isWeekend
                            ? 'text-amber-800 bg-amber-100 border border-amber-200'
                            : 'text-blue-800 bg-blue-100 border border-blue-200'
                        }`}>
                          {selectedDate.isWeekend ? '6 Weekend Slots' : '4 Weekday Slots'}
                        </span>
                      </div>

                      {allSlotsPassed ? (
                        <div className="bg-white rounded-[16px] p-6 text-center border border-outline-variant">
                          <span className="material-symbols-outlined text-slate-400 text-3xl mb-2" aria-hidden="true">event_busy</span>
                          <p className="font-semibold text-on-surface">No slots remaining for today</p>
                          <p className="text-body-sm text-on-surface-variant mt-1">
                            Operating hours for today have closed. Please choose tomorrow or another upcoming date above.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {currentSlots.map((slot) => {
                            const isSelected = selectedSlot === slot.id

                            if (slot.isPast) {
                              return (
                                <div
                                  key={slot.id}
                                  className="p-4 rounded-[16px] border border-outline-variant/50 bg-surface-container-lowest opacity-50 flex items-center justify-between cursor-not-allowed"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400 text-lg" aria-hidden="true">history</span>
                                    <div>
                                      <p className="text-xs text-on-surface-variant font-medium line-through">{slot.timeRange}</p>
                                      <span className="text-[10px] text-red-500 font-semibold uppercase">Slot Passed</span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }

                            return (
                              <button
                                key={slot.id}
                                type="button"
                                onClick={() => setSelectedSlot(slot.id)}
                                aria-pressed={isSelected}
                                className={`p-4 rounded-[16px] border-2 transition-all flex flex-col items-start justify-between text-left relative cursor-pointer ${
                                  isSelected
                                    ? 'bg-primary text-on-primary border-primary shadow-sm scale-[1.01]'
                                    : 'bg-white text-on-surface border-outline-variant hover:border-primary'
                                }`}
                              >
                                <div className="w-full flex items-center justify-between mb-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-lg" aria-hidden="true">schedule</span>
                                    <span className={`text-[11px] font-bold uppercase tracking-wider ${
                                      isSelected ? 'text-on-primary/80' : 'text-on-surface-variant'
                                    }`}>
                                      {selectedDate.dayName}
                                    </span>
                                  </div>
                                  {slot.tag && (
                                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                      isSelected ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-800'
                                    }`}>
                                      {slot.tag}
                                    </span>
                                  )}
                                </div>
                                <span className="text-label-md font-extrabold">{slot.timeRange}</span>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button variant="secondary" onClick={() => setStep('address')}>Back</Button>
                      <Button
                        variant="primary"
                        className="flex-1"
                        disabled={!selectedSlot}
                        onClick={handleNextFromSlot}
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </motion.div>
                )
              })()}

              {/* STEP 3: Payment */}
              {step === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div>
                    <h2 className="text-headline-sm text-on-surface mb-1">Select Payment Method</h2>
                    <p className="text-body-md text-on-surface-variant">
                      All online transactions are 100% secure and processed via Razorpay.
                    </p>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200/80 rounded-[16px] p-3.5 flex items-center gap-3 text-emerald-950 text-xs font-semibold">
                    <span className="material-symbols-outlined text-emerald-600 text-xl shrink-0" aria-hidden="true">verified_user</span>
                    <span>100% Encrypted & Secure Payment. Instant order confirmation with live status tracking.</span>
                  </div>

                  {PAYMENT_METHODS.map((method) => (
                    <div key={method.id}>
                      <label
                        htmlFor={`pay-${method.id}`}
                        className={`flex items-center gap-4 bg-white rounded-[20px] shadow-card p-5 cursor-pointer border-2 transition-all ${
                          selectedPayment === method.id ? 'border-primary' : 'border-transparent hover:border-outline-variant'
                        }`}
                      >
                        <input
                          type="radio"
                          id={`pay-${method.id}`}
                          name="payment"
                          value={method.id}
                          checked={selectedPayment === method.id}
                          onChange={() => setSelectedPayment(method.id)}
                          className="accent-primary"
                        />
                        <div className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-primary" style={{ fontSize: '22px' }} aria-hidden="true">{method.icon}</span>
                        </div>
                        <div>
                          <p className="text-label-md font-semibold text-on-surface">{method.label}</p>
                          <p className="text-label-sm text-on-surface-variant">{method.description}</p>
                        </div>
                      </label>
                    </div>
                  ))}
                  <div className="flex gap-3 pt-2">
                    <Button variant="secondary" onClick={() => setStep('slot')}>Back</Button>
                    <Button variant="primary" className="flex-1" onClick={handleNextFromPayment}>Review Order</Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Summary */}
              {step === 'summary' && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h2 className="text-headline-sm text-on-surface">Review Your Order</h2>

                  {/* Items */}
                  <div className="bg-white rounded-[20px] shadow-card p-5 space-y-3">
                    {items.map((item) => (
                      <div key={`${item.id}::${item.weight}`} className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-[10px] flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-label-md font-semibold text-on-surface">{item.name}</p>
                          <p className="text-label-sm text-on-surface-variant">{item.weight} × {item.quantity}</p>
                        </div>
                        <p className="text-label-md font-bold text-on-surface">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  {/* Delivery details */}
                  <div className="bg-white rounded-[20px] shadow-card p-5 space-y-2 text-body-md">
                    <div className="flex gap-3">
                      <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }} aria-hidden="true">location_on</span>
                      <div>
                        <p className="font-semibold text-on-surface">{chosenAddress?.name}</p>
                        <p className="text-on-surface-variant">{chosenAddress?.line1}, {chosenAddress?.city} {chosenAddress?.pincode}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }} aria-hidden="true">schedule</span>
                      <p className="text-on-surface">{selectedSlot}</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }} aria-hidden="true">payment</span>
                      <p className="text-on-surface">{PAYMENT_METHODS.find((m) => m.id === selectedPayment)?.label}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => setStep('payment')}>Back</Button>
                    <Button
                      variant="primary"
                      size="lg"
                      className="flex-1"
                      loading={placingOrder || paymentLoading}
                      onClick={handlePlaceOrder}
                    >
                      Place Order — ₹{total.toLocaleString()}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sticky order summary */}
          <div>
            <div className="sticky top-24 bg-white rounded-[20px] shadow-card p-5">
              <h2 className="text-label-md font-semibold text-on-surface mb-4">Order Summary</h2>
              <div className="space-y-3 text-body-md border-b border-outline-variant pb-4 mb-4">
                {items.map((item) => (
                  <div key={`${item.id}::${item.weight}`} className="flex justify-between">
                    <span className="text-on-surface-variant truncate flex-1 pr-2">{item.name} × {item.quantity}</span>
                    <span className="font-semibold text-on-surface flex-shrink-0">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-body-md">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Delivery</span>
                  <span className="text-success font-semibold">FREE</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Discount</span>
                    <span className="font-semibold">-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-outline-variant pt-3 flex justify-between">
                  <span className="font-bold text-on-surface">Total</span>
                  <span className="font-black text-headline-sm text-on-surface">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Important Guidelines */}
            <div className="mt-4 bg-surface-container-low rounded-[20px] p-5 border border-outline-variant/50">
              <h3 className="text-label-md font-semibold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary" style={{ fontSize: '20px' }}>info</span>
                Important Information
              </h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-green-600 mt-0.5" style={{ fontSize: '18px' }}>moped</span>
                  <div>
                    <p className="text-label-sm font-bold text-on-surface">Delivery Within 8 KM</p>
                    <p className="text-body-sm text-on-surface-variant leading-tight">Maximum delivery range is 8 KM. Applicable delivery charges will apply.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-orange-600 mt-0.5" style={{ fontSize: '18px' }}>storefront</span>
                  <div>
                    <p className="text-label-sm font-bold text-on-surface">Market Price Applies</p>
                    <p className="text-body-sm text-on-surface-variant leading-tight">Price depends on the daily market price.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={!!successOrderRef}
        onClose={() => {
          navigate('/my-orders')
        }}
        title={null}
        id="order-success-modal"
        size="sm"
        showClose={false}
      >
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
            <span className="material-symbols-outlined text-green-600 text-3xl font-black animate-pulse">
              check_circle
            </span>
          </div>
          <h2 className="text-xl font-bold text-on-surface mb-2 font-serif">
            Order Placed Successfully!
          </h2>
          <p className="text-on-surface-variant text-sm mb-6 font-medium">
            Your order has been received and is being prepared.
          </p>
          
          {/* Order ID - copyable */}
          <div className="bg-surface-container-low rounded-2xl px-4 py-3 flex items-center justify-between mb-6 border border-outline-variant/30">
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mb-0.5">Your Order ID</p>
              <p className="font-mono font-black text-lg text-primary">{successOrderRef}</p>
            </div>
            <button
              onClick={() => {
                if (successOrderRef) {
                  navigator.clipboard.writeText(successOrderRef)
                  addToast({ message: '📋 Order ID copied!', type: 'success' })
                }
              }}
              className="text-primary hover:bg-primary/5 p-2 rounded-full transition-colors flex items-center"
              title="Copy Order ID"
            >
              <span className="material-symbols-outlined text-[20px]">content_copy</span>
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/orders/${successOrderRef}`)}
              className="flex-1 bg-primary hover:bg-primary/95 text-white py-3 rounded-full font-bold text-sm shadow-sm transition-all cursor-pointer"
            >
              Track Order
            </button>
            <button
              onClick={() => navigate('/my-orders')}
              className="flex-1 border border-outline-variant hover:bg-surface-container-low text-on-surface py-3 rounded-full font-bold text-sm transition-all cursor-pointer"
            >
              My Orders
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
