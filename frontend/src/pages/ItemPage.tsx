import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useUserStore } from "@/store/userStore";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

const ItemPage = () => {
	const selectedProduct = useUserStore((state: any) => state.selectedProduct);
	const getProductById = useUserStore((state: any) => state.getProductById);
	const isLoading = useUserStore((state: any) => state.isLoading);
	const cart = useUserStore((state: any) => state.cart);
	const addtocart = useUserStore((state: any) => state.addtocart);
	const removefromcart = useUserStore((state: any) => state.removefromcart);
	const changeproductquantity = useUserStore((state: any) => state.changeproductquantity);
	const { id } = useParams();

	useEffect(() => {
		if (id) {
			getProductById(id);
		}
	}, [id, getProductById]);

	const cartItem = selectedProduct
		? cart?.find((ci: any) => String(ci.id?._id || ci.id) === String(selectedProduct._id))
		: null;

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-[#fcfbf7]">
				<div className="w-10 h-10 border-2 border-[#c2b090] border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	if (!selectedProduct) {
		return (
			<div className="min-h-screen bg-[#fcfbf7] px-6 py-16">
				<div className="max-w-4xl mx-auto text-center bg-white rounded-3xl border border-gray-100 p-12">
					<p className="text-slate-700 text-xl font-semibold mb-6">Product not found.</p>
					<Link to="/" className="inline-flex items-center gap-2 text-[#a68d60] hover:text-slate-900 transition-colors">
						<ArrowLeft size={16} /> Back to home
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#fcfbf7] py-10 px-6 md:px-10 font-[Montserrat]">
			<div className="max-w-6xl mx-auto">
				<Link
					to={`/category/${selectedProduct.category}`}
					className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
				>
					<ArrowLeft size={15} /> Back to {selectedProduct.category}
				</Link>

				<div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className="bg-white border border-gray-100 rounded-[2rem] p-4 shadow-sm"
					>
						<div className="aspect-square rounded-[1.5rem] overflow-hidden bg-[#f6f4ed]">
							<img
								src={selectedProduct.image}
								alt={selectedProduct.name}
								className="w-full h-full object-cover"
							/>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-10"
					>
						<p className="text-xs uppercase tracking-[0.3em] text-[#a68d60] font-bold mb-3">
							{selectedProduct.category}
						</p>
						<h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
							{selectedProduct.name}
						</h1>
						<p className="mt-4 text-3xl font-bold text-slate-900">₹{selectedProduct.price}</p>

						<div className="mt-7 pt-6 border-t border-gray-100">
							<p className="text-slate-600 leading-relaxed">{selectedProduct.description}</p>
						</div>

						<div className="mt-10">
							{cartItem ? (
								<div className="w-full max-w-sm flex items-center justify-between bg-[#faf9f4] p-2 rounded-xl border border-gray-100">
									<div className="flex items-center gap-4">
										<button
											onClick={() => changeproductquantity(selectedProduct._id, "dec")}
											className="p-2 rounded-lg hover:bg-white transition-colors"
										>
											<Minus size={16} />
										</button>
										<span className="text-lg font-bold text-slate-800 min-w-7 text-center">{cartItem.quantity}</span>
										<button
											onClick={() => changeproductquantity(selectedProduct._id, "inc")}
											className="p-2 rounded-lg hover:bg-white transition-colors"
										>
											<Plus size={16} />
										</button>
									</div>

									<button
										onClick={() => removefromcart(selectedProduct._id)}
										className="p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-white transition-colors"
									>
										<Trash2 size={17} />
									</button>
								</div>
							) : (
								<button
									onClick={() => addtocart(selectedProduct._id)}
									className="w-full max-w-sm flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-[#b09d7a] transition-all duration-300"
								>
									<ShoppingBag size={16} /> Add to Cart
								</button>
							)}
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default ItemPage;
