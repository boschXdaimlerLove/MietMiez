'use client';

import Button from "@/app/components/button";

function handleSubmit() {

}

export default function RegisterPage() {
    return (
        <main className='w-screen h-screen flex justify-center items-center'>
            <div className='text-center border-solid border-2 border-[var(--primaryBtn)] rounded-[32] px-12 py-20'>
                <div className='py-8'>
                    <h1>Welcome to MietMiez</h1>
                    <h2>Register now to rent a pet</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="email" className="block w-full mb-4 p-2 border rounded-md"
                           required/>
                    <input type="password" placeholder="password" className="block w-full mb-4 p-2 border rounded-md"
                           required/>
                    <input type="password" placeholder="confirm password"
                           className="block w-full mb-4 p-2 border rounded-md"
                           required/>
                    <Button
                        isPrimary={true}
                        title="Register"
                        onClick={handleSubmit}
                        type={'submit'}
                    />
                </form>
            </div>
        </main>
    );
}
