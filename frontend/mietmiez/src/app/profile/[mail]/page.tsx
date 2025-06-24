export default function ProfilePage({params}: { params: { mail: string } }) {
    return (
        <main>
            {params.mail}
        </main>
    );
}
