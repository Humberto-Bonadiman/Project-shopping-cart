const apiUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addProducts() {
  const itemAddButton = document.querySelectorAll('.item__add');
  const getIdItem = itemAddButton.forEach((product) => {
    product.addEventListener('click', () => {
      const idButton = product.parentNode.firstElementChild.innerText;
      const apiItem = `https://api.mercadolibre.com/items/${idButton}`;
      fetch(apiItem)
        .then((response) => response.json())
        .then((item) => {
          const cart = {
            sku: item.id,
            name: item.title,
            salePrice: item.price,
          };
          document.querySelector('.cart__items').appendChild(createCartItemElement(cart));
        }); 
    });
  });
  return getIdItem;
}

function fetchComputer() {
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
    .then(() => addProducts());
}

window.onload = () => {
  fetchComputer();
};
