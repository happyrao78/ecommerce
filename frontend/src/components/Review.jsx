import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import Button from './Button';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Modal from './Modal';

const ProductReviews = ({ productId }) => {
    const { token, backendUrl } = useContext(ShopContext);
    const [reviews, setReviews] = useState([]);
    const [formData, setFormData] = useState({
        rating: '',
        comment: '',
        images: [],
        video: null
    });
    const [error, setError] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [ratingCounts, setRatingCounts] = useState([0, 0, 0, 0, 0]);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (token) {
            fetchReviews();
        }
    }, [productId, token]);

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/review/${productId}/get-review`,
                { headers: { token } }
            );
            const fetchedReviews = response.data;
            setReviews(fetchedReviews);

            const counts = Array(5).fill(0);
            fetchedReviews.forEach((review) => {
                if (review.rating >= 1 && review.rating <= 5) {
                    counts[review.rating - 1] += 1;
                }
            });
            setRatingCounts(counts);
        } catch (err) {
            console.error('Error fetching reviews:', err);
            toast.error('Failed to fetch reviews');
        }
    };

    useEffect(()=>{
        console.log(reviews)
    },[reviews])

    const calculateAverageRating = () => {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return reviews.length ? totalRating / reviews.length : 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        const fileType = e.target.name;

        if (fileType === "video") {
            const file = files[0];
            if (file) {
                // 100MB in bytes
                const maxSize = 100 * 1024 * 1024;

                if (file.size > maxSize) {
                    setError('Video file is too large. Please upload a file smaller than 100MB.');
                    return;
                }

                if (!file.type.startsWith('video/')) {
                    setError('Please upload a valid video file.');
                    return;
                }
            }
        }

        setFormData(prev => {
            if (fileType === "images") {
                return { ...prev, images: Array.from(files) };
            } else if (fileType === "video") {
                return { ...prev, video: files[0] };
            }
            return prev;
        });
        setError(''); // Clear any previous errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.comment || !formData.rating) {
            setError('Please fill in all required fields (rating and comment).');
            return;
        }

        setIsUploading(true);
        try {
            const data = new FormData();
            data.append('comment', formData.comment);
            data.append('rating', formData.rating);

            // Append images
            formData.images.forEach((image, index) => {
                data.append(`image${index + 1}`, image);
            });

            // Append video if exists
            if (formData.video) {
                data.append('video', formData.video);
            }

            const response = await axios.post(
                `${backendUrl}/api/review/${productId}/add-review`,
                data,
                {
                    headers: {
                        token,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            await fetchReviews(); // Refresh reviews
            toast.success(response.data.message);

            // Reset form
            setFormData({
                rating: '',
                comment: '',
                images: [],
                video: null
            });
            setError('');
            setIsFormVisible(false);
        } catch (err) {
            console.error('Error submitting review:', err);
            toast.error(err.response?.data?.message || 'Failed to submit review');
            setError('Failed to submit review. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleStarClick = (rating) => {
        setFormData(prev => ({ ...prev, rating }));
    };

    return (
        <div className="p-4">
            {!token ? (
                <div>
                    <p>Please log in to read and submit reviews.</p>
                    <Link to="/login">
                        <Button className="mt-4">Login</Button>
                    </Link>
                </div>
            ) : (
                <>
                    {/* <h1 className='text-4xl font-medium m-4' >Reviews</h1> */}

                    <div className='w-full gap-0 sm:flex sm:flex-row lg:grid lg:grid-cols-3 items-center border justify-center'>
                        {reviews.length > 0 && (
                            <div className='flex flex-col items-center justify-center w-full h-full p-4'>
                                <span className='w-full h-full text-3xl sm:text-3xl lg:text-5xl font-bold flex justify-center items-end py-1 sm:py-1 lg:py-2'>{calculateAverageRating().toFixed(1)}</span>
                                <div className="flex items-start gap-2 justify-center w-full h-full ">
                                    <span className="font-bold text-xl">Average Rating: </span>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((rate) => (
                                            <span
                                                key={rate}
                                                className={`text-2xl ${calculateAverageRating() >= rate ? 'text-yellow-500' : 'text-gray-400'}`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>

                                </div>

                            </div>
                        )}

                        {reviews.length > 0 && (
                            <div className="w-full h-full items-center border p-4">
                                {ratingCounts.map((count, index) => {
                                    const percentage = (count / reviews.length) * 100;
                                    return (
                                        <div key={index} className="flex items-center mb-2">
                                            <div>
                                                <span className="text-yellow-500 text-lg">{'★'.repeat(index + 1)}</span>
                                                <span className="text-gray-500 text-lg">{'★'.repeat(5 - (index + 1))}</span>
                                            </div>
                                            <div className="ml-4 flex-1 bg-gray-200 rounded-full h-2 relative">
                                                <div
                                                    className="bg-yellow-500 h-2 rounded-full"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <p className="ml-2">{count}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className='w-full h-full border flex items-center justify-center p-6'>
                            <Button
                                onClick={() => setIsFormVisible(prev => !prev)}
                                disabled={isUploading}
                                className="flex items-center justify-center"
                            >
                                {isFormVisible ? 'Cancel Review' : 'Write a Review'}
                            </Button>
                        </div>
                    </div>

                    <Modal isVisible={isFormVisible} onClose={() => setIsFormVisible(false)}>
                        <h3 className="text-lg font-bold mb-4">Add a Review</h3>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((rate) => (
                                    <span
                                        key={rate}
                                        className={`cursor-pointer text-2xl ${formData.rating >= rate ? 'text-yellow-500' : 'text-gray-400'}`}
                                        onClick={() => handleStarClick(rate)}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>

                            <textarea
                                name="comment"
                                value={formData.comment}
                                onChange={handleChange}
                                placeholder="Write your review here..."
                                className="border px-4 py-2 rounded"
                                required
                            />

                            <div className="space-y-2">
                                <label className="block">
                                    <span className="text-gray-700">Upload Images:</span>
                                    <input
                                        type="file"
                                        name="images"
                                        multiple
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="mt-1 block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-gray-700">Upload Video:</span>
                                    <input
                                        type="file"
                                        name="video"
                                        onChange={handleFileChange}
                                        accept="video/*"
                                        className="mt-1 block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100"
                                    />
                                </label>
                            </div>

                            <Button
                                type="submit"
                                disabled={isUploading}
                                className="w-full"
                            >
                                {isUploading ? 'Uploading...' : 'Submit Review'}
                            </Button>
                        </form>
                    </Modal>

                    <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500 mt-4">
                        {reviews.length === 0 ? (
                            <p>No reviews yet. Be the first to review this product!</p>
                        ) : (
                            (showAllReviews ? reviews : reviews.slice(0, 7)).reverse().map((review, index) => (
                                <div key={index} className="border-b pb-4 mb-4">
                                    <h3 className="font-bold text-xl">{review.name}</h3>
                                    <h4 className="text-yellow-500 text-lg">Rating: {'★'.repeat(review.rating)}</h4>
                                    <h4 className="text-gray-700 text-lg">{review.comment}</h4>

                                    <div className='flex gap-2'>

                                    {review.images?.length > 0 && (
                                        <div className="flex gap-2 mt-2 flex-wrap">
                                            {review.images.map((img, idx) => (
                                                <a
                                                    key={idx}
                                                    href={img}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`review-${idx + 1}`}
                                                        className="w-20 h-20 object-cover rounded"
                                                    />
                                                </a>
                                            ))}
                                        </div>
                                    )}

                                    {review.videos?.[0].length > 0 && (
                                        <div className="flex gap-2 mt-2 flex-wrap">
                                            {review.videos.map((videoUrl, idx) => (
                                                <video
                                                    key={idx}
                                                    width="100"
                                                    height="80"
                                                    controls
                                                    className="mt-2 rounded"
                                                >
                                                    <source src={videoUrl} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            ))}
                                        </div>
                                    )}
                                    </div>

                                    <p className="text-xs text-gray-400 mt-2">
                                        {new Date(review.date).toLocaleDateString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                    {reviews.length > 7 && (
                        <Button
                            onClick={() => setShowAllReviews(prev => !prev)}
                            className="m-4"
                        >
                            {showAllReviews ? 'Show Less Reviews' : 'Load All Reviews'}
                        </Button>
                    )}
                </>
            )}
        </div>
    );
};

export default ProductReviews;