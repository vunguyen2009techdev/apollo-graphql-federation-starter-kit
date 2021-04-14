interface GeoInterface {
  state: string;
  country: string;
}

interface PersonInterface {
  first: string;
  last: string;
  geo: GeoInterface;
}

export default class Person {
  private first: string;
  private last: string;
  private geo: GeoInterface;

  constructor({ first, last, geo }: PersonInterface) {
    this.first = first;
    this.last = last;
    this.geo = geo;
  }

  public get fullName(): string {
    return `${this.first} ${this.last}`;
  }

  public get location(): string {
    const { state, country } = this.geo;
    return `${state}, ${country}`;
  }

  whoAmI(): string {
    const { fullName, location } = this;
    return `My name is ${fullName}, and I'm from ${location}`;
  }
}
