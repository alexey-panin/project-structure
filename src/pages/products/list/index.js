import SortableTable from '../../../components/sortable-table/index.js';
import SortPanel from '../../../components/sort-panel/index.js';
import header from './products-header.js';
import fetchJson from '../../../utils/fetch-json.js';

const BACKEND_URL = process.env.BACKEND_URL;
const PRODUCTS_URL = "api/rest/products";

export default class Page {
  element;
  subElements = {};
  components = {};
  sliderFrom = 0;
  sliderTo = 4000;

  updateTableComponent = async (event) => {
    const { type, detail } = event;

    if (type === "range-select") {
      const { from, to } = detail;
      this.sliderFrom = from;
      this.sliderTo = to;
    }    
    
    const { sorted, start, end, element: sortableTableElem } = this.components.sortableTable;
    const { id: sort, order } = sorted;
    
    sortableTableElem.classList.add("sortable-table_loading");
    
    const { subElements } = this.components.sortPanel;
    const { filterName, filterStatus } = subElements;
    const { value: filterNameValue } = filterName;
    const { value: filterStatusValue } = filterStatus;

 

    const url = new URL(PRODUCTS_URL, BACKEND_URL);

    const searchParams = [
      ["price_gte", this.sliderFrom],
      ["price_lte", this.sliderTo]
    ];

    if (filterNameValue) {
      searchParams.push(
        ["title_like", filterNameValue]
      )
    }

    if (filterStatusValue) {
      searchParams.push(
        ["status", filterStatusValue]
      )
    }

    //TODO: сделать через цикл

    searchParams.push([
      "_sort",
      sort
    ]);

    searchParams.push([
      "_order",
      order
    ]);

    searchParams.push([
      "_start",
      start
    ]);

    searchParams.push([
      "_end",
      end
    ]);

    for (const [name, value] of searchParams) {
      url.searchParams.set(name, value);
    }

    const data = await fetchJson(url);
    this.components.sortableTable.addRows(data);

    sortableTableElem.classList.remove("sortable-table_loading");
  }

  async initComponents () {
    const to = new Date();
    const from = new Date(to.getTime() - (30 * 24 * 60 * 60 * 1000));

    const sortPanel = new SortPanel({
      sliderMin: this.sliderFrom,
      sliderMax: this.sliderTo
    });

    const sortableTable = new SortableTable(header, {
      url: `api/rest/products?_embed=subcategory.category&_sort=title&_order=asc&_start=0&_end=30`
    });

    this.components.sortPanel = sortPanel;
    this.components.sortableTable = sortableTable;
  }

  get template () {
    return `
    <div class="products-list">
      <div class="content__top-panel">
        <h1 class="page-title">Товары</h1>
        <a href="/products/add" class="button-primary">Добавить товар</a>
      </div>
      <div data-element="sortPanel">
        <!-- sort-panel component -->
      </div>
      <div data-element="sortableTable">
        <!-- sortable-table component -->
      </div>
    </div>`;
  }

  async render () {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    await this.initComponents();

    this.renderComponents();

    this.initEventListeners();

    return this.element;
  }

  initEventListeners() {
    const { subElements } = this.components.sortPanel;
    const { filterName, filterStatus } = subElements;

    for (const element of [filterName, filterStatus]) {
      element.addEventListener("input", this.updateTableComponent);
    }

    this.element.addEventListener("range-select", this.updateTableComponent);
  }

  removeEventListeners() {
    const { subElements } = this.components.sortPanel;
    const { filterName, filterStatus } = subElements;

    for (const element of [filterName, filterStatus]) {
      element.removeEventListener("input", this.updateTableComponent);
    }

    this.element.removeEventListener("range-select", this.updateTableComponent);
  }

  renderComponents () {
    Object.keys(this.components).forEach(component => {
      const root = this.subElements[component];
      const { element } = this.components[component];

      root.append(element);
    });
  }

  getSubElements ($element) {
    const elements = $element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  destroy () {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
    this.removeEventListeners();
  }
}
