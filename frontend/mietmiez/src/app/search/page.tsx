export default function SearchPage({searchParams}: { searchParams: { text?: string, type?: string, city?: string } }) {
    return (
        <main>
            <h1>Search with following params</h1>
            <p>Text: {searchParams.text}</p>
            <p>Type: {searchParams.type}</p>
            <p>City: {searchParams.city}</p>
        </main>
    );
}
