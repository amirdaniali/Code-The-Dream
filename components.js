import { locationHandler } from "./routes.js";

// Component to create an artwork card
export function createArtworkCard(artwork, artwork_manifest= null) {
  const card = document.createElement('div');
  card.className = 'artwork-card'; // Styling will be in styles.css


  try {
    if (artwork.color.l > 40){
      card.style.background = `hsl(${artwork.color.h},${artwork.color.s}%,${artwork.color.l}%)`;
    }
    else {
      card.style.background = `#a4a2a5`;
      // card.style.background = `hsl(${10 + Math.floor(Math.random() * 345)}, 100%, 65%)`;
    }
    
  } catch (error) {
      card.style.background = `#a4a2a5`;
      // card.style.background = `hsl(${10 + Math.floor(Math.random() * 345)}, 100%, 65%)`;
  }


  // Add image
  const imagewrapper = document.createElement('a');
  const image = document.createElement('img');
  imagewrapper.className = 'card-image-wrapper';
  imagewrapper.href = `/art/${artwork.id}`;
  image.className = 'card-img explicit-outbound'; // all links with explicit-outbound class will be handled by routes.js file
  if (!artwork.image) {
    console.log(`Image for id: ${artwork.id} not available from API. Fetching placeholder image.`);
  }
  image.src = artwork.image || '/media/placeholder.jpg'; // Fallback image
  image.alt = '--Image Not Available--' || 'Artwork';

  // encountered when server has an issue and cannot show the image, then replace the image with placeholder
  image.addEventListener('error', function handleError() {
    // console.log(image.parentElement);
    // image.parentElement.remove();
    console.log(image.src, 'not available from the ARTIC server. Fetching placeholder image.');
    const defaultImage = '/media/placeholder.jpg';
  
      image.src = defaultImage;
      image.alt = 'default';
      
  });

  // handle image redirects
  image.addEventListener('click', function routeURL() {
    window.history.pushState({}, "", `/art/${artwork.id}`);
    locationHandler();
  });
  

  imagewrapper.appendChild(image);
  card.appendChild(imagewrapper);


  // Add title
  const title = document.createElement('a');
  title.title = artwork.title;
  title.className = 'card-title explicit-outbound'; // all links with explicit-outbound class will be handled by routes.js file
  title.href = `/art/${artwork.id}`;
  title.appendChild(document.createTextNode(artwork.title));
  title.textContent = artwork.title || 'Untitled';
  card.appendChild(title);
  
  // Add Info Wrapper
  const infoWrapper = document.createElement('div');
  infoWrapper.className = 'card-info';
  
  // Add id

  const id = document.createElement('a');
  id.title = `ID: ${artwork.id}`;
  id.className = 'card-id explicit-outbound'; // all links with explicit-outbound class will be handled by routes.js file
  id.href = `/art/${artwork.id}`;
  id.appendChild(document.createTextNode(`ID: ${artwork.id}`));
  infoWrapper.appendChild(id);


  // Add Date
  const date_display = document.createElement('p');
  date_display.className = 'card-date';
  date_display.textContent = 'Date Displayed: ' + (artwork.date || 'No Date Known');
  infoWrapper.appendChild(date_display);

  card.appendChild(infoWrapper);

  // Add artist
  const artists_wrapper = document.createElement('div');
  artists_wrapper.className = 'card-artists-wrapper';
  const artists_header = document.createElement('div');
  artists_header.className = 'card-header';
  artists_header.textContent =`Artists: `;
  artists_wrapper.appendChild(artists_header);
  const artists = document.createElement('ul');
  artists.className = 'card-ul';
 
  if (artwork.artists.length) {  // for each artist add their name and a link to their page
    artwork.artists.forEach( (artist, index) => {
      const aLink = document.createElement('a');
      aLink.className = 'card-list-item explicit-outbound'; // all links with explicit-outbound class will be handled by routes.js file
      aLink.title = `${artist}`;
      aLink.href = `/artist/${artwork.arists_links[index]}`;
      aLink.appendChild(document.createTextNode(`${artist}`));
      const outer_list = document.createElement('li');
      outer_list.appendChild(aLink);
      artists.appendChild(outer_list);
    });
  } else { // No artist data found so no <a> link needed.
    const noArtist = document.createElement('p');
    noArtist.className ='card-list-item';
    noArtist.innerText = 'No Known Artist';
    artists.appendChild(noArtist)
  }

  
  artists_wrapper.appendChild(artists);
  card.appendChild(artists_wrapper);

  // Add Description
  const description = document.createElement('div');
  const desc_header = document.createElement('div');
  desc_header.className = 'card-title';
  desc_header.textContent =`Description`;
  description.className = 'card-description';
  if (artwork_manifest != null) { 
  if (typeof artwork_manifest.description[0] !== 'undefined') { 
    description.innerHTML = artwork_manifest.description[0]['value'].replace(/\n/g, "<br /><br />") || ((( artwork.short_description || artwork.description )) || 'No description available.');
  }}
  else {
    description.innerHTML = ((( artwork.short_description || artwork.description )) || 'No description available.');
  }
  
  card.appendChild(desc_header);
  card.appendChild(description);

  // Add title
  const category_wrapper = document.createElement('div');
  category_wrapper.className = 'card-categories-wrapper';  
  const category_header = document.createElement('div');
  category_header.className = 'card-header';
  category_header.textContent =`  Categories(s): `;
  category_wrapper.appendChild(category_header);

  // Add categories
  const categories = document.createElement('ul');  
  categories.className = 'card-ul';  
  artwork.categories.forEach( (category, index) => { // add a link to each category
    const aLink = document.createElement('a');
    aLink.className = 'card-list-item explicit-outbound'; // all links with explicit-outbound class will be handled by routes.js file
    aLink.title = `${category} `;
    aLink.href = `/category/${artwork.category_links[index]}`;
    aLink.appendChild(document.createTextNode(`${category}`));
    const outer_list = document.createElement('li');
    outer_list.appendChild(aLink);
    categories.appendChild(outer_list);
  });
  category_wrapper.appendChild(categories);
  card.appendChild(category_wrapper);



  return card;
}
    
