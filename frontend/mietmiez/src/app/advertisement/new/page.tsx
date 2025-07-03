import Button from "@/app/components/button";
import { useState } from "react";

const NewAdvertisementPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [animal, setAnimal] = useState("");
    const [error, setError] = useState("");

     async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
         e.preventDefault();
         setError("");
         ClientUserCommunication.login(email, password).then((success) => {
           if (!success) {
             setError("Login fehlgeschlagen. Bitte überprüfe deine Anmeldedaten.");
           } else {
             // router.push("/home");
           }
         });
       }

    return (
        <main>
            {isLoggedIn ?

            <div>
                {error && (
                    <p className="text-red-500 mb-3 text-sm text-center">{error}</p>
                )}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Name des Tieres"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        />

                    <input
                        type="text"
                        placeholder="Gib an was man über dein Tier wissen sollte..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        />

                    <input
                        type="text"
                        placeholder="Art des Tieres"
                        value={animal}
                        onChange={(e) => setAnimal(e.target.value)}
                        required
                        />

                    <input
                        type="submit"
                        placeholder="Veröffentlichen"
                    ></input>
                </form>      
            </div>
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            : <p>Bitte einloggen.</p>}
        </main>
    );
}

export default NewAdvertisementPage;