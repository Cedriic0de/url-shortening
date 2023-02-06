const selectorElement = (selector) => {
  const element = document.querySelector(selector);

  if(element) return element;
  throw new Error(`Cannot find element ${selector}`);
}

const form = selectorElement('form');
const userInput = selectorElement('input');
const result = selectorElement(".result-list");


form.addEventListener('submit', (e) => {
	e.preventDefault();

  const url = userInput.value;
	shortUrl(url);
});

async function shortUrl(url){
  try {
   const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`);
   const data = await response.json();
  console.log(data);

	const newUrl = document.createElement("div");
  newUrl.classList.add("item");
  newUrl.innerHTML = `
      <p>${data.result.short_link}</p>
      <button class="newUrl-btn">Copy</button>`;
  

  result.prepend(newUrl);
  const copyBtn = document.querySelector(".newUrl-btn");

  copyBtn.addEventListener("click", () => {
	  navigator.clipboard.writeText(copyBtn.previousElementSibling.textContent);
    //alert("New short link copied");
    copyBtn.classList.add("copied");
    copyBtn.innerHTML = "Copied";
  });


  
  userUrl.value = "";
  } catch (error) {
    console.log(error);
  }
}