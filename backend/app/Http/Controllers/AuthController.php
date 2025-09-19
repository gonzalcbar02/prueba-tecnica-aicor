<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Google_Client;

class AuthController extends Controller
{

    public function loginWithGoogle(Request $request): JsonResponse
    {
        try {
            $idToken = $request->input('credential'); // viene del front

            $client = new Google_Client(['client_id' => env('GOOGLE_CLIENT_ID')]);
            $payload = $client->verifyIdToken($idToken);

            if (!$payload) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Token inválido de Google'
                ], 401);
            }

            // Datos del usuario
            $googleId = $payload['sub'];
            $email = $payload['email'];
            $name = $payload['name'];

            // Buscar o crear usuario
            $user = User::where('email', $email)->first();

            if (!$user) {
                $user = User::create([
                    'name' => $name,
                    'email' => $email,
                    'google_id' => $googleId,
                    'password' => bcrypt(str()->random(16)),
                ]);
            } else {
                if (!$user->google_id) {
                    $user->update(['google_id' => $googleId]);
                }
            }

            // Crear token JWT
            $token = JWTAuth::fromUser($user);

            return response()->json([
                'status' => 'success',
                'message' => 'Login con Google exitoso',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                    ],
                    'access_token' => $token,
                    'token_type' => 'bearer',
                    'expires_in' => config('jwt.ttl') * 60
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Fallo en autenticación con Google',
                'error' => $e->getMessage()
            ], 401);
        }
    }

    public function me(): JsonResponse
    {
        try {
            $user = Auth::user();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        }
    }

    public function logout(): JsonResponse
    {
        try {
            if (! $token = JWTAuth::getToken()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Token not provided'
                ], 400);
            }

            JWTAuth::invalidate($token);

            return response()->json([
                'status' => 'success',
                'message' => 'Successfully logged out'
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to logout, please try again'
            ], 500);
        }
    }

    public function refresh(): JsonResponse
    {
        try {
            $token = JWTAuth::refresh(JWTAuth::getToken());

            return response()->json([
                'status' => 'success',
                'data' => [
                    'access_token' => $token,
                    'token_type' => 'bearer',
                    'expires_in' => config('jwt.ttl') * 60
                ]
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Token cannot be refreshed, please login again'
            ], 401);
        }
    }
}
