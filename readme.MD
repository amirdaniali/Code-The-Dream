#  Advanced Pre-Work Assignment

![First Page](./media/HomePage.jpg "First Page of the webapp")

This website was my Assignment submission for Summer 2025 Code the Dream course.

You can find a link to the Assignment [here](https://codethedream.org/open-adv-pre-work/).


## How to Run 

First download this repository with
```git
git clone https://github.com/amirdaniali/Articasso.git
```


### Python Flask

Since the project is a list of static files you can choose between 4 ways of serving the files. You can move onto other options if one doesn't work. First try the Flask method. Open `serve-flask.py` and change the `BASE_DIR` to the path that you downloaded the project then run the code below depending on your operating system. 

On windows:

```bash

cd path/to/the/project
python -m venv ./venv
./venv/Scripts/activate 
python -m pip install flask
python ./serve-flask.py

```
On mac and linux:
```bash
cd path/to/the/project
python -m venv ./venv
source ./venv/bin/activate
python -m pip install flask
python ./serve-flask.py
```


You can then access the application on http://localhost:8080 or http://127.0.0.1:8080

### Serving Using NPM globally

Another way is by using `node.js` and `http-server`. Make sure the npm global directory is added to the $PATH. If this method doesn't work, search google for `mac how to add npm to path` or `windows how to add npm to PATH`

```Bash
cd path/to/the/project
npm install -g http-server
http-server
 ```

### Serving Using NPM for this project

If you don't want to install http-server globally, you can install it just for this project. Run: 

```bash
cd path/to/the/project
npm install http-server
./node_modules/.bin/http-server
```

You need to make sure you can view the node_modules folder created in the project directory. In case of any issues with your npm instalations, you can try yarn as a substitue. 


Finally, you should be able to access the application on http://localhost:8080 or http://127.0.0.1:8080

On windows you can use powershell via windows terminal which allows the above syntax to function. For linux or mac the path to the node module could be different. You can download Node.js from [nodejs.org](https://nodejs.org/). Search google for specific npm instructions for your OS.

### Python HTTP Server

Alternatively the static files can be served via a `python` `http.server`. You can open `serve-http.py` from the project directory via your IDE, change the path paramether to where you downloaded the project and run:

```bash
cd path/to/the/project
python ./serve.py
```

The above method works well on windows, on mac you can get the path to the project via finder and then change the path in `serve-http.py`. If you run into any issues you should search how to configure python http server for your OS to serve .

You can then access the application on http://localhost:8080 or http://127.0.0.1:8080

Should you run into any issues serving the files you can view the project screenshot in the media folder of this repository. You can also see the latest version of this repo hosted via github at: [artic-arts.amirdaniali.com.]

## Design Decisions

During the completion of this assignment here are all the issues I came across and all the and design decisions I made. 

### API Options
The options for the APIs in the course are as follows:
- Weather
- Music
- Star Wars
- Marvel Comics
- Art
- Dog/Cat
- Coffee

I had to choose between different api providers and build an app around them. I am a fan of Arts and wouldnt say no to an excuse to build something useful that pleases the spirit as well. So I took a look at the ARTIC Api from Art Institute of Chicago.

Here is the [Website](https://www.artic.edu/) of Art Institute of Chicago.
![Art Institute of Chicago Website](./media/ART_Chicago_Website.jpg "Art Institute of Chicago Website")

And Here is the link to the [API Documentation](https://api.artic.edu/docs/#introduction). 
![API Documentation](./media/Documentation_Screenshot.png "Art Institute of Chicago API Dcoumentation")

The Project I wanted to make needed to demonstrate the data from at least two endpoints from the api, and allow the user to navigate through them. Since the data already exists I made the design choice to Keep all code in the front-end and didnt feel the need to complicate the logic via a backend. This design choice turned out to be the right one as Everything I wanted to do for the project can be done without a need for a dedicated backend.

### The Architecture

The initial architechture of the project can be seen here. Since then I have moved all the functions in each of the js files below to their own files. But the overall process is the same. 

1. `index.html`:
   - Purpose: The main HTML file for the application. Contains the structure and links to JavaScript and  CSS files.
   - Description: Serves as the entry point and root for the application UI.

2. `styles.css`:
   - Purpose: CSS imports and custom styling.
   - Description: Sets up styling rules, adding any additional customizations needed.

3. `app.js`:
   - Purpose: Main JavaScript file handling API calls, state management, and DOM updates.
   - Description:
     - Fetches data from the Artic API.
     - Stores state in local variables.
     - Dynamically updates the UI based on user interactions.

4. `helpers.js`:
   - Purpose: Contains helper functions.
   - Description:
     - Functions for API calls (e.g., fetching data).
     - Utility functions like error handling or formatting.

5. `components.js`:
   - Purpose: Encapsulates reusable components like cards, views, errors.
   - Description:
     - Contains functions to create dynamic HTML elements (like artwork cards, search bars).
     - Helps maintain modularity in code.
6. `routes.js`
   - Purpose: Allows the user to view parts of the application by simple clicks. 
   - Description:
     - Contains functions to analyse click events and route them to the proper destinations.
     - Calls the proper functions in `app.js` to populate pages with the correct data.
7. `state.js`
   - Purpose: Lets us avoid fetching content repeatedly from the api.
   - Description:
     - Saves the loaded content to IndexedDb so the user can comeback to their session after page close and reloads.
     - Saves loaded state to memory cache to avoid fetching the same artworks multiple times. 


This is a diagram I made for the way different parts of the project interact:
![Diagram](./media/Initial%20Architecture.png "Initial Architecture")

### Seting up the Controller and View

After reading the api I started coding. I was a little rusty in my JavaScript so it took me a little longer than usual to read the documentations. I managed to code the helper functions that interact with the api in the helpers.js file. The helper functions use the JavaScript Fetch syntax and are all async. 

The only major issue I ran into initially was that the Artic Api doesnt actually return any images (except the thumbnail. They return the image id and the image has to be linked to using a html `<img>` tag. For awhile I kept trying to use javascript to fetch the images from the server programmitaclly, but I kept running into CORS errors. After a long search online about workarounds, I decided to make normal html do the work.

Here is the function I wrote using javascript to fetch the resource from the api:

```javascript
export async function find_art(id = 129884, all_fields = true) {
    console.log('find art initialized with parameter',id);
    const address_parameters = all_fields ? '' : '?fields=id,title,artist_titles,artist_ids,date_display,description,exhibition_history,thumbnail,color,category_titles,category_ids,image_id'
    const addressURL = `https://api.artic.edu/api/v1/artworks/${id}${address_parameters}`
    const returnResponse = await fetch(addressURL, 
        { headers: {
            'AIC-User-Agent': 'Code the Dream Prework @amirdaniali@gh'
        }});
    
    const data = await returnResponse.json();
    console.log('art with id', id,'was found', data);

    return data
}
```

In the lines above the function determines if a reduced set of fields are requested or not. Then it fetches the resource and returns the data. I got distracted while coding the fuction to set a custom `AIC-User-Agent` header as requested by [the documentation](https://api.artic.edu/docs/#image-sizes). I got so distracted I didnt include a try/catch statement in the function until much later. 

Afterwards I began coding the `app.js` file where I setup the interactivity of the main page and made sure the search box was connected to the helper functions to retrieve the user information. After that I started coding the `components.js` file to produce the results of the user searches. 

### Setting Up The Single Page Application

The application I wanted to build had to have many pages. One for Showing the main page, one for showing the page related to the art-pieces themselves and maybe one especially for each artist. Such functionality would require multiple `page.html` files and a complex way of routing them without needing complex express/node backends. At the end I decided to go with a SPA concept I learned from this [blog](https://dev.to/thedevdrawer/single-page-application-routing-using-hash-or-url-9jh)

All routing logic is implemented in `routes.js` file and allows for multiple pages to be loaded with browser URL functionality supported. 

Whenever a new link to a page is clicked, the `routes.js` file checks to see if the element has the class-name: `explicit-outband`. If so it ignores the default behavior of the browser and loads the contexts of the local page into the `main-container` section tag in the main `index.html` file. If it cannot find the classname it treats it as a normal `<a>` tag and allows the link to redirect to another url. 

Here is how the locationHandler function is set up. I ommitted some of the longer logic blocs in the switch case for brevity. 


```javascript
export async function locationHandler() {


    const location = window.location.pathname; // get the url path
    
    // if the path length is 0, set it to primary page route
    let currentView = ['/','']
    if (location.length == 0) {
        location = "/";
    }
    else{ 
        currentView = location.split('/');
        currentView.splice(0, 1);       
    }
    
    // get the route object from the routes object
    const route = routes[currentView[0]] || routes["404"];
    // get the html from the template
    const html = await fetch(route.template).then((response) => response.text());
    // set the content of the content div to the html
    
   // prepare the wrapper section and remove the current view

    document.getElementById("main-container").innerHTML = '';
    document.getElementById("main-container").innerHTML = html; 

   if (currentView[0]=='') controller.routeHome();
    else if (currentView[0]=='art')  controller.routeArt(currentView[1]);
    else if (currentView[0]=='artist')  controller.routeArtist(currentView[1]);
    else if (currentView[0]=='category')  controller.routeCategory(currentView[1]);
    else if (currentView[0]=='feed')  controller.routeFeed();
    else if (currentView[0]=='odyssey')  controller.routeOdyssey();
    else if (currentView[0]=='countries')  controller.routeCountries();
    else if (currentView[0]=='art_search')  controller.routeArtSearch();
    else if (currentView[0]=='artist_search')  controller.routeArtistSearch();
    else if (currentView[0]=='category_search')  controller.routeCategorySearch();
    else if (currentView[0]=='about')  {}
    else {
        window.location.pathname = '/';
    }
         
}

```

After loading the custom resources for any page `routes.js` calls multiple functions in `app.js` to load the interactivity of the proper page the user has requested. `app.js` then can call `helpers.js` to request the resources from the ARTIC API and then call `components.js` to display the resources to the user. 


### Components

Here is how components are structured. I have a `<section>` element in the main `index.html` file. The `routes.js` file injects the main wrapper inside that `<section>` element. After that `components.js` injects every needed element into the `section`.

Here is an example logic displaying the artwork page.

```javascript

// app.js

export async function displayArtworkPage(id) {
  try {
    const artworksSection = document.getElementById('artworks');
    // Create a loader while fetching data
    const loader = createLoader();
    artworksSection.appendChild(loader);
    try {
      // Fetch artwork data
    const artwork = await find_art(id, false);
    const art_manifest = await find_manifest(id);
      if (artwork.data.image_id) {
        var artImage = await find_art_image(artwork.data.image_id)
      } else {
        var artImage = null;
      }

    // Remove the loader
    artworksSection.removeChild(loader);

        // Create an artwork card and add it to the DOM
    const card = displayArtwork({
      title: artwork.data.title,
      artists: artwork.data.artist_titles,
      arists_links: artwork.data.artist_ids,
      image: artImage,
      id:artwork.data.id,
      date:artwork.data.date_display,
      description:artwork.data.short_description,
      history: artwork.data.exhibition_history,
      color: artwork.data.color,
      categories: artwork.data.category_titles,
      category_links: artwork.data.category_ids,
    }, art_manifest);
    artworksSection.appendChild(card);
    
    // catch stamenet for error handling is placed here
    
}}}

```

### Art of the day.

Something I'm very happy to get the chance to add to the project is the artwork of the day section. 

A problem with the api is simply that not every random id exists. When I tried a logic like `find_art(100000+dayofYear)` I simply ran into 404 issues. As a result after trying a few times with different initial ids, I simply gave up and tried another approach. 

In the final version, I started by simply going over every single artwork id after an initial number. If the artwork exists I added it to the final selected elements list. 

Afterwards I coded the date handling logic like this:

```javascript

const artSection = document.getElementById('art-of-the-day');
const now = new Date();
const start = new Date(now.getFullYear(), 0, 0);
const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
const oneDay = 1000 * 60 * 60 * 24;
const day = Math.floor(diff / oneDay);

const allArtworks = // A very long list of IDS for each day.


const id = allArtworks[day]['ID'];
const artwork = await find_art(id, false);
const card = displayDayArtwork(artwork);
artSection.appendChild(card);

```


## State Management

Without a solution for state management, I could visibly see the homepage request the same featured arts and latest api artworks on every reload or SPA link change. This is obviously a needless load on the Artic servers and needs to be fixed. I didn't want to save any json files to disk and I couldn't rely on any backend to load data so I had to code the state management code myself. The code for `state.js` keeps track of the data we have fetched so far and saves it to an object that can be accessed using getters and setters. I later added the functionality to persist the data using IndexedDb functionality. Many people would say IndexedDB is overkill and hard to work with but not me. I found it simple and useful and although I prefer SQL based RDBs, I enjoyed IndexedDB for what it offered. 

## Gallery


![Updated Homepage](./media/iMac.jpg "The main homepage.")
The main homepage.

![mobile view](./media/iPhone.jpg "Mobile view")
Mobile view

![Searching functionality for categories](./media/Africa.png "Searching for africa in categories.")
Searching for africa in categories.


![Searching functionality for arts](./media/Van_Gogh.png "Searching for van gogh in arts.")
Searching for van gogh in arts.


## Conclusion

By using the architecture mentioned above I can make multiple pages just behave like static files and besides needing a service to load the files, no resource is wasted with unneeded computations. All logic is client-side and the project can be used with minimal costs as long as the ARTIC Api remains online. 

This project helped me greatly to think outside the box to recreate the typical luxuries we use everyday granted to us by frameworks like React or Vue inside pure javascript. 

I thank Code the Dream team to inspire me to create this project celebrating the beautiful art collection of the Art Institute of Chicago.


Reminder: You can view the website and the project on my personal website [here](https://Articasso.org).


