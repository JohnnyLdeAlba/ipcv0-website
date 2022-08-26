import React from "react";
import { styled } from '@mui/material/styles';

import Box from "@mui/material/Box";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CachedIcon from '@mui/icons-material/Cached';
import { useSnackbar, SnackbarContent } from "notistack";

import { getContext } from "./context";

const context = getContext();
const theme = context.getTheme();

function openSnackbar(
  enqueueSnackbar,
  closeSnackbar) {

  return (payload) => {

    const [ type, caption, content, link ] = payload;

    const close = ((link) => {

      if (typeof link == "undefined")
        return () => { closeSnackbar(); };
      else {

        return () => {

          window.open(link);
          closeSnackbar();
        }
      }	
    })(link);

    enqueueSnackbar(
      content,
      {
        anchorOrigin: {

          vertical: "bottom",
          horizontal: "right"
	},

	content: (key, message) =>
	  <Snackbar
	    id={ key }
	    type={ type }
	    caption={ caption }
	    message={ message }
	    close={ close }
	  />
      });
  };
}

function snackbarEffect(enqueueSnackbar, closeSnackbar) {

   return () => {

    context.createSubscription("openSnackbar");

    context.addSubscriber(
      "openSnackbar",
      "snackbar",
      openSnackbar(enqueueSnackbar, closeSnackbar)
    );

    return () => {
      context.removeSubscriber("snackbar");
    };
  };
}

function SnackbarIcon(props) {

  switch (props.type) {
 
    case "success":

      return <CheckCircleIcon
        sx={{ fontSize: "38px" }} />;

    case "error":

      return <CancelIcon
        sx={{ fontSize: "38px" }} />;

    case "pending":

      return <CachedIcon
        sx={{ fontSize: "38px" }} />;

    default: return <></>;
  }
}

const Snackbar = React.forwardRef((props, ref) => {

  const iconColor = ((iconType) => {

    switch (iconType) {
 
      case "success": 
        return "#00ff00";

      case "error":
	return "#cc3333";

      case "pending":
	return "#4488ff";

      default:
	return "blue";
    }
  })(props.type);

  const Snackbar = styled(Box)({

    cursor: "pointer",
    display: "flex",
    flexDirection: "row",
    margin: "0 16px",
    padding: "16px 16px 8px 16px",
    width: "400px",
    backgroundColor: theme.snackbarColor,
    color: theme.textColor
  });

  const IconWrapper = styled(Box)({

    marginRight: "16px",
    color: iconColor
  });

  const Message = styled(Box)({

    display: "flex",
    flexDirection: "column"
  });

  const MessageCaption = styled(Box)({
    fontWeight: "bold"
  });

  const MessageContent = Box;

  return (
    <SnackbarContent ref={ ref }>
      <Snackbar onClick={ props.close }>
        <IconWrapper>
          <SnackbarIcon type={ props.type } />
	</IconWrapper>
	<Message>
	  <MessageCaption>
            { props.caption }
	  </MessageCaption>
	  <MessageContent>
            { props.message }
	  </MessageContent>
	</Message>
      </Snackbar>
    </SnackbarContent>
  );
});

export function SnackbarSubscriber() {

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  React.useEffect(snackbarEffect(
    enqueueSnackbar,
    closeSnackbar
  ));

  return (<></>);
}
