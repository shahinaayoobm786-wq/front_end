import { Link } from "react-router-dom";

function Home() {

    return (
        <div className="home-container">

            <div className="home-content">

                <h1>
                    Welcome to Shopping Corner 🛍️
                </h1>

                <p>
                    Find the best products at the best prices.
                    Browse our collection and start shopping today.
                </p>

                <Link
                    to="/products"
                    className="home-btn"
                >
                    Shop Now
                </Link>

            </div>

        </div>
    );
}

export default Home;