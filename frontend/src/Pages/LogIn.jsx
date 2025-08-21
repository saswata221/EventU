import React from "react";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail } from "react-icons/hi";
import { FaApple } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";

function LogIn(){
    return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white py-5 px-5 w-fit h-fit text-center ">
        <div className="flex justify-end"><RxCross1 className="scale-125"/></div>
        <p className="p-3 text-lg">Get Started </p>
        <div className="px-10 py-1 rounded-lg text-black/70 text-lg m-5 border-black/50 border-[1px] flex gap-5 items-center"> <FcGoogle className=" scale-150"/>Continue with Google</div>
        <div className="px-10 py-1 rounded-lg text-black/70 text-lg m-5 border-black/50 border-[1px] flex gap-5 items-center"><HiOutlineMail className="text-black scale-150"/>Continue with Email</div>
        <div className="px-10 py-1 rounded-lg text-black/70 text-lg m-5 border-black/50 border-[1px] flex gap-5 items-center"><FaApple className="text-black scale-150"/>Continue with Apple</div>
        <p className=" p-3">Or</p>
        <div>+91 <input type="tel" name="phone" placeholder="Continue with mobile no"  pattern="[0-9]*" inputmode="numeric" className="border-b-[1px] border-black/50  p-2" /></div>
        <p className="text-[10px] mt-14 ">*I agree to the <span className="underline">Terms & Condition</span> and <span className="underline">Private Policy</span></p>

      </div>
    </div>
  );
}

export default LogIn;