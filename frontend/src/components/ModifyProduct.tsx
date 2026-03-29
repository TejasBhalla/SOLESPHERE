import { useUserStore } from '@/store/userStore'
import React, { useEffect } from 'react'
import { Card } from './ui/card'

const ModifyProduct = () => {
    const products=useUserStore((state)=>state.products)
    const getproducts=useUserStore((state)=>state.getproducts)
    useEffect(()=>{
        const GetProducts=async () => {
            await getproducts()
        }
        GetProducts()
    },[])
  return (
    <div className='flex flex-col items-center w-full'>
        <h1>Modify Products</h1>
        <div className='flex w-[80%] px-6  mt-4 items-center justify-between rounded-t-xl border-1 h-10 bg-white font-semibold'>
            <h1 className='basis-1/5'>Product Name</h1>
            <h1 className='basis-1/5'>Catergory</h1>
            <h1 className='basis-1/5'>Price</h1>
            <h1 className='basis-1/5'>Featured</h1>
            <h1 className=''>Action</h1>
            
        </div>
        <div className=' w-[80%] items-center rounded-b-xl'>
            {products.map((product)=>{
                return (
                    <Card className='px-6 flex flex-row items-center justify-between w-full border-1 h-14 rounded-[0] '>
                        <div className="flex basis-1/4">
                            <img className="w-10 rounded h-10 object-cover" src={product.image} />
                            <h1 className='ml-2'>{product.name}</h1>
                        </div>
                        <div className="basis-1/4">{product.category}</div>
                        <div className="basis-1/4">${product.price}</div>
                        <div className="basis-1/4">{product.isFeatured ? 'Yes' : 'No'}</div>
                        <div>plus</div>

                    </Card>
                )
            })}
            
        </div>
    </div>
  )
}

export default ModifyProduct