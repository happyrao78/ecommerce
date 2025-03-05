import React from "react";
import { toast } from "react-toastify";
import Button from "./Button";
import {Toaster} from "react-hot-toast"
import Title from "./Title";

const NewsLetterBox = () => {
  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Simulate form submission success
    const form = event.target;

    // Use fetch API to submit the form data to Web3Forms
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: new FormData(form),
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Review sent successfully!");
          form.reset();
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      })
      .catch(() => toast.error("Something went wrong. Please try again."));
  };

  return (
    <div className="text-center animate-fadeIn mt-20">
      {/* Toaster for Notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Heading */}
      <Title className="text-3xl font-medium text-gray-800 transition-transform duration-500 hover:scale-105" text1={"REVIEW"} text2={"US"}/>
        
  

      {/* Subheading */}
      <p className="text-gray-500  hover:opacity-100 transition-opacity duration-300 text-md">
        We'd love to hear your thoughts and feedback!
      </p>

      {/* Form */}
      <form
        onSubmit={handleFormSubmit}
        className="w-full sm:w-1/2 flex flex-col gap-4 mx-auto my-6 p-4 border border-gray-300 rounded-lg transition-all duration-300 focus-within:border-indigo-500 focus-within:shadow-lg"
      >
        {/* Hidden Access Key */}
        <input
          type="hidden"
          name="access_key"
          value="8c1faef5-4354-4e6b-b812-9687c9243ee8"
        />

        {/* Name Field */}
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="w-full outline-none text-gray-700 bg-transparent placeholder-gray-400 py-2 px-3 rounded-md transition-colors duration-300 focus:text-gray-900 focus:placeholder-gray-600 border border-gray-300 focus:border-indigo-500"
          required
        />

        {/* Email Field */}
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          className="w-full outline-none text-gray-700 bg-transparent placeholder-gray-400 py-2 px-3 rounded-md transition-colors duration-300 focus:text-gray-900 focus:placeholder-gray-600 border border-gray-300 focus:border-indigo-500"
          required
        />

        {/* Review Field */}
        <textarea
          name="review"
          placeholder="Write your review here"
          rows="4"
          className="w-full outline-none text-gray-700 bg-transparent placeholder-gray-400 py-2 px-3 rounded-md transition-colors duration-300 focus:text-gray-900 focus:placeholder-gray-600 border border-gray-300 focus:border-indigo-500 resize-none"
          required
        ></textarea>

        {/* Submit Button */}
        <Button
          type="submit"
          className=""
        >
          SUBMIT
        </Button>
      </form>
    </div>
  );
};

export default NewsLetterBox;
