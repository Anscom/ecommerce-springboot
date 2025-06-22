import { useState, useEffect } from 'react'
import { useAuthStore } from '../stores/useAuthStore'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, error, isAuthenticated, loading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(email, password)
  }

  // 🔍 Watch for successful login
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

return (
    <div className="flex min-h-screen">
      {/* Left Side (Image) */}
      <div className="hidden md:flex w-1/2 items-center justify-center">
        <img
          src="https://img.freepik.com/free-photo/interior-clothing-store-with-stylish-merchandise-racks-fashionable-brand-design-casual-wear-modern-boutique-empty-fashion-showroom-shopping-centre-with-elegant-merchandise_482257-65537.jpg?semt=ais_items_boosted&w=740"
          alt="Lighthouse"
          className="w-full h-full object-cover rounded-l-2xl"
        />
      </div>

      {/* Right Side (Form) */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white rounded-r-2xl p-8">
        <div className="max-w-md w-full">
          <div className="flex items-center space-x-3 mb-6">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/028/244/679/small/white-t-shirt-mockup-male-t-shirt-with-short-sleeves-front-back-view-realistic-3d-mock-up-ai-generated-photo.jpg"
              alt="Logo"
              className="w-8 h-8"
            />
            <span className="text-lg font-semibold">Shirt CO</span>
          </div>
          <h2 className="text-2xl font-bold mb-1">Nice to see you again</h2>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-sm text-right mt-1">
                <a href="#" className="text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <label className="text-sm">Remember me</label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
                  {error && <p>{error}</p>}

            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-2 text-sm text-gray-400">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>
<button
  className="w-full flex items-center justify-center bg-black text-white py-2 rounded-md"
  onClick={() => {
    window.location.href = "https://a-ecommerce.anscom-dev.com/oauth2/authorization/google";
  }}
>
  <img
    src="https://img.icons8.com/?size=100&id=4hR4Ih04Je2t&format=png&color=000000"
    alt="Google"
    className="w-5 h-5 mr-2"
  />
  Or sign in with Google
</button>

            <p className="text-center text-sm mt-4">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-600 hover:underline">
                Sign up now
              </a>
            </p>

            <div className="mt-8 flex justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <img
                  src="https://static.vecteezy.com/system/resources/thumbnails/028/244/679/small/white-t-shirt-mockup-male-t-shirt-with-short-sleeves-front-back-view-realistic-3d-mock-up-ai-generated-photo.jpg"
                  alt="shirtco"
                  className="w-4 h-4"
                />
                <span>@shirtco</span>
              </div>
              <span>© Shirt CO 2025</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage
