"use client";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const ErrorMessage = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (error)
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 animate-fadeIn">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-800 font-medium">
              Usuario o contraseña incorrectos
            </p>
          </div>
        </div>
      </div>
    );
};

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openEye = "/ic_eyeopen.png";
  const closeEye = "/ic_eyeclose.png";

  const passwordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn("credentials", {
        username: email.toLowerCase(),
        password: password,
        redirect: true,
        callbackUrl: "/private"
      });
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-arial">
      <div className="flex flex-col h-screen lg:flex-row">
        {/* Left Panel - Login Form */}
        <section className="flex flex-col lg:w-1/2 relative overflow-hidden">
          {/* Background Pattern - Optimized for mobile */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5" />
          <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full -translate-y-32 translate-x-32 sm:-translate-y-48 sm:translate-x-48" />
          <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-80 sm:h-80 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full translate-y-24 -translate-x-24 sm:translate-y-40 sm:-translate-x-40" />

          <div className="relative z-10 flex flex-col h-full">
            {/* Header - Mobile optimized */}
            <div className="flex items-center justify-between p-4 sm:p-6 lg:p-8">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="relative">
                  <Image
                    alt="digi plus"
                    src="/digi-plus-tecnologia.png"
                    width={120}
                    height={96}
                    className="block w-24 h-16 sm:w-32 sm:h-20 lg:w-48 lg:h-24 aspect-auto  "
                  />
                </div>
                <div className="block sm:hidden">
                  <p className="text-xs font-semibold text-gray-700 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                    Indoor
                  </p>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-gray-700 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                    Indoor Tracking
                  </p>
                </div>
              </div>
            </div>

            {/* Login Form Container - Mobile optimized */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-12 xl:px-16 py-4 sm:py-6">
              <div className="w-full max-w-sm sm:max-w-md">
                {/* Welcome Section - Mobile optimized */}
                <div className="text-center mb-6 sm:mb-8">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
                    Bienvenido
                  </h1>
                  <p className="text-base sm:text-lg text-gray-600 font-medium px-2">
                    Inicia sesión para acceder a la plataforma
                  </p>
                </div>
                {/* Error Message */}
                <Suspense>
                  <ErrorMessage />
                </Suspense>

                {/* Login Form - Mobile optimized */}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-6"
                >
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Usuario
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                        <Image
                          src="/ic_user.png"
                          alt="Usuario"
                          width={18}
                          height={18}
                          className="text-gray-400 group-focus-within:text-blue-500 transition-colors"
                        />
                      </div>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg text-gray-900 placeholder-gray-500 text-base"
                        placeholder="Ingresa tu usuario"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Contraseña
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                        <Image
                          src="/ic_password.png"
                          alt="Contraseña"
                          width={18}
                          height={18}
                          className="text-gray-400 group-focus-within:text-blue-500 transition-colors"
                        />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full pl-10 sm:pl-12 pr-12 sm:pr-14 py-3 sm:py-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg text-gray-900 placeholder-gray-500 text-base"
                        placeholder="Ingresa tu contraseña"
                      />
                      <button
                        type="button"
                        onClick={passwordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors touch-manipulation"
                      >
                        <Image
                          src={showPassword ? openEye : closeEye}
                          alt={
                            showPassword
                              ? "Ocultar contraseña"
                              : "Mostrar contraseña"
                          }
                          width={18}
                          height={18}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Submit Button - Mobile optimized */}
                  <div className="pt-2 sm:pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 sm:py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl disabled:shadow-sm transform hover:scale-[1.01] sm:hover:scale-[1.02] disabled:scale-100 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:cursor-not-allowed touch-manipulation text-base sm:text-lg"
                    >
                      {isLoading
                        ? <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span className="text-sm sm:text-base">
                              Iniciando sesión...
                            </span>
                          </div>
                        : <span className="flex items-center justify-center space-x-2">
                            <span>Iniciar Sesión</span>
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                          </span>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Right Panel - Hero Image - Mobile optimized */}
        <div className="lg:w-1/2 w-full h-48 sm:h-64 lg:h-auto relative overflow-hidden order-first lg:order-last">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800" />
          <div className="absolute inset-0 bg-[url('/wallpaper-login.png')] bg-cover bg-center bg-no-repeat mix-blend-overlay opacity-80" />

          {/* Overlay Content - Mobile optimized */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-6 lg:p-8 xl:p-12">
            <div className="sm:max-w-md">
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 leading-tight">
                Sistema de Tracking
                <span className="block text-blue-200">Inteligente</span>
              </h2>
              <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-blue-100 mb-4 sm:mb-6 lg:mb-8 leading-relaxed px-2">
                Monitorea y gestiona tus activos en tiempo real con nuestra
                plataforma de última generación
              </p>

              {/* Feature List - Mobile optimized */}
              <div className="space-y-2 sm:space-y-3 lg:space-y-4 text-left">
                <div className="flex items-center space-x-2 sm:space-x-3 text-white/90">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-300 rounded-full flex-shrink-0" />
                  <span className="text-xs sm:text-sm lg:text-base">
                    Seguimiento en tiempo real
                  </span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 text-white/90">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-300 rounded-full flex-shrink-0" />
                  <span className="text-xs sm:text-sm lg:text-base">
                    Análisis de datos avanzado
                  </span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 text-white/90">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-300 rounded-full flex-shrink-0" />
                  <span className="text-xs sm:text-sm lg:text-base">
                    Alertas inteligentes
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Elements - Mobile optimized */}
          <div className="absolute top-4 right-4 sm:top-10 sm:right-10 w-12 h-12 sm:w-20 sm:h-20 bg-white/10 rounded-full blur-xl" />
          <div className="absolute bottom-8 left-4 sm:bottom-20 sm:left-10 w-16 h-16 sm:w-32 sm:h-32 bg-blue-300/20 rounded-full blur-2xl" />
          <div className="absolute top-1/2 right-8 sm:right-20 w-8 h-8 sm:w-16 sm:h-16 bg-purple-300/30 rounded-full blur-lg" />
        </div>
      </div>
    </main>
  );
};

export default Page;
