import React, { Suspense } from 'react';
import FreshDealsContent from './FreshDealsContent';
import Navbar from '../Navbar/Navbar';
import Footer from '../Shared/Footer/Footer';

const FreshDeals = () => {
  return (
    <>

      <div className="container mx-auto pt-10" style={{marginTop:'130px'}}>
        <Suspense fallback={<div className="text-center">Loading fresh deals...</div>}>
          <FreshDealsContent />
        </Suspense>
      </div>

    </>
  );
};

export default FreshDeals;