// Component to create a generic loader (for "loading" placeholders)
export function createLoader() {
  const loader = document.createElement('div');
  loader.className = 'loader'; // Styling will be in styles.css
  loader.textContent = 'Loading...';

  return loader;
}
  
// Component to create an error message
export function createErrorMessage(errorMessage) {
  const errorContainer = document.createElement('div');
  errorContainer.className = 'error-message'; // Styling will be in styles.css
  errorContainer.textContent = errorMessage || 'An error occurred. Please try again.';

  return errorContainer;
}

// Component to create a search result item
export function createSearchResultItem(item) {
  const resultItem = document.createElement('div');
  resultItem.className = 'search-result-item'; // Styling will be in styles.css

  const title = document.createElement('h3');
  title.textContent = item.title || 'No Title';
  resultItem.appendChild(title);

  const snippet = document.createElement('p');
  snippet.textContent = item.snippet || 'No additional information.';
  resultItem.appendChild(snippet);

  return resultItem;
}

// Component to show the data about an artist
export function createArtistInfo(artist) {
  const card = document.createElement('div');
  card.className = 'artist-info'; // Styling will be in styles.css
  
  // Add title
  const title = document.createElement('p');
  title.className = 'artist-title';
  title.textContent = artist.data.title || 'Unknown Artist';
  card.appendChild(title);


  const other_names = document.createElement('div');
  other_names.className = 'artist-other-names';
  other_names.textContent = 'Artist Other Names: ' + (artist.data.alt_titles || 'No Other Names Used');
  card.appendChild(other_names);

  // Add Info Wrapper
  const infoWrapper = document.createElement('div');
  infoWrapper.className = 'artist-info';

  // Add id

  const id = document.createElement('a');
  id.title = `Artist ID: ${artist.data.id}`;
  id.className = 'artist-id explicit-outbound';  // all links with explicit-outbound class will be handled by routes.js file
  id.href = `/artist/${artist.data.id}`;
  id.appendChild(document.createTextNode(`Artist ID: ${artist.data.id}`));
  infoWrapper.appendChild(id);


  // Add Date
  const date_display = document.createElement('p');
  date_display.className = 'artist-date';
  date_display.innerHTML = 'Artist Date of Birth: ' + (artist.data.birth_date || 'No Date Known') + '<br>' + 'Artist Date of Death: ' + (artist.data.death_date || 'No Date Known');
  infoWrapper.appendChild(date_display);


  card.appendChild(infoWrapper);

  const description = document.createElement('div');
  const desc_header = document.createElement('div');
  desc_header.className = 'card-title';
  desc_header.textContent =`Description`;
  description.className = 'artist-description';
  description.innerHTML = ( artist.data.description || 'No description available.' );
  card.appendChild(desc_header);
  card.appendChild(description);


  return card
}

