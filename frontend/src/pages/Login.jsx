

import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Button from '../components/Button';
import { LockIcon, MailIcon, UserIcon } from 'lucide-react';
import { FcGoogle } from "react-icons/fc";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth } from './FirebaseConfig.jsx'; // Ensure you have this Firebase config file

const Login = () => {
    const [currentState, setCurrentState] = useState("Login");
    const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    // Standard Email/Password Authentication
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Firebase authentication
            if (currentState === "Sign Up") {
                // Create user with Firebase
                try {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    console.log(userCredential)
                    const firebaseUser = userCredential.user;

                    // Send to backend for additional user registration
                    const response = await axios.post(backendUrl + "/api/user/register", { 
                        name: name || firebaseUser.displayName, 
                        email, 
                        firebaseUid: firebaseUser.uid,
                        emailPasswordSignIn: true,
                        password,
                        googleId:null
                
                    });

                    console.log(response)
                    
                    if (response.data.success) {
                        toast.success("Sign Up successful!");
                        setToken(response.data.token);
                        localStorage.setItem("token", response.data.token);
                        navigate("/");
                    }
                } catch (error) {
                    if (error.code === 'auth/email-already-in-use') {
                        toast.error("Email already in use. Please use a different email.");
                    } else {
                        throw error;
                    }
                }
            } else {
                // Sign in with Firebase
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log(userCredential)
                const firebaseUser = userCredential.user;

                // Verify with backend
                const response = await axios.post(backendUrl + "/api/user/login", { 
                    email, 
                    firebaseUid: firebaseUser.uid,
                    emailPasswordSignIn:true


                });

                console.log(response)

                if (response.data.success) {
                    toast.success("Login successful!");
                    setToken(response.data.token);
                    localStorage.setItem("token", response.data.token);
                    navigate("/");
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Google Authentication
    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Send to backend for authentication/registration
            const endpoint = currentState === "Sign Up" 
                ? "/api/user/register" 
                : "/api/user/login";

            const payload = {
                name: user.displayName,
                email: user.email,
                firebaseUid: user.uid,
                googleSignIn: true
            };

            const response = await axios.post(backendUrl + endpoint, payload);
            
            if (response.data.success) {
                console.log(response)
                toast.success(`${currentState} with Google successful!`);
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                navigate("/");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Google Sign-In Error", error);
            toast.error(error.message);
        } finally {
            setIsGoogleLoading(false);
        }
    };

    useEffect(() => {
        if (token) navigate("/");
    }, [token, navigate]);

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] bg-white px-4 py-8 sm:py-12 w-full">
            <div className="w-full max-w-md mx-auto">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-black px-4 sm:px-6 py-6 sm:py-8 text-white">
                        <h2 className="text-2xl sm:text-3xl font-bold text-center">
                            {currentState === "Login" ? "Welcome Back" : "Create Account"}
                        </h2>
                        <p className="text-gray-300 text-sm sm:text-base text-center mt-2">
                            {currentState === "Login" 
                                ? "Sign in to access your account" 
                                : "Join us and start shopping today"}
                        </p>
                    </div>

                    {/* Form */}
                    <div className="p-4 sm:p-6 md:p-8">
                        <form onSubmit={onSubmitHandler} className="space-y-4 sm:space-y-6">
                            {currentState === "Sign Up" && (
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
                                        placeholder="Full Name"
                                        required
                                        onChange={(e) => setName(e.target.value)}
                                        value={name}
                                    />
                                </div>
                            )}
                            
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MailIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
                                    placeholder="Email Address"
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                />
                            </div>
                            
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
                                    placeholder="Password"
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                />
                            </div>
                            
                            {/* {currentState === "Login" && (
                                <div className="flex justify-end">
                                    <a href="#" className="text-xs sm:text-sm text-blue-600 hover:text-blue-800">
                                        Forgot Password?
                                    </a>
                                </div>
                            )} */}
                            
                            <Button 
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="inline-block h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                ) : null}
                                {currentState === "Login" ? "Sign In" : "Create Account"}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center my-4">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="mx-4 text-gray-500 text-sm">or</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        {/* Google Sign In/Up Button */}
                        <div className='w-full'>
                        <Button 
                            variant="outline" 
                            className="w-full "
                            onClick={handleGoogleSignIn}
                            disabled={isGoogleLoading}
                        >
                            {isGoogleLoading ? (
                                <span className="inline-block h-4 w-4 sm:h-5 sm:w-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></span>
                            ) : (
                                <FcGoogle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                            )}
                            {currentState === "Login" ? "Sign in with Google" : "Sign up with Google"}
                        </Button>
                        </div>
                        
                        <div className="text-center mt-4 sm:mt-6">
                            {currentState === "Login" ? (
                                <p className="text-gray-600 text-xs sm:text-sm">
                                    Don't have an account?{" "}
                                    <button 
                                        type="button"
                                        className="font-medium text-blue-600 hover:text-blue-800" 
                                        onClick={() => setCurrentState("Sign Up")}
                                    >
                                        Sign Up
                                    </button>
                                </p>
                            ) : (
                                <p className="text-gray-600 text-xs sm:text-sm">
                                    Already have an account?{" "}
                                    <button 
                                        type="button"
                                        className="font-medium text-blue-600 hover:text-blue-800" 
                                        onClick={() => setCurrentState("Login")}
                                    >
                                        Sign In
                                    </button>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;