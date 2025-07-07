import User from "@/app/objects/user/user";

export default function UserCard({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-md w-full max-w-md mx-auto">
      <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
        {/* Hier unbedingt das Image ersetzen mit einem neutralen User avatar*/}
        <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            ><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
      </div>
      <div className="flex flex-col text-gray-800">
        <h3 className="text-lg font-semibold">
          {user.firstName} {user.lastName}
        </h3>
        <p className="text-sm text-gray-600">📍 {user.city}</p>
        <p className="text-sm text-gray-600">✉️ {user.email}</p>
      </div>
    </div>
  );
}
