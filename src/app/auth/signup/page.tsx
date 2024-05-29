"use client"

import LoginLoadingAnimation from '@/components/ButtonAnimation/LoginLoadingAnimation'
import { supabase } from '@/supabase/supabaseClient'
import Link from 'next/link'
import React, { useState, useRef, ChangeEvent, useEffect } from 'react'
import toast from 'react-hot-toast'
import { AiFillCloseCircle } from 'react-icons/ai'
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa"
import AuthTransition from '@/components/common/AuthTransition'
import defaultImage from "@/assets/defaultImage.png"
import Image from 'next/image'


interface PersonalData {
    email: string,
    password: string,
    confirmPassword: string,
    avatarPath: string | ArrayBuffer | null;
    avatarUrl: string
  }

const Page = () => {

    const [validatePassword, setValidatePassword] = useState({
        length: false,
        number: false,
        specialChar: false,
    })

    const [imageFile, setImageFile] = useState<File | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const [inputData, setInputData] = useState<PersonalData>({
        email: "",
        password: "",
        confirmPassword: "",
        avatarPath: "",
        avatarUrl: ""
    })

    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

    const signUpNewUser = async () => {
        setLoading(true); // Set loading state to true
        try {
            const { data, error } = await supabase.auth.signUp({
                email: inputData.email,
                password: inputData.password,
                options: {
                    emailRedirectTo: 'http://localhost:3000/auth/login',
                    data: {
                        role: "admin"
                    }
                },
            });
    
            if (error) {
                // If there's an error, show an error message and log the error
                toast.error(error.message);
                console.log(error);
                await deleteUploadedFile(); // Delete the uploaded image if signup fails
            } else {
                // Check if the email is taken
                const emailIsTaken = data.user?.identities?.length === 0;
    
                if (emailIsTaken) {
                    // If email is taken, show an error message
                    toast.error("Email is taken");
                    await deleteUploadedFile(); // Delete the uploaded image if email is taken
                } else {
                    // If sign-up is successful, show a success message
                    toast.success("Check your email and activate your account", {
                        icon: "📧"
                    });
                    console.log(data);
                }
            }
        } catch (error) {
            // Catch and handle any unexpected errors
            toast.error("An unexpected error occurred");
            console.error(error);
            await deleteUploadedFile(); // Delete the uploaded image if there's an unexpected error
        } finally {
            // Set loading state to false in the finally block to ensure it runs regardless of success or failure
            setLoading(false);
        }
    };
    
    const uploadFileAndGetUrl = async () => {
        if (imageFile != null) {
            setLoading(true);
    
            const uploadPromise = async () => {
                const { data, error } = await supabase.storage.from('pickplate').upload(`userAvatar/${imageFile.name}`, imageFile);
    
                if (error) {
                    throw error;
                }
    
                const { data: imageUrl } = supabase
                    .storage
                    .from('pickplate')
                    .getPublicUrl(`userAvatar/${imageFile.name}`);
    
                setInputData((prevInputData) => ({ ...prevInputData, avatarUrl: imageUrl.publicUrl }));
    
                console.log(data);
            };
    
            toast.promise(
                uploadPromise(),
                {
                    loading: 'Registering...',
                    success: () => {
                        signUpNewUser();
                        return 'Upload successful!';
                    },
                    error: (err) => {
                        if (err.message == "The resource already exists") {
                            setInputData({ ...inputData, avatarPath: "" });
                            return "Please choose another image";
                        }
                        return `Errors: ${err.message}`;
                    },
                }
            );
            setLoading(false);
        }
    };
    
    const deleteUploadedFile = async () => {
        const fileName = imageFile?.name;
        const { error } = await supabase.storage.from('pickplate').remove([`userAvatar/${fileName}`]);
        setInputData({...inputData, avatarPath: "", avatarUrl: ""})
        setImageFile(null)
        if (error) {
            console.error("Failed to delete the uploaded image:", error.message);
        }
    };
    

    useEffect(() => {
        console.log(inputData)
    }, [inputData])
    

    const validateInputAndSignup = () => {
        const { email, password, confirmPassword } = inputData;
      
        if (!email) {
          toast.error("Please enter your email.");
          emailInputRef.current?.focus();
          return;
        }
      
        if (!password) {
          toast.error("Please enter your password.");
          passwordInputRef.current?.focus();
          return;
        }
      
        if (!confirmPassword) {
          toast.error("Please confirm your password.");
          confirmPasswordInputRef.current?.focus();
          return;
        }
      
        if (password !== confirmPassword) {
          toast.error("Passwords don't match!");
          confirmPasswordInputRef.current?.focus();
          return;
        }
      
        if (!validatePassword.length || !validatePassword.number || !validatePassword.specialChar) {
          toast.error("Please follow the password guideline!");
          return;
        }
      
        if (!imageFile) {
          toast.error("Please select an image.");
          return;
        }
      
        setLoading(true);
        uploadFileAndGetUrl();
      };
      

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

    const handleClick = () => {
        inputRef.current?.click();
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            setInputData({...inputData, avatarPath: reader.result});
            setImageFile(file)
          });
    
          reader.readAsDataURL(file);
        }
      };

  return (
    <div className='w-screen h-screen flex items-center justify-center bg-waikawa-gray-50 overflow-x-hidden'>
        <div className='flex items-center justify-center w-[90%] sm:w-[400px] md:w-[600px] 2xl:w-[800px]'>
            <AuthTransition>
                <div className="form p-8 px-6 md:px-8 bg-waikawa-gray-200 flex flex-col md:flex-row items-center justify-around gap-6 md:gap-8 w-full">
                    <div className="leftSide flex flex-col gap-6 w-full lg:w-[50%] ">
                        <h1 className='font-bold text-xl md:text-2xl text-waikawa-gray-600 mb-3 uppercase'>sign up</h1>
                        <div className="inputs flex flex-col gap-4 w-full ">
                            <div className="emailInput flex flex-col gap-1 w-full relative ">
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
                    </div>
                    <div className="rightside w-full lg:w-[50%] flex flex-col gap-4">
                        <div onClick={handleClick} className='mt-2 flex flex-col items-center justify-center'>
                            {inputData.avatarPath ? (
                                <img src={inputData.avatarPath as string}  className='w-[90px] h-[90px] lg:w-[110px] lg:h-[110px]  rounded-md object-cover border-[2px] border-[#f0f0f0]' alt="Avatar" />
                            ) : (
                                <Image src={defaultImage} alt='default avatar' width={90} height={90} className='w-[90px] h-[90px] lg:w-[110px] lg:h-[110px] rounded-md object-cover bg-[#c0c0c0] border-dashed p-2 border-[2px] border-[#414141]'/>
                            )}
                            <input type="file" ref={inputRef} onChange={handleChange} style={{ display: "none" }} />
                        </div>
                        <div className="validation flex flex-col w-full gap-3 mt-3 h-auto md:h-full">
                            <h1 className='text-waikawa-gray-800 font-[600px] md:text-lg md:font-semibold'>Password Requirements</h1>
                            <div className="passwordlength flex gap-2 items-start justify-start ">
                                {inputData.password === "" && <FaExclamationCircle className='text-gray-300 mt-[2px]' />}
                                {validatePassword.length && inputData.password !== "" && <FaCheckCircle className='text-green-500 mt-[2px]' />}
                                {!validatePassword.length && inputData.password !== "" && <AiFillCloseCircle className='text-red-500 mt-[2px]' />}
                                <p className='text-sm md:text-md 2xl:text-lg text-waikawa-gray-900 flex gap-1'><span className='hidden md:flex'>Password</span>should have at least 8 characters.</p>
                            </div>
                            <div className="specialChar flex gap-2 items-start justify-start">
                                {inputData.password === "" && <FaExclamationCircle className='text-gray-300 mt-[2px]' />}
                                {validatePassword.specialChar && inputData.password !== "" && <FaCheckCircle className='text-green-500 mt-[2px]' />}
                                {!validatePassword.specialChar && inputData.password !== "" && <AiFillCloseCircle className='text-red-500 mt-[2px]' />}
                                <p className='text-sm md:text-md 2xl:text-lg text-waikawa-gray-900 flex gap-1'><span className='hidden md:flex'>Password</span>must contain special character.</p>
                            </div>
                            <div className="number flex gap-2 items-start justify-start">
                                {inputData.password === "" && <FaExclamationCircle className='text-gray-300 mt-[2px]' />}
                                {validatePassword.number && inputData.password !== "" && <FaCheckCircle className='text-green-500 mt-[2px]' />}
                                {!validatePassword.number && inputData.password !== "" && <AiFillCloseCircle className='text-red-500 mt-[2px]' />}
                                <p className='text-sm md:text-md 2xl:text-lg text-waikawa-gray-900 flex gap-1'><span className='hidden md:flex'>Password</span>must contain number.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </AuthTransition>
        </div>

    </div>
  )
}

export default Page