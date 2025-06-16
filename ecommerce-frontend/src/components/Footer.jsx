import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div>
            <h4 className="font-bold text-gray-700 mb-2">Furniro</h4>
            <p className="text-sm text-gray-600">400 University Drive Suite 200 Coral Gables, FL 33134 USA</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-700 mb-2">Links</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><a href="/home">Home</a></li>
              <li><a href="/shop">Shop</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-700 mb-2">Help</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Payment Options</li>
              <li>Returns</li>
              <li>Privacy Policies</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-700 mb-2">Newsletter</h4>
            <input type="text" placeholder="Enter your email" className="w-full px-3 py-2 border rounded mb-2" />
            <button className="bg-yellow-500 text-white w-full py-2 rounded hover:bg-yellow-600 transition">Subscribe</button>
          </div>
        </div>
      </footer>
  )
}

export default Footer
