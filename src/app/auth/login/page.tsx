"use client"

import LoginLoadingAnimation from '@/components/ButtonAnimation/LoginLoadingAnimation'
import { supabase } from '@/supabase/supabaseClient'
import Link from 'next/link'
import React, { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import AuthTransition from '@/components/common/AuthTransition'
import { setCookie } from 'cookies-next';

const Page = () => {


    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [inputData, setInputData] = useState({
        email: "",
        password: ""
    })

    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);

    const router = useRouter();

    async function signInWithEmail() {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: inputData.email,
          password: inputData.password,
        })
        if(data.user != null){
            toast.success("Login Successful")
            console.log(data)
            setCookie("token", data.session.access_token)
            setCookie("role", "user")
            router.push("/")
        }
        if(error){
            toast.error(error.message)
        }
        setLoading(false)
      }
      
    const validateInputAndLogin = () => {

        if(inputData.email){
            if(inputData.password){
                setLoading(true)
                signInWithEmail()
            }else{
                toast.error("Please enter your password")
                passwordInputRef.current && passwordInputRef.current.focus()
            }
        }else{
            toast.error("Please enter your email.")
            emailInputRef.current && emailInputRef.current.focus();
        }
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setInputData(prevState => ({ ...prevState, password: e.target.value.trim() }));

    };

  return (
    <div className='w-screen h-screen flex items-center justify-center bg-waikawa-gray-50 overflow-x-hidden'>
        <div className='flex items-center justify-center sm:w-[500px] md:w-[350px] xl:w-[400px]'>
            <AuthTransition>
                <div className="form p-8 bg-waikawa-gray-200 flex items-center justify-around gap-6 flex-col w-full">
                    <h1 className='font-bold text-2xl md:text-3xl text-waikawa-gray-600 mb-5'>LOGIN</h1>
                    <div className="inputs flex flex-col gap-6 w-full">
                        <div className="emailInput flex flex-col gap-1 w-full relative">
                            <label htmlFor="email" className='font-normal text-waikawa-gray-800'>Email</label>
                            <input type="email" placeholder='Enter your email...' ref={emailInputRef} id="email" value={inputData.email} className='email bg-waikawa-gray-100 border-waikawa-gray-600 text-md p-3 text-black outline-none border-l-2' onChange={(e) => setInputData({...inputData, email: e.target.value.trim()})}/>
                        </div>
                        <div className="passwordInput flex flex-col gap-1 w-full relative">
                            <label htmlFor="password" className='font-normal text-waikawa-gray-800'>Password</label>
                            <input type={`${showPassword ? "text" : "password"}`} id='password' ref={passwordInputRef} value={inputData.password} className="passowrd bg-waikawa-gray-100 border-waikawa-gray-600 text-md p-3 text-black outline-none border-l-2" placeholder='Enter your password...' onChange={(e) => handlePasswordChange(e)}/>
                                {
                                    !showPassword ? <i className="fa-solid fa-eye-slash absolute top-1 right-2 cursor-pointer text-waikawa-gray-900" onClick={() => setShowPassword(!showPassword)}></i> : <i className="fa-solid fa-eye absolute top-1 right-2 cursor-pointer text-waikawa-gray-900" onClick={() => setShowPassword(!showPassword)}></i>
                                }
                        </div>
                    </div>
                    <Link href='/auth/forgotPassword' className='text-waikawa-gray-900 w-full text-sm cursor-pointer font-medium -mt-3'><p>Forget password?</p></Link>
                    <button className={` w-full h-[45px] p-2 flex items-center justify-center bg-waikawa-gray-500 text-white duration-200 hover:bg-waikawa-gray-600 `} onClick={validateInputAndLogin}>{loading ? <LoginLoadingAnimation /> : "LOGIN"}</button>
                    <p className='text-waikawa-gray-600 w-full text-sm cursor-pointer font-medium -mt-3'>If you don't have an account, <Link href={'/auth/signup'} className='text-waikawa-gray-900 uppercase'>Sign Up</Link></p>
                </div>
            </AuthTransition>
        </div>
    </div>
  )
}

export default Page