import React, { useEffect, useState } from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import { IoMdLink } from "react-icons/io";
import Tooltip from "@mui/joy/Tooltip";
import IconButton from "@mui/joy/IconButton";
import { BsCopy } from "react-icons/bs";
import Button from "@mui/joy/Button";

export default function OverflowCard({
    name,
    competition_name,
    award,
    description,
    honoree,
    image,
    issuer_address,
    official_web,
    organizer,
    warning,
}) {
  const [page, setPage] = useState(true);
  const [tooltipText, setTooltipText] = useState("Copy to clipboard");

  // 截断地址
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

  const openDes = (event) => {
    event.stopPropagation(); 
    
  };

  return (
    <Card variant="outlined" sx={{ width: 240, paddingBottom:0 }} onClick={()=>setPage(!page)}>
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
      {page?(<>
        <CardContent>
        <Typography level="title-md">{competition_name}</Typography>
        <Typography level="body-sm">{award}</Typography>
      </CardContent>
      <CardOverflow variant="soft" sx={{ bgcolor: 'background.level1' }}>
        <Divider inset="context" />
        <CardContent orientation="horizontal" className='flex items-center'>
          <Typography
            level="body-xs"
            textColor="text.secondary"
            sx={{ fontWeight: 'md' }}
          >
            {organizer}
          </Typography>
          <Divider orientation="vertical" />
          <Typography
            level="body-xs"
            textColor="text.secondary"
            sx={{ fontWeight: 'md' }}
          >
            <a href={official_web} target="_blank" rel="noopener noreferrer" className='text-sky-700'>
                <IoMdLink />
            </a>
          </Typography>
        </CardContent>
      </CardOverflow></>) :(<>
        <CardContent>
            <div className='flex items-center gap-x-2'>
                <Typography level="body-xs">honoree:  {truncateAddress(honoree)}</Typography>
                    <IconButton
                    color="primary"
                    onClick={(event)=>handleCopy(event, honoree)}
                    aria-label="Copy wallet address"
                    size='sm'
                    >
                        <BsCopy />
                    </IconButton>
            </div>
            <div className='flex items-center gap-x-2'>
                <Typography level="body-xs">issuer:  {truncateAddress(issuer_address)}</Typography>
                    <IconButton
                    color="primary"
                    onClick={(event)=>handleCopy(event, issuer_address)}
                    aria-label="Copy wallet address"
                    size='sm'
                    >
                        <BsCopy/>
                    </IconButton>
            </div>
            <CardOverflow variant="soft" sx={{ bgcolor: 'background.level1' }}>
        <Divider inset="context" />
        <CardContent orientation="horizontal" className='flex items-center text-xs'>
            <button  onClick={openDes} className='text-[12px] text-sky-700'>Open description</button>
        </CardContent>
      </CardOverflow>
        </CardContent>
      </>)}
    </Card>
  );
}