// Component to show the data about a category
export function createCategoryInfo(category) {
  const card = document.createElement('div');
  card.className = 'category-info'; // Styling will be in styles.css
  
  // Add title
  const title = document.createElement('p');
  title.className = 'category-title';
  title.textContent = category.data.title || 'Unknown Category';
  card.appendChild(title);


  // Add Info Wrapper
  const infoWrapper = document.createElement('div');
  infoWrapper.className = 'category-info';

  // Add subtype

  const subtype = document.createElement('h3');
  subtype.className = 'category-subtype';
  subtype.textContent = `Subtype: ` + (category.data.title || 'Unknown Subtype');
  card.appendChild(subtype);

  // Add id

  const id = document.createElement('a');
  id.title = `Category ID: ${category.data.id}`;
  id.className = 'category-id explicit-outbound'; // all links with explicit-outbound class will be handled by routes.js file
  id.href = `/category/${category.data.id}`;
  id.appendChild(document.createTextNode(`Category ID: ${category.data.id}`));
  infoWrapper.appendChild(id);

  card.appendChild(infoWrapper);

  return card
}


// Component to show a new artwork just fetched from the api
export function createNewArtwork(artwork, artwork_manifest= null) {
  var status = {};
  status.Ok = true;
  const card = document.createElement('div');
  card.className = 'artwork-card'; // Styling will be in styles.css
  
  
  // Change the backgroud color if image colors are available

  try {
    if (artwork.color.l > 40){
      card.style.background = `hsl(${artwork.color.h},${artwork.color.s}%,${artwork.color.l}%)`;
    }
    else {
      card.style.background = `#a4a2a5`;
      // card.style.background = `hsl(${10 + Math.floor(Math.random() * 345)}, 100%, 65%)`;
    }
    
  } catch (error) {
      card.style.background = `#a4a2a5`;
      // card.style.background = `hsl(${10 + Math.floor(Math.random() * 345)}, 100%, 65%)`;
  }


  // Add image
  const imagewrapper = document.createElement('a');
  const image = document.createElement('img');
  imagewrapper.className = 'new-image-wrapper';
  imagewrapper.href = `/art/${artwork.id}`;
  image.className = 'card-img explicit-outbound'; // all links with explicit-outbound class will be handled by routes.js file
  
  
  if (!artwork.image) { // If the latest API data doesnt have an image set the OK status to false
    status.Ok = false; 
  }
  image.src = artwork.image || '/media/placeholder.jpg'; // Fallback image
  image.alt = '--Image Not Available--' || 'Artwork';

  // encountered when server has an issue and cannot show the image, then replace the image with placeholder
  image.addEventListener('error', function handleError() {
    // console.log(image.parentElement);
    image.parentElement.remove();
    console.log(image.src, 'not available from the ARTIC server. Fetching placeholder image.');
    const defaultImage = '/media/placeholder.jpg';
  
      image.src = defaultImage;
      image.alt = 'default';    
  });
  
  // handles image redirects
  image.addEventListener('click', function routeURL() {
    window.history.pushState({}, "", `/art/${artwork.id}`);
    locationHandler();
      
  });

  imagewrapper.appendChild(image);
  card.appendChild(imagewrapper);


  // Add title
  const title = document.createElement('a');
  title.title = artwork.title;
  title.className = 'card-title explicit-outbound';
  title.href = `/art/${artwork.id}`;
  title.appendChild(document.createTextNode(artwork.title));
  title.textContent = artwork.title || 'Untitled';
  card.appendChild(title);
  
  return [card, status];
}





