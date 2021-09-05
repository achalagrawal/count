import React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import PageList from './PageList';
import { firestore } from "../../firebase";

const drawerWidth = 240;

const bookList = [
  {
    id:"md1_vikalp",
    name:"Vikalp Adhyayan Bindu",
    pages:49
  },
  {
    id:"md2_parichay",
    name:"Ek Parichay",
    pages:122
  },
  {
    id:"md3_mvd",
    name:"Manav Vyavhar Darshan",
    pages:179
  },
  {
    id:"md4_karm",
    name:"Karm Darshan",
    pages:162
  },
  {
    id:"md5_abhyas",
    name:"Abhyas Darshan",
    pages:175
  },
  {
    id:"md6_anubhav",
    name:"Anubhav Darshan",
    pages:49
  },
  {
    id:"md7_janvad",
    name:"Vyavharatmak Janvad",
    pages:242
  },
  {
    id:"md8_bhautikvad",
    name:"Samadhanatmak Bhautikvad",
    pages:362
  },
  {
    id:"md9_adhyatmvad",
    name:"Anubhavatmak Adhyatmvad",
    pages:271
  },
  {
    id:"md10_samajshastra",
    name:"Vyavharvadi Samajshastra",
    pages:314
  },
  {
    id:"md11_arthashastra",
    name:"Avartansheel Arthshastra",
    pages:300
  },
  {
    id:"md12_manovigyan",
    name:"Sanchetnawadi Manovigyan",
    pages:254
  },
  {
    id:"md13_samvidhan",
    name:"Samvidhan",
    pages:304
  }
];

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function BookList(props) {

  let bookIndex = 0;
  if (props.userData && props.userData.bookIndex) {
    bookIndex = props.userData.bookIndex;
  }

  console.log(new Date());

  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List dense>
        {bookList.map((book, index) => (
          <ListItem button divider 
            key={book.id} 
            selected={bookIndex === index}
            onClick={()=> {
            bookIndex=index;
            if(props.mobileOpen.currentState) props.mobileOpen.toggle();
            props.mobileOpen.setTitle(book.name);
            firestore
              .collection("users")
              .doc(props.user.uid)
              .set(
                {bookIndex:index}, {merge:true}
              )
            }}>
            <ListItemText primary={`${index+1}. ${book.name}`} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;
  const currentBook = bookList[bookIndex];

  return (
    <div className={classes.root}>
      <CssBaseline />
     
      <nav className={classes.drawer} aria-label="list of books">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={props.mobileOpen.currentState}
            onClose={props.mobileOpen.toggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <h2>{currentBook.name} (<em>{currentBook.pages} pages</em>)</h2>
        <Divider />
        <PageList
          book={currentBook}
          user={props.user}
          />
      </main>
    </div>
  );
}

BookList.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default BookList;
