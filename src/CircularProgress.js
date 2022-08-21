import React from "react";
import MUIBackdrop from "@mui/material/Backdrop";
import MUICircularProgress from "@mui/material/CircularProgress";
import { getContext } from "./context";

const context = getContext();
const theme = context.getTheme();

function effectFactory(context, show) {

  return () => {

    context.createSubscription("showCircular");
    context.createSubscription("hideCircular");

    context.addSubscriber("showCircular", "circular", () => { show(true); });
    context.addSubscriber("hideCircular", "circular", () => { show(false); });

    return () => {

      context.removeSubscriber("showCircular", "circular");
      context.removeSubscriber("hideCircular", "circular");
    };
  }
}

export function CircularProgress(props) {

  const [ visible, show ] = React.useState(true);
  React.useEffect(effectFactory(context, show));

  return (
    <MUIBackdrop
      open={ visible }
      transitionDuration={ theme.backdropTransition }
      sx={{ zIndex: theme.backdropzIndex  }}
    >
      <MUICircularProgress
        variant="indeterminate"
	size="40px"
	thickness=""
	color="secondary"
      />
    </MUIBackdrop>
  );
}
