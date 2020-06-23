export default class Categories {
  element; //html element

  constructor(url, data) {
    this.url = url;
    this.data = data;
    this.render();    
  }

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = "<h1>Hello World!</h1>";

    const element = wrapper.firstElementChild;

    this.element = element;
  }


}