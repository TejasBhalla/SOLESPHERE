import CreateProduct from '@/components/CreateProduct'
import ModifyProduct from '@/components/ModifyProduct'
import Orders from '@/components/Orders'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'

const DashBoard = () => {

  const [activePart,setActivePart] = useState('createProduct')
  return (
    <div className='bg-[#f5f7fa] '>
    <div className='w-full min-h-screen flex flex-col items-center '>
      <div className='mt-12'>
      <Button className='mr-8' onClick={()=>setActivePart('createProduct')}>create new product</Button>
      <Button className='mr-8' onClick={()=>setActivePart('modifyProduct')}>select featured product</Button>
      <Button className='w-40' onClick={()=>setActivePart('Orders')}>orders</Button>
      </div>
      <div className='mt-8 w-full'>
      {activePart === 'createProduct' && <CreateProduct></CreateProduct>}
        {activePart === 'modifyProduct' && <ModifyProduct></ModifyProduct>}
        {activePart === 'Orders' && <Orders></Orders>}
      </div>
    </div>
    </div>
  )
}

export default DashBoard