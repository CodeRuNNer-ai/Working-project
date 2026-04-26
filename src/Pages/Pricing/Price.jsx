import React from 'react'
import Card from './Card'
const Price = () => {
  return (
    <>
    <div>
        <h1 className='text-5xl font-bold text-white text-center mt-10 mb-2'>
          Simple Pricing
        </h1>
        <p className='text-xl text-white/60 text-center mt-5 mb-4 max-w-2xl mx-auto'>
          Choose the plan that works best for you
        </p>
      </div>
    <div className="grid md:grid-cols-3">
      <Card name='Free' price='$0/Mo' features= {['Basic Access', 'Limited Support']}/>
      <Card name='Pro' price='$19/Mo' features={['Unlimited Access', 'Priority Support', 'Advanced Tools']}/>
      <Card name='Enterprise' price='$99/Mo' features={['Custom Solutions', '24/7 Support', 'API Access']}/>
    </div>
    </>
  )
}

export default Price
