import { useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'expo-router';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  type SelectChangeEvent,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import GroupIcon from '@mui/icons-material/Group';
import CloseIcon from '@mui/icons-material/Close';
import { AppNav } from '../src/components/AppNav';
import { BackHeader } from '../src/components/BackHeader';
import { ColoredTag } from '../src/components/ColoredTag';
import { BRAND } from '../src/lib/brand';
import {
  fetchMyProfile,
  updateMyProfile,
  updateMyStatus,
  type MyProfile,
  type MyProfileFormData,
  type ProfileStatus,
} from '../src/lib/profile';

const STATUS_LABELS: Record<ProfileStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
};

type Mode = 'view' | 'edit';

function toFormData(p: MyProfile): MyProfileFormData {
  return {
    firstName: p.firstName,
    lastName: p.lastName,
    preferredName: p.preferredName ?? '',
    derbyName: p.derbyName ?? '',
    skaterNumber: p.skaterNumber ?? '',
    phone: p.phone ?? '',
    allergies: p.allergies ?? '',
    likes: p.likes ?? '',
    dislikes: p.dislikes ?? '',
  };
}

function formsEqual(a: MyProfileFormData, b: MyProfileFormData): boolean {
  return (Object.keys(a) as (keyof MyProfileFormData)[]).every((key) => a[key] === b[key]);
}

function SectionHeader({
  icon,
  label,
  spacious,
}: {
  icon: ReactNode;
  label: string;
  spacious?: boolean;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        pt: spacious ? 3 : 1.5,
        pb: spacious ? 1.5 : 0.5,
      }}
    >
      <Box sx={{ color: BRAND.navy, display: 'flex' }}>{icon}</Box>
      <Typography sx={{ fontWeight: 700, color: BRAND.navy, fontSize: '1.2rem' }}>
        {label}
      </Typography>
    </Box>
  );
}

function FieldText({ text }: { text: string }) {
  return (
    <Typography variant="body2" sx={{ color: '#4A5568', lineHeight: 1.6, py: 0.5 }}>
      {text}
    </Typography>
  );
}

const SECTION_ICON_SX = { fontSize: 22 } as const;

function StatusRow({
  status,
  editing,
  pendingStatus,
  onStartEdit,
  onChange,
}: {
  status: ProfileStatus;
  editing: boolean;
  pendingStatus: ProfileStatus | null;
  onStartEdit: () => void;
  onChange: (e: SelectChangeEvent<ProfileStatus>) => void;
}) {
  if (!editing) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, py: 0.5 }}>
        <Typography variant="body2" sx={{ color: '#4A5568', lineHeight: 1.6 }}>
          Status: {STATUS_LABELS[status]}
        </Typography>
        <Button
          onClick={onStartEdit}
          sx={{
            color: BRAND.navy,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            minHeight: 44,
            px: 1,
          }}
        >
          Change
        </Button>
      </Box>
    );
  }

  return (
    <FormControl size="small" sx={{ minWidth: 160, my: 0.5 }}>
      <InputLabel id="my-status-label">Status</InputLabel>
      <Select
        labelId="my-status-label"
        label="Status"
        value={pendingStatus ?? status}
        onChange={onChange}
      >
        <MenuItem value="active">Active</MenuItem>
        <MenuItem value="inactive">Inactive</MenuItem>
      </Select>
    </FormControl>
  );
}

