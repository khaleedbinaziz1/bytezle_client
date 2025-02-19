import React, { Suspense } from 'react';

import Navbar from '../Navbar/Navbar';
import Footer from '../Shared/Footer/Footer';
import ProductsContent from './ProductsContent';

const Products = () => {
  return (
    <>

      <div className="container mx-auto pt-10" style={{marginTop:'130px'}}>
        <Suspense fallback={<div className="text-center">Loading fresh deals...</div>}>
          <ProductsContent />
        </Suspense>
      </div>

    </>
  );
};

export default Products;
