import React from "react";
import { styled } from '@mui/material/styles';

import Box from "@mui/material/Box";
import IconButton from '@mui/material/IconButton';
import { SelectMenu } from "./SelectMenu";

import ArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import ArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

import { getContext } from "./context";

const context = getContext();
const theme = context.getTheme();

function changePage(nextPage) {

  return () => {

    context.wrap_panel.page+= nextPage;
    context.processSubscription(
      "updateWrapPanel"
    );
  }
}

export function WrapPagination(props) {

  const ipc_database = context.ipc_database;
  const wrap_panel = context.wrap_panel;

  const wrapped = wrap_panel.wrapped;
  const rowsPerPage = wrap_panel.rowsPerPage;
  const page = wrap_panel.page;
  const totalPages = wrap_panel.totalPages;

  const prevPage = page + 1 == 1 ? "none" : "inline-block";
  const nextPage = page + 1 >= totalPages ? "none" : "inline-block";

  const Pagination = styled(Box)({

    display: "block",
    flexDirection: "row",
    alignItems: "center",
    padding: "8px 16px 0 16px",

    "@media (min-width: 530px)": {
      display: "flex"
    }
  });

  const PageSelect = styled(Box)({
    display: "flex",
    flexDirection: "row"
  });

  const PageControl = styled(Box)({

    flex: 2,
    fontSize: "14px",
    fontWeight: "bold",
    textAlign: "right"
  });

  const updateRowsPerPage = (event) => {

    wrap_panel.rowsPerPage = event.target.value;

    ipc_database.processSubscription(
      "updateWrapPanel", [ wrap_panel ]);
  };

  const updateWrapped = (event) => {

    wrap_panel.wrapped = event.target.value == "wrapped" ? true : false;

    ipc_database.processSubscription(
      "updateWrapPanel", [ wrap_panel ]);
  };

  return (
    <Pagination>
      <PageSelect>

        <SelectMenu
          id="wrappedSelect"
          label="Show"
          selected={ wrapped ? "wrapped" : "unwrapped" }
          items={[
            { label: "Unwrapped", value: "unwrapped" },
            { label: "Wrapped", value: "wrapped" }
	  ]}
	  onChange={ updateWrapped }
	  width="140px" />

	  <SelectMenu
	    id="rowsSelect"
	    label="Rows per page"
	    selected={ rowsPerPage }
	    items={[
              { label: "5", value: 5 },
              { label: "10", value: 10 },
              { label: "25", value: 25 },
              { label: "50", value: 50 }
	    ]}
	    onChange={ updateRowsPerPage }
	    width="140px" />

        </PageSelect>

        <PageControl>

          Page { page + 1 } of { totalPages }
          <IconButton color="secondary" sx={{ display: prevPage }} onClick={ changePage(-1) }><ArrowLeftIcon /></IconButton>
          <IconButton color="secondary" sx={{ display: nextPage }} onClick={ changePage(1) }><ArrowRightIcon /></IconButton>

      </PageControl>
    </Pagination>
  );
}

