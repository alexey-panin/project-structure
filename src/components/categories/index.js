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

  onSortableListReorder(event) {
    console.log(event);
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

    this.appendSubcategoryDraggableList();

    //this.subElements = this.getSubElements(this.element);

    this.initEventListeners();
  }

  initEventListeners() {
    this.element.addEventListener("click", this.onClick);
    this.element.addEventListener("sortable-list-reorder", this.onSortableListReorder);
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
              </div>
            </div>
          </div>
        `;
      }).join("");
  }

  createSubcategoryList() {
    const itemsList = [];
    this.data.forEach(element => {
      const {subcategories} = element;
      const items = subcategories.map(({ id, title, count }) => this.getSortableListItemTemplate(id, title, count));
      itemsList.push(items);
    });

    return itemsList;
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

  appendSubcategoryDraggableList() {
    const subcategotyListArr = this.createSubcategoryList();
    const subcategoryElementArr = this.element.querySelectorAll("[data-element='subcategoryList']");

    for (let i=0; i < subcategoryElementArr.length; i++) {
      const sortableList = new SortableList({ items: subcategotyListArr[i] });
      subcategoryElementArr[i].append(sortableList.element);
    }
  }

/*   getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  } */

  remove() {
    this.element.remove();
  }

  destroy() {
    this.element.removeEventListener("click", this.onClick);
    this.remove();
    //this.subElements = {};
  }
}