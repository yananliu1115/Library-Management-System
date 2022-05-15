import requests

URL = "http://localhost:8000/book/"

book_data = [
    {
        "title": "Introduction to Computer Science Using Python",
        "image": "http://ecx.images-amazon.com/images/I/51eXy1VpBVL.jpg",
        "amount": 30,
    },
    {
        "title": "JavaScript: The Good Parts",
        "image": "http://ecx.images-amazon.com/images/I/518QVtPWA7L._SL160_.jpg",
        "amount": 30,
    },
    {
        "title": "Structure and Interpretation of Computer Programs",
        "image": "http://ecx.images-amazon.com/images/I/51H17R%2BbW8L._SL160_.jpg",
        "amount": 30,
    },
    {
        "title": "Modern Operating Systems",
        "image": "http://ecx.images-amazon.com/images/I/51u3BZpfrML._SL160_.jpg",
        "amount": 30,
    },
    {
        "title": "Introduction to Algorithms",
        "image": "http://ecx.images-amazon.com/images/I/41u4nFsBWrL._SL160_.jpg",
        "amount": 30,
    },
    {
        "title": "C Programming Language",
        "image": "http://ecx.images-amazon.com/images/I/41qX6YdIJ7L._SL160_.jpg",
        "amount": 30,
    },
    {
        "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
        "image": "http://ecx.images-amazon.com/images/I/41D5QxOwn9L._SL160_.jpg",
        "amount": 30,
    },
    {
        "title": "Refactoring: Improving the Design of Existing Code",
        "image": "http://ecx.images-amazon.com/images/I/41gNhHqNwGL._SL160_.jpg",
        "amount": 30,
    },
    {
        "title": "Data Structures and Algorithms",
        "image": "http://ecx.images-amazon.com/images/I/51nFaksq%2BvL._SL160_.jpg",
        "amount": 30,
    },
    {
        "title": "Computer Systems: A Programmer's Perspective",
        "image": "http://ecx.images-amazon.com/images/I/51NTWFgAAbL._SL160_.jpg",
        "amount": 30,
    },
    {
        "title": "Distributed Systems: Principles and Paradigms",
        "image": "http://ecx.images-amazon.com/images/I/519yyphAquL._SL160_.jpg",
        "amount": 30,
    },
    {
        "title": "Database System Concepts",
        "image": "http://ecx.images-amazon.com/images/I/51qKb7gjlbL._SL160_.jpg",
        "amount": 30,
    },
]

print("Start to load Mock book data")
for book in book_data:
    print(book)
    r = requests.post(URL, data=book)

print("Mock book data loaded")


URL = "http://localhost:8000/api/auth/register"

user_data = [
    {
        "email":"admin@test.com",
        "password":"test12345@",
        "first_name": "Admin",
        "last_name": "User",
        "is_staff": True,
        "is_superuser": True,
    },
    {
        "email":"student@test.com",
        "password":"test12345@",
        "first_name": "Student",
        "last_name": "User",
        "is_staff": False,
        "is_superuser": False,
    },
    {
        "email":"yl2248@cornell.edu",
        "password":"test12345@",
        "first_name": "Yanan",
        "last_name": "Liu",
        "is_staff": False,
        "is_superuser": False,
    },
    {
        "email":"sy466@cornell.edu",
        "password":"test12345@",
        "first_name": "Suhui",
        "last_name": "Yu",
        "is_staff": False,
        "is_superuser": False,
    },
]

print("Start to load Mock user data")
for user in user_data:
    print(user)
    r = requests.post(URL, data=user)
print("Mock user data loaded")
