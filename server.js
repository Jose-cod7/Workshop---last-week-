const express = require("express")
const app = express()
const port = 3001
const {
    Pool
} = require("pg")

//const secrets = require('./secrets.json')

const bodyParser = require("body-parser");
const { request, response } = require("express")

app.use(bodyParser.json());

const pool = new Pool({
    user: "pepe",
    host: "localhost",
    database: "migracode_course",
    password: "pepe1234",
    port: 5432,
})

//FUNCTIONS

const getClasses = (req, res) => {
    pool
        .query("SELECT * FROM classes")
        .then((results) => res.json(results.rows))
        .catch((e) => console.error(e));
}

const getStudents = (req, res) => {
    pool
        .query("SELECT * FROM students")
        .then((results) => res.json(results.rows))
        .catch((e) => console.error(e));
}

const getTopics = (req, res) => {
    pool
        .query("SELECT * FROM topics")
        .then((results) => res.json(results.rows))
        .catch((e) => console.error(e));
}

const getStudentByClassId = (req, res) => {   //Ask about rename columns "Name"
    const classId = req.params.classId;
    pool
        .query("SELECT students.student_name, classes.id, classes.name FROM students JOIN students_classes ON students_classes.id=students.id JOIN classes ON students_classes.class_id=classes.id WHERE class_id=$1", [classId])
        .then((results) => res.json(results.rows))
        .catch((e) => console.error(e));
}

const postStudent = (req, res) => {
    const { student_name, group_class } = req.body;

    pool
        .query("SELECT * FROM students WHERE student_name=$1", [student_name])
        .then((result) => {
            //console.log(result)
            if(result.rows.student_name === student_name) {
                return response
                .status (400)
                .send ("A student with the same name already exists");
            } else { 
    pool
        .query("INSERT INTO students (student_name, group_class) VALUES ($1, $2)", [student_name, group_class])
        .then(() => res.send("Student created!"))
        .catch((e) => console.error (e));
            }
        })
}

const postClass = (req, res) => {
    const { name, topic_id, start_time, end_time } = req.body;

    pool
        .query("INSERT INTO classes (name, topic_id, start_time, end_time) VALUES ($1, $2, $3, $4)", [name, topic_id, start_time, end_time])
        .then(() => res.send("Class created"))
        .catch((e) => console.error (e));
}    

const postTopic = (req, res) => {
    const { name } = req.body;

    pool
        .query("INSERT INTO topics (name) VALUES ($1)", [name])
        .then(() => res.send("Topic created"))
        .catch((e) => console.error (e));
} 
//ENDPOINTS

app.get("/classes", getClasses)
app.get("/students", getStudents)
app.get("/topics", getTopics)
app.get("/students_classes/:classId", getStudentByClassId)
app.post("/students", postStudent)
app.post("/classes", postClass)
app.post("/topics", postTopic)

app.listen(port, () => console.log(`Server is listening on port ${port}.`))