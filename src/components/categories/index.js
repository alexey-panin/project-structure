import escapeHtml from '../../utils/escape-html.js';
import fetchJson from '../../utils/fetch-json.js';
import SortableList from '../../components/sortable-list/index.js';

const BACKEND_URL = process.env.BACKEND_URL;
const SUBCATEGORIES_URL = "api/rest/subcategories";

export default class Categories {
  
  element; //html element

  toggleAccordion = (event) => {
    event.preventDefault();
    const {target} = event;
    const isHeader = target.classList.contains("category__header");
    const parentDiv = target.closest("div");

    if (isHeader) {
      parentDiv.classList.toggle("category_open");
    }
  }

  onSortableListReorder = (event) => {
    const { target } = event;
    const { children } = target;

    const payload = [];

    [...children].forEach((child, index) => {
      const childId = child.dataset.id;
      payload.push(
        {
          id: childId,
          weight: index
        }
      );
    });

    this.send(payload);
  }

  constructor(data) {
    this.data = data;
    this.render();
  }

  send(payload) {
    const url = new URL (SUBCATEGORIES_URL, BACKEND_URL);
    const requestParams = {
      method: 'PATCH',
      headers:             {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(payload)
    }

    fetchJson(url, requestParams);
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
    this.element.addEventListener("click", this.toggleAccordion);
    this.element.addEventListener("sortable-list-reorder", this.onSortableListReorder);
  }

  removeEventListeners() {
    this.element.removeEventListener("click", this.toggleAccordion);
    this.element.removeEventListener("sortable-list-reorder", this.onSortableListReorder);
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
    this.removeEventListeners();
    this.remove();
    //this.subElements = {};
  }
}