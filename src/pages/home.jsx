import 'react';
import Nav from '../components/navbar/Navbar.jsx';
import Footer from '../components/footer/Footer.jsx';
import MovieBar from '../components/searchBar/searchBar.jsx';

function Home() {
    return (
        <div>
            <Nav />
            <MovieBar></MovieBar>
            <Footer></Footer>
        </div>
    );
}


export default Home;