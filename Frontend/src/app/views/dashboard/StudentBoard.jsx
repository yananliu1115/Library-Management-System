import React, { Fragment, useState, useEffect } from 'react'
import { styled } from '@mui/system'

import { Breadcrumb, SimpleCard } from 'app/components'
import BorrowedBookTable from './shared/BorrowedBookTable'
import Button from '@mui/material/Button';
import useAuth from 'app/hooks/useAuth'
import { AiOutlineSwap } from "react-icons/ai";
import LibraryGalley from "./shared/LibraryGalley"

const Container = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: {
        margin: '16px',
    },
    '& .breadcrumb': {
        marginBottom: '30px',
        [theme.breakpoints.down('sm')]: {
            marginBottom: '16px',
        },
    },
}))


const StudentBoard = () => {
    const { user} = useAuth()
    const [contentType, setContentType] = useState('allBooks');
    const [books, setBooks] = useState([]);
    const [borrowedBooks, setBorrowedBooks] = useState([]);

    const handleSwitch = () => {
        if (contentType === 'allBooks') {
            fetchBorrowedBooks();
            setContentType('borrowedBooks');
        } else {
            setContentType('allBooks');
        }
    }

    const fetchAllBooks = async () => {
        await fetch("http://localhost:8001/api/books", {
            method: "GET",
            crossDomain: true,
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => {
            return res.json();
        }).then(json => {
            console.log('获取的结果', json);
            console.log(json)
            setBooks(json)
        }).catch(err => {
            console.log('请求错误', err);
        })
        
        
    }

    const Counter = (data) => {
        let map = {};
        for ( let i = 0; i < data.length; i++) {
            if (data[i] === ""){
                continue;
            }
            if (map[data[i]]) {
                map[data[i]]++;
            } else {
                map[data[i]] = 1;
            }
        }
        return map;
    }

    const convertToBorrowedBooks = (book_list) => {
        const counter = Counter(book_list)
        console.log(counter)
        if (counter === {}) {
            setBorrowedBooks([])
            return 
        }

        const borrowed_books = []
        for (const book of books) {
            console.log(typeof(book.id))
            if (book.id in counter){
                borrowed_books.push({
                    id: book.id,
                    title: book.title,
                    image: book.image,
                    amount: counter[book.id]
                })
            }
        }
        console.log(borrowed_books)
        setBorrowedBooks(borrowed_books)
    }

    const fetchBorrowedBooks = async () => {
        await fetch("http://localhost:8001/api/userbooks", {
            method: "POST",
            crossDomain: true,
            body: JSON.stringify({
                "user_id": user.id
            }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => {
            return res.json();
        }).then(json => {
            const book_id_list = json["book_id_list"]
            convertToBorrowedBooks(book_id_list.split(";"))
        }).catch(err => {
            console.log( err);
        })
        
    }


    useEffect(() => {
        fetchAllBooks();
    }, []);

    const borrowBook = async (book_id) => {
        await fetch("http://localhost:8001/api/books/borrow", {
            method: "POST",
            crossDomain: true,
            body: JSON.stringify({
                "book_id": book_id,
                "user_id": user.id
            }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => {
            return res.json();
        }).then(json => {
            console.log( json);
            fetchAllBooks();

        }).catch(err => {
            console.log( err);
        })
    }

    const returnBook = async (book_id) => {
        await fetch("http://localhost:8001/api/books/return", {
            method: "POST",
            crossDomain: true,
            body: JSON.stringify({
                "book_id": book_id,
                "user_id": user.id
            }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => {
            return res.json();
        }).then(json => {
            console.log( json);
            fetchAllBooks();
            fetchBorrowedBooks();
        }).catch(err => {
            console.log( err);
        })
    }

    return (
        <Fragment>
            <Container className="analytics">
            <div className="breadcrumb">
                    <Breadcrumb
                        routeSegments={[
                            { name: 'Dashboard', path: '/' },
                            { name: 'Dashboard' },
                        ]}
                    />
            </div>
            <SimpleCard title={ contentType === "allBooks" ? "Library View" : "Borrowed View"}>

            <Button variant="outlined" startIcon={ <AiOutlineSwap/>} style={{position: 'absolute', right:"50px", top:"105px"}} onClick={handleSwitch}>
                    Switch to {contentType === "allBooks" ? "Borrowed View": "Library View" }
            </Button>

                { contentType === 'allBooks' ?
                    <LibraryGalley books={books} handleBorrowBook={borrowBook}/>
                    :
                    <BorrowedBookTable books={borrowedBooks} handleReturnBook={returnBook}/>
            }     
            </SimpleCard>

            </Container>
        </Fragment>
    )
}

export default StudentBoard
