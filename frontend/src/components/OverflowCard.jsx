import React, { useEffect, useState } from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import { IoMdLink } from "react-icons/io";
import IconButton from '@mui/material/IconButton';
import { BsCopy } from "react-icons/bs";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import './css/OverflowCard.css';
import { IoIosWarning } from "react-icons/io";
import Tooltip from '@mui/material/Tooltip';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function OverflowCard({
    name,
    competition_name,
    award,
    description,
    honoree,
    honoree_address,
    image,
    issuer_address,
    official_web,
    organizer,
    warning,
    owner,
}) {
  const [page, setPage] = useState(true);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const truncateAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleCopy = (event, address) => {
    event.stopPropagation(); 
    if (document.hasFocus()) {
      navigator.clipboard.writeText(address)
        .then(() => alert("Copied to clipboard!"))
        .catch((err) => console.error("Failed to copy text:", err));
    } else {
      alert("Please ensure the page is focused before copying.");
    }
  };

  return (
    <>
    <Card 
      className="main"
      sx={{ width: 240, height: 240,paddingBottom:0, paddingTop:0 }}
      onClick={()=>setPage(!page)}
    >
      <Tooltip title="Owner and honoree differ—this NFT may no longer represent the original award recipient." placement="right">
      {warning? <div className="absolute left-3 top-3 p-1 bg-black rounded-lg z-10">
        <IoIosWarning className="text-yellow-400 text-2xl"/></div>:<></>}
      </Tooltip>
      <CardOverflow>
        <AspectRatio ratio="2">
          <img
            src={image}
            srcSet={image}
            loading="lazy"
            alt=""
          />
        </AspectRatio>
      </CardOverflow>
        <CardContent>
        <Typography level="title-md">{competition_name}</Typography>
        <Typography level="body-sm">{award}</Typography>
      </CardContent>

      <CardOverflow 
        variant="soft" 
          className="card-bottom "
      >
        <Divider inset="context" />
        <CardContent 
          orientation="horizontal" 
          className='flex items-center text-xs'
        >
            <button onClick={handleClickOpen} className='text-[12px] text-sky-700'>
              Open Detail
            </button>
        </CardContent>
      </CardOverflow>

    </Card>


    <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
      {/* 第一块：Competition Name */}
      <DialogTitle className="text-center font-semibold">
        <div className="text-center text-xl font-semibold"> {competition_name}</div>
        <div className="text-center text-base "> Honoree: {honoree}</div>
      </DialogTitle>
      <Divider />

      {/* 第二块：左图右文字 */}
      <DialogContent className="flex gap-4 py-4">
        <img
          src={image}
          alt="Competition"
          className="w-52 h-64 object-cover rounded-md"
        />
        <div className="flex flex-col justify-center w-64 items-center">
            <div className="flex flex-col justify-center text-sm gap-4">
          <div>Honoree: {truncateAddress(honoree_address)}
                <IconButton
                    color="primary"
                    onClick={(event)=>handleCopy(event, honoree)}
                    aria-label="Copy wallet address"
                    sx={{width:28, height:20, ml:1}}
                    >
                    <BsCopy/>
                </IconButton>          
          </div>
          <div>Owned by: {truncateAddress(owner)}                     
                <IconButton
                    color="primary"
                    onClick={(event)=>handleCopy(event, owner)}
                    aria-label="Copy wallet address"
                    // size='small'
                    sx={{width:28, height:20, ml:1}}
                    >
                    <BsCopy/>
                </IconButton>
            </div>
          <div>Issuer: {truncateAddress(issuer_address)}
            <IconButton
                color="primary"
                onClick={(event)=>handleCopy(event, issuer_address)}
                aria-label="Copy wallet address"
                sx={{width:28, height:20, ml:1}}
                >
                <BsCopy/>
            </IconButton>
          </div>
          <div>Organizer: {organizer}</div>
            <div>Award: {award}</div>
            <div className='flex items-center gap-x-2'>
            Official Website:{" "}
            <a
                href={official_web}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
            >
                <IoMdLink />    
               </a>
            </div>
            </div>
        </div>
      </DialogContent>
      <Divider />

      {/* 第三块：滚动的描述文字 */}
      <DialogContent className="max-h-80 min-h-40 overflow-y-auto">
        <div>
            Description:
        </div>
        <p className="text-sm">{description}</p>
      </DialogContent>
      <Divider />
      <DialogContent className='flex justify-end py-0'>
        <Button onClick={handleClose} className="text-blue-500">
          Close
        </Button>
        </DialogContent>
        </Dialog>         
        </>
  );
}