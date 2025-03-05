import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/frontend_assets/assets';
import NewsLetterBox from '../components/NewsLetterBox';
import { FaFacebookSquare, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'; // Import icons

const Contact = () => {
  return (
    <div>
      {/* Title Section */}
      <div className='ml-16 text-2xl pt-10 border-t'>
        <Title text1={"CONTACT"} text2={"US"} />
      </div>

      {/* Contact Content */}
      <div className='my-10 flex flex-col md:flex-row justify-center items-center gap-12 mb-28 px-4 md:px-16 h-full ' >
        {/* Image Section */}
        <div className='flex-1'>
          <img 
            src={assets.contact_img} 
            alt="Contact Illustration" 
            className='w-full md:max-w-[480px] rounded-md shadow-lg'
          />
        </div>

        {/* Contact Details */}
        <div className='flex-1 flex flex-col gap-8 text-gray-700  justify-center  border-2 border-orange-500 h-full p-4 lg:p-8 rounded-lg shadow-md'>
          {/* Store Details */}
          <div>
            <p className='font-semibold text-2xl text-gray-800 mb-2 teko tracking-wider'>Our Store</p>
            <p className='text-gray-500'>
            #98 Guru Nanak Nagar Nalas Road , Rajpura 
            <br />
            Punjab 141010
            </p>
            <p className='text-gray-500 mt-2'>
              Tel: xxxxxxxxxx <br />
              Email: <a href="mailto:hello@gmail.com" className='text-orange-500 font-medium hover:underline'>
                hello@gmail.com
              </a>
            </p>
          </div>

          {/* Social Media Links */}
          <div>
            <p className='font-semibold text-2xl text-gray-800 mb-2 teko tracking-wider'>Follow Us</p>
            <div className='flex items-center gap-6 text-2xl'>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className='text-gray-500 hover:text-blue-600 transition duration-300'>
                <FaFacebookSquare />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className='text-gray-500 hover:text-pink-500 transition duration-300'>
                <FaInstagram />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className='text-gray-500 hover:text-blue-700 transition duration-300'>
                <FaLinkedin />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className='text-gray-500 hover:text-blue-500 transition duration-300'>
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className='my-20'>
        <p className='text-center text-2xl font-semibold text-gray-800 mb-8 teko'>Find Us On The Map</p>
        <div className='w-full max-w-[1200px] mx-auto relative rounded-md overflow-hidden shadow-lg'>
          <iframe
            title="Store Location"
            className='w-full h-[400px] rounded-md'
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3423.8616109538475!2d75.91957419999999!3d30.890532150000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a9d23afdc4469%3A0xdcd54e75ccb6142!2sGuru%20Bagh%20Colony%2C%20Focal%20Point%2C%20Ludhiana%2C%20Punjab%20141014!5e0!3m2!1sen!2sin!4v1734619868806!5m2!1sen!2sin" 
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen={true}

            loading="lazy"
          ></iframe>
          <div className='absolute top-0 pointer-events-none left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black opacity-30'></div>
        </div>
      </div>

      {/* Newsletter Section */}
      {/* <div className='bg-gray-100 py-16'>
        <NewsLetterBox />
      </div> */}
    </div>
  );
};

export default Contact;
