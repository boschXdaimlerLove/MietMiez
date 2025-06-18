import User from "@/app/objects/user";

export default function UserCard({user}: { user: User }) {
    return (
        <div>
            <h3>{user.firstName} {user.lastName}</h3>
            <p>{user.email}</p>
        </div>
    );
}
