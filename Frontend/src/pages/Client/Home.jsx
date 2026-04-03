import React from 'react'
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import LatestCollection from '../../components/LatestCollection';
import PolicySection from '../../components/PolicySection';
const home = () => {
  return (
    <main className="pt-24 px-5">
    <div>
      <Navbar />
      {/* Content starts after navbar */}
      
       <Hero />
       <LatestCollection />
       <PolicySection/>
      
    </div>
    </main>
  );
}

export default home
