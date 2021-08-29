import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase";
import { Fab, Box } from "@material-ui/core";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Refresh as RefreshIcon } from "@material-ui/icons";
import EmptyState from "../EmptyState";
import Loader from "../Loader";
import { ReactComponent as ErrorIllustration } from "../../illustrations/error.svg";


function PageList(props) {
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
    return (
      <EmptyState
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
      />
    );
  }

  if (loading) {
    return <Loader />;
  }

  if (!pages) {
    let obj = {
        "pages":new Array(book.pages).fill(0)
    };

    firestore
    .collection("users")
    .doc(user.uid)
    .collection("pages")
    .doc(book.id)
    .set(obj);
    
    setPages(obj);
  } else {
      return (
        <List dense>
        {pages.pages.map((num, index) => (
          <ListItem button key={index+1}>
            <ListItemText primary={`Page ${index+1} : ${num}`} />
          </ListItem>
        ))}
      </List>
      )
  } 

  console.log(pages);

return(
<div>
    Test
</div>
)
}



export default PageList;