import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase";
import { Fab, Box } from "@material-ui/core";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Rating from '@material-ui/lab/Rating';
import { Refresh as RefreshIcon } from "@material-ui/icons";
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import EmptyState from "../EmptyState";
import Loader from "../Loader";
import { ReactComponent as ErrorIllustration } from "../../illustrations/error.svg";

const zeroPad = (num, places) => String(num).padStart(places, '0');
const ShowError = () => (<EmptyState
  image={<ErrorIllustration />}
  title="Couldn’t retrieve data."
  description="Something went wrong when trying to retrieve the requested user."
  button={
    <Fab
    variant="extended"
    color="primary"
    onClick={() => window.location.reload()}
    >
    <Box clone mr={1}>
    <RefreshIcon />
    </Box>
    Retry
    </Fab>
  }
  />);
  
  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden'
    },
  }));
  
  function PageList(props) {
    const classes = useStyles();
    const { book, user } = props;
    const [loading, setLoading] = useState(true);
    const [pages, setPages] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(() => {
      return firestore
      .collection("users")
      .doc(user.uid)
      .collection("pages")
      .doc(book.id)
      .onSnapshot(
        (snapshot) => {
          setLoading(false);
          setPages(snapshot.data());
        },
        (error) => {
          setLoading(false);
          setError(error);
        }
        );
      },[user.uid, book.id]);
      
      if (error) {
        return <ShowError />;
      }
      
      if (loading) {
        return <Loader />;
      }
      
      if (!loading && typeof(pages) === 'undefined') {
        const obj = {};
        const len = book.pages.toString().length;
        for (let i=1;i<=book.pages;i++)
        {
          obj[zeroPad(i,len)]=0;
        }
        
        firestore
        .collection("users")
        .doc(user.uid)
        .collection("pages")
        .doc(book.id)
        .set(obj);
        // setPages(obj);
      } else if (pages !== null) {
        return (
          <div className={classes.root}>
      <ImageList rowHeight={80} cols={2}>
      {Object.keys(pages).sort().map((key, index) => 
          <ImageListItem key={key} cols={1}>
          <div>
            <Typography component="legend">{`Page ${key}`}</Typography>
            <Rating
            name={key}
            value={pages[key]}
            icon={<CheckCircleIcon fontSize="inherit" />}
            onChange={(event, newValue) => {
              
              firestore
              .collection("users")
              .doc(user.uid)
              .collection("pages")
              .doc(book.id)
              .set({
                [key]:newValue || 0
              },{ merge: true });
            }}
            />
            </div>
          </ImageListItem>
        )}
      </ImageList>
    </div>



            
          )
        }
        
        return (
          <ShowError />
          )
        }
        
        
        
        export default PageList;