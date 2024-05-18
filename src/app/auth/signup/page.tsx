"use client"

import LoginLoadingAnimation from '@/components/ButtonAnimation/LoginLoadingAnimation'
import { supabase } from '@/supabase/supabaseClient'
import Link from 'next/link'
import React, { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { AiFillCloseCircle } from 'react-icons/ai'
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa"
import AuthTransition from '@/components/common/AuthTransition'

const Page = () => {

    const [validatePassword, setValidatePassword] = useState({
        length: false,
        number: false,
        specialChar: false,
    })

    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const [inputData, setInputData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    })

    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

    const signUpNewUser = async() => {
        const { data, error } = await supabase.auth.signUp({
          email: inputData.email,
          password: inputData.password,
          options: {
            emailRedirectTo: 'http://localhost:3000/auth/login',
            data: {
                role: "admin"
            }
          },
        })
        if(error){
            toast.error(error.message)
            console.log(error)
        }
        if(data.user != null){
            toast.success("Check You email and active your account", {
                icon: "📧"
            })
            console.log(data)
        }
        setLoading(false);
    }
      

    const validateInputAndSignup = () => {

        if(inputData.email){
            if(inputData.password){
                if(inputData.confirmPassword){
                    if(inputData.password == inputData.confirmPassword){
                        if(validatePassword.length && validatePassword.number && validatePassword.specialChar){
                            setLoading(true)
                            signUpNewUser()
                        }else{
                            toast.error("Please follow the password guideline!")
                        }
                    }else{
                        toast.error("Password doesn't match!")
                        confirmPasswordInputRef.current && confirmPasswordInputRef.current.focus()
                    }
                }else{
                    toast.error("Please confirm your password")
                    confirmPasswordInputRef.current && confirmPasswordInputRef.current.focus()
                }
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
        const password = e.target.value;
        const format = /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/;
        const hasNumber = /\d/;

        setInputData(prevState => ({ ...prevState, password: e.target.value.trim() }));

        const isValidLength = password.length >= 8;
        const hasSpecialChar = format.test(password);
        const hasNum = hasNumber.test(password);

        isValidLength ? setValidatePassword(prevState => ({...prevState, length: true})) : setValidatePassword(prevState => ({...prevState, length: false}))
        hasNum ? setValidatePassword(prevState => ({...prevState, number: true})) : setValidatePassword(prevState => ({...prevState, number: false})) 
        hasSpecialChar ? setValidatePassword(prevState => ({...prevState, specialChar: true})) : setValidatePassword(prevState => ({...prevState, specialChar: false})) 
    };

  return (
    <div className='w-screen h-screen flex items-center justify-center bg-waikawa-gray-50 overflow-x-hidden'>
        <AuthTransition>
        <div className="form p-8 bg-waikawa-gray-200 flex items-center justify-around gap-6 flex-col w-[85%] sm:w-[500px] md:w-[400px]">
                <h1 className='font-bold text-xl md:text-2xl text-waikawa-gray-600 mb-3 uppercase'>sign up</h1>
                <div className="inputs flex flex-col gap-4 w-full">
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
                    <div className="passwordInput flex flex-col gap-1 w-full relative">
                        <label htmlFor="confirmPassword" className='font-normal text-waikawa-gray-800'>Confirm Password</label>
                        <input type={`${showPassword ? "text" : "password"}`} id='password' ref={confirmPasswordInputRef} value={inputData.confirmPassword} className="confirmPassword bg-waikawa-gray-100 border-waikawa-gray-600 text-md p-3 text-black outline-none border-l-2" placeholder='Confirm password...' onChange={(e) => setInputData(prevState => ({...prevState, confirmPassword: e.target.value}))}/>
                    </div>
                </div>
                <button className={` w-full h-[45px] p-2 flex items-center justify-center bg-waikawa-gray-500 text-white duration-200 hover:bg-waikawa-gray-600 `} onClick={validateInputAndSignup}>{loading ? <LoginLoadingAnimation /> : "Sign up"}</button>
                <p className='text-waikawa-gray-600 w-full text-sm cursor-pointer font-normal -mt-3'>If you already have an account, <Link href={'/auth/login'} className='text-waikawa-gray-900 uppercase font-semibold'>login</Link></p>
                <div className="validation flex flex-col w-full gap-3 mt-3">
                    <h1 className='text-waikawa-gray-800 font-[600px]'>Password Requirements</h1>
                    <div className="passwordlength flex gap-2 items-center justify-start">
                        {inputData.password === "" && <FaExclamationCircle className='text-gray-300' />}
                        {validatePassword.length && inputData.password !== "" && <FaCheckCircle className='text-green-500' />}
                        {!validatePassword.length && inputData.password !== "" && <AiFillCloseCircle className='text-red-500' />}
                        <p className='text-sm md:text-md text-waikawa-gray-900 flex gap-1'><span className='hidden md:flex'>Password</span>should have at least 8 characters.</p>
                    </div>
                    <div className="specialChar flex gap-2 items-center justify-start">
                        {inputData.password === "" && <FaExclamationCircle className='text-gray-300' />}
                        {validatePassword.specialChar && inputData.password !== "" && <FaCheckCircle className='text-green-500' />}
                        {!validatePassword.specialChar && inputData.password !== "" && <AiFillCloseCircle className='text-red-500' />}
                        <p className='text-sm md:text-md text-waikawa-gray-900 flex gap-1'><span className='hidden md:flex'>Password</span>must contain special character.</p>
                    </div>
                    <div className="number flex gap-2 items-center justify-start">
                        {inputData.password === "" && <FaExclamationCircle className='text-gray-300' />}
                        {validatePassword.number && inputData.password !== "" && <FaCheckCircle className='text-green-500' />}
                        {!validatePassword.number && inputData.password !== "" && <AiFillCloseCircle className='text-red-500' />}
                        <p className='text-sm md:text-md text-waikawa-gray-900 flex gap-1'><span className='hidden md:flex'>Password</span>must contain number.</p>
                    </div>
                </div>
            </div>
        </AuthTransition>
    </div>
  )
}

export default Page