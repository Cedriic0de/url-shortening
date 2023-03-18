const getElement = (selector) => {
  const element = document.querySelector(selector);

  if(!element) {
    throw new Error(`Cannot find element ${selector}`);
  }
  
  return element;
};

const form = getElement('form');
const userInput = getElement('input');
const result = getElement(".result-list");
const errMsg = getElement("#error-msg");


const savedUrls = JSON.parse(localStorage.getItem('urls')) || [];

// Load saved URLs from local storage
savedUrls.forEach((url) => {
  const newUrl = createNewUrlElement(url.input, url.short);
  result.prepend(newUrl);
});


form.addEventListener('submit', async (e) => {
	e.preventDefault();

  const url = userInput.value.trim();

  if(!url) {
      errMsg.textContent = "Enter a valid link to shorten";
    userInput.focus();
      return;
  } 
    errMsg.style.display = "none";

  try {
   const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`); //{mode: 'no-cors'} failed to fetch due to CORS policy
   const data = await response.json();
  console.log(data);

    const newUrl = createNewUrlElement(url,data.result.short_link);
    result.prepend(newUrl);

    const copyBtn = document.querySelector(".newUrl-btn");

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(data.result.short_link);
      copyBtn.classList.add("copied");
      copyBtn.innerHTML = "Copied";
    });

    // Saving shortened URL to local storage
    const savedUrl = { input: url, short: data.result.short_link };
    savedUrls.push(savedUrl);
    localStorage.setItem("urls", JSON.stringify(savedUrls));

    userUrl.value = "";
    userInput.focus();

  } catch (error) {
    console.log(error);
  }
});

function  createNewUrlElement(userUrl, shortUrl) {
  const newUrl = document.createElement("div");
  newUrl.classList.add("item");
  newUrl.innerHTML = `
  <p class="user-url">${userUrl}</p>
  <p class="short-url">${shortUrl}</p>
  <button class="newUrl-btn">Copy</button>
      `;

    return newUrl;
}