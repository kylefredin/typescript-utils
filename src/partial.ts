interface Person {
  id?: number | undefined;
  firstName: string
  lastName: string;
}

function clonePerson(person: Person, data: Partial<Person>): Person {
  return { ...person, ...data };
}

const person1: Person = {
  id: 1,
  firstName: "Test",
  lastName: "User"
};

const person2 = clonePerson(person1, { id: 2 });

const person3 = clonePerson(person2, { id: 3, firstName: "Diff" });

// doesn't work because 'age' does not exist on person
// const person4 = clonePerson(person3, { age: 12 });

console.log({ person1, person2, person3 });

class HttpClient {
  patch(_: string, person: Partial<Person>): Promise<Person> {
    return Promise.resolve({ id: 3, firstName: "", lastName: "", ...person });
  }

  put(_: string, person: Required<Person>): Promise<Person> {
    return Promise.resolve(person);
  }

  post(_: string, person: Person): Promise<Person> {
    return Promise.resolve({ id: 5, ...person });
  }
}

class PeopleService {
  httpClient = new HttpClient();

  createUser(person: Person): Promise<Person> {
    return this.httpClient.post("/api/user", person);
  }

  updateUser(person: Required<Person>): Promise<Person> {
    // here we ensure all properties are provided
    return this.httpClient.put(`/api/user/${person.id}`, person);
  }

  patchUser(id: number, person: Partial<Person>): Promise<Person> {
    // here we could allow a partial person...
    return this.httpClient.patch(`/api/user/${id}`, { id, ...person });
  }

  getUser(id: number): Promise<Person|null> {
    return Promise.resolve({ id, firstName: "Test", lastName: "User" });
  }
}

const service = new PeopleService();

const person5 = service.createUser({ firstName: "Another", lastName: "User" });

const person6 = service.updateUser({ id: 6, firstName: "And", lastName: "Another" });

const person7 = service.patchUser(7, { lastName: "Test" });

const person8 = service.getUser(8);

console.log({ person5, person6, person7, person8 });