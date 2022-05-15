import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Button from '@mui/material/Button';

export default function LibraryGalley(props) {

    const handleOnClick = (event) => {
        props.handleBorrowBook(event.target.id)
    }

  return (
    <ImageList sx={{ width: "100%", height: "100%" }} cols={4} >
      {props.books.map((item) => (
        <ImageListItem >
          <img
            src={item.image}
            alt={item.title}
            style={{ height:"200px", width:"200px" }}
            loading="lazy"
          />
          <ImageListItemBar
            title={item.title}
            subtitle={
            <span>
                Number: {item.amount}  
                <Button variant="text" id={item.id} color="primary" style={{marginLeft: "10px"}} onClick={ (event) => {
                    handleOnClick(event)
                } }> Borrow </Button>
            </span>}
            position="below"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}

