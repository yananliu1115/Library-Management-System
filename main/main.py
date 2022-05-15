from dataclasses import dataclass
from flask import Flask, jsonify, abort, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import UniqueConstraint
import requests
from flask_redis import FlaskRedis
from collections import Counter
from producer import publish

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = 'mysql://root:root@main_db/main'
CORS(app)
redis_client = FlaskRedis(app)

db = SQLAlchemy(app)


@dataclass
class Book(db.Model):
    id: int
    title: str
    image: str
    amount: int

    id = db.Column(db.Integer, primary_key=True, autoincrement=False)
    title = db.Column(db.String(200))
    image = db.Column(db.String(200))
    amount = db.Column(db.Integer, default=0)
    


@dataclass
class BookUser(db.Model):
    id: int
    user_id: int
    book_id_list: str
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    book_id_list = db.Column(db.String(200))

    UniqueConstraint('user_id', 'book_id_list', name='user_book_unique')



@app.route('/api/books')
def index():
    return jsonify(Book.query.all())



@app.route('/api/userbooks', methods=['POST'])
def get_userbooks():
    print(request.json['user_id'])
    user_id = int(request.json['user_id'])
    print(user_id) 
    if db.session.query(BookUser).filter_by(user_id=user_id).first() is not None:
        user_book = BookUser.query.filter_by(user_id=user_id).first()
        return jsonify(user_book)
    else:
        user_book = BookUser(user_id=user_id, book_id_list="")
        db.session.add(user_book)
        db.session.commit()
        return jsonify(user_book)
    



@app.route('/api/books/borrow', methods=['POST'])
def borrow():
    user_id = int(request.json['user_id'])
    book_id = int(request.json['book_id'])
    try:
        book = Book.query.filter_by(id=book_id).first()
        book.amount -= 1
        db.session.commit()
        
        if db.session.query(BookUser).filter_by(user_id=user_id).first() is not None:
            user_book = BookUser.query.filter_by(user_id=user_id).first()
            book_id_list = user_book.book_id_list
            book_id_list += str(book_id) + ";"
            user_book.book_id_list = book_id_list
            db.session.commit()
        else:
            user_book = BookUser(user_id=user_id, book_id_list=str(book_id) + ";")
            db.session.add(user_book)
            db.session.commit()
            
        publish('book_borrowed', book_id)    
        return jsonify({"message": "Borrowed successfully"})
            
    except:
        abort(400, 'You already borrowed this book')


@app.route('/api/books/return', methods=['POST'])
def return_book():
    user_id = int(request.json['user_id'])
    book_id = int(request.json['book_id'])
    print(user_id, book_id)
    try:
        book = Book.query.filter_by(id=book_id).first()
        book.amount += 1
        db.session.commit()
        
        user_book = BookUser.query.filter_by(user_id=user_id).first()
        book_id_list_str = user_book.book_id_list
        book_id_list = book_id_list_str.split(";")
        book_id_list.remove(str(book_id))
        book_id_list_str = ";".join(book_id_list)
        user_book.book_id_list = book_id_list_str
        db.session.commit()
        publish('book_returned', book_id)    
        return jsonify({"message": "Returned successfully"})
            
    except:
        abort(400, 'You already returned this book')
    
@app.route('/api/deleteall', methods=['DELETE'])
def delete_all_data():
    db.session.query(Book).delete()
    db.session.commit()
    db.session.query(BookUser).delete()
    db.session.commit()

    return jsonify({"message": "Successfully deleted all data"})
            
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
