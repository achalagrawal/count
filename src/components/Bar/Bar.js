import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from "@material-ui/core/styles";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  ButtonGroup,
  Button,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  Link,
} from "@material-ui/core";


import UserAvatar from "../UserAvatar";
import MenuIcon from '@material-ui/icons/Menu';

const drawerWidth = 240;
const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
});

class Bar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: {
        anchorEl: null,
      },
    };
  }

  openMenu = (event) => {
    const anchorEl = event.currentTarget;

    this.setState({
      menu: {
        anchorEl,
      },
    });
  };

  closeMenu = () => {
    this.setState({
      menu: {
        anchorEl: null,
      },
    });
  };

  render() {
    // Properties
    const { performingAction, user, userData, roles } = this.props;

    // Events
    const {
      onAboutClick,
      onSettingsClick,
      onSignOutClick,
      onSignUpClick,
      onSignInClick,
    } = this.props;

    const { menu } = this.state;

    const menuItems = [
      {
        name: "About",
        onClick: onAboutClick,
      },
      {
        name: "Settings",
        onClick: onSettingsClick,
      },
      {
        name: "Sign out",
        divide: true,
        onClick: onSignOutClick,
      },
    ];

    const { classes } = this.props;

    return (
      <div className={classes.root}>
      <AppBar color="primary" position="fixed" className={classes.appBar}>
        <Toolbar>
          
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={this.props.handleDrawerIcon}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {this.props.title}
          </Typography>
          

          {user && (
            <>
              {roles.includes("admin") && (
                <Box mr={1}>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/admin"
                    variant="outlined"
                  >
                    Admin
                  </Button>
                </Box>
              )}

              <IconButton
                color="inherit"
                disabled={performingAction}
                onClick={this.openMenu}
              >
                <UserAvatar user={Object.assign(user, userData)} />
              </IconButton>

              <Menu
                anchorEl={menu.anchorEl}
                open={Boolean(menu.anchorEl)}
                onClose={this.closeMenu}
              >
                {menuItems.map((menuItem, index) => {
                  if (
                    menuItem.hasOwnProperty("condition") &&
                    !menuItem.condition
                  ) {
                    return null;
                  }

                  let component = null;

                  if (menuItem.to) {
                    component = (
                      <MenuItem
                        key={index}
                        component={RouterLink}
                        to={menuItem.to}
                        onClick={this.closeMenu}
                      >
                        {menuItem.name}
                      </MenuItem>
                    );
                  } else {
                    component = (
                      <MenuItem
                        key={index}
                        onClick={() => {
                          this.closeMenu();

                          menuItem.onClick();
                        }}
                      >
                        {menuItem.name}
                      </MenuItem>
                    );
                  }

                  if (menuItem.divide) {
                    return (
                      <span key={index}>
                        <Divider />

                        {component}
                      </span>
                    );
                  }

                  return component;
                })}
              </Menu>
            </>
          )}

          {!user && (
            <ButtonGroup
              color="inherit"
              disabled={performingAction}
              variant="outlined"
            >
              <Button onClick={onSignUpClick}>Sign up</Button>
              <Button onClick={onSignInClick}>Sign in</Button>
            </ButtonGroup>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />
      </div>
    );
  }
}

Bar.defaultProps = {
  performingAction: false,
};

Bar.propTypes = {
  // Properties
  performingAction: PropTypes.bool.isRequired,
  user: PropTypes.object,
  userData: PropTypes.object,

  // Events
  onAboutClick: PropTypes.func.isRequired,
  onSettingsClick: PropTypes.func.isRequired,
  onSignOutClick: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(Bar);
