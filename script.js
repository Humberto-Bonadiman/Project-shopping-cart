const apiUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
const theCart = document.querySelector('ol');
const totalPrice = document.querySelector('.total-price');
const emptyCart = document.querySelector('.empty-cart');
let sum = 0;

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// Requisito 4

async function setItem() {
  const items = theCart.innerHTML;
  localStorage.setItem('cart__items', items);
}

// Requisito 3 e parte do 5 - function cartItemClickListener
async function cartItemClickListener(event) {
  const priceItem = parseFloat(event.target.innerText.split('$')[1]);
  sum -= priceItem;
  totalPrice.innerText = sum;
  document.querySelector('.cart__items').removeChild(event.target);
  setItem();
}

// Requisito 4

function getItem() {
  if (localStorage.getItem('cart__items')) {
    const items = localStorage.getItem('cart__items');
    theCart.innerHTML = items;
    const lis = document.querySelectorAll('.cart__item');
    lis.forEach((li) => li.addEventListener('click', cartItemClickListener));
  }
}

// Parte do requisito 5

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  theCart.appendChild(li);
  sum += salePrice;
  totalPrice.innerText = sum;
  setItem();
}

// Requisito 2 - function addProducts
// Nesta parte eu consultei o reposit??rio do Enzo Thom??
/* Fonte: https://github.com/tryber/sd-014-b-project-shopping-cart/pull/74/commits/1428ddde588652e0864d91d00b767e33207ae0d8 */
async function addProducts() {
  document.querySelectorAll('.item__add').forEach((product) => {
    product.addEventListener('click', () => {
      const idButton = product.parentNode.firstElementChild.innerText;
      const apiItem = `https://api.mercadolibre.com/items/${idButton}`;
      fetch(apiItem)
        .then((response) => response.json())
        .then((item) => {
          createCartItemElement({
            sku: item.id,
            name: item.title,
            salePrice: item.price,
          });
        });
    });
  });
  setItem();
}

// Requisito 7

function createOrDeleteLoadingMessage() {
  const itemsSection = document.querySelector('.items');
  if (itemsSection.querySelector('.loading')) {
    const getLoading = document.querySelector('.loading');
    // getLoading.innerText = '';
    getLoading.remove();
   } else {
    const loading = document.createElement('h4');
    loading.classList.add('loading');
    loading.innerText = 'loading...';
    itemsSection.appendChild(loading);
  }
}

createOrDeleteLoadingMessage();

// Requisito 1 - function fetchComputer
async function fetchComputer() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => data.results.forEach((product) => {
      const objectProduct = {
        sku: product.id,
        name: product.title,
        image: product.thumbnail,
      };
      const items = document.querySelector('.items');
      items.appendChild(createProductItemElement(objectProduct));
    }))
    .then(() => addProducts())
    .then(() => cartItemClickListener())
    .then(() => setItem());
}

// Requisito 6

emptyCart.addEventListener('click', () => {
  theCart.innerHTML = '';
  totalPrice.innerText = 0;
});

// Requisito 7

setTimeout(async function apiRequest() {
  await fetchComputer();
  createOrDeleteLoadingMessage();
}, 3000);

window.onload = () => {
  getItem();
};