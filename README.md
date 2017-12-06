# Lumi
# Project Prototype
We are currently working on a prototype that will be tested in several german schools.
If you want to participate or contribute contact us at [Slack](https://join.slack.com/t/lumi-education/shared_invite/enQtMjY0MTM2NjIwNDU0LWU3YzVhZjdkNGFjZGE1YThjNzBiMmJjY2I2ODk2MzAzNDE3YzI0MmFkOTdmZWZhOTBmY2RjOTc3ZmZmOWMxY2U) or [c@Lumi.education](mailto:c@Lumi.education).

## Goals

We want to build a basic version that can be used by any teacher in everyday life at school. This requires an admin-interface that enables
* **managing** (*create*, *browse*, *assign*) 
    * Courses, Users and Groups
    * Collections, Cards and Tags
* **monitoring** (*live (current session)*, *history (past sessions)*) 
    * student progress
    * student results

On the user side, we just need an interface that gives intuitive access to all learning material that is provided by the teacher.

## Terminology

### Courses, Users and Groups
* A **User** is a student, who is part of one or multiple courses and can be part of any number of groups within a course 
* A **Course** is a fixed number of users that meets the teacher on a regular basis for lessons. It is the starting point for any teacher in everyday life.
* **Groups** are flexible number of users within a course. They allow teachers to split a heterogeneous course into subgroups in order to facilitate and improve learning. Groups can be long- or short-term. 


### Collections, Cards and Tags
* A **Collection** is a set of cards. Collections are used to shape and structure lessons. Therefore each collection represents a certain time-span during lessons.
* A **Card** is a learning impulse that can be displayed on a single-screen. It can be passive (i.e. a video,  an instruction like "Listen to teacher for XX min" or a link) or actively require the user to answer via free-text, multiple-choice or sort type. It can contain Images and can be styled with Markdown.
* A **Tag** is a string that can be assigned to any card or collection in order to facilitate management and assignment. All Didctacitally useful information (e.g. difficulty, topic, subtopic, competence) is placed here. Tags are used to filter cards and assign them to collections. 

## Implementation

### Multiple Entry Point Principle
Depending on the situation a teacher needs different starting points to access or manage content but also for monitoring and review. 

E.g. in early planning phase, a teacher might directly want to create a collection and thus 
1. selects <collection> via menu
2. creates a learning card and assigns tags 
3. Repeats 2 N times
3. assigns the collection with N cards to a course

Later the teacher might want to add other (maybe already existing) collections to a course. Thus he
1. selects <course> via menu
2. assigns new collections to the course
3. deactivates old collections

During or after a lesson, the teacher might want to review the progress of all students. However, he might also want to see the response of an individual student.

> All this leads to the **principle of multiple entry points**. Thus we need to create a user interface, that makes it simple to access all our core interfaces from various starting points. We still need the following core interfaces:
> * Assign collections to Course
>  * Create documents 
>  * Monitor progress by session-id

### Assignment of Cards/Collections to Groups/Users

* Courses and Collections are the basic building blocks of lesson planning. Learning material is provided to students by *assigning collections to courses*
* Since (over time) multiple collections are assigned to a course, an assigned collection can be set **active** or **inactive** in order to cater only neccessary content to students.


### Monitoring based on Session-ID

* Since each lesson starts with a unique timestamp and a unique session-id, te terms lesson and **session** can be used synonymously.
* During or after a session, the teacher needs to be able to monitor/review the **progress** of each student. The progress of all users for a fixed (current or past) session is displayed in k NxM tables where 
    * N is the number of cards if a collection 
    * M is the number of students that were active in that collection
    * k is the number of collections that were active in that session
* During or after a session, the teacher also needs to be able to see all **responses** for a fixed certain card. 