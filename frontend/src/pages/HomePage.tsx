import React from 'react';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HomePage = () => {
  const categories = [
    { name: 'Clothing', image: 'https://res.cloudinary.com/dws18vqlr/image/upload/v1753607067/mediamodifier-7cERndkOyDw-unsplash_eqrqbe.jpg' },
    { name: 'Shoes', image: 'https://res.cloudinary.com/dws18vqlr/image/upload/v1752141069/cld-sample-5.jpg' },
    { name: 'Electronics', image: 'https://res.cloudinary.com/dws18vqlr/image/upload/v1753606080/maxim-hopman-Hin-rzhOdWs-unsplash_yq8js9.jpg' },
    { name: 'Accessories', image: 'https://res.cloudinary.com/dws18vqlr/image/upload/v1753460507/giorgio-trovato-K62u25Jk6vo-unsplash_wufn4c.jpg' },
  ];

  return (
    <div className='min-h-screen bg-[#fcfbf7] font-[Montserrat]'>
      {/* Hero Section */}
      <div className="relative h-[70vh] md:h-[90vh] w-full overflow-hidden flex items-center">
        <img 
          className='absolute inset-0 w-full h-full object-cover' 
          src='https://res.cloudinary.com/dws18vqlr/image/upload/v1763275748/1600_x_500-1_wd8sto.jpg'
          alt="Monsoon Sale Hero"
        />
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30" />

        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }}  
          transition={{ duration: 0.8 }}
          className="relative z-10 px-6 md:px-16 max-w-4xl"
        >
          <h1 className="text-4xl md:text-6xl text-white font-bold leading-tight">
            Mega Monsoon Sale <br /> 
            <span className="text-yellow-400">Up to 70% OFF!</span>
          </h1>
          <p className='mt-4 text-white text-sm md:text-lg max-w-xl opacity-90 leading-relaxed'>
            Shop the storm of savings! Refresh your wardrobe, gadgets, and home 
            with unbeatable discounts across all categories.
          </p>
          <button className="mt-8 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-black hover:text-white transition-colors duration-300">
            SHOP THE SALE
          </button>
        </motion.div>
      </div>

      {/* Categories Section */}
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className="flex flex-col items-center mb-12">
          <h2 className='text-3xl md:text-4xl font-bold tracking-tighter'>PRODUCT CATEGORIES</h2>
          <div className="h-1 w-20 bg-black mt-2"></div>
        </div>

        {/* Responsive Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {categories.map((category, index) => (
            <Link key={index} to={`/category/${category.name.toLowerCase()}`} className="group">
              <motion.div 
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className='relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-200'
              >
                <img 
                  className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 brightness-90 group-hover:brightness-75' 
                  src={category.image} 
                  alt={category.name}
                />
                <div className="absolute inset-0 flex items-end p-6 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white text-2xl font-bold tracking-wide">
                    {category.name}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;