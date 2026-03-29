import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useUserStore } from '../store/userStore.ts'
import { useNavigate } from 'react-router-dom'

const SignUpPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()

  const signup = useUserStore((state) => state.signup)
  const user = useUserStore((state) => state.user)

  const handleChangeName = (e) => {
    const value = e.target.value
    setName(value)
  }
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
      await signup(name, email, password);
      const newUser = useUserStore.getState().user;
      console.log('User signed up:', newUser);
      if (newUser) {
        navigate('/')
      }
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  return (
    <div className='flex flex-col w-full h-screen items-center bg-[#ebeae5]  '>
      <h1 className='mt-10 text-3xl font-serif'>New Account</h1>

      <Card className='flex mt-8 w-140 h-106 px-4 '>
        <CardHeader>
          <CardTitle className='text-2xl'>Sign up </CardTitle>
          <CardDescription className='text-[16px]'>Create your account to access exclusive deals, faster checkout, and order tracking.</CardDescription>
        </CardHeader>
        <CardContent>
          <h1>Name</h1>
          <Input name='name' onChange={handleChangeName}></Input>
          <h1 className='mt-4'>Email</h1>
          <Input name='email' type='email' onChange={handleChangeEmail}></Input>
          <h1 className='mt-4'>Password</h1>
          <Input onChange={handleChangePassword}></Input>
          <div className='flex w-full mt-4'>
            <Button className='w-30 ' onClick={handleSubmit}>Create Account</Button>
            <Button className='w-30  mx-60' onClick={() => navigate('/login')}>Login</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUpPage