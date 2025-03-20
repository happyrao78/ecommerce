import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UiContext } from "../context/UiContext";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";



export default function CategorySlider() {

    const { isCategoriesOpen, closeCategories } = useContext(UiContext)
    const { subCategoryData} = useContext(ShopContext)
    const isOpen = isCategoriesOpen
    const onClose = () => closeCategories()


    const categories= Object.keys(subCategoryData).length > 0
    ? Object.entries(subCategoryData).flatMap(([category, subcategories]) => [
        // First add the main category
        { name: category.charAt(0).toUpperCase() + category.slice(1), subCategory:subcategories.map(subcategory => (
          `${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}`
      ))},
    ]): []

    useEffect(() => {
        console.log(isCategoriesOpen,isOpen,categories)
    },[isCategoriesOpen,isOpen])

    return (
        <div
      className={`fixed inset-0 bg-white shadow-lg z-20 w-3/4 sm:w-1/2 md:w-1/3 h-full p-4 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <h2 className="text-lg font-semibold">Categories</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-black">
          ✕
        </button>
      </div>

      {/* Category List */}
      <div className="mt-4 space-y-3">
        {categories.map((category, index) => (
          <CategoryItem key={index} category={category} />
        ))}
      </div>
    </div>
    );
}

function CategoryItem({ category }) {
    const [expanded, setExpanded] = useState(false);

    return (
      <div className="border-b py-2">
        <button
          className="w-full flex items-center justify-between text-left"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center space-x-3">
            <span className="font-medium">{category.name}</span>
          </div>
          <span>{expanded ? "-" : "+"}</span>
        </button>
        {expanded && (
          <div className="pl-4 text-sm text-gray-600 ">
            {category.subCategory.map((sub, index) => (
              <Link to={`/category/${category.name.toLowerCase()}/${sub.toLowerCase()}`} key={index}>
              <div key={index} className="m-1">{sub}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
}
