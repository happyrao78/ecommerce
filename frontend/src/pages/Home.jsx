import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsLetterBox from '../components/NewsLetterBox'
import WhatsAppChat from './Whatsapp'
import HomeFeedback from '../components/HomeFeedback'
import Freeship from '../components/Freeship'
import CategoriesSlider from '../components/CategoriesSlider'
import FeaturedCollectionSlider from '../components/FeaturedCollectionBanner'
import SpecialOffer from '../components/SpecialOfferBanner'
import Top from '../components/Top'
import New from '../components/New'
import Hot from '../components/Hot'
import Popular from '../components/Popular'
// import Freeship from '../components/Freeship'

const Home = () => {
  return (
    <div>
        
        {/* <Hero/> */}
        <CategoriesSlider/>
        <LatestCollection/>
        <FeaturedCollectionSlider/>
        <BestSeller/>
        <SpecialOffer/>
        <Top />
        <New />
        <Hot />
        <Popular />
        <OurPolicy/>
        <HomeFeedback/>
        {/* <NewsLetterBox/> */}
        <WhatsAppChat />
    </div>
  )
}

export default Home