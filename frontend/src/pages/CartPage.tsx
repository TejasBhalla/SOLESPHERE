import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/store/userStore";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, removefromcart, changeproductquantity, getcart, createordersession } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    getcart();
  }, [getcart]);

  // Helpers to normalize cart item/product shape
  const getItemProduct = (item) => (item?.id && typeof item.id === 'object' ? item.id : item);
  const getItemId = (item) => (item?.id?._id || item?._id || item?.id);

  // Calculate Subtotal
  const subtotal =
    cart?.reduce((acc, item) => {
      const product = getItemProduct(item);
      const price = product?.price || 0;
      const qty = item?.quantity || 0;
      return acc + price * qty;
    }, 0) || 0;
  const shipping = subtotal > 5000 ? 0 : 150; // Free shipping over 5k example
  const total = subtotal + shipping;

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#fcfbf7] px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-6">
            <ShoppingBag size={40} className="text-gray-300" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 font-[Montserrat]">Your cart is empty</h1>
          <p className="text-gray-500 mb-8 max-w-xs mx-auto">Looks like you haven't discovered your next favorite piece yet.</p>
          <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-semibold hover:bg-[#c2b090] transition-all shadow-xl shadow-slate-200">
            Start Shopping <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbf7] py-12 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#a68d60] transition-colors mb-4 uppercase tracking-widest font-bold">
            <ChevronLeft size={16} /> Back to Shop
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 font-[Montserrat]">Shopping Bag <span className="text-[#a68d60] ml-2">({cart.length})</span></h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Side: Cart Items */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <motion.div
                    key={getItemId(item)}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Item Image */}
                    <div className="w-full sm:w-32 h-40 rounded-2xl overflow-hidden bg-[#f9f8f4] flex-shrink-0">
                      <img
                        src={getItemProduct(item)?.image}
                        alt={getItemProduct(item)?.name}
                        className="w-full h-full object-cover transition-transform hover:scale-110 duration-700"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 flex flex-col justify-between w-full h-full">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h2 className="text-xl font-bold text-slate-800 tracking-tight">{getItemProduct(item)?.name}</h2>
                          <p className="text-sm text-gray-400 mt-1 italic">Premium Selection</p>
                        </div>
                        <p className="text-lg font-black text-slate-900">₹{getItemProduct(item)?.price}</p>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center gap-4 bg-[#f9f8f4] p-1 rounded-xl border border-gray-100">
                          <button
                            type="button"
                            onClick={async () => {
                              await changeproductquantity(getItemId(item), 'dec');
                            }}
                            className="w-8 h-8 flex items-center justify-center hover:text-red-500 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-bold text-slate-800 text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={async () => {
                              await changeproductquantity(getItemId(item), 'inc');
                            }}
                            className="w-8 h-8 flex items-center justify-center hover:text-green-600 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <button
                          type="button"
                          onClick={async () => {
                            await removefromcart(getItemId(item));
                          }}
                          className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors font-medium px-2"
                        >
                          <Trash2 size={16} /> Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-slate-200/50 sticky top-12"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-8 font-[Montserrat]">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-slate-800">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span className="font-medium">Shipping</span>
                  <span className="font-bold text-slate-800">{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                </div>
                {shipping === 0 && (
                  <p className="text-[10px] text-[#a68d60] font-bold uppercase tracking-widest">Free Shipping Applied</p>
                )}
                <div className="h-[1px] bg-gray-100 my-4" />
                <div className="flex justify-between text-xl font-black text-slate-900">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={async () => {
                  const res = await createordersession();
                  if (res?.success && res.data?.sessionUrl) {
                    window.location.href = res.data.sessionUrl;
                  } else {
                    navigate('/checkout');
                  }
                }}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#c2b090] transition-all duration-500 shadow-lg shadow-slate-200"
              >
                Checkout Now <ArrowRight size={20} />
              </motion.button>

              <div className="mt-6 space-y-4 text-center">
                <p className="text-xs text-gray-400">Secure Payment Guaranteed</p>
                <div className="flex justify-center gap-4 opacity-30 grayscale">
                  {/* Placeholders for payment icons */}
                  <div className="w-8 h-5 bg-gray-400 rounded-sm" />
                  <div className="w-8 h-5 bg-gray-400 rounded-sm" />
                  <div className="w-8 h-5 bg-gray-400 rounded-sm" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;