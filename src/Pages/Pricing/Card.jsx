import React from 'react'

const Card = (props) => {
  return (
    <div className='min-h-screen bg-linear-to-b from-black to-gray-900 py-5 px-4'>
      <div className="gap-8 max-w-4xl mx-auto">

        <div className="bg-white/10 backdrop-blur-md border h-95 border-white/20 rounded-3xl p-5 shadow-2xl hover:shadow-3xl transition-smooth transition-all duration-300 hover:-translate-y-2">

          <h3 className="text-2xl font-bold text-white mb-4">
            {props.name}
          </h3>

          <h2 className="text-4xl font-black text-white mb-6">
            {props.price}
          </h2>

          <ul className="space-y-2 mb-6">
            {props.features.map((item, index) => (
              <li key={index} className="text-white/80">
                ✔ {item}
              </li>
            ))}
          </ul>

          <button className="mt-auto w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
            Get Started
          </button>

        </div>

      </div>
    </div>
  )
}

export default Card
