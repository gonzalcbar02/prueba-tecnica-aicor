import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function Login() {
    return (
        <div className="space-y-4 sm:space-y-6 border-2 border-gray-300 rounded-lg p-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg xl:max-w-xl bg-white shadow-md">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Bienvenido a nuestra tienda</h2>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base">Accede con tu cuenta de google </p>
          </div>

        <GoogleOAuthProvider clientId="874618065354-ffcmlo8qb7oq3bqu7s51h8lojmcoohnn.apps.googleusercontent.com">
            <GoogleLogin
                onSuccess={(credentialResponse) => {
                    console.log(credentialResponse);
                }}
                onError={() => {
                    console.log("Error al iniciar sesión");
                }}
            />
        </GoogleOAuthProvider>


        </div>
    )
}
