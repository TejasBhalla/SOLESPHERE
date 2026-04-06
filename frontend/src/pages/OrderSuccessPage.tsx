import { useEffect, useMemo, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { useUserStore } from '@/store/userStore'

const OrderSuccessPage = () => {
  const { confirmordersuccess, isLoading, error } = useUserStore() as any
  const location = useLocation()
  const hasConfirmedRef = useRef(false)

  const sessionId = useMemo(() => {
    const query = new URLSearchParams(location.search)
    return query.get('session_id')
  }, [location.search])

  useEffect(() => {
    if (!sessionId || hasConfirmedRef.current) {
      return
    }

    hasConfirmedRef.current = true
    confirmordersuccess(sessionId)
  }, [confirmordersuccess, sessionId])

  return (
    <div className="min-h-screen bg-[#fcfbf7] px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm">
        <CheckCircle2 className="mx-auto mb-5 text-green-600" size={56} />
        <h1 className="font-[Montserrat] text-3xl font-bold text-slate-900">Payment Successful</h1>
        <p className="mt-3 text-gray-600">
          {isLoading ? 'Finalizing your order...' : 'Your payment has been confirmed and your order has been placed.'}
        </p>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition-colors hover:bg-[#c2b090]"
          >
            Continue Shopping
          </Link>
          <Link
            to="/cart"
            className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-slate-700 transition-colors hover:bg-gray-50"
          >
            View Cart
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccessPage
