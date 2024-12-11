import React from 'react';
import './css/HomePage.css';
import Card from '@mui/joy/Card';
import { styled } from '@mui/joy/styles';
import Input from '@mui/joy/Input';

const MetadataFilter = ({metadataFilters, updateMetadataFilter}) => {
  return (
    <div className="w-62 fixed p-2 my-4 rounded z-10">
      <Card>
        <div>Filter</div>
          {metadataFilters.map((filter, index) => (
            ['name', 'honoree', 'image', '_address'].includes(filter.key) ? <></>:
            <div key={index} className="flex w-full gap-4 items-center p-1">
                <Input
                onChange={(e) =>
                  updateMetadataFilter(index, filter.key, e.target.value)
                }
                slots={{ input: InnerInput }}
                slotProps={{
                  input: {
                    type: 'text',
                    label: filter.key, // 传递动态 label
                  },
                }}
                sx={{ '--Input-minHeight': '24px', '--Input-radius': '6px' }}
              />
            </div>
          ))}
      </Card>
     </div>
  );
};

export default MetadataFilter;


const StyledInput = styled('input')({
  width: '200px',
  border: 'none', // remove the native input border
  minWidth: 0, // remove the native input width
  outline: 0, // remove the native input outline
  padding: 0, // remove the native input padding
  paddingTop: '1em',
  flex: 1,
  color: 'inherit',
  backgroundColor: 'transparent',
  fontFamily: 'inherit',
  fontSize: '10px',
  fontStyle: 'inherit',
  fontWeight: 'inherit',
  lineHeight: 'inherit',
  textOverflow: 'ellipsis',
  '&::placeholder': {
    opacity: 0,
    transition: '0.1s ease-out',
  },
  '&:focus::placeholder': {
    opacity: 1,
  },
  '&:focus ~ label, &:not(:placeholder-shown) ~ label, &:-webkit-autofill ~ label': {
    top: '0px',
    fontSize: '10px',
  },
  '&:focus ~ label': {
    color: 'var(--Input-focusedHighlight)',
  },
  '&:-webkit-autofill': {
    alignSelf: 'stretch', // to fill the height of the root slot
  },
  '&:-webkit-autofill:not(* + &)': {
    marginInlineStart: 'calc(-1 * var(--Input-paddingInline))',
    paddingInlineStart: 'var(--Input-paddingInline)',
    borderTopLeftRadius:
      'calc(var(--Input-radius) - var(--variant-borderWidth, 0px))',
    borderBottomLeftRadius:
      'calc(var(--Input-radius) - var(--variant-borderWidth, 0px))',
  },
});

const StyledLabel = styled('label')(({ theme }) => ({
  position: 'absolute',
  lineHeight: 1,
  top: 'calc((var(--Input-minHeight) - 1em) / 2)',
  color: theme.vars.palette.text.tertiary,
  fontWeight: theme.vars.fontWeight.md,
  transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
}));

const InnerInput = React.forwardRef(function InnerInput(props, ref) {
    const { label, ...otherProps } = props;
  const id = React.useId();
  return (
    <React.Fragment>
      <StyledInput {...otherProps} ref={ref} id={id} />
      <StyledLabel htmlFor={id}>{label}</StyledLabel>
    </React.Fragment>
  );
});

function FilterCom({key, val}) {
    return (
      <Input
        slots={{ input: InnerInput }}
        slotProps={{
          input: {
            // placeholder: 'A placeholder',
            type: 'password',
            label: key, // 传递动态 label
          },
        }}
        sx={{ '--Input-minHeight': '24px', '--Input-radius': '6px' }}
      />
    );
  }
  
