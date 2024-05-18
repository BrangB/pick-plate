import React from 'react'
import Lottie from "lottie-react";
import loading from "@/lottie/loginLoading.json"

const LoginLoadingAnimation = () => {
    return (
        <div style={{ width: '25px'}} className='flex items-center justify-center'>
          <Lottie
            animationData={loading}
            className="flex justify-center items-center"
            loop={true}
          />
        </div>
      );
}

export default LoginLoadingAnimation