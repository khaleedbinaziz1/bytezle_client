'use client';

import React, { useEffect, Suspense } from 'react';
import Navbar from './pages/Navbar/Navbar';
import Footer from './pages/Shared/Footer/Footer';
import Hero from './pages/Hero/Hero';
import InfoCards from './pages/InfoCards/InfoCards';
import Categories from './pages/categories/Categories';
import FeaturedProducts from './pages/FeaturedProducts/FeaturedProducts';
import WeeklyDeals from './pages/WeeklyDeals/WeeklyDeals';
import Banner from '@/components/Banner/Banner';
import { ToastContainer } from 'react-toastify';
import BabyItem from './pages/FiveSelCat/BabyItem';
import Breakfast from './pages/FiveSelCat/Breakfast';
import DipsSpread from './pages/FiveSelCat/DipsSpreads';
import RefreshmentHaven from './pages/FiveSelCat/RefreshmentHaven';
import GoUpButton from './GoUpButton'; // Import the GoUpButton component
import { useRouter } from 'next/navigation';
import Messenger from '@/components/messenger';
import AllProducts from './pages/AllProducts/AllProducts';

export default function Home() {





  return (
    <div>

      <div className="main-content overflow-y-auto app">

        <Suspense fallback={<div><span className="loading loading-infinity loading-lg"></span></div>}>
        
          <Hero />
          <Messenger />
          <InfoCards />
          <Categories />


          <FeaturedProducts />
          <AllProducts />

        </Suspense>
      </div>
      <GoUpButton />
    </div>
  );
}
