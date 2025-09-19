import { Outlet } from "react-router-dom"

export default function AuthLayout() {
  return (
    <div className=" bg-gray-100 min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl bg-white rounded-xl shadow-xl border border-gray-100  py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8">

        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
