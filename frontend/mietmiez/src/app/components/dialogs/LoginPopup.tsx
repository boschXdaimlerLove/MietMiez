import Button from "@/app/components/button";

function handleLogin() {

}

export default function LoginPopup() {
    return (
        <div className="text-center border">
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="email"/>
                <input type="password" placeholder="password"/>
                <Button isPrimary={true} onClick={handleLogin} title="Login" type="submit"/>
            </form>
        </div>
    );
}
