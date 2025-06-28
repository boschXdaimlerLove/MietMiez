export default async function ProfilePage({params}: { params: Promise<{ mail: string }> }) {
    const {mail} = await params;
    return (
        <main>
            {mail}
        </main>
    );
}
