import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Modal from "./Modal"; // Import Modal
import Title from "./Title"; // Import Title component
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { assets } from "../assets/frontend_assets/assets";

// const reviews = [
//   {
//     id: 1,
//     name: "Sunita Sinha",
//     rating: 5,
//     description: "Amazing product! The pain relief oil worked wonders for my chronic knee pain. I started noticing significant relief within a week of using it. Highly recommend it to anyone dealing with joint or back pain.",
//     image: assets.productTwo,
//     caption: "Works wonders!",
//   },
//   {
//     id: 2,
//     name: "Pranjal Samrat",
//     rating: 5,
//     description: "Dard-e-Dhuan pain relief oil is very effective. I’ve been using it for my cervical pain, and the results have been impressive. The soothing effect lasts for hours, providing comfort throughout the day.",
//     image: assets.productTwo,
//     caption: "Very Effective!",
//   },
//   {
//     id: 3,
//     name: "Komal Tuteja",
//     rating: 4.5,
//     description: "These capsules are a game changer! My joint stiffness and discomfort have significantly reduced. I feel so much more active now. A must-try for anyone with joint pain.",
//     image: assets.productOne,
//     caption: "A must-try!",
//   },
//   {
//     id: 4,
//     name: "Hriday Singh",
//     rating: 4.5,
//     description: "I tried Dard-E-Dhuan for back pain, and it’s been really helpful. It’s a must-have for anyone seeking natural pain relief, though the smell could be milder.",
//     image: assets.productTwo,
//     caption: "Worth the money!",
//   },
//   {
//     id: 5,
//     name: "Deepika Sharma",
//     rating: 4.5,
//     description: "Highly effective capsules for chronic pain! I’ve tried many Ayurvedic products, but Dard-E-Mukta stands out in its ability to provide lasting relief. Worth every penny.",

//     image: assets.productOne,
//     caption: "Dard-E-Mukta stands out.",
//   },
// ];

const reviews = [

  {
    id: 1,
    name: "Amit Varma",
    rating: 4,
    description: "The service was fantastic. My queries were addressed promptly, and the support team was very understanding and helpful.",
    image: assets.about_img,
    caption: "Great support team!",
  },
  {
    id: 2,
    name: "Ritu Raj",
    rating: 5,
    description: "I was skeptical at first, but I am impressed by the effectiveness of these products. They’re natural, affordable, and show visible results.",
    image: assets.about_img,
    caption: "Highly recommended!",
  },
  {
    id: 3,
    name: "Sneha Kapoor",
    rating: 4.5,
    description: "What I appreciate most is the attention to detail in packaging and the easy-to-follow instructions. Great experience overall!",
    image: assets.about_img,
    caption: "Thoughtful design.",
  },
  {
    id: 4,
    name: "Rajiv Nair",
    rating: 4,
    description: "The delivery was quick, and the product arrived in perfect condition. It’s great to see such efficiency in logistics.",
    image: assets.about_img,
    caption: "Efficient delivery.",
  },
  {
    id: 5,
    name: "Ananya Bose",
    rating: 5,
    description: "I’ve recommended this brand to all my friends and family. Reliable and trustworthy with excellent results.",
    image: assets.about_img,
    caption: "A brand you can trust.",
  },
];



