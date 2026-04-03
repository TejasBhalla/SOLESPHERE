import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from '@/store/userStore';
import { Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";

const CartControl = ({ item, cartItem, methods }: { item: any; cartItem: any; methods: any }) => {
  const { addtocart, removefromcart, changeproductquantity } = methods;

  return (
    <div className="absolute bottom-4 right-4 left-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
      {cartItem ? (
        <div onClick={(e) => e.stopPropagation()} className="flex items-center justify-between bg-white/95 backdrop-blur-sm p-1.5 rounded-xl shadow-xl border border-gray-100">
          <div className="flex items-center gap-3 ml-1">
            <button onClick={() => changeproductquantity(item._id, 'dec')} className="p-1 hover:text-red-500 transition-colors"><Minus size={16} /></button>
            <span className="text-sm font-bold text-slate-800">{cartItem.quantity}</span>
            <button onClick={() => changeproductquantity(item._id, 'inc')} className="p-1 hover:text-green-600 transition-colors"><Plus size={16} /></button>
          </div>
          <button onClick={() => removefromcart(item._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors border-l border-gray-100 ml-2"><Trash2 size={16} /></button>
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            addtocart(item._id);
          }}
          className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-[#b09d7a] transition-all duration-300 shadow-2xl active:scale-95"
        >
          <ShoppingBag size={16} /> Add to Cart
        </button>
      )}
    </div>
  );
};

const CategoryPage = () => {
  const fetchCategoryProducts = useUserStore((state: any) => state.fetchCategoryProducts);
  const products = useUserStore((state: any) => state.products);
  const isLoading = useUserStore((state: any) => state.isLoading);
  const cart = useUserStore((state: any) => state.cart);
  const addtocart = useUserStore((state: any) => state.addtocart);
  const removefromcart = useUserStore((state: any) => state.removefromcart);
  const changeproductquantity = useUserStore((state: any) => state.changeproductquantity);
  const methods = { addtocart, removefromcart, changeproductquantity };
  const { name } = useParams();
  const navigate = useNavigate();

  useEffect(() => { fetchCategoryProducts(name); }, [name, fetchCategoryProducts]);

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#fcfbf7]">
      <div className="w-10 h-10 border-2 border-[#c2b090] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="bg-[#fcfbf7] min-h-screen font-sans selection:bg-[#c2b090]/30">
      <div className="max-w-7xl mx-auto px-6 py-12 md:px-10">
        
        <header className="mb-12">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <p className="text-xs uppercase tracking-[0.4em] text-[#a68d60] font-bold mb-2">Essential Collection</p>
            <h1 className="text-4xl md:text-5xl font-bold capitalize text-slate-900 tracking-tight font-[Montserrat]">{name}</h1>
          </motion.div>
        </header>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {products.map((item) => {
              const cartItem = cart?.find((ci: any) => String(ci.id?._id || ci.id) === String(item._id));

              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => navigate(`/item/${item._id}`)}
                  className="group relative cursor-pointer bg-white rounded-[2rem] border border-gray-100 hover:border-transparent transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
                >
                  {/* Image Section */}
                  <div className="relative aspect-[1/1.2] m-3 overflow-hidden rounded-[1.5rem] bg-[#f9f8f4]">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CartControl item={item} cartItem={cartItem} methods={methods} />
                  </div>

                  {/* Info Section */}
                  <div className="px-6 pb-8 pt-2">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h2 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-[#a68d60] transition-colors">{item.name}</h2>
                      <span className="text-lg font-bold text-slate-900">₹{item.price}</span>
                    </div>
                    
                    {/* Description Section */}
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 italic">
                      {item.description || `Handcrafted premium ${name} designed for ultimate comfort and timeless style.`}
                    </p>

                    <div className="mt-4 flex items-center gap-2">
                      <span className="h-[1px] flex-1 bg-gray-100"></span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Detail</span>
                      <span className="h-[1px] flex-1 bg-gray-100"></span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {!isLoading && !products.length && (
          <div className="text-center py-32">
            <ShoppingBag className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-gray-400 text-lg italic">We couldn't find any items in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;