export default class DomConsole {
  private _element:HTMLElement;

  //constructor(ele:HTMLElement) {
  //  this._element = ele;
  //}
  set element(ele:HTMLElement) {
    this._element = ele;
  }

  log(message: string) {
    //const p = document.createElement('p');
    this._element.innerHTML = this._element.innerHTML + '<p>'+ message +'<p>' ;
  }
}
