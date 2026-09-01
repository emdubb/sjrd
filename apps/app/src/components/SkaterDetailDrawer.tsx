import { useState, useEffect } from 'react';
import { Drawer, Box, Typography, Divider } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import { EventDrawerHeader } from './EventDrawerHeader';
import { ColoredTag } from './ColoredTag';
import { DetailRow } from './DetailRow';
import { BRAND } from '../lib/brand';
import { fetchSkaterDetail, type SkaterDetail } from '../lib/skaters';

interface Props {
  skaterId: string | null;
  onClose: () => void;
}

export function SkaterDetailDrawer({ skaterId, onClose }: Props) {
  const [detail, setDetail] = useState<SkaterDetail | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!skaterId) return;
    setDetail(null);
    fetchSkaterDetail(skaterId)
      .then(setDetail)
      .catch(() => {});
  }, [skaterId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!skaterId) return null;

  const attendanceLabel =
    detail && detail.attendanceRate !== null
      ? `${detail.attendanceRate}% attendance`
      : 'No attendance data yet';

  return (
    <Drawer
      anchor="bottom"
      open
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '16px 16px 0 0',
          width: '100%',
          maxWidth: 600,
          mx: 'auto',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <EventDrawerHeader onClose={onClose} />

      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 3, pb: 3 }}>
        {!detail ? (
          <Typography variant="body2" sx={{ color: '#9AABBD', py: 4, textAlign: 'center' }}>
            Loading…
          </Typography>
        ) : (
          <>
            <ColoredTag label="Skater" color={BRAND.navy} />
            <Typography
              sx={{
                fontWeight: 700,
                color: BRAND.navy,
                fontSize: '1.4rem',
                lineHeight: 1.15,
                mt: 0.25,
              }}
            >
              {detail.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7A8D', mb: 1.5 }}>
              {detail.preferredName || detail.firstName} {detail.lastName}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
              <FamilyRestroomIcon sx={{ fontSize: 20, color: BRAND.navy }} />
              <Typography sx={{ fontWeight: 700, color: BRAND.navy, fontSize: '1.1rem' }}>
                Guardians
              </Typography>
            </Box>
            {detail.guardians.length === 0 ? (
              <Typography variant="body2" sx={{ color: '#9AABBD', pb: 1 }}>
                No guardians on file.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                {detail.guardians.map((guardian, i) => (
                  <DetailRow
                    key={i}
                    icon={<PersonOutlineIcon sx={{ fontSize: 18 }} />}
                    text={`${guardian.name} ${guardian.lastName} · ${guardian.phone ?? 'No phone on file'}`}
                  />
                ))}
              </Box>
            )}

            <Divider sx={{ my: 1.5 }} />

            <DetailRow
              icon={<HealthAndSafetyIcon sx={{ fontSize: 18 }} />}
              text={`Allergies: ${detail.allergies || 'None on file'}`}
            />
            <DetailRow icon={<EventAvailableIcon sx={{ fontSize: 18 }} />} text={attendanceLabel} />
            <DetailRow
              icon={<ThumbUpIcon sx={{ fontSize: 18 }} />}
              text={`Likes: ${detail.likes || 'Not set'}`}
            />
            <DetailRow
              icon={<ThumbDownIcon sx={{ fontSize: 18 }} />}
              text={`Dislikes: ${detail.dislikes || 'Not set'}`}
            />
            <DetailRow
              icon={<GroupIcon sx={{ fontSize: 18 }} />}
              text={`Team: ${detail.teamName}`}
            />
          </>
        )}
      </Box>
    </Drawer>
  );
}
