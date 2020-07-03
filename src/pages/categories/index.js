import Categories from '../../components/categories/index.js';
import fetchJson from '../../utils/fetch-json.js';

export default class Page {
  element;
  subElements = {};
  components = {};
  data = {};

  async getData () {
    const fetchUrl = new URL('api/rest/categories', process.env.BACKEND_URL);

    fetchUrl.searchParams.set("_sort", "weight");
    fetchUrl.searchParams.set("_refs", "subcategory");

    this.data = await fetchJson(fetchUrl);
  }

  initComponents () {
    this.components.categories = new Categories(this.data);
  }

  get template () {
    return `
    <div class="categories">
      <div class="content__top-panel">
        <h1 class="page-title">Категории товаров</h1>
      </div>
      <div data-element="categories">
        <!-- categories component -->
      </div>
    </div>`;
  }

  async render () {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(this.element);

    await this.getData();

    this.initComponents();

    this.renderComponents();

    return this.element;
  }

  renderComponents () {
    Object.keys(this.components).forEach(component => {
      const root = this.subElements[component];
      const { element } = this.components[component];
      root.append(element);
    });
  }

  getSubElements (element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  destroy () {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }
}