// Component to create an artwork display
export function displayArtwork(artwork, artwork_manifest= null) {
  const card = document.createElement('div');
  card.className = 'artwork-display'; // Styling will be in styles.css
  
  // Change the backgroud color if image colors are available

  try {
    if (artwork.color.l > 40){
      card.style.background = `hsl(${artwork.color.h},${artwork.color.s}%,${artwork.color.l}%)`;
    }
    else {
      card.style.background = `#a4a2a5`;
      // card.style.background = `hsl(${10 + Math.floor(Math.random() * 345)}, 100%, 65%)`;
    }
    
  } catch (error) {
      card.style.background = `#a4a2a5`;
      // card.style.background = `hsl(${10 + Math.floor(Math.random() * 345)}, 100%, 65%)`;
  }


  // Add image
  const imagewrapper = document.createElement('div');
  const image = document.createElement('img');
  imagewrapper.className = 'image-wrapper';
  
  // handle if image data isn't available from the api


  image.className = 'display-img ';
  if (!artwork.image) {
    console.log(`Image for id: ${artwork.id} not available from API. Fetching placeholder image.`);
  }
  image.src = artwork.image || '/media/placeholder.jpg'; // Fallback image
  image.alt = '--Image Not Available--' || 'Artwork';

  // handle cors errors from the server
  image.addEventListener('error', function handleError() {
    console.log(image.src, 'not available from the ARTIC server. Fetching placeholder image.');
    const defaultImage = '/media/placeholder.jpg';
  
      image.src = defaultImage;
      image.alt = 'default';
      
  });
  

  imagewrapper.appendChild(image);
  card.appendChild(imagewrapper);
  // card.appendChild(image);

  // Add Info Wrapper
  const infoWrapper = document.createElement('div');
  infoWrapper.className = 'display-info';


  // Add title
  const title = document.createElement('a');
  title.title = artwork.title;
  title.className = 'display-title';
  title.appendChild(document.createTextNode(artwork.title));
  title.textContent = artwork.title || 'Untitled';
  infoWrapper.appendChild(title);
  
  
  
  // Add id

  const id = document.createElement('a');
  id.title = `ID: ${artwork.id}`;
  id.className = 'display-id';
  id.appendChild(document.createTextNode(`ID: ${artwork.id}`));
  infoWrapper.appendChild(id);


  // Add Date
  const date_display = document.createElement('p');
  date_display.className = 'display-date';
  date_display.textContent = 'Date Displayed: ' + (artwork.date || 'No Date Known');
  infoWrapper.appendChild(date_display);

  

  // Add artist
  const artists_wrapper = document.createElement('div');
  artists_wrapper.className = 'display-artists-wrapper';
  const artists_header = document.createElement('div');
  artists_header.className = 'display-header';
  artists_header.textContent =`Artists: `;
  artists_wrapper.appendChild(artists_header);
  const artists = document.createElement('ul');
  artists.className = 'display-ul';

  if (artwork.artists.length) { // for each artist add their name and a link to their page
    artwork.artists.forEach( (artist, index) => {
      const aLink = document.createElement('a');
      aLink.className = 'display-list-item explicit-outbound'; // all links with explicit-outbound class will be handled by routes.js file
      aLink.title = `${artist}`;
      aLink.href = `/artist/${artwork.arists_links[index]}`;
      aLink.appendChild(document.createTextNode(`${artist}`));
      const outer_list = document.createElement('li');
      outer_list.appendChild(aLink);
      artists.appendChild(outer_list);
    });
  } else {
    const noArtist = document.createElement('p');
    noArtist.className ='display-list-item';
    noArtist.innerText = 'No Known Artist';
    artists.appendChild(noArtist)
  }

  
  artists_wrapper.appendChild(artists);
  infoWrapper.appendChild(artists_wrapper);


  // Add Description
  const description = document.createElement('div');
  const desc_header = document.createElement('div');
  desc_header.className = 'display-title';
  desc_header.textContent =`Description`;
  description.className = 'display-description';
  
  if (artwork_manifest != null) { // If there is a manifst description use it. 
    if (typeof artwork_manifest.description[0] !== 'undefined') { 
      description.innerHTML = artwork_manifest.description[0]['value'].replace(/\n/g, "<br /><br />") || ((( artwork.short_description || artwork.description )) || 'No description available.');
    }}
    else {
      description.innerHTML = ((( artwork.short_description || artwork.description )) || 'No description available.');
    }
  infoWrapper.appendChild(desc_header);
  infoWrapper.appendChild(description);

  // Add title
  const category_wrapper = document.createElement('div');
  category_wrapper.className = 'display-categories-wrapper';  
  const category_header = document.createElement('div');
  category_header.className = 'display-header';
  category_header.textContent =`  Categories(s): `;
  category_wrapper.appendChild(category_header);

  // Add categories
  const categories = document.createElement('ul');  
  categories.className = 'display-ul';  
  artwork.categories.forEach( (category, index) => { // for each category add name and a link to its page
    const aLink = document.createElement('a');
    aLink.className = 'display-list-item explicit-outbound'; // all links with explicit-outbound class will be handled by routes.js file
    aLink.title = `${category} `;
    aLink.href = `/category/${artwork.category_links[index]}`;
    aLink.appendChild(document.createTextNode(`${category}`));
    const outer_list = document.createElement('li');
    outer_list.appendChild(aLink);
    categories.appendChild(outer_list);
  });
  category_wrapper.appendChild(categories);
  infoWrapper.appendChild(category_wrapper);

  card.appendChild(infoWrapper);

  return card;
}