function DiscardChangesDialog({
  open,
  onClose,
  onDiscard,
}: {
  open: boolean;
  onClose: () => void;
  onDiscard: () => void;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, mx: 2 } }}
    >
      <IconButton
        onClick={onClose}
        aria-label="Close"
        sx={{ position: 'absolute', top: 8, right: 8, color: '#9AABBD', width: 44, height: 44 }}
      >
        <CloseIcon />
      </IconButton>

      <DialogTitle sx={{ fontWeight: 700, color: BRAND.navy, pr: 6 }}>Discard changes?</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: '#4A5568' }}>
          You have unsaved changes to your profile. Leaving now will discard them.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{ color: BRAND.navy, textTransform: 'none', fontWeight: 600, minHeight: 44, px: 2 }}
        >
          Keep Editing
        </Button>
        <Button
          onClick={onDiscard}
          variant="contained"
          disableElevation
          sx={{
            bgcolor: '#C62828',
            color: '#fff',
            borderRadius: 1,
            textTransform: 'none',
            fontWeight: 700,
            minHeight: 44,
            px: 2.5,
            '&:hover': { bgcolor: '#A32020' },
          }}
        >
          Discard
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function StatusConfirmDialog({
  open,
  status,
  saving,
  acknowledged,
  onAcknowledgedChange,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  status: ProfileStatus | null;
  saving: boolean;
  acknowledged: boolean;
  onAcknowledgedChange: (checked: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, mx: 2 } }}
    >
      <IconButton
        onClick={onCancel}
        aria-label="Close"
        sx={{ position: 'absolute', top: 8, right: 8, color: '#9AABBD', width: 44, height: 44 }}
      >
        <CloseIcon />
      </IconButton>

      <DialogTitle sx={{ fontWeight: 700, color: BRAND.navy, pr: 6 }}>
        Confirm status change
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: '#4A5568', mb: 1.5 }}>
          You&apos;re changing your status to <strong>{status ? STATUS_LABELS[status] : ''}</strong>
          . This affects how you show up in rosters, attendance, and eligibility.
        </DialogContentText>
        <FormControlLabel
          control={
            <Checkbox
              checked={acknowledged}
              onChange={(e) => onAcknowledgedChange(e.target.checked)}
            />
          }
          label="I have read the Handbook and understand what this status means."
          sx={{
            alignItems: 'flex-start',
            '& .MuiFormControlLabel-label': { color: '#4A5568', fontSize: '0.9rem', mt: 0.75 },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          onClick={onCancel}
          sx={{ color: BRAND.navy, textTransform: 'none', fontWeight: 600, minHeight: 44, px: 2 }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={!acknowledged || saving}
          variant="contained"
          disableElevation
          sx={{
            bgcolor: BRAND.navy,
            color: '#fff',
            borderRadius: 1,
            textTransform: 'none',
            fontWeight: 700,
            minHeight: 44,
            px: 2.5,
            '&:hover': { bgcolor: '#112C56' },
            '&.Mui-disabled': { bgcolor: '#C8D0DA', color: '#fff' },
          }}
        >
          {saving ? 'Saving…' : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [form, setForm] = useState<MyProfileFormData | null>(null);
  const [mode, setMode] = useState<Mode>('view');
  const [saving, setSaving] = useState(false);
  const [discardConfirmOpen, setDiscardConfirmOpen] = useState(false);
  const [statusEditing, setStatusEditing] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<ProfileStatus | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);

  const hasUnsavedChanges = !!profile && !!form && !formsEqual(form, toFormData(profile));

  useEffect(() => {
    fetchMyProfile()
      .then((p) => {
        setProfile(p);
        setForm(toFormData(p));
      })
      .catch(() => {});
  }, []);

  const updateField =
    (field: keyof MyProfileFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => (prev ? { ...prev, [field]: e.target.value } : prev));
    };

  const handleCancel = () => {
    if (profile) setForm(toFormData(profile));
    setDiscardConfirmOpen(false);
    setMode('view');
  };

  const handleBackClick = () => {
    if (mode === 'edit') {
      if (hasUnsavedChanges) {
        setDiscardConfirmOpen(true);
      } else {
        setMode('view');
      }
    } else {
      router.replace('/more');
    }
  };

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    try {
      await updateMyProfile(form);
      setProfile((prev) => (prev ? { ...prev, ...form } : prev));
      setMode('view');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = (e: SelectChangeEvent<ProfileStatus>) => {
    const nextStatus = e.target.value as ProfileStatus;
    if (!profile || nextStatus === profile.status) return;
    setAcknowledged(false);
    setPendingStatus(nextStatus);
  };

  const handleCancelStatusChange = () => {
    setPendingStatus(null);
    setAcknowledged(false);
    setStatusEditing(false);
  };

  const handleConfirmStatusChange = async () => {
    if (!profile || !pendingStatus) return;
    setStatusSaving(true);
    try {
      await updateMyStatus(pendingStatus);
      setProfile((prev) => (prev ? { ...prev, status: pendingStatus } : prev));
      setPendingStatus(null);
      setAcknowledged(false);
      setStatusEditing(false);
    } finally {
      setStatusSaving(false);
    }
  };

  const primaryButtonSx = {
    bgcolor: BRAND.navy,
    color: '#fff',
    borderRadius: 1,
    py: 1.5,
    fontSize: '1rem',
    fontWeight: 700,
    textTransform: 'none',
    '&:hover': { bgcolor: '#112C56' },
    '&.Mui-disabled': { bgcolor: '#C8D0DA', color: '#fff' },
  } as const;

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppNav current="more" />
      <BackHeader
        title="Profile"
        onBack={handleBackClick}
        action={
          mode === 'view' && profile ? (
            <IconButton
              onClick={() => setMode('edit')}
              aria-label="Edit profile"
              sx={{ color: BRAND.navy, width: 44, height: 44 }}
            >
              <EditOutlinedIcon />
            </IconButton>
          ) : undefined
        }
      />

      {!profile || !form ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body2" sx={{ color: '#9AABBD' }}>
            Loading…
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            px: 2,
            py: 2,
            pb: { xs: '88px', md: 3 },
            maxWidth: 480,
            width: '100%',
            mx: 'auto',
            boxSizing: 'border-box',
            overflowY: 'auto',
          }}
        >
          <ColoredTag label="Profile" color={BRAND.navy} />
          <Typography
            sx={{
              fontWeight: 700,
              color: BRAND.navy,
              fontSize: '1.4rem',
              lineHeight: 1.15,
              mb: 0.5,
            }}
          >
            {profile.firstName} {profile.lastName}
          </Typography>

          {mode === 'view' ? (
            <>
              <Divider sx={{ my: 1 }} />

              <SectionHeader icon={<BadgeIcon sx={SECTION_ICON_SX} />} label="Identity" />
              <FieldText text={`Preferred Name: ${profile.preferredName || 'Not set'}`} />
              <FieldText text={`Derby Name: ${profile.derbyName || 'Not set'}`} />
              <FieldText text={`Skater Number: ${profile.skaterNumber || 'Not set'}`} />

              <SectionHeader icon={<PhoneIcon sx={SECTION_ICON_SX} />} label="Contact" />
              <FieldText text={`Phone: ${profile.phone || 'Not set'}`} />

              <SectionHeader icon={<FavoriteBorderIcon sx={SECTION_ICON_SX} />} label="Personal" />
              <FieldText text={`Allergies: ${profile.allergies || 'None on file'}`} />
              <FieldText text={`Likes: ${profile.likes || 'Not set'}`} />
              <FieldText text={`Dislikes: ${profile.dislikes || 'Not set'}`} />

              <Divider sx={{ my: 1 }} />

              <SectionHeader icon={<GroupIcon sx={SECTION_ICON_SX} />} label="Team" />
              <FieldText text={profile.teamName} />

              <StatusRow
                status={profile.status}
                editing={statusEditing}
                pendingStatus={pendingStatus}
                onStartEdit={() => setStatusEditing(true)}
                onChange={handleStatusChange}
              />
            </>
          ) : (
            <>
              <Divider sx={{ my: 1 }} />

              <SectionHeader icon={<BadgeIcon sx={SECTION_ICON_SX} />} label="Identity" spacious />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="First Name"
                  value={form.firstName}
                  onChange={updateField('firstName')}
                  fullWidth
                />
                <TextField
                  label="Last Name"
                  value={form.lastName}
                  onChange={updateField('lastName')}
                  fullWidth
                />
                <TextField
                  label="Preferred Name"
                  value={form.preferredName}
                  onChange={updateField('preferredName')}
                  fullWidth
                />
                <TextField
                  label="Derby Name"
                  value={form.derbyName}
                  onChange={updateField('derbyName')}
                  fullWidth
                />
                <TextField
                  label="Skater Number"
                  value={form.skaterNumber}
                  onChange={updateField('skaterNumber')}
                  fullWidth
                />
              </Box>

              <SectionHeader icon={<PhoneIcon sx={SECTION_ICON_SX} />} label="Contact" spacious />
              <TextField
                label="Phone"
                value={form.phone}
                onChange={updateField('phone')}
                fullWidth
              />

              <SectionHeader
                icon={<FavoriteBorderIcon sx={SECTION_ICON_SX} />}
                label="Personal"
                spacious
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Allergies"
                  value={form.allergies}
                  onChange={updateField('allergies')}
                  fullWidth
                  multiline
                  rows={2}
                />
                <TextField
                  label="Likes"
                  value={form.likes}
                  onChange={updateField('likes')}
                  fullWidth
                  multiline
                  rows={2}
                />
                <TextField
                  label="Dislikes"
                  value={form.dislikes}
                  onChange={updateField('dislikes')}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Box>

              <Divider sx={{ my: 1 }} />

              <SectionHeader icon={<GroupIcon sx={SECTION_ICON_SX} />} label="Team" spacious />
              <FieldText text={profile.teamName} />

              <StatusRow
                status={profile.status}
                editing={statusEditing}
                pendingStatus={pendingStatus}
                onStartEdit={() => setStatusEditing(true)}
                onChange={handleStatusChange}
              />

              <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
                <Button
                  onClick={handleCancel}
                  fullWidth
                  variant="outlined"
                  sx={{
                    color: BRAND.navy,
                    borderColor: BRAND.navy,
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.5,
                    minHeight: 44,
                    '&:hover': { borderColor: BRAND.navy, bgcolor: BRAND.notifBg },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  fullWidth
                  variant="contained"
                  disableElevation
                  sx={primaryButtonSx}
                >
                  {saving ? 'Saving…' : 'Save'}
                </Button>
              </Box>
            </>
          )}
        </Box>
      )}

      <DiscardChangesDialog
        open={discardConfirmOpen}
        onClose={() => setDiscardConfirmOpen(false)}
        onDiscard={handleCancel}
      />

      <StatusConfirmDialog
        open={!!pendingStatus}
        status={pendingStatus}
        saving={statusSaving}
        acknowledged={acknowledged}
        onAcknowledgedChange={setAcknowledged}
        onCancel={handleCancelStatusChange}
        onConfirm={handleConfirmStatusChange}
      />
    </Box>
  );
}
