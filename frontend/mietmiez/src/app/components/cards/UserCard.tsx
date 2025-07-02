import User from "@/app/objects/user";

export default function UserCard({ user }: { user: User }) {
    return (
        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-md w-full max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                {/* Hier unbedingt das Image ersetzen mit einem neutralen User avatar*/}
                <img
                    src="/cat.jpg"
                    alt="User avatar"
                    className="object-cover w-full h-full"
                />
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
