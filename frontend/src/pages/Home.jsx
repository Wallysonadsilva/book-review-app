const Home = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Welcome to BookReview</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-lg text-gray-700 mb-4">
                    Discover new books, share your thoughts, and connect with other readers.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">Find Books</h2>
                        <p className="text-gray-600">
                            Search through our extensive collection of books.
                        </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">Share Reviews</h2>
                        <p className="text-gray-600">
                            Share your opinions and read what others think.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;