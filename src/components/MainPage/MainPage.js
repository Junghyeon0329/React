import './MainPage.css';
import { useUser } from '../../contexts/UserContext';

function MainPage() {
    const { user, logoutUser } = useUser();

    return (
        <div className="Page-Container">
            <header className="Header">
                <h1>My Application</h1>
            </header>
            <div className="grid-container">
                <div className="grid-item item1">Item 1</div>
                <div className="grid-item item2">Item 2</div>
                <div className="grid-item item3">Item 3</div>
                <button className="grid-item button">Add New Item</button>
            </div>
            <footer className="Footer">
                <p>Footer Content</p>
            </footer>
                
        </div>
    );
}

export default MainPage;
