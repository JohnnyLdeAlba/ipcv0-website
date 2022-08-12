import React from "react";
import MUIBackdrop from "@mui/material/Backdrop";
import { getContext } from "./context";

const context = getContext();
const theme = context.getTheme();

function effectFactory(context, show, visible) {

  return () => {

    context.createSubscription("showBackdrop");
    context.createSubscription("hideBackdrop");

    context.addSubscriber("showBackdrop", "backdrop", () => { show(true); });
    context.addSubscriber("hideBackdrop", "backdrop", () => { show(false); });

    return () => {

      context.removeSubscriber("showBackdrop", "backdrop");
      context.removeSubscriber("hideBackdrop", "backdrop");
    };
  }
}

export function Backdrop(props) {

  const [ visible, show ] = React.useState(context.backdropVisible);
  React.useEffect(effectFactory(context, show, visible));
  const hide = () => { show(false); };

  return (
    <MUIBackdrop
      open={ visible }
      onClick={ hide }
      transitionDuration={ theme.backdropTransition }
    >
      { props.children }
    </MUIBackdrop>
  );
}
