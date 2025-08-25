import React from 'react'
import { Lock, Crown, Star, Zap } from 'lucide-react'
const Locked = () => {
  return (
    <div className="min-h-screen bg-minimal-dark-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Card */}
        <div className="bg-minimal-dark-100 rounded-2xl p-6 border border-gray-800 shadow-xl">
          {/* Lock Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg">
            <Lock className="w-10 h-10 text-black" strokeWidth={2.5} />
          </div>

          {/* Premium Badge
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-sm font-bold mb-4">
            <Crown className="w-4 h-4" />
            PREMIUM FEATURE
          </div> */}

          {/* Message */}
          <h1 className="text-xl font-bold text-white mb-2">
            Feature Locked
          </h1>
          <p className="text-gray-400 mb-6 text-sm">
            Unlock premium features to access advanced tools and priority support.
          </p>

          {/* Features */}
          <div className="space-y-2 flex  mb-6">
            <div className="flex items-center gap-2 text-left">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
                <Star className="w-3 h-3 text-black" />
              </div>
              <span className="text-gray-300 text-sm">Advanced analytics</span>
            </div>
            <div className="flex items-center gap-2 text-left">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
                <Zap className="w-3 h-3 text-black" />
              </div>
              <span className="text-gray-300 text-sm">Enhanced performance</span>
            </div>
            <div className="flex items-center gap-2 text-left">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
                <Crown className="w-3 h-3 text-black" />
              </div>
              <span className="text-gray-300 text-sm">Priority support</span>
            </div>
          </div>

          {/* CTA */}
          {/* <button className="w-full bg-gradient-to-r from-cyan-400 to-teal-500 text-black font-bold py-3 rounded-xl hover:from-cyan-500 hover:to-teal-600 transition-all">
            Upgrade to Premium
          </button> */}
          <button className="w-full mt-2 text-gray-400 hover:text-white text-sm">
            Learn more
          </button>
        </div>
      </div>
    </div>
  )
}

export default Locked
