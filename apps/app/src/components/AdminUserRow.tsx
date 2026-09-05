import { Typography, Box, ButtonBase, useTheme, useMediaQuery } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { BRAND } from '../lib/brand';
import { TagChip } from './TagChip';
import type { AdminUser } from '../lib/adminUsers';
import { USER_TYPE_LABELS, primaryUserType } from '../lib/userTypes';

interface Props {
  user: AdminUser;
  onOpen: () => void;
}

export function AdminUserRow({ user, onOpen }: Props) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const inviteLabel = user.invited ? 'Invited' : 'Needs Invite';
  const primaryType = primaryUserType(user.userTypes);

  return (
    <ButtonBase
      onClick={onOpen}
      focusRipple
      sx={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        border: '1px solid #E0E6ED',
        borderLeft: `4px solid ${BRAND.navy}`,
        bgcolor: '#fff',
        borderRadius: 2,
        px: 2,
        py: 1.5,
        transition: 'box-shadow 0.15s',
        '&:hover': { boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography sx={{ fontWeight: 700, color: BRAND.navy, fontSize: '1rem' }}>
            {user.name}
          </Typography>
          {isDesktop ? (
            <Typography variant="body2" sx={{ color: '#6B7A8D', mt: 0.25 }}>
              {user.email}
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ color: '#6B7A8D', mt: 0.25 }}>
              {user.teamNames.join(' & ') || 'No team'}
            </Typography>
          )}

          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.75, flexWrap: 'wrap' }}
          >
            {isDesktop ? (
              user.userTypes.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#9AABBD' }}>
                  No role assigned
                </Typography>
              ) : (
                user.userTypes.map((type) => <TagChip key={type} label={USER_TYPE_LABELS[type]} />)
              )
            ) : primaryType ? (
              <TagChip label={USER_TYPE_LABELS[primaryType]} />
            ) : (
              <Typography variant="body2" sx={{ color: '#9AABBD' }}>
                No role assigned
              </Typography>
            )}
          </Box>
        </Box>

        {isDesktop && (
          <Typography variant="body2" sx={{ color: '#4A5568', minWidth: 140 }}>
            {user.teamNames.join(' & ') || '—'}
          </Typography>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
          <Box
            sx={{
              px: 1.25,
              py: 0.5,
              borderRadius: 1.5,
              bgcolor: user.invited ? BRAND.notifBg : '#B45300',
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '0.875rem',
                color: user.invited ? BRAND.navy : '#fff',
                whiteSpace: 'nowrap',
              }}
            >
              {inviteLabel}
            </Typography>
          </Box>
          <ChevronRightIcon sx={{ color: '#9AABBD' }} />
        </Box>
      </Box>
    </ButtonBase>
  );
}
