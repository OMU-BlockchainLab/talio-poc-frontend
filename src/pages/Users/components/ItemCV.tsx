import { Avatar, Button, Chip, Divider, Rating, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import PaidIcon from '@mui/icons-material/Paid';
import HistoryIcon from '@mui/icons-material/History';
import * as React from 'react';
import { CVDetail } from 'utils/types';

export interface IItemCVProps {
  dataDetail: CVDetail;
}

export default function ItemCV({ dataDetail }: IItemCVProps) {
  const handleReviewCV = (url: string) => {
    window.open(url);
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '950px',
        padding: '32px',
        background: '#FFFFFF',
        boxShadow: '0px 2px 15px rgba(0, 0, 0, 0.05)',
        borderRadius: '20px',
        marginBottom: '40px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Stack direction="row" spacing={2} alignItems={'center'}>
          <Avatar
            alt="Remy Sharp"
            sx={{ width: 56, height: 56 }}
            src="/static/images/avatar/1.jpg"
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <Typography fontSize={14} textAlign={'left'}>
              {dataDetail?.jobPosition}
            </Typography>
            <Typography>{dataDetail?.objective}</Typography>
            <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly />
          </Box>
        </Stack>
        <Stack direction="row" spacing={2} alignItems={'center'}>
          <ShareIcon />
          <FavoriteBorderIcon />
          <Button sx={{ backgroundColor: '#896EFF', color: '#fff' }}>Interview me</Button>
        </Stack>
      </Box>
      <Box
        width={'100%'}
        marginTop="34px"
        sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column' }}
      >
        <Typography textAlign={'left'}>Content</Typography>
        <Button
          sx={{
            backgroundColor: '#896EFF',
            color: '#fff',
            width: '130px',
            marginTop: '31px',
            ':hover': {
              backgroundColor: '#896EFF',
              color: '#fff',
              opacity: 0.5,
            },
          }}
          onClick={() => handleReviewCV(dataDetail.cvUrl)}
        >
          View CV
        </Button>
      </Box>
      <Divider sx={{ margin: '31px 0' }} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <PersonPinCircleIcon sx={{ width: '25px', height: '25px', marginRight: '5px' }} />
          <Typography>Frontend Developer</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <PaidIcon sx={{ width: '25px', height: '25px', marginRight: '5px' }} />
          <Typography>$1000 - $3000</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <HistoryIcon sx={{ width: '25px', height: '25px', marginRight: '5px' }} />
          <Typography>3 year</Typography>
        </Box>
      </Box>
      <Divider sx={{ margin: '31px 0' }} />
      <Stack direction={'row'}>
        {['reactjs', 'vuejs', 'javascript', 'graphql'].map((item: string) => (
          <Chip label={item} sx={{ marginRight: '5px' }} />
        ))}
      </Stack>
    </Box>
  );
}
