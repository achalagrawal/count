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
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import EmptyState from "../EmptyState";
import Loader from "../Loader";
import { ReactComponent as ErrorIllustration } from "../../illustrations/error.svg";
import multiple from "../../sounds/multiple.wav"
import single from "../../sounds/single.wav"

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

  const playSound = audioFile => {
    audioFile.play();
  }
  
  const useStyles = makeStyles((theme) => ({
    list: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden'
    },
    multimark: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '10ch',
      },
    },
    margin: {
      margin: theme.spacing(1),
      marginBottom: theme.spacing(2)
    }
  }));
  
  function PageList(props) {
    const classes = useStyles();
    const { book, user } = props;
    const [loading, setLoading] = useState(true);
    const [pages, setPages] = useState(null);
    const [error, setError] = useState(null);
    const singleAudio = new Audio(single);
    const multipleAudio = new Audio(multiple);
    
    const [start, setStart] = React.useState(1);
    const handleStart = (event) => {
      let input = parseInt(event.target.value);
      if (input<1) input = 1;
      if (input>book.pages) input = book.pages;
      setStart(input);
    };
    
    const [end, setEnd] = React.useState(book.pages);
    const handleEnd = (event) => {
      let input = parseInt(event.target.value);
      if (input<1) input = 1;
      if (input>book.pages) input = book.pages;
      setEnd(input);
    };
    
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
      } else if (pages !== null) 
      {
        return (
          <div>
          <div className={classes.multimark}>
          <h3>Mark Multiple Pages</h3>
          <TextField
          id="start-number"
          label="Start"
          type="number"
          value={start}
          onChange={handleStart}
          InputLabelProps={{
            shrink: true,
          }}
          variant="filled"
          />
          <TextField
          id="end-number"
          label="End"
          type="number"
          value={end}
          onChange={handleEnd}
          InputLabelProps={{
            shrink: true,
          }}
          variant="filled"
          />
          </div>
          <div className={classes.margin}>
          <Button 
          variant="contained" 
          color="primary"
          onClick={() => { 
            const obj = {};
            const len = book.pages.toString().length;
            for (let i=start;i<=end;i++)
            {
              obj[zeroPad(i,len)]=pages[zeroPad(i,len)]+1;
            }
            
            firestore
            .collection("users")
            .doc(user.uid)
            .collection("pages")
            .doc(book.id)
            .set(obj,{merge:true});

            playSound(multipleAudio);
          }}>
          Mark Read
          </Button>
          </div>
          <Divider />
          <h3>Mark Individual Pages</h3>
          <div className={classes.list}>
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

              playSound(singleAudio);
            }}
            />
            </div>
            </ImageListItem>
            )}
            </ImageList>
            </div>
            </div>
            )
          }
          
          return (<ShowError />)
        }
        
        export default PageList;