const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} z-10 absolute left-0 top-1/2 transform -translate-y-1/2 cursor-pointer`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      <div className="text-xl text-gray-400 hover:text-gray-600"><FaArrowLeft /></div>
    </div>
  );
};

const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} z-10 absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      <div className="text-xl text-gray-400 hover:text-gray-600"><FaArrowRight /></div>
    </div>
  );
};

const HomeFeedback = () => {
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = (review) => {
    setSelectedReview(review);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedReview(null);
  };

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    // prevArrow: <CustomPrevArrow />,
    // nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="w-full py-8 bg-white text-center relative mt-10 sm:mt-10 lg:mt-4 overflow-hidden">
      <Title text1={"Customers"} text2={"Say !"} />

      <Slider {...settings}>
        {reviews.map((review) => (
          // <div key={review.id} className="p-4 hover:scale-105 transition-all ease-in-out">
          //   <div
          //     className="flex flex-col items-center justify-center p-4 rounded-lg shadow-md border cursor-pointer"
          //     onClick={() => openModal(review)}
          //   >
          //     <img
          //       src={review.image}
          //       alt={review.name}
          //       className="w-full h-40 object-cover rounded-lg mb-4"
          //     />
          //     <p className="text-md text-gray-500 m-1">{review.caption}</p>
          //     <h3 className="font-bold text-lg">{review.name}</h3>
          //     <div className="flex items-center justify-center my-1">
          //       {[1, 2, 3, 4, 5].map((rate, index) => (
          //         <span
          //           key={index}
          //           className={`text-xl ${
          //             rate <= Math.floor(review.rating)
          //               ? "text-yellow-500"
          //               : "text-gray-300"
          //           }`}
          //         >
          //           ★
          //         </span>
          //       ))}
          //     </div>
          //     <p className="text-gray-600 text-sm text-center">
          //   {review.description.slice(0, 50).trim()}...
          //     </p>
          //   </div>
          // </div>
          <div key={review.id} className="p-0 sm:p-0 lg:p-4 hover:scale-105 transition-all ease-in-out lg:mt-4 ">
            {/* <div
              className="flex items-center justify-center  rounded-lg  cursor-pointer bg-white border"
              onClick={() => openModal(review)}
            > */}
            <div
              className="flex items-center justify-center  rounded-lg  cursor-pointer bg-white border "
              
            >
              <div className="hidden lg:block lg:w-full lg:h-[350px] overflow-hidden object-cover ">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-start items-start px-0 sm:px-0 lg:px-4 max-w-[350px] xs:ml-4 lg:ml-0 sm:ml-4 ml-4">
                <div className="flex flex-col justify-start items-start gap-2 py-4">
                <div className="flex ">
                  {[1, 2, 3, 4, 5].map((rate, index) => (
                    <span
                      key={index}
                      className={`text-xl ${rate <= Math.floor(review.rating)
                        ? "text-yellow-500"
                        : "text-gray-300"
                        }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className=" text-sm sm:text-sm lg:text-md text-gray-500 text-left">
                  {review.description}
                </p>
                {/* <p className="text-xs text-gray-500 my-1">{review.caption}</p> */}
                <h3 className="font-medium text-md sm:text-md lg:text-xl text-black">{review.name}</h3>
                </div>

                <div className="flex py-4 justify-start gap-4 items-center w-full border-t">
                  

                  <img src={review.image} alt=""  className="w-16 h-16 rounded-full"/>
                  <div className="flex flex-col justify-start items-start">
                  <h1 className="text-xs sm:text-xs lg:text-md font-medium">Product Reviewed Name</h1>
                  <h2 className="text-sm ">Rs 999</h2>
                  </div>
                 
                  
                </div>

              </div>
            </div>
          </div>

        ))}
      </Slider>

      {/* Modal */}
      <Modal isVisible={isModalVisible} onClose={closeModal}>
        {selectedReview && (
          <div className="flex flex-col items-center">
            <img
              src={selectedReview.image}
              alt={selectedReview.name}
              className="w-full h-52 object-cover rounded-lg mb-4"
            />
            <h3 className="text-2xl font-bold mb-2">{selectedReview.name}</h3>
            <div className="flex items-center mb-2">
              {[1, 2, 3, 4, 5].map((rate, index) => (
                <span
                  key={index}
                  className={`text-2xl ${rate <= Math.floor(selectedReview.rating)
                    ? "text-yellow-500"
                    : "text-gray-300"
                    }`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-gray-700 text-center">
              {selectedReview.description}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HomeFeedback;
