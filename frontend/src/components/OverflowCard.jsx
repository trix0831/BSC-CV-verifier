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
import DialogContent from '@mui/material/DialogContent';
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
        sx={{ 
          width: 240, 
          height: 240,
          paddingBottom: 0, 
          paddingTop: 0,
          backgroundColor: '#3d3a4e', // Set card background to gray
          border: '1.5px solid #6EACDA', // Add light blue border
          transition: 'transform 0.3s ease', // Add this line
          '&:hover': {
            transform: 'scale(1.05)',       // Add this line
          },
        }}
        onClick={() => setPage(!page)}
      >
        {warning ? (
          <div 
           className="absolute left-3 top-3 p-1 bg-red-700 rounded-lg z-10 opacity-75 flashing"
          >
            <IoIosWarning className="text-yellow-400 text-2xl"/>
          </div>
        ) : null}

        <CardOverflow>
          <div 
            className="image-container"
            
          >
            <img
              src={image}
              loading="lazy"
              alt=""
            />
          </div>
        </CardOverflow>

        <div>
          <p
            className='competition-name'
          >
            {competition_name}
          </p>
          <p
            className='award'
          >
            {award}
          </p>
        </div>
        
        {/* <Divider/> */}

        <button 
          onClick={handleClickOpen} 
          className='open-detail-button'
          style={{
            position: 'absolute',
            bottom: 15,
            borderRadius: '8px',
            transition: 'background-color 0.3s ease',
            padding: '2px 4px',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(114, 113, 120, 0.5)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <p
            style={{
              margin: "0 auto",
            }}
          >
            View Details
          </p>
        </button>
      </Card>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          style: {
            backgroundColor: '#3d3a4e', // Set dialog background to gray
            color: '#c9c9c9', // Set text color
            borderRadius: '8px', // Add rounded corners
            border: '1.5px solid #6EACDA', // Add light blue border
            boxShadow: '0 0 10px #6EACDA', // Add light blue shadow
          },
        }}
        
      >
        <DialogTitle
          className="text-center font-semibold"
          style={{ color: '#c9c9c9' }} // Set text color
        >
          <div className="text-center text-xl font-semibold">{competition_name}</div>
          <div className="text-center text-base">Honoree: {honoree}</div>
        </DialogTitle>

        <Divider />

        <DialogContent 
          className="flex gap-4"
          style={{ color: '#c9c9c9' }} // Set text color
        >
          <img
            src={image}
            alt="Competition"
            className="w-52 h-56 object-cover rounded-md"
          />
          
          <div className="flex flex-col justify-center w-64 items-center">
            <div className="flex flex-col justify-center text-sm gap-4">
              <div>
                Honoree: {truncateAddress(honoree_address)}
                <IconButton
                  color="primary"
                  onClick={(event) => handleCopy(event, honoree_address)}
                  aria-label="Copy wallet address"
                  sx={{ width: 28, height: 20, ml: 1 }}
                >
                  <BsCopy />
                </IconButton>          
              </div>
              <div>
                Owned by: {truncateAddress(owner)}                     
                <IconButton
                  color="primary"
                  onClick={(event) => handleCopy(event, owner)}
                  aria-label="Copy wallet address"
                  sx={{ width: 28, height: 20, ml: 1 }}
                >
                  <BsCopy />
                </IconButton>
              </div>
              <div>
                Issuer: {truncateAddress(issuer_address)}
                <IconButton
                  color="primary"
                  onClick={(event) => handleCopy(event, issuer_address)}
                  aria-label="Copy wallet address"
                  sx={{ width: 28, height: 20, ml: 1 }}
                >
                  <BsCopy />
                </IconButton>
              </div>
              <div>Organizer: {organizer}</div>
              <div>Award: {award}</div>
              <div className='flex items-center gap-x-2'>
                Official Website: 
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

        <DialogContent 
          className="max-h-80 min-h-40 overflow-y-auto"
          style={{ color: '#c9c9c9' }} // Set text color  
        >
          <div>Description:</div>
          <p className="text-sm">{description}</p>
        </DialogContent>
        <Divider />
        <DialogContent
          className="flex justify-end py-0"
          style={{ color: '#c9c9c9' }} // Set text color
        >
          <Button onClick={handleClose} className="text-blue-500">
            Close
          </Button>
        </DialogContent>
      </Dialog>         
    </>
  );
}