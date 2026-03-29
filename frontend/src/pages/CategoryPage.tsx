import React from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useUserStore } from '@/store/userStore'
import { useEffect } from "react";

const CategoryPage = () => {
    const fetchCategoryProducts = useUserStore((state)=> state.fetchCategoryProducts)
    const products = useUserStore((state)=> state.products);
    const isLoading = useUserStore((state)=> state.isLoading);
  

  const { name } = useParams();
  useEffect(() => {
      const FetchCategoryProducts = async () => {
        await fetchCategoryProducts(name);
      }
      FetchCategoryProducts();
    }, [name])
    if (isLoading) {
    return <h1 className="p-10 text-3xl font-bold">Loading...</h1>;
  }
  console.log("🛒 Products in UI:", products);

  // Animation Variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const card = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
  };

  return (
    <motion.div
      className="p-10 bg-[#fcfbf7] min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <h1 className="text-4xl font-bold mb-6 capitalize font-[Montserrat]">
        {name} Products
      </h1>

      <motion.div
        className="grid grid-cols-4 gap-6 m"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {products.map((item) => (
          <motion.div
            key={item._id}
            variants={card}
            whileHover={{
              scale: 1.05,
              y: -5,
              boxShadow: "0px 10px 25px rgba(0,0,0,0.15)"
            }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="p-4 bg-[#f5f2eb]  shadow cursor-pointer"
          >
            <motion.img
              src={item.image}
              className="w-full h-60 object-cover rounded-xl"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />

            <h2 className="mt-4 text-xl font-semibold">{item.name}</h2>
            <div className="flex">
            <p>From &nbsp; </p>
            <p className="text-red-500 font-medium"> ₹{item.price}</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              className="mt-3 px-4 py-2 bg-[#] text-white rounded-xl bg-[#c2b090] hover:bg-gray-800"
            >
              Add to Cart
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default CategoryPage;
