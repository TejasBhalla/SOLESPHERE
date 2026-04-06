import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react'
import { useUserStore } from '@/store/userStore'

const CheckoutPage = () => {
  const { cart, getcart, createordersession, isLoading, error } = useUserStore() as any

  useEffect(() => {
    getcart()
  }, [getcart])

  const subtotal =
    cart?.reduce((acc: number, item: any) => {
      const product = item?.id && typeof item.id === 'object' ? item.id : item
      return acc + (product?.price || 0) * (item?.quantity || 0)
    }, 0) || 0

  const shipping = subtotal > 5000 ? 0 : 150
  const total = subtotal + shipping

  const handlePayNow = async () => {
    const response = await createordersession()
    if (response?.success && response?.data?.sessionUrl) {
      window.location.href = response.data.sessionUrl
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfbf7] px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <Link to="/cart" className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-slate-900">
          <ArrowLeft size={16} /> Back to cart
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <h1 className="mb-6 font-[Montserrat] text-3xl font-bold text-slate-900">Order Checkout</h1>
            <div className="space-y-4">
              {(cart || []).map((item: any) => {
                const product = item?.id && typeof item.id === 'object' ? item.id : item
                const key = product?._id || item?._id || item?.id
                return (
                  <div key={key} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-[#faf9f5] px-4 py-3">
                    <div>
                      <p className="font-semibold text-slate-800">{product?.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item?.quantity}</p>
                    </div>
                    <p className="font-bold text-slate-900">Rs. {(product?.price || 0) * (item?.quantity || 0)}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">Payment Summary</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">Rs. {subtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-slate-900">{shipping === 0 ? 'FREE' : `Rs. ${shipping}`}</span>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex items-center justify-between text-lg font-bold text-slate-900">
                <span>Total</span>
                <span>Rs. {total}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePayNow}
              disabled={isLoading || !cart || cart.length === 0}
              className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 px-5 py-4 font-semibold text-white transition-all hover:bg-[#c2b090] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CreditCard size={18} />
              {isLoading ? 'Creating secure payment...' : 'Pay with Stripe'}
            </button>

            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">
              <ShieldCheck size={14} /> Secure checkout powered by Stripe
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
