function Person(name: any) {
this.name = name;
return { name };
}

Person.prototype = {
sayHello() {
console.log("hello");
}
};
const person = new Person("xiaopeng");
console.log(person.**proto** === Person.prototype); // false
console.log("--->", person.constructor); // Object
