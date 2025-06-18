export default class User {
    firstName: string;
    lastName: string;
    email: string;
    city: string;
    zipCode: string;

    constructor(firstName: string, lastName: string, email: string, city: string, zipCode: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.city = city;
        this.zipCode = zipCode;
    }
}
