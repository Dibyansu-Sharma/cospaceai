'use client'
import PricingModel from '@/components/custom/PricingModel';
import { UserDetailContext } from '@/context/UserDetailContext'
import Colors from '@/data/Colors';
import Lookup from '@/data/Lookup'
import React, { useContext } from 'react'

function Pricing() {
    const { userDetail } = useContext(UserDetailContext);

    return (
        <div className='flex justify-center w-full'>
            <div className='mt-10 flex flex-col items-center w-full max-w-screen-lg p-10 md:px-32 lg:px-48 flex-grow'>
                <h2 className='font-bold text-5xl'>Pricing</h2>
                <p className='text-gray-400 max-w-xl text-center mt-4'>{Lookup.PRICING_DESC}</p>
                
                <div 
                    className='p-5 border rounded-xl flex w-full justify-between mt-7 items-center' 
                    style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
                >
                    <h2 className='text-lg'>
                        <span className='font-bold'>{userDetail?.token} Tokens Left</span>
                    </h2>
                    <div className='text-right'>
                        <h2>Need more tokens?</h2>
                        <p>Upgrade your plan below</p>
                    </div>
                </div>

                <div className='w-full'>
                    <PricingModel />
                </div>
            </div>
        </div>
    )
}

export default Pricing;
