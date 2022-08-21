import React from "react";
import MUIBackdrop from "@mui/material/Backdrop";
import { getContext } from "./context";

const context = getContext();
const theme = context.getTheme();

function effectFactory(context, show, lock) {

  return () => {

    context.createSubscription("showBackdrop");
    context.createSubscription("hideBackdrop");
    context.createSubscription("lockBackdrop");

    context.addSubscriber("showBackdrop", "backdrop", () => { show(true); });
    context.addSubscriber("hideBackdrop", "backdrop", () => { show(false); });
    context.addSubscriber("lockBackdrop", "backdrop", (locked) => { locked ?  lock(true) : lock(false); });

    return () => {

      context.removeSubscriber("showBackdrop", "backdrop");
      context.removeSubscriber("hideBackdrop", "backdrop");
      context.removeSubscriber("lockBackdrop", "backdrop");
    };
  }
}

export function Backdrop(props) {

  const [ visible, show ] = React.useState(false);
  const [ locked, lock ] = React.useState(false);

  React.useEffect(effectFactory(context, show, lock));

  const hide = locked ? () => {} : () => { context.hideBackdrop(); };

  return (
    <MUIBackdrop
      open={ visible }
      onClick={ hide }
      transitionDuration={ theme.backdropTransition }
      sx={{ zIndex: theme.backdropzIndex  }}
    >
      { props.children }
    </MUIBackdrop>
  );
}
