
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google"
import { useAuth } from "../../contexts/AuthContext.jsx"


export default function LoginView() {
    const { loginWithGoogle, isLoading, error } = useAuth()

    

    return (
        <div className="flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-blue-600">¡Bienvenido a TechStore!</h1>
                        <p className="text-gray-600">Inicia sesión para acceder a tu cuenta</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">Continúa con</span>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <GoogleOAuthProvider clientId="874618065354-ffcmlo8qb7oq3bqu7s51h8lojmcoohnn.apps.googleusercontent.com">
                                <GoogleLogin
                                    onSuccess={async (credentialResponse) => {
                                        const isSuccess = await loginWithGoogle(credentialResponse.credential)
                                        if (isSuccess) {
                                            window.location.href = "/dashboard"
                                        } 
                                    }}
                                    onError={() => {
                                        error("Error al iniciar sesión con Google. Inténtalo de nuevo.")
                                    }}
                                    theme="outline"
                                    size="large"
                                />
                            </GoogleOAuthProvider>
                        </div>

                        {isLoading && (
                            <div className="flex items-center justify-center space-x-2 text-blue-600">
                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                <span className="text-sm">Iniciando sesión...</span>
                            </div>
                        )}
                    </div>

                    <div className="text-center space-y-2 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                            ¿Necesitas ayuda?{" "}
                            <button className="text-blue-600 hover:text-blue-700 font-medium">Contacta soporte</button>
                        </p>
                        <p className="text-xs text-gray-400">Al continuar, aceptas nuestros términos de servicio</p>
                    </div>
                </div>


            </div>
        </div>
    )
}
