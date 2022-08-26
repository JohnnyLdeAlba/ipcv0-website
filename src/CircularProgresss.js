import React from "react";
import { styled } from '@mui/material/styles';
import MUICircularProgress from "@mui/material/CircularProgress";

import { getContext } from "./context";
const context = getContext();

function circularEffect(context, show) {

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

function CircularProgress(props) {

  const [ visible, show ] = React.useState(false);
  const display = visible ? "inline-block" : "none";

  React.useEffect(circularEffect(context, show));

  const CircularProgress = styled(MUICircularProgress)({
    display: display
  });

  return (
    <CircularProgress
      variant="indeterminate"
      size={60}
      thickness={6}
      color="secondary"
    />
  );
}
