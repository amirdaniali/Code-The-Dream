import { createArtworkCard, createPost, createLoader, createErrorMessage } from './components.js';
import {displayArtworkCard, populatePage, displayPost } from './app.js';


const routes = {
    404: {
        template: "/routes/404.html",
        title: "404",
        description: "Page not found",
    },
    "": {
        template: "/routes/index.html",
        title: "Artic Arts Home",
        description: "This is the home page",
    },
    'about': {
        template: "/routes/about.html",
        title: "About Us",
        description: "This is the about page",
    },
    'art': {
        template: "/routes/art.html",
        title: "View Art",
        description: "This is the art page",
    },
    'artist': {
        template: "/routes/artist.html",
        title: "View Artist",
        description: "This is the artist page",
    },
    'category': {
        template: "/routes/category.html",
        title: "Art Category",
        description: "This is the category page",
    },
};


const route = (event) => {
    event = event || window.event; // get window.event if event argument not provided
    // event.preventDefault();
    // window.history.pushState(state, unused, target link);
    window.history.pushState({}, "", event.target.href);
    locationHandler();
};

// create document click that watches the nav links only
document.addEventListener("click", (e) => {
    console.log(e);
    const { target } = e;
    console.log(e.explicitOriginalTarget.className)
    if (e.explicitOriginalTarget.className.includes("explicit-outbound") ){
        e.preventDefault();
        route();
    }
    // console.log('target not a link');
    
});


const locationHandler = async () => {
    // get the url path, replace hash with empty string
    const location = window.location.pathname; // get the url path
    
    // if the path length is 0, set it to primary page route
    let currentView = ['/','']
    if (location.length == 0) {
        location = "/";
    }
    else{ 
        currentView = location.split('/');
        currentView.splice(0, 1);
        console.log('location=', location, 'currentView=',currentView);
        /// to do add functionality of paths inside here
    }
    
    // get the route object from the routes object
    const route = routes[currentView[0]] || routes["404"];
    // get the html from the template
    const html = await fetch(route.template).then((response) => response.text());
    // set the content of the content div to the html
    document.getElementById("main-container").innerHTML = html;
    // set the title of the document to the title of the route
    document.title = route.title;
    // set the description of the document to the description of the route
    document
        .querySelector('meta[name="description"]')
        .setAttribute("content", route.description);
    // console.log('routing ended up at', location);
    



    
    switch (currentView[0]) {
        case '':
            console.log('Home Loaded.')
            populatePage(15);
            break;




        case 'art':
          
            // DOM Elements
            const artworksSection = document.getElementById('artworks');
            const searchBar = document.getElementById('search-bar');
            const searchButton = document.getElementById('search-button');
            
            if (currentView[1]) {
                searchBar.defaultValue = currentView[1];
                try {
                    await displayArtworkCard(currentView[1]); // Display artwork card
                } catch (error) {
                    const errorMessage = createErrorMessage(`Invalid ID. The Artic Database has no art with id: ${currentView[1]}`);
                }
            } else {
                searchBar.placeholder = "Try a 6 digit Art ID to view";
            }
            

            searchButton.addEventListener('click', async () => {
                // Clear any existing content
                artworksSection.innerHTML = '';
            
                const searchValue = searchBar.value.trim();
                if (searchValue === '') {
                const errorMessage = createErrorMessage('Please enter an ID to search.');
                artworksSection.appendChild(errorMessage);
                return;
                }
            
                // Display either an artwork card or a post based on the entered ID
                const id = parseInt(searchValue, 10);
            
                if (isNaN(id)) {
                const errorMessage = createErrorMessage('Invalid ID. Please enter a numeric value.');
                artworksSection.appendChild(errorMessage);
                } else {
                // Example: Display both artwork cards and posts for demonstration
                
                try {
                    await displayArtworkCard(id); // Display artwork card
                } catch (error) {
                    const errorMessage = createErrorMessage(`Invalid ID. The Artic Database has no art with id: ${id}`);
                }
                
                
                window.history.replaceState = `/${id}`;
                // await displayPost(id);       // Display post
                }
            });
            
            
            searchButton.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    // code for enter
                    console.log('Enter pressed')
                }
            
            });
            
            // Execute a function when the user presses a key on the keyboard
                searchBar.addEventListener("keypress", function(event) {
                    // If the user presses the "Enter" key on the keyboard
                    if (event.key === "Enter") {
                    // Cancel the default action, if needed
                    event.preventDefault();
                    // Trigger the button element with a click
                    console.log('Pressed Button with Enter');
                    searchButton.click();
                }}); 
                
                
                console.log('Art Loaded.')
                break;
            
        case 'artist':



                console.log('Artist Loaded.')
                break;
        case 'about':
                console.log('About Loaded.')
                break;
        case 'category':
                console.log('Category Loaded.')
                break;
        default:
                window.location.pathname = '/';
                console.log('404')
                break;
    }
};


// create a function that watches the hash and calls the urlLocationHandler
// call the urlLocationHandler to load the page
locationHandler();
window.onpopstate = locationHandler;
window.route = route;