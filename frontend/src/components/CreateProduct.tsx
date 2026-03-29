import React, { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button';
import { useUserStore } from '@/store/userStore';
import { toast } from "sonner"

const CreateProduct = () => {
  const addproduct = useUserStore((state)=> state.addproduct)

  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    image: null,
  });

  const handleChange= (e) =>{
    const {name,value,type,files} = e.target
    if (type === 'file') {
      setProduct({...product,image:files[0]})
    } else {
      setProduct({...product,[name]:value})
    }
  }
  const getBase64 = (file) =>{             //convert to base64
    return new Promise((resolve,reject)=>{
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload=()=> resolve(reader.result)
      reader.onerror=(error)=> reject(error)

    })

  }

  const handleSubmit = async () =>{
    if(product.name && product.price&& product.description&&product.image&&product.category){
      const base64Image = await getBase64(product.image)
      addproduct({...product,image:base64Image})
      setProduct({
    name: '',
    description: '',
    category: '',
    price: '',
    image: null,
  })
    toast.success("Product created successfully!");
    } else {
      toast("Please fill all the details to create a product.")
    }
  }

  return (
    <div className='flex w-full flex-col items-center'>
        <h1>Create Product</h1>
        <Card className='mt-4 w-120 h-124' >
          <CardContent>
          <h1>Enter Name</h1>
          <Input name='name' value={product.name} onChange={handleChange} className='mt-1'></Input>
          <h1  className='mt-4'>Description</h1>
          <Input name='description' value={product.description} onChange={handleChange} className='mt-1'></Input>
          <h1 className='mt-4'>Category</h1>
          <Input value={product.category} name='category' onChange={handleChange} className='mt-1'></Input>
          <h1 className='mt-4'>Price</h1>
          <Input  value={product.price} name='price' type='number' onChange={handleChange} className='mt-1'></Input>
          <h1 className='mt-4'>Upload Image</h1>
          <Input id="picture" name='image' accept='image/*' type="file" onChange={handleChange} className='mt-1'></Input>
          <Button onClick={handleSubmit} type='submit'className='mt-6 w-full'>Create </Button>
          </CardContent>
          
        </Card>
    </div>
  )
}

export default CreateProduct