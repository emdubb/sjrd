import { useState } from 'react';
import { Box, Typography, Divider, Button } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { ColoredTag } from './ColoredTag';
import { DetailRow } from './DetailRow';
import { TagChip } from './TagChip';
import { BRAND } from '../lib/brand';
import type { AdminUser } from '../lib/adminUsers';
import { USER_TYPE_LABELS } from '../lib/userTypes';

export function AdminUserViewBody({ user }: { user: AdminUser }) {
  const [showContact, setShowContact] = useState(false);

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 3, pb: 3 }}>
      <ColoredTag
        label={user.source === 'pending' ? 'Pending User' : 'Account'}
        color={BRAND.navy}
      />
      <Typography
        sx={{ fontWeight: 700, color: BRAND.navy, fontSize: '1.4rem', lineHeight: 1.15, mt: 0.25 }}
      >
        {user.name}
      </Typography>

      <Button
        onClick={() => setShowContact((prev) => !prev)}
        startIcon={showContact ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
        sx={{
          color: BRAND.navy,
          fontWeight: 600,
          fontSize: '0.875rem',
          minHeight: 44,
          px: 0,
          justifyContent: 'flex-start',
        }}
      >
        {showContact ? 'Hide Contact Info' : 'View Contact Info'}
      </Button>

      {showContact && (
        <Box sx={{ mb: 0.5 }}>
          <DetailRow icon={<MailOutlineIcon sx={{ fontSize: 18 }} />} text={user.email} />
          {user.source === 'account' && (
            <DetailRow
              icon={<PhoneOutlinedIcon sx={{ fontSize: 18 }} />}
              text={user.phone || 'No phone on file'}
            />
          )}
        </Box>
      )}

      {user.status && (
        <DetailRow
          icon={<CheckCircleOutlineIcon sx={{ fontSize: 18 }} />}
          text={`Status: ${user.status === 'active' ? 'Active' : 'Inactive'}`}
        />
      )}
      <DetailRow
        icon={<CheckCircleOutlineIcon sx={{ fontSize: 18 }} />}
        text={user.invited ? 'Invited' : 'Not yet invited'}
      />

      <Divider sx={{ my: 1.5 }} />

      <Typography sx={{ fontWeight: 700, color: BRAND.navy, fontSize: '1.05rem', mb: 1 }}>
        Role Types
      </Typography>
      {user.userTypes.length === 0 ? (
        <Typography variant="body2" sx={{ color: '#9AABBD', mb: 1.5 }}>
          No role assigned yet.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 1.5 }}>
          {user.userTypes.map((type) => (
            <TagChip key={type} label={USER_TYPE_LABELS[type]} />
          ))}
        </Box>
      )}

      <DetailRow
        icon={<GroupIcon sx={{ fontSize: 18 }} />}
        text={`Team: ${user.teamNames.join(' & ') || 'None assigned'}`}
      />
    </Box>
  );
}
