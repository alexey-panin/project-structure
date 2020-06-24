import escapeHtml from '../../utils/escape-html.js';

export default class Categories {
  
  element; //html element

  onClick = (event) => {
    event.preventDefault();
    const {target} = event;
    const isHeader = target.classList.contains("category__header");
    const parentDiv = target.closest("div");

    if (isHeader) {
      parentDiv.classList.toggle("category_open");
    }
  }

  constructor(data) {
    this.data = data;
    this.render();    
  }

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getCategoriesContainerTemplate(this.data);

    const element = wrapper.firstElementChild;

    this.element = element;

    this.subElements = this.getSubElements(this.element);

    this.initEventListeners();
  }

  initEventListeners() {
    this.element.addEventListener("click", this.onClick);
  }

  getCategoriesContainerTemplate(data) {
    return `
      <div data-element="categoriesContainer">
        ${this.getCategoryTemplate(data)}
      </div>
    `;
  }

  getCategoryTemplate(data) {
    return data
      .map(item => {
        return `
          <div class="category category_open" data-id="${item.id}">
            <header class="category__header">${escapeHtml(item.title)}</header>
            <div class="category__body">
              <div class="subcategory-list" data-element="subcategoryList">
                ${this.getSubcategoryList(item)}
              </div>
            </div>
          </div>
        `;
      }).join("");
  }

  getSubcategoryList(item) {
    return `
      <ul class="sortable-list">
        ${this.getSortableListItem(item)}
      </ul>
    `;
  }

  getSortableListItem({subcategories}) {
    return subcategories
      .map( ({ id, title, count }) => {
        return `
        <li class="categories__sortable-list-item sortable-list__item" data-grab-handle="" data-id="${id}">
          <strong>${escapeHtml(title)}</strong>
          <span><b>${count}</b> products</span>
        </li>
        `;
      }).join("");

  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}