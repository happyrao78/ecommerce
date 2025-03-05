import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/frontend_assets/assets';
import NewsLetterBox from "../components/NewsLetterBox";

const About = () => {
  return (
    <div>
      {/* FOUNDER'S NOTE */}
      <div className='text-2xl pt-8 border-t'>
        <Title text1={"FOUNDER'S"} text2={"NOTE"} />
      </div>

      <div className='my-10 flex flex-col md:flex-row items-center gap-12'>
        {/* Founder Image */}
        <img
          src={assets.about_img}
          alt="founder-image"
          className='w-full md:max-w-[350px] rounded-md shadow-lg'
        />

        {/* Founder Message */}
        <div className='flex flex-col justify-center gap-4 md:w-3/5 text-gray-700'>
          <p className='text-md  sm:text-md lg:text-lg leading-relaxed'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum non ipsam sequi maiores aperiam odit omnis aspernatur officia a dicta, provident in, unde quae id quos dolores tenetur tempora atque minus reiciendis debitis! Provident iusto nesciunt ab quae unde quia excepturi nisi sed. Natus sint eaque magnam ad vitae at.
          </p>
          <p className='text-md  sm:text-md lg:text-lg leading-relaxed'>
            Feel free to shoot me an email at <a href="hello@gmail.com" className='text-orange-500 font-semibold hover:underline'>
              hello@gmail.com
            </a> or connect with me on LinkedIn if you need any help!
          </p>
          <div className='mt-4'>
            <b className='text-gray-800 text-2xl sm:text-2xl lg:text-3xl teko tracking-wider'>Happy Yadav</b>
            <p className='text-sm text-gray-600'>Founder</p>
          </div>
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className='text-xl py-4'>
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>
      <div className='flex flex-col md:flex-row text-md mb-20'>
        {/* Feature 1 */}
        <div className='border px-8 md:px-16 py-8 sm:py-16 flex flex-col gap-5
            transition-all duration-300 ease-in-out hover:bg-orange-600 hover:text-white'>
          <b className='text-2xl sm:text-2xl lg:text-3xl teko tracking-wider'>Quality Assurance:</b>
          <p>
            We ensure high-quality mentoring and guidance to help students excel in their professional journeys.
          </p>
        </div>
        {/* Feature 2 */}
        <div className='border px-8 md:px-16 py-8 sm:py-16 flex flex-col gap-5
            transition-all duration-300 ease-in-out hover:bg-orange-600 hover:text-white'>
          <b className='text-2xl sm:text-2xl lg:text-3xl teko tracking-wider'>Convenience:</b>
          <p>
            Our platform offers a user-friendly experience, allowing students to connect seamlessly with mentors.
          </p>
        </div>
        {/* Feature 3 */}
        <div className='border px-8 md:px-16 py-8 sm:py-16 flex flex-col gap-5
            transition-all duration-300 ease-in-out hover:bg-orange-600 hover:text-white'>
          <b className='text-2xl sm:text-2xl lg:text-3xl teko tracking-wider'>Exceptional Customer Service:</b>
          <p>
            Our team is always ready to provide support and address your queries efficiently.
          </p>
        </div>
      </div>

      {/* DEMO OF PRODUCT */}
      <div className='text-xl py-4'>
        <Title text1={"DEMO OF"} text2={"PRODUCT"} />
      </div>
      <div className='flex justify-center items-center mb-20'>
        <div className='w-full max-w-[800px]'>
          <iframe
            className='w-full aspect-video rounded-md shadow-lg'
            src="https://www.youtube.com/embed"
            title="Product Demo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Newsletter Section */}
      {/* <NewsLetterBox /> */}
    </div>
  );
};

export default About;
