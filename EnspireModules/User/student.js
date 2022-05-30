const User = require('./user.js');

class Student extends User {
    constructor(name, studentID, course) {
        var _name = name;
        this.name = () => { return _name; }

        var _studentID = studentID;
        this.studentID = () => { return _studentID; }

        var _course = course;
        this.course = () => { return _course; }
        this.changeCourse = (course) => { _course = course; }
    }

    formSchedule() {}
}

module.exports = Student;