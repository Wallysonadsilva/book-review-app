const Header = () => {
    return (
        <header className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">BookReview</h1>
                    {/* Navigation will be added here later */}
                </div>
            </div>
        </header>
    );
};

export default Header;