// Component to create the art work of the day display
export function displayDayArtwork(artwork, artwork_manifest= null) {
  const card = document.createElement('div');
  card.className = 'artwork-display'; // Styling will be in styles.css
  
  // Change the backgroud color if image colors are available
  try {
    if (artwork.color.l > 40){
      card.style.background = `hsl(${artwork.color.h},${artwork.color.s}%,${artwork.color.l}%)`;
    }
    else {
      card.style.background = `#a4a2a5`;
      // card.style.background = `hsl(${10 + Math.floor(Math.random() * 345)}, 100%, 65%)`;
    }
    
  } catch (error) {
      card.style.background = `#a4a2a5`;
      // card.style.background = `hsl(${10 + Math.floor(Math.random() * 345)}, 100%, 65%)`;
  }


// Add image
  const imagewrapper = document.createElement('a');
  const image = document.createElement('img');
  imagewrapper.className = 'day-image-wrapper';
  imagewrapper.href = `/art/${artwork.id}`;
  image.className = 'day-img explicit-outbound';

  // handle if image data isn't available from the api
  if (!artwork.image) {
    console.log(`Image for id: ${artwork.id} not available from API. Fetching placeholder image.`);
  }
  image.src = artwork.image || '/media/placeholder.jpg'; // Fallback image
  image.alt = '--Image Not Available--' || 'Artwork';

  // handle cors errors from the server
  image.addEventListener('error', function handleError() {
    console.log(image.src, 'not available from the ARTIC server. Fetching placeholder image.');
    const defaultImage = '/media/placeholder.jpg';
  
      image.src = defaultImage;
      image.alt = 'default';
      
  });
  
  // handle image redirects
  image.addEventListener('click', function routeURL() {
    window.history.pushState({}, "", `/art/${artwork.id}`);
    locationHandler();  });

  imagewrapper.appendChild(image);
  card.appendChild(imagewrapper);

  // Add Info Wrapper
  const infoWrapper = document.createElement('div');
  infoWrapper.className = 'display-info';


  // Add title
  const title = document.createElement('a');
  title.title = artwork.title;
  title.className = 'display-title';
  title.href = `/art/${artwork.id}`;
  title.appendChild(document.createTextNode(artwork.title));
  title.textContent = artwork.title || 'Untitled';
  infoWrapper.appendChild(title);
  
  
  
  // Add id

  const id = document.createElement('a');
  id.title = `ID: ${artwork.id}`;
  id.className = 'display-id';
  id.href = `/art/${artwork.id}`;
  id.appendChild(document.createTextNode(`ID: ${artwork.id}`));
  infoWrapper.appendChild(id);


  // Add Date
  const date_display = document.createElement('p');
  date_display.className = 'display-date';
  date_display.textContent = 'Date Displayed: ' + (artwork.date || 'No Date Known');
  infoWrapper.appendChild(date_display);

  

  // Add artist
  const artists_wrapper = document.createElement('div');
  artists_wrapper.className = 'display-artists-wrapper';
  const artists_header = document.createElement('div');
  artists_header.className = 'display-header';
  artists_header.textContent =`Artists: `;
  artists_wrapper.appendChild(artists_header);
  const artists = document.createElement('ul');
  artists.className = 'display-ul';

  if (artwork.artists.length) {
    artwork.artists.forEach( (artist, index) => { // for each artist add their name and a link to their page
      const aLink = document.createElement('a');
      aLink.className = 'display-list-item explicit-outbound'; // all links with explicit-outbound class will be handled by routes.js file
      aLink.title = `${artist}`;
      aLink.href = `/artist/${artwork.arists_links[index]}`;
      aLink.appendChild(document.createTextNode(`${artist}`));
      const outer_list = document.createElement('li');
      outer_list.appendChild(aLink);
      artists.appendChild(outer_list);
    });
  } else {
    const noArtist = document.createElement('p');
    noArtist.className ='display-list-item';
    noArtist.innerText = 'No Known Artist';
    artists.appendChild(noArtist)
  }

  
  artists_wrapper.appendChild(artists);
  infoWrapper.appendChild(artists_wrapper);

  // Add Description
  const description = document.createElement('div');
  const desc_header = document.createElement('div');
  desc_header.className = 'display-title';
  desc_header.textContent =`Description`;
  description.className = 'display-description';
  
  if (artwork_manifest != null) { // If there is a manifst description use it. 
    if (typeof artwork_manifest.description[0] !== 'undefined') { 
      description.innerHTML = artwork_manifest.description[0]['value'].replace(/\n/g, "<br /><br />") || ((( artwork.short_description || artwork.description )) || 'No description available.');
    }}
    else {
      description.innerHTML = ((( artwork.short_description || artwork.description )) || 'No description available.');
    }
  infoWrapper.appendChild(desc_header);
  infoWrapper.appendChild(description);


  

  // Add title
  const category_wrapper = document.createElement('div');
  category_wrapper.className = 'display-categories-wrapper';  
  const category_header = document.createElement('div');
  category_header.className = 'display-header';
  category_header.textContent =`  Categories(s): `;
  category_wrapper.appendChild(category_header);

  // Add categories
  const categories = document.createElement('ul');  
  categories.className = 'display-ul';  
  artwork.categories.forEach( (category, index) => { // for each category add name and a link to its page
    const aLink = document.createElement('a');
    aLink.className = 'display-list-item explicit-outbound'; // all links with explicit-outbound class will be handled by routes.js file
    aLink.title = `${category} `;
    aLink.href = `/category/${artwork.category_links[index]}`;
    aLink.appendChild(document.createTextNode(`${category}`));
    const outer_list = document.createElement('li');
    outer_list.appendChild(aLink);
    categories.appendChild(outer_list);
  });
  category_wrapper.appendChild(categories);
  infoWrapper.appendChild(category_wrapper);

  card.appendChild(infoWrapper);

  return card;
}


// Component to create an Artist Search Result
export function createArtistResult(data=null) {
  const artistContainer = document.createElement('div');
  artistContainer.className = 'small-result'; // Styling will be in styles.css
  const aLink = document.createElement('a');
  aLink.className = 'small-result-item explicit-outbound'; // all links with explicit-outbound class will be handled by routes.js file
  aLink.title = data.title || 'Unknown';
  aLink.href = `/artist/${data.id}`;
  aLink.textContent = data.title || 'Unknown';
  artistContainer.appendChild(aLink);

  return artistContainer;
}

// Component to create a category Search Result
export function createCategoryResult(data=null) {
  const categoryContainer = document.createElement('div');
  categoryContainer.className = 'small-result'; // Styling will be in styles.css
  const aLink = document.createElement('a');
  aLink.className = 'small-result-item explicit-outbound'; // all links with explicit-outbound class will be handled by routes.js file
  aLink.title = data.title || 'Unknown';
  aLink.href = `/category/${data.id}`;
  aLink.textContent = data.title || 'Unknown';
  categoryContainer.appendChild(aLink);

  return categoryContainer;
}