import escapeHtml from '../../utils/escape-html.js';
import SortableList from '../../components/sortable-list/index.js';

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
    this.createSubcategoryList();   
  }

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getCategoriesContainerTemplate(this.data);

    const element = wrapper.firstElementChild;

    this.element = element;

    this.subElements = this.getSubElements(this.element);
    console.log(this.subElements);

    this.initEventListeners();

    console.log(this.data);
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

  ///////////////////////////////////////

  createSubcategoryList() {
    this.data.forEach(element => {
      const {subcategories} = element;
      const items = subcategories.map(({ id, title, count }) => this.getSortableListItemTemplate(id, title, count));
      console.log(items);
      
    });

    

/*     const sortableList = new SortableList({
      items
    }); */
  }

  getSortableListItemTemplate(id, title, count) {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = `
      <li class="categories__sortable-list-item sortable-list__item" data-grab-handle="" data-id="${id}">
        <strong>${escapeHtml(title)}</strong>
        <span><b>${count}</b> products</span>
      </li>`;

    return wrapper.firstElementChild;
  }

  ///////////////////////////////////////

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    console.log(elements);

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.element.removeEventListener("click", this.onClick);
    this.remove();
    this.subElements = {};
  }
}