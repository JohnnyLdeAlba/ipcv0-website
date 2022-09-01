import React from "react";
import { styled } from '@mui/material/styles';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { getContext } from "./context";

const context = getContext();
const theme = context.getTheme();

export function SelectMenu(props) {

  const onChange = typeof props.onChange == "undefined" ?
    (event) => {} : props.onChange;

  const [ value, setValue ] = React.useState(props.selected);

  const menuProps = {

    sx: {
      "& .MuiMenu-paper": {

        backgroundColor: theme.select,
	color: theme.text
      }
    }
  };

  const SelectLabel = styled(InputLabel)({

    fontSize: "14px", 
    color: theme.text,

    "&.Mui-focused": { color: theme.text }	  
  });

  const SelectSpan = styled(Select)({

    padding: "2px",
    fontSize: "12px",
    backgroundColor: theme.select,
    color: theme.text,

    "& .MuiSelect-icon": { color: theme.text }
  });

  const SelectItem = styled(MenuItem, { themeProps: props })({

    fontSize: "14px",

    ":hover": {
      backgroundColor: theme.selectHighlight
    },

    "&.Mui-selected": {

      backgroundColor: theme.selected,

      ":hover": {
        backgroundColor: theme.selectHighlight
      }
    }
  });

  const handleChange = (event) => {

    onChange(event);
    setValue(event.target.value);
  }

  return (
    <FormControl size="small" sx={{ margin: "8px 16px 4px 0", minWidth: props.width }}>

      <SelectLabel id={ props.id }>
	{ props.label }
      </SelectLabel>

      <SelectSpan
        labelId={ props.id }
        id={ props.id }
        value={ value }
	label={ props.label } 

        MenuProps={ menuProps }
	onChange={ handleChange }
      >
	{
          props.items.map((item) => {

            return (
	      <SelectItem key={ item.value } value={ item.value }>
	        { item.label }
	      </SelectItem>
	    );
	  })
        }
      </SelectSpan>
    </FormControl>
  );
}
