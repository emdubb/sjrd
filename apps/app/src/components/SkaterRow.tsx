import { Typography, Box, ButtonBase } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { BRAND } from '../lib/brand';
import type { SkaterListItem } from '../lib/skaters';

interface Props {
  skater: SkaterListItem;
  onOpen: () => void;
}

export function SkaterRow({ skater, onOpen }: Props) {
  const attendanceLabel =
    skater.attendanceRate === null ? 'No attendance data' : `${skater.attendanceRate}% attendance`;
  const lastAttendedNote = skater.lastAttendedLabel
    ? `Last attended ${skater.lastAttendedLabel}`
    : 'Never attended';

  return (
    <ButtonBase
      onClick={onOpen}
      focusRipple
      sx={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        border: '1px solid #E0E6ED',
        borderLeft: `4px solid ${skater.attendanceWarning ? '#E65100' : BRAND.navy}`,
        bgcolor: '#fff',
        borderRadius: 2,
        px: 2,
        py: 1.5,
        transition: 'box-shadow 0.15s',
        '&:hover': { boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, color: BRAND.navy, fontSize: '1rem' }}>
            {skater.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
            <Typography variant="body2" sx={{ color: '#6B7A8D' }}>
              {skater.teamName}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: skater.attendanceWarning ? '#E65100' : '#6B7A8D', fontWeight: 600 }}
            >
              {attendanceLabel}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.75 }}>
            {skater.attendanceWarning && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <WarningAmberIcon
                  titleAccess="Hasn't attended practice in 2+ weeks"
                  sx={{ fontSize: 18, color: '#E65100' }}
                />
                <Typography variant="body2" sx={{ color: '#E65100', fontWeight: 600 }}>
                  {lastAttendedNote}
                </Typography>
              </Box>
            )}
            {skater.hasAllergies && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <HealthAndSafetyIcon
                  titleAccess="Has allergies on file — view details"
                  sx={{ fontSize: 18, color: '#C62828' }}
                />
                <Typography variant="body2" sx={{ color: '#C62828', fontWeight: 600 }}>
                  Allergies
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <ChevronRightIcon sx={{ color: '#9AABBD', flexShrink: 0 }} />
      </Box>
    </ButtonBase>
  );
}
