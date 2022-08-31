import React from "react";
import { styled } from '@mui/material/styles';

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ConstructionIcon from '@mui/icons-material/Construction';

import { Card } from "./Card";
import { getContext } from "./context";

const context = getContext();
const lang = context.getLang();

function setApprovalForAllEvent(approvalForAll, setApprovalForAll) {

  const ipc_contract = context.ipc_contract;

  return async () => {

    if (approvalForAll == "pending")
      return;

    const enabled = approvalForAll == "enabled" ? false : true;

    const tx = await ipc_contract
      .setApprovalForAll(enabled);
    if (tx.code == -1) {

      if (tx.payload == "")
        return;

      context.openSnackbar(
        "error",
        lang.getCaption("APPROVALFORALL_NOT_OWNER"),
        lang.getMessage("APPROVALFORALL_NOT_OWNER")
      );    

      return;
    }

    context.openSnackbar(
      "pending",
      lang.getCaption("APPROVALFORALL_PENDING"),
      lang.getMessage("APPROVALFORALL_PENDING"),
      "https://etherscan.io/tx/" + tx.payload
    );    

    setApprovalForAll("pending");
    await context.delay();

    context.addSubscriber(
      "approvalForAll",
      "approvalForAll",
      (event_id, subscriber_id, payload) => {

        const [ owner, operator, approved ] = payload;

        if (event_id != "approvalForAll")
          return;

        if (approved)
          setApprovalForAll("enabled");
        else
          setApprovalForAll("disabled");

        context.openSnackbar(
          "success",
          lang.getCaption("APPROVALFORALL_OK"),
          lang.getMessage("APPROVALFORALL_OK")
        );    

	context.removeSubscriber(
          "approvalForAll",
          "approvalForAll"
        );
      });
  };
}

function wrapXEvent(wrapX, setWrapX, wrapAll) {

  const ipc_contract = context.ipc_contract;
  const ipc_database = context.ipc_database;

  return async () => {

    if (wrapX == "pending")
      return;

    context.showCircular(true);
    const tx = await ipc_contract.wrapX(0, wrapAll);
    context.showCircular(false);

    if (tx.code == -1) {

      if (tx.payload == "")
        return;

      if (wrapAll) {

        context.openSnackbar(
          "error",
          lang.getCaption("WRAPALL_FAILED"),
          lang.getMessage("WRAPALL_FAILED")
        );    
      }
      else {

        context.openSnackbar(
          "error",
          lang.getCaption("UNWRAPALL_FAILED"),
          lang.getMessage("UNWRAPALL_FAILED")
        );    
      }

      return;
    }

    if (wrapAll) {

      context.openSnackbar(
        "pending",
        lang.getCaption("WRAPALL_PENDING"),
        lang.getMessage("WRAPALL_PENDING"),
        "https://etherscan.io/tx/" + tx.payload
      );    
    }
    else {

      context.openSnackbar(
        "pending",
        lang.getCaption("UNWRAPALL_PENDING"),
        lang.getMessage("UNWRAPALL_PENDING"),
        "https://etherscan.io/tx/" + tx.payload
      );    
    }

    setWrapX("pending");
    await context.delay();

    context.addSubscriber(
      "wrapX",
      "wrapX",
      (event_id, subscriber_id, payload) => {

        const wrap_panel = context.wrap_panel;
        const [ owner, wrapTokens, totalTokens ] = payload;

        if (event_id != "wrapX")
          return;

	if (wrapAll)
          setWrapX("wrapAll");
        else
          setWrapX("unwrapAll");

	if (wrapAll) {

          wrap_panel.wrapped = true;
	  wrap_panel.update();

          ipc_database.resetOwnersTokens();
          context.processSubscription("updateWrapPanel");

          context.openSnackbar(
            "success",
            lang.getCaption("WRAPALL_OK"),
            lang.getMessage("WRAPALL_OK")
          );    
        }
        else {

          wrap_panel.wrapped = false;
          wrap_panel.update();

          ipc_database.resetOwnersTokens();
          context.processSubscription("updateWrapPanel");

          context.openSnackbar(
            "success",
            lang.getCaption("UNWRAPALL_OK"),
            lang.getMessage("UNWRAPALL_OK")
          );    
	}

	context.removeSubscriber(
          "wrapX",
          "wrapX"
        );
      });
  };
}

export function WrapConfig(props) {

  const [ approvalForAll, setApprovalForAll ] = React.useState(null);
  const [ wrapAll, setWrapAll ] = React.useState("wrapAll");
  const [ unwrapAll, setUnwrapAll ] = React.useState("unwrapAll");

  React.useEffect(() => {

    context.addSubscriber(
      "approvalForAllUpdate",
      "approvalForAll",
      (event_id, subscriber_id, payload) => {
    
        const [ approvedForAll ] = payload;
        const approvedForAllState = approvedForAll ? "enabled" : "disabled";

        setApprovalForAll(approvedForAllState);
    });

    if (approvalForAll == null) {

      context.ipc_contract.isApprovedForAll()
        .then(approvedForAll => {
          context.processSubscription("approvalForAllUpdate", [ approvedForAll ]);
      });
    }

    return () => {

      context.removeSubscriber(
        "approvalForAllUpdate",
        "approvalForAll"
      );

      context.removeSubscriber(
        "approvalForAll",
        "approvalForAll"
      );

      context.removeSubscriber(
        "wrapX",
        "wrapX"
      );
    }
  });

  const Table = styled(Box)({

    display: "flex",
    flexDirection: "column"
  });

  const Row = styled(Box)({

    display: "flex",
    flexDirection: "row",
    padding: "24px"
  });

  const Title = styled(Box)({

    fontSize: "16px",
    fontWeight: "bold",
    paddingBottom: "8px"
  });

  const SubTitle = styled(Box)({
    fontSize: "14px",
  });

  const PendingButton = styled(Button)({

    margin: "8px 16px 8px 0",
    fontSize: "12px"
  });

  const approvalForAllLabel = ((state) => {

    switch (state) {

      case "enabled": return "Disable";
      case "disabled": return "Enable";
      default: return "Pending";
    }

  })(approvalForAll);

  return (
    <Card
      icon={ <ConstructionIcon /> }
      title="Wrapper Configuration"
      subtitle=""
      show={ props.show }
    >
      <Table>
        <Row> 
          <Box>
            <Title>Approve All Tokens</Title>
            <SubTitle>Allow the contract to automatically approve all your IPCs.</SubTitle>
	  </Box>
          <Box sx={{ flex: 1, textAlign: "right" } }>
            <PendingButton variant="contained" onClick={ setApprovalForAllEvent(approvalForAll, setApprovalForAll) }>
	      { approvalForAllLabel }
	    </PendingButton>
	  </Box>
	</Row>
        <Row> 
          <Box>
            <Title>Wrap/UnWrap All</Title>
            <SubTitle>Wrap and unwrap all your tokens in a single click!</SubTitle>
	  </Box>
          <Box sx={{ flex: 1, textAlign: "right" } }>
            <PendingButton variant="contained" onClick={ wrapXEvent(wrapAll, setWrapAll, true) }>
	      { wrapAll == "wrapAll" ? "Wrap All" : "Pending" }
	    </PendingButton>
            <PendingButton variant="contained" onClick={ wrapXEvent(unwrapAll, setUnwrapAll, false) }>
	      { unwrapAll == "unwrapAll" ? "Unwrap All" : "Pending" }
	    </PendingButton>

	  </Box>
	</Row>
      </Table>
    </Card>
  );
}

