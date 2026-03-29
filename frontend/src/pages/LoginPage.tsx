import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useUserStore } from '../store/userStore.ts'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()

  const login = useUserStore((state) => state.login)
  const user = useUserStore((state) => state.user)
  const getprofile = useUserStore((state) => state.getprofile)

  const handleChangeEmail = (e) => {
      const value = e.target.value
      setEmail(value)
    }
    const handleChangePassword = (e) => {
      const value = e.target.value
      setPassword(value)
    }
  
    const handleSubmit = async () => {
      try {
        await login( email, password);
        const newUser = useUserStore.getState().user;
        console.log('User signed up:', newUser);
        if (newUser) {
          navigate('/')
        }
      } catch (err) {
        console.error('login error:', err);
      }
    };

    useEffect(()=>{
      const getProfile = async()=>{
        await getprofile()
      }
      getProfile()
    },[])


  return (
    <div className='flex flex-col w-full h-screen items-center bg-[#ebeae5] '>
      <h1 className='mt-10 text-3xl font-serif'>Login</h1>

      <Card className='flex mt-8 w-140 px-4 '>
        <CardHeader>
          <CardTitle className='text-2xl'>Sign In </CardTitle>
          <CardDescription className='text-[16px]'>Welcome back! Please enter your details to continue shopping and tracking your orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <h1 className='mt-4'>Email</h1>
          <Input name='email' type='email' autoComplete='on' onChange={handleChangeEmail}></Input>
          <h1 className='mt-4'>Password</h1>
          <Input  onChange={handleChangePassword}></Input>
          <div className='flex w-full mt-4'>
            <Button className='w-30 ' onClick={handleSubmit}>Login</Button>
            <Button className='w-30  mx-60' onClick={() => navigate('/signup')}>sign up</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage