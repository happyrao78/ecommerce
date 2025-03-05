import { useState, useContext } from "react";
import { Search, X } from "lucide-react";
import { ShopContext } from "../context/ShopContext";
import RecentlyViewed from "./RecentlyViewed";
import ProductItem from "../components/ProductItem";

const SearchModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { products } = useContext(ShopContext);

  const featureKeywords = ["women", "men", "children", "women top"];
  
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {/* Search Icon to Trigger Modal */}
      <button onClick={() => setIsOpen(true)}>
        <Search className="w-6 h-6" />
      </button>
      
      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex flex-col items-center p-6 shadow-lg">
          <div className="bg-white w-full max-w-6xl p-6 rounded-lg relative overflow-scroll">
            {/* Close Button */}
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-6">
              <X className="w-6 h-6" />
            </button>

            {/* Search Input */}
            <div className="w-full flex items-center border border-gray-300 rounded-lg px-4 py-2 mt-10">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Searching..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full outline-none bg-transparent pl-2 text-lg"
              />
            </div>

            {/* Feature Keywords */}
            <div className="mt-6 w-full">
              <h2 className="text-xl font-medium">Featured Keywords</h2>
              <div className="flex gap-2 mt-4 flex-wrap">
                {featureKeywords.map((keyword) => (
                  <button key={keyword} onClick={() => setQuery(keyword)} className="px-4 py-2 border rounded-full text-gray-700">
                    {keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Results */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductItem key={product._id} {...product} />
                ))
              ) : (
                <p className="text-gray-500">No products found.</p>
              )}
            </div>

            {/* Recently Viewed Products */}
            {/* <RecentlyViewed /> */}
          </div>
        </div>
      )}
    </>
  );
};

export default SearchModal;
