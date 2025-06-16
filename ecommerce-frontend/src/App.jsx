import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import { Routes, Route } from 'react-router-dom'
import SignUpPage from './pages/SignUpPage'
import HomePage from './pages/HomePage'
import OAuth2RedirectHandler from "./pages/OAuth2RedirectHandler"
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ShopPage from './pages/ShopPage'
import ItemDetailPage from './pages/ItemDetailPage'
import ContactPage from './pages/ContactPage'
import CheckoutPage from './pages/CheckoutPage'
import CheckoutSuccessPage from './pages/CheckoutSuccessPage'
import CreateItemPage from './pages/CreateItemPage'
import AdminRoute from './protection/AdminRoute'
import UpdateItemPage from './pages/UpdateItemPage'
import ItemListPage from './pages/ItemListPage'

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/signup' element={<SignUpPage />}/>
        <Route path="/oauth2/success" element={<OAuth2RedirectHandler />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/shop' element={<ShopPage />} />
        <Route path="/shop/:id" element={<ItemDetailPage />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/checkout' element={<CheckoutPage />} />
        <Route path='/checkout-success' element={<CheckoutSuccessPage />} />
          <Route
          path="/create-item"
          element={
            <AdminRoute>
              <CreateItemPage />
            </AdminRoute>
          }
        />
          <Route
          path="/items/update/:itemId"
          element={
            <AdminRoute>
              <UpdateItemPage />
            </AdminRoute>
          }
        />
          <Route
          path="/items"
          element={
            <AdminRoute>
              <ItemListPage />
            </AdminRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  )
}

export default App
